import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

import checkSettings from '../../utils/checkSettings';

const SETTINGS_MODEL = {
    label: ['required', 'string'], // label of the title
    variant: ['string'] // variant of the title. Available options: 'h1', 'h2', 'h3', 'h4' (default), 'h5', 'h6', 'subtitle1', 'subtitle2',
    // 'body1', 'body2'. 'caption'. 'button', 'overline', 'srOnly'. 'inherit'
};

const FormFieldTitle = ({ settings }) => {
    useEffect(() => {
        checkSettings('Button', settings, SETTINGS_MODEL);
    }, []);

    return settings.variant !== 'editor'
        ? <Typography
            variant={settings.variant || 'h4'}
        >
            {settings.label}
        </Typography>
        : <div dangerouslySetInnerHTML={{ __html: settings.label }}></div>
    ;
};

FormFieldTitle.propTypes = {
    settings: PropTypes.object
};

FormFieldTitle.defaultProps = {
    settings: {}
};

export const fieldName = 'title';
export const getInitialValues = () => {};
export const Component = FormFieldTitle;

export default {
    Component,
    fieldName,
    getInitialValues
};
