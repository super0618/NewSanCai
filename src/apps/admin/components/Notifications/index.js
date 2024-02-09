import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { useDispatch, useSelector } from 'react-redux';

import SnackbarContent from '@material-ui/core/SnackbarContent';
import classNames from 'classnames';
import Snackbar from '@material-ui/core/Snackbar';
import setError from '../../store/actions/setError';
import { Alert } from '@material-ui/lab';
import setSuccess from '../../store/actions/setSuccess';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
    title: {
        flexGrow: 1
    },
    popper: {
        zIndex: 100
    },
    button: {
        textAlign: 'center'
    },
    message: {
        padding: '0',
        background: 'transparent'
    },
    margin: {
        margin: theme.spacing(1),
        padding: '0',
        minWidth: 'unset',
        background: 'transparent'
    },
    updating: {
        boxShadow: 'none'
    }
}));

const Notifications = () => {
    const error = useSelector(({ application }) => application.error);
    const success = useSelector(({ application }) => application.success);
    const updating = useSelector(({ application }) => application.updating);
    const dispatch = useDispatch();
    const classes = useStyles();

    const handleClose = () => {
        if (error) {
            dispatch(setError(false));
        }
        if (success) {
            dispatch(setSuccess(false));
        }
    };

    return <Snackbar
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
        }}
        onClose={handleClose}
        open={!!error || !!success || !!updating}
        autoHideDuration={success ? 2000 : null}
    >
        <SnackbarContent
            className={classNames(classes.margin, {
                [classes.updating]: !!updating
            })}
            classes={{ message: classes.message }}
            message={
                <span>
                    {
                        success && <Alert onClose={handleClose} severity="success">
                                Changes saved successfully
                        </Alert>
                    }
                    {
                        error && <Alert onClose={handleClose} severity="error">
                            Something went wrong. Reload the page and try again
                        </Alert>
                    }
                    {
                        updating && <CircularProgress />
                    }
                </span>
            }
        />

    </Snackbar>;
};

export default Notifications;
