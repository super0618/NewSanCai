import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';

import Form from '../Form/Form';
import getFields from './getFields';
import saveArticleSubcategory from '../../services/article/saveSubcategory';
import editArticleSubcategory from '../../services/article/editSubcategory';
import getArticlesByName from '../../services/article/getItemsPaginatedByName';
import getArticlesByIds from '../../services/article/getItemsByIds';
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
    },
    margin2: {
        transform: 'translateY(calc(-100% - 10px)) !important'
    }
}));

const ExampleSubcategoryForm = ({ activeCategory, item, onDone }) => {
    const [errorText, setErrorText] = useState();
    const classes = useStyles();
    const isExistItem = !!item._id;

    const handleSubmit = values => {
        (isExistItem
            ? editArticleSubcategory({ categoryId: activeCategory._id, id: item._id, item: values })
            : saveArticleSubcategory(activeCategory._id, values))
            .then(() => {
                onDone();
            })
            .catch(error => {
                if (error.code === 'duplication') {
                    setErrorText('Enter unique alias');
                }
            });
    };

    const handleHideFailMessage = () => {
        setErrorText('');
    };

    const handleFetchValue = (value, featured) => {
        return getArticlesByName({
            search: value,
            page: 1,
            size: 50,
            sort: 'desc',
            locale: DEFAULT_LOCALE,
            categoryId: activeCategory._id,
            subcategoryId: item._id,
            ...(featured
                ? {
                    excludeId: featured.filter(item => !!item).join(',') || ''
                }
                : {})
        });
    };

    const handleGetByIdsArticles = (value) => {
        return getArticlesByIds({
            ids: value,
            locale: DEFAULT_LOCALE,
            sort: 'desc'
        });
    };

    return <div>
        <Form
            data={item.data}
            fields={getFields({
                formTitle: isExistItem ? 'Edit subcategory' : 'Add subcategory',
                onInputChangeHandler: handleFetchValue,
                onValueChangeHandlerArticles: handleGetByIdsArticles
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

ExampleSubcategoryForm.propTypes = {
    activeCategory: PropTypes.object,
    item: PropTypes.object,
    onDone: PropTypes.func.isRequired
};

ExampleSubcategoryForm.defaultProps = {
    activeCategory: {},
    item: {}
};

export default ExampleSubcategoryForm;
