import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import NewCredentialsForm from '../NewCredentialsForm';

import Typography from '@material-ui/core/Typography';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import amber from '@material-ui/core/colors/amber';
import { makeStyles } from '@material-ui/core/styles';

import checkRecoveryToken from '../../services/checkRecoveryToken';

import { ADMIN_PANEL_URL } from '../../constants/constants';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
    loader: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    warningBlock: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '110px'
    },
    warning: {
        backgroundColor: amber[700]
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

const RecoveryForm = ({ token, email }) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [tokenIsValid, setTokenIsValid] = useState(false);

    useEffect(() => {
        checkRecoveryToken({
            token,
            email
        })
            .then(() => {
                setTokenIsValid(true);
                setLoading(false);
            })
            .catch(() => {
                setTokenIsValid(false);
                setLoading(false);
            });
    }, []);

    const redirectToMain = () => {
        window.location.href = ADMIN_PANEL_URL;
    };

    if (loading) {
        return <div className={classes.loader}>
            <CircularProgress />
        </div>;
    }

    if (tokenIsValid) {
        return <div>
            <Typography variant='h5'><FormattedMessage id='accountRecovery' /></Typography>
            <NewCredentialsForm
                type='recovery'
                initial={{
                    email
                }}
                recovery={{
                    token,
                    email
                }}
                onDone={redirectToMain}
            />
        </div>;
    }

    return <div className={classes.warningBlock}>
        <SnackbarContent
            className={classNames(classes.warning, classes.margin)}
            classes={{ message: classes.message }}
            message={
                <span id='client-snackbar' className={classes.message}>
                    <Alert severity="warning">
                        <FormattedMessage id='thisLinkIsOutdated' />
                    </Alert>
                </span>
            }
        />
        <Button variant='contained' color='default' href={ADMIN_PANEL_URL}>
            <FormattedMessage id='goToMainPage' />
        </Button>
    </div>;
};

RecoveryForm.propTypes = {
    token: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
};

export default RecoveryForm;
