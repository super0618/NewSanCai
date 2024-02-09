import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import classNames from 'classnames';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
// import { debounce } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Form from '../Form/Form';
import getFields from './getFields';
import getCategories from '../../../admin/services/article/getCategories';
import searchArticles from '../../services/article/searchArticles';
import editVote from '../../services/votes/editVote';
import saveVote from '../../services/votes/saveVote';
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

const ExampleForm = ({ item, onDone }) => {
    const [errorText, setErrorText] = useState();
    const classes = useStyles();
    const isNewItem = !!item._id;
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [articles, setArticles] = useState([]);

    const handleSubmit = values => {
        (isNewItem ? editVote(item._id, values) : saveVote(values))
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

    useEffect(() => {
        getCategories().then(result => {
            if (result) {
                setCategories(result.map((category) => {
                    return {
                        label: category?.data[router.locale]?.name,
                        value: category._id
                    };
                }));
                const subCategories = result.map((category) => category?.subcategories?.map(subcategory => {
                    return {
                        label: subcategory?.data[router.locale]?.name,
                        value: subcategory._id,
                        category: category._id
                    };
                }
                )).flat();

                setSubCategories(subCategories);
            }
        });
    }, []);

    const handleSearch = ({ categoryId, subcategoryId, event }) => () => {
        searchArticles({ searchText: event.target.value, categoryId, subcategoryId }).then(response =>
            setArticles(
                response.map((data) => {
                    return {
                        label: data.data[router.locale]?.title,
                        value: data._id
                    };
                })
            )
        );
    };

    // const searchWithDebounce = useCallback(debounce(handleSearch, 500), []);

    return <div>
        <Form
            data={item.data}
            fields={getFields({
                formTitle: isNewItem ? 'Edit vote' : 'Add vote',
                categories,
                subCategories,
                onSearch: handleSearch,
                articles
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

ExampleForm.propTypes = {
    item: PropTypes.object,
    onDone: PropTypes.func.isRequired
};

ExampleForm.defaultProps = {
    item: {}
};

export default ExampleForm;
