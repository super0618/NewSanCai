import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';

import { makeStyles } from '@material-ui/core/styles';

import checkSettings from '../../utils/checkSettings';

const SETTINGS_MODEL = {}; // no available settings

const useStyles = makeStyles(theme => ({
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    }
}));

const FormFieldDivider = ({ settings }) => {
    const classes = useStyles();

    useEffect(() => {
        checkSettings('Divider', settings, SETTINGS_MODEL);
    }, []);

    return <Divider className={classes.divider} />;
};

FormFieldDivider.propTypes = {
    settings: PropTypes.object
};

FormFieldDivider.defaultProps = {
    settings: {}
};

export const fieldName = 'divider';
export const getInitialValues = () => {};
export const Component = FormFieldDivider;

export default {
    Component,
    fieldName,
    getInitialValues
};
