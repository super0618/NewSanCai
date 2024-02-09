import React, { useState } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';

import Form from '../Form/Form';
import getFields from './getFields';
import getArticlePage from '../../services/article/getArticlePage';
import { DEFAULT_LOCALE } from '../../../client/constants';
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

const ArticleCategoryForm = ({ onDone }) => {
    const [errorText, setErrorText] = useState();
    const classes = useStyles();

    const handleSubmit = values => {
        (getArticlePage(values[DEFAULT_LOCALE].link))
            .then((result) => {
                onDone(result);
            })
            .catch(() => {
                // setErrorText('Something went wrong. Reload the page and try again');
            });
    };

    const handleHideFailMessage = () => {
        setErrorText('');
    };

    return <div>
        <Form
            fields={getFields({
                formTitle: 'Add article'
            })}
            onSubmit={handleSubmit}
        />
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            onClose={handleHideFailMessage}
            open={!!errorText}
            autoHideDuration={null}
        >
            <SnackbarContent
                className={classNames(classes.error, classes.margin)}
                classes={{ message: classes.message }}
                message={
                    <span className={classes.message}>
                        <Alert onClose={handleHideFailMessage} severity="error">
                            {errorText}
                        </Alert>
                    </span>
                }
            />
        </Snackbar>
    </div>;
};

ArticleCategoryForm.propTypes = {
    onDone: PropTypes.func.isRequired
};

ArticleCategoryForm.defaultProps = {
};

export default ArticleCategoryForm;
