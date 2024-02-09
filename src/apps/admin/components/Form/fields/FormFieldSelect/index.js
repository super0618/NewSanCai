import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import always from 'ramda/src/always';

import checkSettings from '../../utils/checkSettings';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

const SETTINGS_MODEL = {
    label: ['required', 'string'],
    options: [ // list of select options
        'required',
        {
            label: ['required', 'string'], // label of the select option
            value: ['required', 'string'], // value of the select option
            disabled: ['boolean'] // is the select option disabled
        }
    ],
    disabled: ['boolean'],
    clearable: ['boolean'],
    onChangeCallback: ['function']
};

const FormFieldSelect = ({ value, settings, validationMessage, onChange, onBlur }) => {
    useEffect(() => {
        checkSettings('Select', settings, SETTINGS_MODEL);
    }, []);

    const handleChange = event => {
        event.preventDefault();

        onChange(event.target.value);

        if (settings.onChangeCallback) {
            settings.onChangeCallback(event.target.value);
        }
    };

    const handleClear = () => {
        onChange('');

        if (settings.onChangeCallback) {
            settings.onChangeCallback('');
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
        select
        disabled={settings.disabled}
    >
        {
            (settings.options || []).map((optionSettings, i) => (
                <MenuItem key={i} value={optionSettings.value} disabled={optionSettings.disabled}>
                    {optionSettings.label}
                </MenuItem>
            ))
        }
        {
            settings.clearable && !!value &&
            <MenuItem style={{ color: '#3f51b5' }}>
                Clear value
                <IconButton aria-label="add to shopping cart" onClick={handleClear} color={'primary'} style={{ margin: '0 10px' }} size={'small'}>
                    <ClearIcon />
                </IconButton>
            </MenuItem>
        }
    </TextField>;
};

FormFieldSelect.propTypes = {
    value: PropTypes.string,
    settings: PropTypes.object,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    validationMessage: PropTypes.string
};

FormFieldSelect.defaultProps = {
    value: '',
    settings: {},
    onChange: always,
    onBlur: always,
    validationMessage: ''
};

export const fieldName = 'select';
export const getInitialValues = (data, field, langs) => langs.reduce((result, lang) => {
    if (field.langInsensitive) {
        result[field.name] = data[lang][field.name] || '';
    } else {
        result[`${lang}_${field.name}`] = data[lang][field.name] || '';
    }
    return result;
}, {});
export const getPayload = (values, field, lang) => field.langInsensitive ? values[field.name] : values[`${lang}_${field.name}`];
export const Component = FormFieldSelect;

export default {
    Component,
    fieldName,
    getInitialValues,
    getPayload
};
