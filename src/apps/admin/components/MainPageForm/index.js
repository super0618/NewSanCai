import React, { useEffect, useState } from 'react';

import classNames from 'classnames';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import Form from '../Form/Form';
import getFields from './getFields';
import updatePage from '../../services/updatePage';
import getPageByPageId from '../../services/getPageByPageId';
import getArticlesByName from '../../services/article/getItemsPaginatedByName';
import getPostsByName from '../../services/post/getItemsPaginatedByName';
import getPostsByIds from '../../services/post/getItemsByIds';
import getArticlesByIds from '../../services/article/getItemsByIds';
import { DEFAULT_LOCALE } from '../../../client/constants';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
    content: {
        width: '100%',
        padding: theme.spacing(4),
        '@media (max-width:1200px)': {
            width: 'calc(100% - 64px)'
        },
        '@media (max-width:780px)': {
            margin: '16px',
            width: 'calc(100% - 32px)'
        }
    },
    loader: {
        height: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
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

const PAGE_ID = 'main';

const MainPageForm = () => {
    const [loading, setLoading] = useState(true);
    const [disabled, setDisabled] = useState(true);
    const [page, setPage] = useState({});
    const [errorText, setErrorText] = useState();
    const [selectedFeatured, setSelectedFeatures] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        getPageByPageId(PAGE_ID)
            .then(data => {
                setPage(data);
                setSelectedFeatures([
                    ...data.data[DEFAULT_LOCALE].featuredTopMain,
                    ...data.data[DEFAULT_LOCALE].featuredTopSub,
                    ...data.data[DEFAULT_LOCALE].featuredBottom,
                    ...data.data[DEFAULT_LOCALE].featuredBottomVote,
                    ...data.data[DEFAULT_LOCALE].featuredRight,
                    ...data.data[DEFAULT_LOCALE].featuredRightList,
                    ...data.data[DEFAULT_LOCALE].featuredCommentarySection
                ]);
                setLoading(false);
            });
    }, []);

    const handleChange = (values, changes) => {
        setSelectedFeatures([
            ...values.featuredTopMain,
            ...values.featuredTopSub,
            ...values.featuredBottom,
            ...values.featuredBottomVote,
            ...values.featuredRight,
            ...values.featuredRightList,
            ...values.featuredCommentarySection
        ]);
        disabled && !changes.lang && setDisabled(false);
    };

    const handleSubmit = values => {
        updatePage(PAGE_ID, values)
            .then(() => {
                getPageByPageId(PAGE_ID)
                    .then(data => {
                        setPage(data);
                        setDisabled(true);
                    });
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

    const handleFetchValueArticles = (value, featured) => {
        return getArticlesByName({
            search: value,
            page: 1,
            size: 50,
            sort: 'desc',
            locale: DEFAULT_LOCALE,
            ...((featured)
                ? {
                    excludeId: [...featured?.filter(item => !!item)].join(',') || ''
                }
                : {})
        });
    };

    const handleFetchValuePosts = (value, featured) => {
        return getPostsByName({
            search: value,
            page: 1,
            size: 50,
            sort: 'desc',
            type: 'video',
            locale: DEFAULT_LOCALE,
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

    const handleGetByIdsPosts = (value) => {
        return getPostsByIds({
            ids: value,
            locale: DEFAULT_LOCALE,
            sort: 'desc'
        });
    };

    if (loading) {
        return <div className={classes.loader}>
            <CircularProgress/>
        </div>;
    }

    return <div className={classes.content}>
        <Form
            data={page.data}
            onChange={handleChange}
            fields={getFields({
                disabled,
                onInputChangeHandlerArticles: handleFetchValueArticles,
                onInputChangeHandlerPosts: handleFetchValuePosts,
                onValueChangeHandlerArticles: handleGetByIdsArticles,
                onValueChangeHandlerPosts: handleGetByIdsPosts,
                selectedFeatured: selectedFeatured
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

export default MainPageForm;
