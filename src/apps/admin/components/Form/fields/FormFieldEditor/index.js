import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Editor from '../../../Editor';

import always from 'ramda/src/always';

import checkSettings from '../../utils/checkSettings';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    field: {
        marginTop: '15px',
        marginBottom: '8px',
        '& .ck-content': {
            minHeight: '150px'
        }
    }
});

const SETTINGS_MODEL = {
    toolbar: ['array'], // list of features, which are available in the editor,
    type: ['string'],
    filename: ['string']
};

const defaultToolbar = [
    'heading',
    '|',
    'alignment',
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    'link',
    'highlight',
    '|',
    'bulletedList',
    'numberedList',
    '|',
    'horizontalLine',
    'imageUpload',
    'videoUpload',
    'blockQuote',
    'insertTable',
    'mediaEmbed',
    'undo',
    'redo'
];

const FormFieldEditor = ({ value, settings, onChange }) => {
    useEffect(() => {
        checkSettings('Editor', settings, SETTINGS_MODEL);
    }, []);

    const classes = useStyles();

    const handleChange = event => {
        onChange(event.target.value);
    };

    return <div className={classes.field}>
        {
            settings.type === 'articleImage'
                ? (
                    settings.filename &&
                <Editor
                    toolbar={settings.toolbar || defaultToolbar}
                    value={value}
                    onChange={handleChange}
                    filename={settings.filename}
                />
                )
                : (
                    <Editor
                        toolbar={settings.toolbar || defaultToolbar}
                        value={value}
                        onChange={handleChange}
                    />
                )
        }

    </div>;
};

FormFieldEditor.propTypes = {
    settings: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func
};

FormFieldEditor.defaultProps = {
    value: '',
    settings: {},
    onChange: always
};

export const fieldName = 'editor';
export const getInitialValues = (data, field, langs) => langs.reduce((result, lang) => {
    if (field.langInsensitive) {
        result[field.name] = data[lang][field.name] || '';
    } else {
        result[`${lang}_${field.name}`] = data[lang][field.name] || '';
    }
    return result;
}, {});
export const getPayload = (values, field, lang) => field.langInsensitive ? values[field.name] : values[`${lang}_${field.name}`];
export const Component = FormFieldEditor;

export default {
    Component,
    fieldName,
    getInitialValues,
    getPayload
};
