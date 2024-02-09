import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import always from 'ramda/src/always';

import checkSettings from '../../utils/checkSettings';

const SETTINGS_MODEL = {
    label: ['required', 'string'], // label of the checkbox
    disabled: ['boolean'] // is the checkbox disabled
};

const FormFieldCheckbox = ({ value, settings, onChange }) => {
    useEffect(() => {
        checkSettings('Checkbox', settings, SETTINGS_MODEL);
    }, []);

    const handleChange = (event, checked) => {
        event.preventDefault();

        onChange(checked);
    };

    return <FormControlLabel
        control={
            <Checkbox
                checked={value}
                onChange={handleChange}
                color='primary'
                disabled={settings.disabled}
            />
        }
        label={settings.label}
    />;
};

FormFieldCheckbox.propTypes = {
    value: PropTypes.bool,
    settings: PropTypes.object,
    onChange: PropTypes.func
};

FormFieldCheckbox.defaultProps = {
    value: false,
    settings: {},
    onChange: always
};

export const fieldName = 'checkbox';
export const getInitialValues = (data, field, langs) => langs.reduce((result, lang) => {
    if (field.langInsensitive) {
        result[field.name] = data[lang][field.name] || false;
    } else {
        result[`${lang}_${field.name}`] = data[lang][field.name] || false;
    }
    return result;
}, {});
export const getPayload = (values, field, lang) => field.langInsensitive ? values[field.name] : values[`${lang}_${field.name}`];
export const Component = FormFieldCheckbox;

export default {
    Component,
    fieldName,
    getInitialValues,
    getPayload
};
