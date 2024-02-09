import React, { useState } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';

import Form from '../Form/Form';
import getFields from './getFields';
import saveArticleItem from '../../services/post/saveCategoryItem';
import editArticleItem from '../../services/post/editCategoryItem';

import getItemName from '../../utils/getItemName';
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
    },
    margin2: {
        transform: 'translateY(calc(-100% - 10px)) !important'
    }
}));

const ExampleSubcategoryItemForm = ({ item, onDone, categories, authors, activeSubcategory, activeCategory }) => {
    const [errorText, setErrorText] = useState();
    const classes = useStyles();
    const isNewItem = !!item._id;
    const [category, setCategory] = useState(activeCategory ||
        (!!item.data && categories.find((category) => category._id === item.data[DEFAULT_LOCALE].category)));
    const categoriesOptions = categories.map((category, i) => ({ value: category._id, label: getItemName(category, `Category ${i}`) }));
    const subcategoriesOptions = category
        ? category?.subcategories?.length
            ? category?.subcategories?.map((category, i) => ({ value: category._id, label: getItemName(category, `Category ${i}`) }))
            : null
        : undefined;
    const authorsOptions = authors.map((author, i) => ({ value: author._id, label: getItemName(author, `Author ${i}`) }));
    const newItemData = {};
    activeCategory && LOCALES.forEach(locale => {
        newItemData[locale] = {
            category: activeCategory._id,
            ...activeSubcategory ? { subcategory: activeSubcategory._id } : { subcategory: null }
        };
    });

    const handleSubmit = values => {
        const subcategory = activeSubcategory?._id ?? null;
        const newItemValue = Object.entries(values).reduce((obj, [locale, value]) => {
            return {
                ...obj,
                [locale]: {
                    ...value,
                    subcategory
                },
                type: 'photo'
            };
        }, {});

        (isNewItem ? editArticleItem(item._id, values) : saveArticleItem(newItemValue))
            .then(() => {
                onDone();
            })
            .catch(error => {
                if (error.code === 'duplication') {
                    setErrorText('Enter unique alias');
                }
            });
    };

    const handlePickCategory = (id) => {
        setCategory(categories.find(category => category._id === id) || null);
    };

    const handleHideFailMessage = () => {
        setErrorText('');
    };

    return <div>
        <Form
            data={item.data || newItemData}
            fields={getFields({
                formTitle: isNewItem ? 'Edit post' : 'Add post',
                categoriesOptions,
                subcategoriesOptions,
                authorsOptions,
                handlePickCategory
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
                className={classNames(classes.error, classes.margin, classes.margin2)}
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
    authors: PropTypes.array,
    onDone: PropTypes.func.isRequired,
    activeSubcategory: PropTypes.object,
    activeCategory: PropTypes.object
};

ExampleSubcategoryItemForm.defaultProps = {
    categories: {},
    authors: {},
    item: {},
    activeSubcategory: {},
    activeCategory: {}
};

export default ExampleSubcategoryItemForm;
