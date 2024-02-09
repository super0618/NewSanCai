import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import checkSettings from '../../utils/checkSettings';

const useStyles = makeStyles({
    button: {
        margin: '15px 10px 0 0'
    }
});

const SETTINGS_MODEL = {
    buttons: [ // list of buttons
        'required',
        {
            label: ['required', 'string'], // label of the button
            color: ['string'], // color of the button. Available options: 'default' (default), 'inherit', 'primary', 'secondary'
            disabled: ['boolean'], // is the button disabled
            onClick: ['function'] // onClick handler. Disable form submitting
        }
    ]
};

const FormFieldButtons = ({ settings, triggerSubmit }) => {
    useEffect(() => {
        checkSettings('Buttons', settings, SETTINGS_MODEL);
    }, []);

    const classes = useStyles();

    const handleClick = buttonSettings => event => {
        event.preventDefault();

        const callback = buttonSettings.onClick || triggerSubmit;

        callback();
    };

    return <div>
        {(settings.buttons || []).map((buttonSettings, i) => {
            return <Button
                key={i}
                variant='contained'
                className={classes.button}
                color={buttonSettings.color || 'primary'}
                disabled={settings.disabled}
                onClick={handleClick(buttonSettings)}
            >
                {buttonSettings.label}
            </Button>;
        })}
    </div>;
};

FormFieldButtons.propTypes = {
    settings: PropTypes.object,
    triggerSubmit: PropTypes.func
};

FormFieldButtons.defaultProps = {
    settings: {},
    triggerSubmit: () => {}
};

export const fieldName = 'buttons';
export const getInitialValues = () => {};
export const Component = FormFieldButtons;

export default {
    Component,
    fieldName,
    getInitialValues
};
