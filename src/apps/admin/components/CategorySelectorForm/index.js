import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';

import Form from '../Form/Form';
import getFields from './getFields';
import { DEFAULT_LOCALE } from '../../../client/constants';
import { Alert } from '@material-ui/lab';
import getItemName from '../../utils/getItemName';
import editCategoryItems from '../../services/article/editCategoryItems';

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

const CategorySelectorForm = ({ onDone, activeCategory, activeSubcategory, categories, selected }) => {
    const [errorText, setErrorText] = useState();
    const classes = useStyles();
    const [category, setCategory] = useState(activeCategory
        ? (categories.find((category) => category._id === activeCategory._id))
        : null);
    const categoriesOptions = categories.map((category, i) => ({ value: category._id, label: getItemName(category, `Category ${i}`) }));
    const subcategoriesOptions = category
        ? category?.subcategories?.length
            ? category?.subcategories?.map((category, i) => ({ value: category._id, label: getItemName(category, `Category ${i}`) }))
            : null
        : undefined;
    const data = useMemo(() => ({
        en: {
            category: activeCategory?._id,
            subcategory: activeSubcategory?._id
        },
        'zh-cn': {
            category: activeCategory?._id,
            subcategory: activeSubcategory?._id
        },
        'zh-tw': {
            category: activeCategory?._id,
            subcategory: activeSubcategory?._id
        }
    }), [activeCategory, activeSubcategory]);

    const handlePickCategory = (id) => {
        setCategory(categories.find(category => category._id === id) || null);
    };

    const handleSubmit = values => {
        const ids = selected.map((item) => item._id);
        (editCategoryItems({ ids, categoryId: values[DEFAULT_LOCALE].category, subcategoryId: values[DEFAULT_LOCALE].subcategory }))
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
                formTitle: 'Change category',
                categoriesOptions,
                subcategoriesOptions,
                handlePickCategory
            })}
            onSubmit={handleSubmit}
            data={data}
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

CategorySelectorForm.propTypes = {
    onDone: PropTypes.func.isRequired,
    activeCategory: PropTypes.object,
    activeSubcategory: PropTypes.object,
    categories: PropTypes.array,
    selected: PropTypes.array
};

CategorySelectorForm.defaultProps = {
};

export default CategorySelectorForm;
