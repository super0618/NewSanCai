import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import checkSettings from '../../utils/checkSettings';

const useStyles = makeStyles({
    buttonRoot: {
        display: 'inline-flex',
        marginTop: '16px'
    }
});

const SETTINGS_MODEL = {
    label: ['required', 'string'], // label of the button
    color: ['string'], // color of the button. Available options: 'default', 'inherit', 'primary' (default), 'secondary'
    disabled: ['boolean'], // is the button disabled
    onClick: ['function'] // onClick handler. Disable form submitting
};

const FormFieldButton = props => {
    useEffect(() => {
        checkSettings('Button', settings, SETTINGS_MODEL);
    }, []);

    const { settings } = props;
    const classes = useStyles();

    const handleClick = event => {
        event.preventDefault();

        const callback = settings.onClick || props.triggerSubmit;

        callback();
    };

    return <div className={classes.buttonRoot}>
        <Button
            variant='contained'
            color={settings.color || 'primary'}
            disabled={settings.disabled}
            onClick={handleClick}
        >
            {settings.label}
        </Button>
    </div>;
};

FormFieldButton.propTypes = {
    settings: PropTypes.object,
    triggerSubmit: PropTypes.func
};

FormFieldButton.defaultProps = {
    settings: {},
    triggerSubmit: () => {}
};

export const fieldName = 'button';
export const getInitialValues = () => {};
export const Component = FormFieldButton;

export default {
    Component,
    fieldName,
    getInitialValues
};
