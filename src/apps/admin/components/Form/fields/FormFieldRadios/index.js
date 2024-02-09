import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import always from 'ramda/src/always';

import checkSettings from '../../utils/checkSettings';

const SETTINGS_MODEL = {
    options: [ // list of radio options
        'required',
        {
            label: ['required', 'string'], // label of the radio option
            value: ['required', 'string'], // value of the radio option
            disabled: ['boolean'] // is the radio option disabled
        }
    ]
};

const FormFieldRadios = ({ value, settings, onChange }) => {
    useEffect(() => {
        checkSettings('Radios', settings, SETTINGS_MODEL);
    }, []);

    const handleToggle = currentValue => (event, checked) => {
        if (checked) {
            onChange(currentValue);
        } else {
            onChange('');
        }
    };

    return <FormControl>
        <RadioGroup>
            {(settings.options || []).map((optionSettings, i) => {
                return (
                    <FormControlLabel
                        key={i}
                        control={
                            <Radio
                                color='primary'
                                disabled={optionSettings.disabled}
                                onChange={handleToggle(optionSettings.value)}
                                checked={optionSettings.value === value}
                            />
                        }
                        label={optionSettings.label}
                    />
                );
            })}
        </RadioGroup>
    </FormControl>;
};

FormFieldRadios.propTypes = {
    value: PropTypes.string,
    settings: PropTypes.object,
    onChange: PropTypes.func
};

FormFieldRadios.defaultProps = {
    value: '',
    settings: {},
    onChange: always
};

export const fieldName = 'radios';
export const getInitialValues = (data, field, langs) => langs.reduce((result, lang) => {
    if (field.langInsensitive) {
        result[field.name] = data[lang][field.name] || null;
    } else {
        result[`${lang}_${field.name}`] = data[lang][field.name] || null;
    }
    return result;
}, {});
export const getPayload = (values, field, lang) => field.langInsensitive ? values[field.name] : values[`${lang}_${field.name}`];
export const Component = FormFieldRadios;

export default {
    Component,
    fieldName,
    getInitialValues,
    getPayload
};
