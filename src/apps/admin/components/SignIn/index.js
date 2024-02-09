import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import classNames from 'classnames';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';

import { useDispatch } from 'react-redux';
import signIn from '../../services/signIn';

import { ADMIN_PANEL_URL, TOKEN_LOCAL_STORAGE_NAME } from '../../constants/constants';

import setAdmin from '../../store/actions/setAdmin';
import setToken from '../../store/actions/setToken';
import setAuthenticated from '../../store/actions/setAuthenticated';

import styles from './styles.module.css';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
    error: {
        backgroundColor: theme.palette.error.dark
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1)
    },
    message: {
        display: 'flex',
        alignItems: 'center',
        padding: '0'
    },
    margin: {
        margin: theme.spacing(1),
        padding: '0',
        minWidth: 'unset',
        background: 'transparent'
    }
}));

const Authentication = () => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const [values, setValues] = useState({ login: '', password: '' });
    const [errors, setErrors] = useState({});
    const [authFailed, setAuthFailed] = useState(false);
    const classes = useStyles();

    const handleChange = credential => event => {
        setValues(values => ({ ...values, [credential]: event.target.value }));
        setErrors(errors => ({ ...errors, [credential]: false }));
    };

    const handleHideFailMessage = () => {
        setAuthFailed(false);
    };

    const handleSubmit = event => {
        event.preventDefault();

        const { login, password } = values;
        const credentials = {
            login: login.trim(),
            password: password.trim()
        };

        if (!credentials.login || !credentials.password) {
            return setErrors({
                login: !login,
                password: !password
            });
        }

        signIn(credentials)
            .then(({ admin, token }) => {
                localStorage.setItem(TOKEN_LOCAL_STORAGE_NAME, token);

                dispatch(setToken(token));
                dispatch(setAdmin(admin));
                dispatch(setAuthenticated(true));
            })
            .catch(() => {
                setValues(values => ({ ...values, password: '' }));
                setErrors({});
                setAuthFailed(true);
            });
    };

    return <div className={styles.container}>
        <h1 className={styles.title}><FormattedMessage id='entrance' /></h1>
        <form className={styles.form} noValidate autoComplete='off' onSubmit={handleSubmit}>
            <TextField
                label={intl.formatMessage({ id: 'login' })}
                value={values.login}
                onChange={handleChange('login')}
                margin='normal'
                variant='outlined'
                error={errors.login}
            />
            <TextField
                label={intl.formatMessage({ id: 'password' })}
                value={values.password}
                onChange={handleChange('password')}
                margin='normal'
                variant='outlined'
                error={errors.password}
                type='password'
            />
            <div className={styles.button}>
                <Button variant='contained' color='primary' type='submit' fullWidth>
                    <FormattedMessage id='enter' />
                </Button>
            </div>
            <div className={styles.button}>
                <Button variant='contained' color='default' fullWidth href={`${ADMIN_PANEL_URL}/recovery`}>
                    <FormattedMessage id='forgotYourPassword' />
                </Button>
            </div>
        </form>
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            onClose={handleHideFailMessage}
            open={authFailed}
            autoHideDuration={null}
        >
            <SnackbarContent
                className={classNames(classes.error, classes.margin)}
                classes={{ message: classes.message }}
                message={
                    <span id='client-snackbar' className={classes.message}>
                        <Alert severity="error">
                            <FormattedMessage id='wrongUsernameOrPassword' />
                        </Alert>
                    </span>
                }
            />
        </Snackbar>
    </div>;
};

export default Authentication;
