import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';

import always from 'ramda/src/always';

import checkSettings from '../../utils/checkSettings';

const SETTINGS_MODEL = {
    label: ['required', 'string'], // label of the field
    multiline: ['boolean'], // should the field work like a textarea
    type: ['string'], // "type" attribute of the input
    max: ['number'], // "max" attribute of the number input
    min: ['number'], // "min" attribute of the number input
    forbiddenSymbols: ['array'] // symbols that are forbidden for typing
};

const FormFieldInput = ({ value, settings, validationMessage, onChange, onBlur }) => {
    useEffect(() => {
        checkSettings('Input', settings, SETTINGS_MODEL);
    }, []);

    const handleChange = event => {
        event.preventDefault();
        if (!settings.forbiddenSymbols?.includes(event.nativeEvent.data)) {
            if (settings.type === 'number') {
                if (settings.max) {
                    if (parseInt(event.target.value) > settings.max) {
                        onChange(settings.max);
                        return;
                    }
                }
                if (settings.min) {
                    if (parseInt(event.target.value) < settings.min) {
                        onChange(settings.min);
                        return;
                    }
                }
            }

            onChange(event.target.value);
        }
    };

    return <TextField
        label={settings.label}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        error={!!validationMessage}
        margin='normal'
        variant='outlined'
        multiline={settings.multiline}
        type={settings.type || 'text'}
        InputProps={{
            inputProps: settings.type === 'number' && {
                ...(settings.max ? { max: settings.max } : {}),
                ...(settings.min ? { min: settings.min } : {})
            }
        }}
    />;
};

FormFieldInput.propTypes = {
    value: PropTypes.string,
    settings: PropTypes.object,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    validationMessage: PropTypes.string
};

FormFieldInput.defaultProps = {
    value: '',
    settings: {},
    onChange: always,
    onBlur: always,
    validationMessage: ''
};

export const fieldName = 'input';
export const getInitialValues = (data, field, langs) => langs.reduce((result, lang) => {
    if (field.langInsensitive) {
        result[field.name] = data[lang][field.name] || '';
    } else {
        result[`${lang}_${field.name}`] = data[lang][field.name] || '';
    }
    return result;
}, {});
export const getPayload = (values, field, lang) => field.langInsensitive ? values[field.name] : values[`${lang}_${field.name}`];
export const Component = FormFieldInput;

export default {
    Component,
    fieldName,
    getInitialValues,
    getPayload
};
