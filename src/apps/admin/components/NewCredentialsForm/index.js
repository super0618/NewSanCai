import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

import changeCredentials from '../../services/changeCredentials';
import changeRecoveryCredentials from '../../services/changeRecoveryCredentials';

const EMAIL_PATTERN = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i; // eslint-disable-line no-control-regex, no-useless-escape, max-len

const newCredentialsValidators = [
    ({ login }) => /[а-яА-Я]/g.test(login) ? <FormattedMessage id='loginMustNotContainCyrillic' /> : null,
    ({ login }) => / /g.test(login) ? <FormattedMessage id='loginMustNotContainSpaces' /> : null,
    ({ password }) => password.length >= 8 ? null : <FormattedMessage id='passwordLengthMustBeAtLeastEight' />,
    ({ password }) => /[а-яА-Я]/g.test(password) ? <FormattedMessage id='passwordMustNotContainCyrillic' /> : null,
    ({ password }) => / /g.test(password) ? <FormattedMessage id='passwordMustNotContainSpaces' /> : null,
    ({ password }) => /[0-9]/g.test(password) ? null : <FormattedMessage id='numbersMustBeUsedInPassword' />,
    ({ password, password2 }) => password === password2 ? null : <FormattedMessage id='passwordsMustMatch' />,
    ({ email }) => EMAIL_PATTERN.test(email) ? null : <FormattedMessage id='pleaseEnterValidEmail' />
];

const validateCredentials = credentials => {
    const errors = [];

    newCredentialsValidators.forEach(validator => {
        const error = validator(credentials);

        error && errors.push(error);
    });

    return errors;
};

const useStyles = makeStyles({
    form: {
        width: '400px'
    },
    errorPoint: {
        marginTop: '10px',
        fontSize: '14px'
    }
});

const NewCredentialsForm = ({ onDone, initial, type, authentication, recovery }) => {
    const { email = '', login = '' } = initial;
    const [values, setValues] = useState({ email, login, password: '', password2: '' });
    const [errors, setErrors] = useState({});
    const [credentialsErrors, setCredentialsErrors] = useState([]);

    const classes = useStyles();

    const changeCredentialsByType = newCredentials => {
        switch (type) {
        case 'authentication':
            return changeCredentials({
                oldCredentials: authentication,
                newCredentials
            });
        case 'recovery':
            return changeRecoveryCredentials({
                recovery,
                newCredentials
            });
        }
    };

    const handleChange = credential => event => {
        setValues(values => ({ ...values, [credential]: event.target.value }));
        setErrors(errors => ({ ...errors, [credential]: false }));
    };

    const handleSubmit = event => {
        event.preventDefault();

        const { login, password, password2, email } = values;
        const newCredentials = {
            login: login.trim(),
            password: password.trim(),
            email: email.trim()
        };

        if (!newCredentials.login || !newCredentials.password || !newCredentials.email || !password2) {
            return setErrors({
                login: !login,
                email: !email,
                password: !password,
                password2: !password2
            });
        }

        const credentialsErrors = validateCredentials({
            ...newCredentials,
            password2: password2.trim()
        });

        setCredentialsErrors(credentialsErrors);

        if (credentialsErrors.length) {
            return;
        }

        changeCredentialsByType(newCredentials)
            .then(() => {
                onDone();
            })
            .catch(() => {
                setValues(values => ({ ...values, login, password: '', password2: '' }));
            });
    };

    return <div>
        <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
                label={<FormattedMessage id='email' />}
                value={values.email}
                onChange={handleChange('email')}
                margin='normal'
                variant='outlined'
                fullWidth
                error={errors.email}
                InputLabelProps={{
                    shrink: !!values.email
                }}
            />
            <TextField
                label={<FormattedMessage id='login' />}
                value={values.login}
                onChange={handleChange('login')}
                margin='normal'
                variant='outlined'
                fullWidth
                error={errors.login}
                InputLabelProps={{
                    shrink: !!values.login
                }}
            />
            <TextField
                label={<FormattedMessage id='password' />}
                value={values.password}
                onChange={handleChange('password')}
                margin='normal'
                variant='outlined'
                fullWidth
                error={errors.password}
                InputLabelProps={{
                    shrink: !!values.password
                }}
                type='password'
            />
            <TextField
                label={<FormattedMessage id='confirmPassword' />}
                value={values.password2}
                onChange={handleChange('password2')}
                margin='normal'
                variant='outlined'
                fullWidth
                error={errors.password2}
                InputLabelProps={{
                    shrink: !!values.password2
                }}
                type='password'
            />
            <Button variant='contained' color='primary' type='submit' fullWidth>
                <FormattedMessage id='change' />
            </Button>
            { credentialsErrors.map((error, i) => <Typography className={classes.errorPoint} color='error' key={i}>&bull; {error}</Typography>) }
        </form>
    </div>;
};

NewCredentialsForm.propTypes = {
    type: PropTypes.oneOf(['authentication', 'recovery']).isRequired,
    authentication: PropTypes.object,
    recovery: PropTypes.object,
    initial: PropTypes.object,
    onDone: PropTypes.func
};

NewCredentialsForm.defaultProps = {
    onDone: () => {},
    authentication: {},
    recovery: {},
    initial: {}
};

export default NewCredentialsForm;
