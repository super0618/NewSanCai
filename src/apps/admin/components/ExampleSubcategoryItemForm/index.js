import React, { useState } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';

import Form from '../Form/Form';
import getFields from './getFields';
import saveExampleCategoryItem from '../../services/exampleCategoryWithSubcategories/saveCategoryItem';
import editExampleCategoryItem from '../../services/exampleCategoryWithSubcategories/editCategoryItem';

import getItemName from '../../utils/getItemName';
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

const ExampleSubcategoryItemForm = ({ item, onDone, categories, activeSubcategory }) => {
    const [errorText, setErrorText] = useState();
    const classes = useStyles();
    const isNewItem = !!item._id;
    const categoriesOptions = categories.map((category, i) => ({ value: category._id, label: getItemName(category, `Category ${i}`) }));

    const handleSubmit = values => {
        const subcategory = activeSubcategory?._id ?? null;
        const newItemValue = Object.entries(values).reduce((obj, [locale, value]) => {
            return {
                ...obj,
                [locale]: {
                    ...value,
                    subcategory
                }
            };
        }, {});

        (isNewItem ? editExampleCategoryItem(item._id, values) : saveExampleCategoryItem(newItemValue))
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
                formTitle: isNewItem ? 'Редактирование примера' : 'Добавление примера',
                categoriesOptions
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

ExampleSubcategoryItemForm.propTypes = {
    item: PropTypes.object,
    categories: PropTypes.array,
    onDone: PropTypes.func.isRequired,
    activeSubcategory: PropTypes.object
};

ExampleSubcategoryItemForm.defaultProps = {
    categories: {},
    item: {},
    activeSubcategory: {}
};

export default ExampleSubcategoryItemForm;
