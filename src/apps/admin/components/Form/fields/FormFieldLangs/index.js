import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import always from 'ramda/src/always';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { makeStyles } from '@material-ui/core/styles';

import checkSettings from '../../utils/checkSettings';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { lighten } from '@material-ui/core/styles/colorManipulator';

const SETTINGS_MODEL = {}; // no available settings

const useStyles = makeStyles(theme => ({
    root: {
        justifyContent: 'flex-start',
        marginTop: '15px'
    },
    langNav: {
        maxWidth: '50px',
        textTransform: 'uppercase'
    },
    langNavError: {
        color: 'red !important'
    },
    buttonWrapper: {
        display: 'flex',
        alignItems: 'center'
    },
    button: {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        whiteSpace: 'nowrap',
        height: 'fit-content'
    }
}));

const FormFieldLangs = ({ value, validationMessage, onChange, langs, settings, triggerTranslate }) => {
    useEffect(() => {
        checkSettings('Langs', settings, SETTINGS_MODEL);
    }, []);

    const classes = useStyles();

    const handleChange = (event, newValue) => {
        onChange(langs[newValue]);
    };

    const valueIndex = useMemo(() => {
        const valueIndex = langs.findIndex(lang => value === lang);

        return valueIndex < 0 ? 0 : valueIndex;
    }, [value, langs]);

    const handleTranslate = (event) => {
        event.preventDefault();

        if (triggerTranslate) {
            triggerTranslate();
        }
    };

    return <BottomNavigation
        value={valueIndex}
        onChange={handleChange}
        showLabels
        className={classes.root}
    >
        {langs.map((lang, i) => {
            return <BottomNavigationAction className={classNames(classes.langNav, {
                [classes.langNavError]: !!validationMessage
            })} key={i} label={lang} />;
        })}
        {
            triggerTranslate &&
            <div className={classes.buttonWrapper}>
                <Tooltip title={'Translate form values to languages other than active'}>
                    <Button className={classes.button} onClick={handleTranslate}>Translate</Button>
                </Tooltip>
            </div>
        }
    </BottomNavigation>;
};

FormFieldLangs.propTypes = {
    onChange: PropTypes.func,
    triggerTranslate: PropTypes.func,
    value: PropTypes.string,
    langs: PropTypes.array,
    settings: PropTypes.object,
    validationMessage: PropTypes.string
};

FormFieldLangs.defaultProps = {
    onChange: always,
    langs: [],
    value: '',
    settings: {},
    validationMessage: '',
    triggerTranslate: () => {}
};

export const fieldName = 'langs';
export const getInitialValues = () => {};
export const Component = FormFieldLangs;

export default {
    Component,
    fieldName,
    getInitialValues
};
