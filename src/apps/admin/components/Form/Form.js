import React, { useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';

import is from 'ramda/src/is';
import isEmpty from 'ramda/src/isEmpty';
import forEach from 'ramda/src/forEach';
import any from 'ramda/src/any';
import always from 'ramda/src/always';

import { fieldName as langsFieldName } from './fields/FormFieldLangs';
import { fieldName as listWithFormsFieldName } from './fields/FormFieldListWithForms';
import { fieldName as blocksConstructorFieldName } from './fields/FormFieldBLocksConstructor';
import fieldsMap from './fields';

import validatorsList from './validators';

import { LOCALES } from '../../../client/constants';
import getTranslations from '../../services/article/getTranslations';
import replaceForbiddenSymbols from './utils/replaceForbiddenSymbols';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    error: {
        backgroundColor: theme.palette.error.dark
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(4)
    },
    message: {
        display: 'flex',
        alignItems: 'center',
        padding: '0'
    },
    margin: {
        margin: theme.spacing(1),
        padding: '0',
        minWidth: 'unset',
        background: 'transparent'
    }
}));

const langInsensitivesFields = [langsFieldName, listWithFormsFieldName, blocksConstructorFieldName];
const checkIsLangsField = field => field.field === langsFieldName;
const checkIsAliasField = field => field.name === 'alias';
const getFieldName = (field, lang) => (field.langInsensitive || langInsensitivesFields.includes(field.field)) ? field.name : `${lang}_${field.name}`;

const Form = ({ data, langs, onChange, onSubmit, fields, setCurrentValues, onBlur }, ref) => {
    const initialValues = useMemo(() => {
        const dataWithLangs = langs.reduce((newData, lang) => {
            newData[lang] = newData[lang] || {};

            return newData;
        }, data || {});
        return fields.reduce((result, field) => {
            const fieldInfo = fieldsMap[field.field];
            const values = fieldInfo.getInitialValues(dataWithLangs, field, langs);

            return {
                ...result,
                ...values
            };
        }, {});
    }, []);

    const [values, setValues] = useState(initialValues);
    const [validationMessages, setValidationMessages] = useState({});
    const [lang, setLang] = useState(langs[0]);
    const [errorText, setErrorText] = useState('');

    useImperativeHandle(ref, () => ({
        updateValues: changes => {
            setValues((prev) => ({ ...prev, ...changes }));
            setValidationMessages((prev) => ({ ...prev, alias: '' }));
        }
    }));

    const classes = useStyles();

    const validators = useMemo(() => fields
        .reduce((validators, field) => {
            if (!field.validators) {
                return validators;
            }

            let newValidators = {};

            if (field.langInsensitive) {
                newValidators[field.name] = field.validators;
            } else {
                newValidators = langs.reduce((result, lang) => {
                    return {
                        ...result,
                        [`${lang}_${field.name}`]: field.validators
                    };
                }, {});
            }

            return {
                ...validators,
                ...newValidators
            };
        }, {}),
    [fields, langs]
    );

    const createField = (field, i) => {
        const FieldComponent = fieldsMap[field.field].Component;
        const fieldName = getFieldName(field, lang);
        const validationMessage = validationMessages[fieldName];

        const fieldProps = {
            onChange: handleFieldChange(field, fieldName),
            onBlur: handleFieldBlur(field),
            name: fieldName,
            value: values[fieldName],
            isRequired: any(validator => validator.name === 'required', field.validators || []),
            validationMessage,
            schema: field.schema || {},
            settings: field.settings || {},
            langs,
            key: i,
            triggerSubmit: handleTriggerSubmit,
            ...(checkIsLangsField(field) ? { triggerTranslate: handleTranslate } : {})
        };

        return <FormControl key={i} error={!!validationMessage}>
            <FieldComponent {...fieldProps} />
            {field.hint && <FormHelperText>{field.hint}</FormHelperText>}
            {validationMessage && <FormHelperText>{validationMessage}</FormHelperText>}
        </FormControl>;
    };

    const handleTranslate = () => {
        const currentLang = lang;
        let newValidationMessages = {};

        fields.forEach((field) => {
            if (!field.langInsensitive) {
                newValidationMessages = {
                    ...newValidationMessages,
                    ...langs.reduce((result, lang) => {
                        if (field.field === 'input' || field.field === 'editor') {
                            if (lang !== currentLang) {
                                const currentValue = values[`${currentLang}_${field.name}`];
                                const langValue = values[`${lang}_${field.name}`];
                                if (currentValue && !langValue) {
                                    return {
                                        ...result,
                                        [`${lang}_${field.name}`]: {
                                            field,
                                            text: currentValue,
                                            lang
                                        }
                                    };
                                }
                            }
                        }

                        return result;
                    }, {})
                };
            }
        });

        const texts = Object.keys(newValidationMessages).map((fieldName) => ({
            fieldName,
            text: newValidationMessages[fieldName].text,
            lang: newValidationMessages[fieldName].lang
        }));

        if (texts.length) {
            getTranslations(texts).then(result => {
                if (result?.translations) {
                    let changes = {};

                    result.translations.forEach(translation => {
                        changes = {
                            ...changes,
                            [translation.fieldName]: translation.text
                        };
                    });

                    const newValues = {
                        ...values,
                        ...changes
                    };

                    onChange(newValues, changes);

                    setValues(prev => ({ ...prev, ...newValues }));
                    let clearedErrors = {};
                    Object.keys(changes).forEach(fieldName => {
                        clearedErrors = {
                            ...clearedErrors,
                            [fieldName]: ''
                        };
                    }
                    );
                    setValidationMessages(prev => ({ ...prev, ...clearedErrors }));

                    if (setCurrentValues) {
                        setCurrentValues({ ...values, ...newValues });
                    }
                }
            });
        }
    };

    const validateForm = () => {
        const currentLang = lang;
        let validationMessages = {};
        let isValid = true;
        let isAnotherLangValid = true; // Todo: добавить подсказку "Поправьте валидацию для языков: langs"
        let isCurrentLangValid = true;
        if (values.status === 'draft') {
            return { isValid: true, isOnlyAnotherLangInvalid: false };
        }

        fields.forEach((field) => {
            let newValidationMessages = {};

            if (field.langInsensitive) {
                if (field.name === 'votingOptions') {
                    if (values[field.name].length < 2) {
                        newValidationMessages[field.name] = 'Create at least 2 options.';
                    } else {
                        const options = values[field.name];
                        options.every((option) => {
                            if ('data' in option) {
                                return true;
                            } else {
                                newValidationMessages[field.name] = 'All voting options should be filled.';
                                return false;
                            }
                        });
                    }
                } else {
                    const validationMessage = validateField(field.name);

                    if (validationMessage) {
                        if (isCurrentLangValid) {
                            isCurrentLangValid = false;
                        }

                        newValidationMessages[field.name] = validationMessage;
                    }
                }
            } else {
                newValidationMessages = langs.reduce((result, lang) => {
                    const validationMessage = validateField(`${lang}_${field.name}`);

                    if (validationMessage) {
                        if (isCurrentLangValid) {
                            if (currentLang === lang) {
                                isCurrentLangValid = false;
                            }
                        }
                        if (isAnotherLangValid) {
                            if (currentLang !== lang) {
                                isAnotherLangValid = false;
                            }
                        }

                        return {
                            ...result,
                            [`${lang}_${field.name}`]: validationMessage
                        };
                    }

                    return result;
                }, {});
            }

            if (!isEmpty(newValidationMessages)) {
                isValid = false;
            }

            validationMessages = {
                ...validationMessages,
                ...newValidationMessages
            };
        });

        setValidationMessages(prev => ({
            ...prev,
            ...validationMessages
        }));

        return { isValid, isOnlyAnotherLangInvalid: !isAnotherLangValid && isCurrentLangValid };
    };

    const validateField = filedName => {
        const validatorsArr = validators[filedName] || [];
        let validationMessage = '';

        forEach(({ name, options }) => {
            const validatorOptions = is(Object, options) ? options : {};
            const validator = validatorsList[name];

            if (validator && !validationMessage) {
                validationMessage = validator(values[filedName], validatorOptions, values, filedName);
            }
        }, validatorsArr);

        return validationMessage;
    };

    const getPayload = () => {
        return langs.reduce((result, lang) => {
            const valuesByLang = fields.reduce((result, field) => {
                const fieldInfo = fieldsMap[field.field];

                if (!fieldInfo.getPayload) {
                    return result;
                }

                const value = fieldInfo.getPayload(values, field, lang);

                return {
                    ...result,
                    [field.name]: value
                };
            }, {});

            return {
                ...result,
                [lang]: valuesByLang
            };
        }, {});
    };

    const handleFieldChange = (field, fieldName) => value => {
        if (checkIsLangsField(field)) {
            setLang(value);
        }
        const currentValue = checkIsAliasField(field) ? replaceForbiddenSymbols(value) : value;
        const changes = {
            [fieldName]: currentValue
        };
        const newValues = {
            ...values,
            ...changes
        };

        setValues(prev => ({ ...prev, ...newValues }));
        if (fieldName === 'status' && value === 'draft') {
            setValidationMessages([]);
        } else {
            setValidationMessages(prev => ({ ...prev, [fieldName]: '' }));
        }

        if (setCurrentValues) {
            setCurrentValues({ ...values, ...newValues });
        }
        onChange(newValues, changes);
    };

    const handleFieldBlur = field => () => {
        if (values.status !== 'draft') {
            const fieldName = getFieldName(field, lang);
            const validationMessage = validateField(fieldName);
            setValidationMessages(prev => ({ ...prev, [fieldName]: validationMessage }));
        }
        onBlur && onBlur(field, values);
    };

    const handleSubmit = event => {
        event && event.preventDefault();

        const { isValid, isOnlyAnotherLangInvalid } = validateForm();

        if (isValid) {
            onSubmit(getPayload());
        } else {
            if (isOnlyAnotherLangInvalid) {
                setErrorText('Check validation for other languages');
                return;
            }

            setErrorText('Check validation');
        }
    };

    const handleTriggerSubmit = () => {
        handleSubmit();
    };

    const handleHideFailMessage = () => {
        setErrorText('');
    };

    return <div>
        <form onSubmit={handleSubmit} className={classes.form}>
            {fields.map((field, i) => createField(field, i))}
        </form>
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            onClose={handleHideFailMessage}
            open={!!errorText}
            autoHideDuration={null}
        >
            <SnackbarContent
                className={classNames(classes.error, classes.margin)}
                classes={{ message: classes.message }}
                message={
                    <span className={classes.message}>
                        <Alert onClose={handleHideFailMessage} severity="error">
                            {errorText}
                        </Alert>
                    </span>
                }
            />
        </Snackbar>
    </div>;
};

const FormRef = forwardRef(Form);

Form.propTypes = {
    data: PropTypes.object,
    fields: PropTypes.array,
    langs: PropTypes.array,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    setCurrentValues: PropTypes.func,
    onBlur: PropTypes.func
};

FormRef.defaultProps = {
    data: {},
    fields: [],
    langs: LOCALES,
    onChange: always,
    onSubmit: always,
    setCurrentValues: () => {}
};

export default FormRef;
