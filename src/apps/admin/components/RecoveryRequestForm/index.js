import React, { useState } from 'react';

import classNames from 'classnames';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import green from '@material-ui/core/colors/green';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';

import recover from '../../services/recover';

import { ADMIN_PANEL_URL } from '../../constants/constants';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
    buttons: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    successBlock: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '110px'
    },
    success: {
        backgroundColor: green[600]
    },
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

const RecoveryRequestForm = () => {
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);
    const [result, setResult] = useState(false);

    const handleChange = event => {
        setEmail(event.target.value);
        setError(false);
    };

    const handleSubmit = event => {
        event.preventDefault();

        if (!event) {
            return setError(true);
        }

        recover(email)
            .then(() => setResult(true));
    };

    if (result) {
        return <div className={classes.successBlock}>
            <SnackbarContent
                className={classNames(classes.success, classes.margin)}
                classes={{ message: classes.message }}
                message={
                    <span id='client-snackbar' className={classes.message}>
                        <Alert severity="success">
                            <FormattedMessage id='checkYourMail' />
                        </Alert>
                    </span>
                }
            />
            <Button variant='contained' color='default' href={ADMIN_PANEL_URL}>
                <FormattedMessage id='goToMainPage' />
            </Button>
        </div>;
    }

    return <form onSubmit={handleSubmit}>
        <Typography variant='h5'><FormattedMessage id='accountRecovery' /></Typography>
        <TextField
            label='Email'
            value={email}
            onChange={handleChange}
            margin='normal'
            variant='outlined'
            fullWidth
            error={error}
        />
        <div className={classes.buttons}>
            <Button variant='contained' color='default' href={ADMIN_PANEL_URL}>
                <FormattedMessage id='goToMainPage' />
            </Button>
            <Button variant='contained' color='primary' type='submit'>
                <FormattedMessage id='reestablish' />
            </Button>
        </div>
    </form>;
};

export default RecoveryRequestForm;
