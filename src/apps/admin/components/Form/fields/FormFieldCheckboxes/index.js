import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import List from '@material-ui/core/List';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import always from 'ramda/src/always';

import checkSettings from '../../utils/checkSettings';

const SETTINGS_MODEL = {
    options: [ // list of checkboxes
        'required',
        {
            label: ['required', 'string'], // label of the checkbox
            value: ['required', 'string'], // value of the checkbox
            disabled: ['boolean'] // is the checkbox disabled
        }
    ]
};

const FormFieldCheckboxes = ({ value, settings, onChange }) => {
    useEffect(() => {
        checkSettings('Checkboxes', settings, SETTINGS_MODEL);
    }, []);

    const handleChange = currentValue => () => {
        if (value.includes(currentValue)) {
            onChange(value.filter(value => value !== currentValue));
        } else {
            onChange([...value, currentValue]);
        }
    };

    return <List dense>
        {(settings.options || []).map((optionSettings, i) => {
            return (
                <FormControlLabel
                    key={i}
                    control={
                        <Checkbox
                            checked={value.includes(optionSettings.value)}
                            onChange={handleChange(optionSettings.value)}
                            color='primary'
                            disabled={settings.disabled}
                        />
                    }
                    label={optionSettings.label}
                />
            );
        })}
    </List>;
};

FormFieldCheckboxes.propTypes = {
    value: PropTypes.array,
    settings: PropTypes.object,
    onChange: PropTypes.func
};

FormFieldCheckboxes.defaultProps = {
    value: [],
    settings: {},
    onChange: always
};

export const fieldName = 'checkboxes';
export const getInitialValues = (data, field, langs) => langs.reduce((result, lang) => {
    if (field.langInsensitive) {
        result[field.name] = data[lang][field.name] || [];
    } else {
        result[`${lang}_${field.name}`] = data[lang][field.name] || [];
    }
    return result;
}, {});
export const getPayload = (values, field, lang) => field.langInsensitive ? values[field.name] : values[`${lang}_${field.name}`];
export const Component = FormFieldCheckboxes;

export default {
    Component,
    fieldName,
    getInitialValues,
    getPayload
};
