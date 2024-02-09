import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import always from 'ramda/src/always';

import checkSettings from '../../utils/checkSettings';
import getArticlesByIds from '../../../../services/article/getItemsByIds';
import { DEFAULT_LOCALE } from '../../../../../client/constants';

const SETTINGS_MODEL = {
    label: ['required', 'string'],
    multiple: ['required', 'boolean'],
    options: [ // list of select options
        'required',
        {
            label: ['required', 'string'], // label of the select option
            value: ['required', 'string'], // value of the select option
            category: ['string'], // helper value for the select option
            disabled: ['boolean'] // is the select option disabled
        }
    ],
    onSearch: ['function']
};

const FormFieldSuggest = ({ value, settings, validationMessage, onChange, onBlur }) => {
    const [currentArticle, setCurrentArticle] = useState(null);

    useEffect(() => {
        if (settings.onSearch && !!value) {
            getArticlesByIds({
                ids: value,
                locale: DEFAULT_LOCALE,
                sort: 'desc'
            }).then(result => {
                if (result?.length) {
                    setCurrentArticle({
                        value: result[0]._id,
                        label: result[0].data[DEFAULT_LOCALE]?.title
                    });
                }
            });
        }

        checkSettings('Suggest', settings, SETTINGS_MODEL);
    }, []);

    const valueOptions = useMemo(() => {
        if (settings.multiple) {
            return (value || []).map(value => settings.options.find(valueOption => valueOption.value === value)).filter(value => !!value);
        } else {
            const valueOption = settings.options.find(valueOption => valueOption.value === value);
            if (valueOption) {
                return valueOption;
            } else if (currentArticle) {
                return currentArticle;
            } else {
                if (value) {
                    onChange('');
                }

                return '';
            }
        }
    }, [settings.multiple, value, settings.options, currentArticle]);

    const handleChange = (event, option) => {
        event.preventDefault();

        onChange(settings.multiple ? option.map(option => option.value) : (option?.value || ''));
    };

    return <Autocomplete
        multiple={settings.multiple}
        onChange={handleChange}
        options={settings.options || []}
        value={valueOptions}
        getOptionLabel={option => option.label || ''}
        getOptionDisabled={option => option.disabled || false}
        renderInput={(params) => <TextField
            {...params}
            label={settings.label}
            onBlur={onBlur}
            error={!!validationMessage}
            margin='normal'
            variant='outlined'
            onChange={settings.onSearch}
        />}
    />;
};

FormFieldSuggest.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]),
    settings: PropTypes.object,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    validationMessage: PropTypes.string
};

FormFieldSuggest.defaultProps = {
    value: '',
    settings: {},
    onChange: always,
    onBlur: always,
    validationMessage: ''
};

export const fieldName = 'suggest';
export const getInitialValues = (data, field, langs) => langs.reduce((result, lang) => {
    if (field.langInsensitive) {
        result[field.name] = data[lang][field.name] || '';
    } else {
        result[`${lang}_${field.name}`] = data[lang][field.name] || '';
    }
    return result;
}, {});
export const getPayload = (values, field, lang) => field.langInsensitive ? values[field.name] : values[`${lang}_${field.name}`];
export const Component = FormFieldSuggest;

export default {
    Component,
    fieldName,
    getInitialValues,
    getPayload
};
