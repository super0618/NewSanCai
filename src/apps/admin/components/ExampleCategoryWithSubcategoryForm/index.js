import React, { useState } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';

import Form from '../Form/Form';
import getFields from './getFields';
import saveExampleCategory from '../../services/exampleCategoryWithSubcategories/saveCategory';
import editExampleCategory from '../../services/exampleCategoryWithSubcategories/editCategory';
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

const ExampleCategoryWithSubcategoryForm = ({ item, onDone }) => {
    const [errorText, setErrorText] = useState();
    const classes = useStyles();
    const isExistItem = !!item._id;

    const handleSubmit = values => {
        (isExistItem ? editExampleCategory(item._id, values) : saveExampleCategory(values))
            .then(() => {
                onDone();
            })
            .catch(error => {
                if (error.code === 'duplication') {
                    setErrorText('Enter unique alias');
                } else {
                    setErrorText('Something went wrong. Reload the page and try again');
                }
            });
    };

    const handleHideFailMessage = () => {
        setErrorText('');
    };

    return <div>
        <Form
            data={item.data}
            fields={getFields({
                formTitle: isExistItem ? 'Редактирование примера' : 'Добавление примера'
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
            autoHideDuration={2000}
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

ExampleCategoryWithSubcategoryForm.propTypes = {
    item: PropTypes.object,
    onDone: PropTypes.func.isRequired
};

ExampleCategoryWithSubcategoryForm.defaultProps = {
    item: {}
};

export default ExampleCategoryWithSubcategoryForm;
