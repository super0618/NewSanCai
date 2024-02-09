import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';

import format from 'date-fns/format';

import checkSettings from '../../utils/checkSettings';

const SETTINGS_MODEL = {
    label: ['required', 'string'], // label of the field
    preloadToday: ['boolean'],
    preloadTomorrow: ['boolean'],
    min: ['string']
};

const FormFieldDate = ({ value, validationMessage, settings, onChange, onBlur }) => {
    useEffect(() => {
        checkSettings('Date', settings, SETTINGS_MODEL);
    }, []);

    const today = new Date();
    const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

    const preloadedDate = settings.preloadToday ? today : tomorrow;
    const year = preloadedDate.getFullYear();
    const month = preloadedDate.getMonth() + 1;
    const day = preloadedDate.getDate();
    const preloadedDateFormatted = `${year}-${month.toString().length === 1 ? `0${month}` : month}-${day.toString().length === 1 ? `0${day}` : day}`;

    const date = useMemo(() => (!value && (settings.preloadToday || settings.preloadTomorrow))
        ? preloadedDateFormatted
        : value, [value]);

    useEffect(() => {
        onChange(date);
    }, [date]);

    const handleChange = event => {
        event.preventDefault();

        onChange(event.target.value);
    };

    return <TextField
        label={settings.label}
        value={date}
        onChange={handleChange}
        onBlur={onBlur}
        error={!!validationMessage}
        margin='normal'
        variant='outlined'
        type='date'
        InputLabelProps={{
            shrink: true
        }}
        InputProps={{
            inputProps: {
                ...(settings.min ? { min: settings.min } : {})
            }
        }}
    />;
};

FormFieldDate.propTypes = {
    value: PropTypes.string,
    settings: PropTypes.object,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    validationMessage: PropTypes.string
};

FormFieldDate.defaultProps = {
    settings: {},
    onChange: () => {},
    onBlur: () => {},
    validationMessage: ''
};

export const fieldName = 'date';
export const getInitialValues = (data, field, langs) => langs.reduce((result, lang) => {
    if (field.langInsensitive) {
        result[field.name] = data[lang][field.name] ? format(data[lang][field.name], 'yyyy-MM-dd') : '';
    } else {
        result[`${lang}_${field.name}`] = data[lang][field.name] ? format(data[lang][field.name], 'yyyy-MM-dd') : '';
    }
    return result;
}, {});
export const getPayload = (values, field, lang) => {
    if (field.langInsensitive) {
        return values[field.name] ? +new Date(values[field.name]) : undefined;
    } else {
        return values[`${lang}_${field.name}`] ? +new Date(values[`${lang}_${field.name}`]) : undefined;
    }
};
export const Component = FormFieldDate;

export default {
    Component,
    fieldName,
    getInitialValues,
    getPayload
};
