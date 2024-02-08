import React, { useState } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';

import Form from '../Form/Form';
import getFields from './getFields';
import editArticleComment from '../../services/article/editArticleComment';
import editPostComment from '../../services/post/editPostComment';

import { DEFAULT_LOCALE, LOCALES } from '../../../client/constants';
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

const CommentForm = ({ item, onDone, isArticleComment }) => {
    const [errorText, setErrorText] = useState();
    const classes = useStyles();
    const commentData = {};
    LOCALES.forEach((locale) => {
        commentData[locale] = {
            text: item.comment.text
        };
    });

    const handleSubmit = values => {
        // eslint-disable-next-line max-len
        (isArticleComment ? editArticleComment(item.object._id, item._id, { text: values[DEFAULT_LOCALE].text }) : editPostComment(item.object._id, item._id, { text: values[DEFAULT_LOCALE].text }))
            .then(() => {
                onDone();
            })
            .catch(error => {
                if (error.code === 'duplication') {
                    // no duplication validation atm
                }
            });
    };

    const handleHideFailMessage = () => {
        setErrorText('');
    };

    return <div>
        <Form
            data={commentData}
            fields={getFields({
                formTitle: 'Edit comment'
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

CommentForm.propTypes = {
    item: PropTypes.object,
    onDone: PropTypes.func.isRequired,
    isArticleComment: PropTypes.bool
};

CommentForm.defaultProps = {
    item: {}
};

export default CommentForm;
