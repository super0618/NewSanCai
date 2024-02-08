import React, { useEffect, useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { makeStyles } from '@material-ui/core/styles';

import Form from '../Form/Form';
import getFields from './getFields';
import saveArticleItem from '../../services/article/saveCategoryItem';
import editArticleItem from '../../services/article/editCategoryItem';
import updatePage from '../../services/updatePage';
import editCategory from '../../services/article/editCategory';
import editSubcategory from '../../services/article/editSubcategory';

import getItemName from '../../utils/getItemName';
import { DEFAULT_LOCALE, LOCALES } from '../../../client/constants';
import getSlicedFeaturesList from '../../utils/getSlicedFeaturesList';
import replaceForbiddenSymbols from '../Form/utils/replaceForbiddenSymbols';
import { Alert } from '@material-ui/lab';

const FEATURED_KEYS = {
    featuredTopMain: 'featuredTopMain',
    featuredBottom: 'featuredBottom',
    featuredBottomVote: 'featuredBottomVote',
    featuredTopSub: 'featuredTopSub',
    featuredRight: 'featuredRight',
    featuredRightList: 'featuredRightList',
    featuredCommentarySection: 'featuredCommentarySection'
};

const FEATURED_LIMIT = {
    featuredTopMain: 1,
    featuredBottom: 2,
    featuredBottomVote: 4,
    featuredTopSub: 4,
    featuredRight: 1,
    featuredRightList: 4,
    featuredCommentarySection: null
};

const CATEGORY_FEATURED_LIMIT = 2;

const PAGE_ID = 'main';

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

const ARTICLE_STATUSES = [
    { value: 'draft', label: 'Draft' },
    { value: 'private', label: 'Private' },
    { value: 'published', label: 'Published' }
];

const ExampleSubcategoryItemForm = ({ item, onDone, categories, authors, activeSubcategory, activeCategory, setFieldsChanged, onClose, page }) => {
    const formRef = useRef();
    const [editableItem, setEditableItem] = useState(item);
    const [errorText, setErrorText] = useState();
    const classes = useStyles();
    const isNewItem = !!editableItem._id;
    const [currentValues, setCurrentValues] = useState([]);
    const [filename, setFilename] = useState('');
    const [category, setCategory] = useState(activeCategory
        ? (categories.find((category) => category._id === activeCategory._id))
        : (!!item.data && categories.find((category) => category._id === item.data[DEFAULT_LOCALE].category)));
    const [isFeaturedEnabled, setFeaturedEnabled] = useState(item?.data
        ? item.data[DEFAULT_LOCALE]?.status === 'published' && !item.data[DEFAULT_LOCALE]?.hidden
        : false);

    const [currentStatus, setCurrentStatus] = useState(item?.data ? item.data[DEFAULT_LOCALE]?.status : null);

    const categoriesOptions = categories.map((category, i) => ({ value: category._id, label: getItemName(category, `Category ${i}`) }));
    const subcategoriesOptions = category
        ? category?.subcategories?.length
            ? category?.subcategories?.map((category, i) => ({ value: category._id, label: getItemName(category, `Category ${i}`) }))
            : null
        : undefined;
    const [disabled, setDisabled] = useState(true);
    const authorsOptions = authors.map((author, i) => ({ value: author._id, label: getItemName(author, `Author ${i}`) }));
    const newItemData = {};
    activeCategory && LOCALES.forEach(locale => {
        newItemData[locale] = {
            category: activeCategory._id,
            ...activeSubcategory ? { subcategory: activeSubcategory._id } : { subcategory: null }
        };
    });
    const subCategoryToEdit = useMemo(() => {
        return item?.data && category?.subcategories?.find(({ _id }) => _id === item?.data[DEFAULT_LOCALE]?.subcategory);
    }, [category, item]);

    const isPreviewButtonShown = useMemo(() => {
        if (editableItem?.data && (editableItem?.data[DEFAULT_LOCALE]?.status === 'private' || editableItem?.data[DEFAULT_LOCALE]?.status === 'published')) {
            return true;
        }
        return false;
    }, [editableItem]);

    useEffect(() => {
        let dateString = '';
        const date = new Date();
        let month = '' + (date.getMonth() + 1);
        let day = '' + date.getDate();
        const year = date.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }

        dateString = [year, month, day].join('-');

        const articleName = (currentValues[`${DEFAULT_LOCALE}_alias`] || (editableItem?.data && editableItem.data[DEFAULT_LOCALE].alias) || '');
        // eslint-disable-next-line max-len
        const categoryName = (currentValues[`${DEFAULT_LOCALE}_category`] &&
                categories.find(category => category._id === currentValues[`${DEFAULT_LOCALE}_category`])?.data[DEFAULT_LOCALE].name) ||
            (editableItem?.data && categories.find(category => category._id === editableItem.data[DEFAULT_LOCALE].category)?.data[DEFAULT_LOCALE].name) || '';
        const article = articleName ? '-' + articleName.replace(' ', '_') : '';
        const category = categoryName ? '-' + categoryName.replace(' ', '_') : '';
        const fileName = `${dateString}${category.toLowerCase()}${article.toLowerCase()}`;
        setFilename(fileName);
    }, [currentValues], editableItem);

    const mainPageFeatures = useMemo(() => {
        const obj = {};
        LOCALES.map((locale) => {
            return {
                [locale]: {
                    [FEATURED_KEYS.featuredBottom]: page.data[locale][FEATURED_KEYS.featuredBottom] || [],
                    [FEATURED_KEYS.featuredBottomVote]: page.data[locale][FEATURED_KEYS.featuredBottomVote] || [],
                    [FEATURED_KEYS.featuredCommentarySection]: page.data[locale][FEATURED_KEYS.featuredCommentarySection] || [],
                    [FEATURED_KEYS.featuredRight]: page.data[locale][FEATURED_KEYS.featuredRight] || [],
                    [FEATURED_KEYS.featuredRightList]: page.data[locale][FEATURED_KEYS.featuredRightList] || [],
                    [FEATURED_KEYS.featuredTopMain]: page.data[locale][FEATURED_KEYS.featuredTopMain] || [],
                    [FEATURED_KEYS.featuredTopSub]: page.data[locale][FEATURED_KEYS.featuredTopSub] || []
                }
            };
        }).forEach((element) => {
            const languageCode = Object.keys(element)[0];
            const languageValues = element[languageCode];
            obj[languageCode] = languageValues;
        });
        return obj;
    }, [page]);

    const [isActiveFeaturedFlag, setIsActiveFeaturedFlag] = useState(null);

    useEffect(() => {
        const modifiedItem = editableItem;
        if (modifiedItem?.data) {
            for (const key in FEATURED_KEYS) {
                for (const lang in page.data) {
                    modifiedItem.data[lang][key] = page.data[lang][key].includes(editableItem._id);
                }
            }

            setIsActiveFeaturedFlag(modifiedItem
                ? (modifiedItem?.data[DEFAULT_LOCALE]?.featuredTopMain && 'featuredTopMain') ||
                (modifiedItem?.data[DEFAULT_LOCALE]?.featuredBottom && 'featuredBottom') ||
                (modifiedItem?.data[DEFAULT_LOCALE]?.featuredBottomVote && 'featuredBottomVote') ||
                (modifiedItem?.data[DEFAULT_LOCALE]?.featuredCommentarySection && 'featuredCommentarySection') ||
                (modifiedItem?.data[DEFAULT_LOCALE]?.featuredRight && 'featuredRight') ||
                (modifiedItem?.data[DEFAULT_LOCALE]?.featuredRightList && 'featuredRightList') ||
                (modifiedItem?.data[DEFAULT_LOCALE]?.featuredTopSub && 'featuredTopSub') || null
                : null);
        }
    }, [page]);

    const currentItem = useMemo(() => {
        const modifiedItem = JSON.parse(JSON.stringify(editableItem));
        if (modifiedItem?.data) {
            for (const key in FEATURED_KEYS) {
                for (const lang in page.data) {
                    modifiedItem.data[lang][key] = page.data[lang][key].includes(modifiedItem._id);
                }
            }
            if (category?.data[DEFAULT_LOCALE]?.featured?.includes(modifiedItem._id)) {
                modifiedItem.data.en.featuredCategory = true;
                modifiedItem.data['zh-cn'].featuredCategory = true;
                modifiedItem.data['zh-tw'].featuredCategory = true;
            }
            if (subCategoryToEdit?.data[DEFAULT_LOCALE]?.featured?.includes(modifiedItem._id)) {
                modifiedItem.data.en.featuredSubCategory = true;
                modifiedItem.data['zh-cn'].featuredSubCategory = true;
                modifiedItem.data['zh-tw'].featuredSubCategory = true;
            }
            return modifiedItem;
        }
    }, [editableItem, page, category, subCategoryToEdit]);

    const handleSubmit = values => {
        const valuesToSend = JSON.parse(JSON.stringify(values));
        for (const lang in valuesToSend) {
            delete valuesToSend[lang][FEATURED_KEYS.featuredBottom];
            delete valuesToSend[lang][FEATURED_KEYS.featuredBottomVote];
            delete valuesToSend[lang][FEATURED_KEYS.featuredCommentarySection];
            delete valuesToSend[lang][FEATURED_KEYS.featuredRight];
            delete valuesToSend[lang][FEATURED_KEYS.featuredRightList];
            delete valuesToSend[lang][FEATURED_KEYS.featuredTopMain];
            delete valuesToSend[lang][FEATURED_KEYS.featuredTopSub];
            delete valuesToSend[lang].featuredCategory;
            delete valuesToSend[lang].featuredSubCategory;
        }

        (isNewItem ? editArticleItem(editableItem._id, valuesToSend) : saveArticleItem(valuesToSend))
            .then((res) => {
                setEditableItem(res);
                setFieldsChanged(false);
                setDisabled(true);
                const newFeaturesData = JSON.parse(JSON.stringify(mainPageFeatures));

                for (const lang in values) {
                    if (valuesToSend[DEFAULT_LOCALE].status !== 'published') {
                        const topFeatured = newFeaturesData[lang][FEATURED_KEYS.featuredTopMain].filter((id) => id !== res._id.toString());
                        newFeaturesData[lang][FEATURED_KEYS.featuredTopMain] = topFeatured;
                        const featuredRightList = newFeaturesData[lang][FEATURED_KEYS.featuredRightList].filter((id) => id !== res._id.toString());
                        newFeaturesData[lang][FEATURED_KEYS.featuredRightList] = featuredRightList;
                        const featuredBottom = newFeaturesData[lang][FEATURED_KEYS.featuredBottom].filter((id) => id !== res._id.toString());
                        newFeaturesData[lang][FEATURED_KEYS.featuredBottom] = featuredBottom;
                        const featuredBottomVote = newFeaturesData[lang][FEATURED_KEYS.featuredBottomVote].filter((id) => id !== res._id.toString());
                        newFeaturesData[lang][FEATURED_KEYS.featuredBottomVote] = featuredBottomVote;
                        // eslint-disable-next-line max-len
                        const featuredCommentarySection = newFeaturesData[lang][FEATURED_KEYS.featuredCommentarySection].filter((id) => id !== res._id.toString());
                        newFeaturesData[lang][FEATURED_KEYS.featuredCommentarySection] = featuredCommentarySection;
                        const featuredRight = newFeaturesData[lang][FEATURED_KEYS.featuredRight].filter((id) => id !== res._id.toString());
                        newFeaturesData[lang][FEATURED_KEYS.featuredRight] = featuredRight;
                        const featuredTopSub = newFeaturesData[lang][FEATURED_KEYS.featuredTopSub].filter((id) => id !== res._id.toString());
                        newFeaturesData[lang][FEATURED_KEYS.featuredTopSub] = featuredTopSub;
                    } else {
                        if (values[lang][FEATURED_KEYS.featuredTopMain]) {
                            const slicedArray = getSlicedFeaturesList(
                                newFeaturesData[lang][FEATURED_KEYS.featuredTopMain], res._id.toString(), FEATURED_LIMIT.featuredTopMain);
                            newFeaturesData[lang][FEATURED_KEYS.featuredTopMain] = slicedArray;
                        } else {
                            const filteredArray = newFeaturesData[lang][FEATURED_KEYS.featuredTopMain].filter((id) => id !== res._id.toString());
                            newFeaturesData[lang][FEATURED_KEYS.featuredTopMain] = filteredArray;
                        }
                        if (values[lang][FEATURED_KEYS.featuredRightList]) {
                            const slicedArray = getSlicedFeaturesList(
                                newFeaturesData[lang][FEATURED_KEYS.featuredRightList], res._id.toString(), FEATURED_LIMIT.featuredRightList);
                            newFeaturesData[lang][FEATURED_KEYS.featuredRightList] = slicedArray;
                        } else {
                            const filteredArray = newFeaturesData[lang][FEATURED_KEYS.featuredRightList].filter((id) => id !== res._id.toString());
                            newFeaturesData[lang][FEATURED_KEYS.featuredRightList] = filteredArray;
                        }
                        if (values[lang][FEATURED_KEYS.featuredBottom]) {
                            const slicedArray = getSlicedFeaturesList(
                                newFeaturesData[lang][FEATURED_KEYS.featuredBottom], res._id.toString(), FEATURED_LIMIT.featuredBottom);
                            newFeaturesData[lang][FEATURED_KEYS.featuredBottom] = slicedArray;
                        } else {
                            const filteredArray = newFeaturesData[lang][FEATURED_KEYS.featuredBottom].filter((id) => id !== res._id.toString());
                            newFeaturesData[lang][FEATURED_KEYS.featuredBottom] = filteredArray;
                        }
                        if (values[lang][FEATURED_KEYS.featuredBottomVote]) {
                            const slicedArray = getSlicedFeaturesList(
                                newFeaturesData[lang][FEATURED_KEYS.featuredBottomVote], res._id.toString(), FEATURED_LIMIT.featuredBottomVote);
                            newFeaturesData[lang][FEATURED_KEYS.featuredBottomVote] = slicedArray;
                        } else {
                            const filteredArray = newFeaturesData[lang][FEATURED_KEYS.featuredBottomVote].filter((id) => id !== res._id.toString());
                            newFeaturesData[lang][FEATURED_KEYS.featuredBottomVote] = filteredArray;
                        }
                        if (values[lang][FEATURED_KEYS.featuredCommentarySection]) {
                            const slicedArray = getSlicedFeaturesList(
                                // eslint-disable-next-line max-len
                                newFeaturesData[lang][FEATURED_KEYS.featuredCommentarySection], res._id.toString(), FEATURED_LIMIT.featuredCommentarySection);
                            newFeaturesData[lang][FEATURED_KEYS.featuredCommentarySection] = slicedArray;
                        } else {
                            // eslint-disable-next-line max-len
                            const filteredArray = newFeaturesData[lang][FEATURED_KEYS.featuredCommentarySection].filter((id) => id !== res._id.toString());
                            newFeaturesData[lang][FEATURED_KEYS.featuredCommentarySection] = filteredArray;
                        }
                        if (values[lang][FEATURED_KEYS.featuredRight]) {
                            const slicedArray = getSlicedFeaturesList(
                                newFeaturesData[lang][FEATURED_KEYS.featuredRight], res._id.toString(), FEATURED_LIMIT.featuredRight);
                            newFeaturesData[lang][FEATURED_KEYS.featuredRight] = slicedArray;
                        } else {
                            const filteredArray = newFeaturesData[lang][FEATURED_KEYS.featuredRight].filter((id) => id !== res._id.toString());
                            newFeaturesData[lang][FEATURED_KEYS.featuredRight] = filteredArray;
                        }
                        if (values[lang][FEATURED_KEYS.featuredTopSub]) {
                            const slicedArray = getSlicedFeaturesList(
                                newFeaturesData[lang][FEATURED_KEYS.featuredTopSub], res._id.toString(), FEATURED_LIMIT.featuredTopSub);
                            newFeaturesData[lang][FEATURED_KEYS.featuredTopSub] = slicedArray;
                        } else {
                            const filteredArray = newFeaturesData[lang][FEATURED_KEYS.featuredTopSub].filter((id) => id !== res._id.toString());
                            newFeaturesData[lang][FEATURED_KEYS.featuredTopSub] = filteredArray;
                        }
                    }
                }

                const mainPageData = {
                    en: {
                        ...page.data.en,
                        ...newFeaturesData.en
                    },
                    'zh-cn': {
                        ...page.data['zh-cn'],
                        ...newFeaturesData['zh-cn']
                    },
                    'zh-tw': {
                        ...page.data['zh-tw'],
                        ...newFeaturesData['zh-tw']
                    }
                };
                const promises = [
                    updatePage(PAGE_ID, mainPageData)
                ];
                if (values[DEFAULT_LOCALE].featuredCategory && valuesToSend[DEFAULT_LOCALE].status === 'published') {
                    const articleIdInFeatures = category?.data[DEFAULT_LOCALE]?.featured || [];
                    const slicedArray = getSlicedFeaturesList(articleIdInFeatures, res._id.toString(), CATEGORY_FEATURED_LIMIT);
                    const newCategoryData = {
                        en: {
                            ...category.data.en,
                            featured: slicedArray
                        },
                        'zh-cn': {
                            ...category.data['zh-cn'],
                            featured: slicedArray
                        },
                        'zh-tw': {
                            ...category.data['zh-tw'],
                            featured: slicedArray
                        }
                    };
                    promises.push(editCategory(category._id, newCategoryData));
                } else {
                    if (category.data[DEFAULT_LOCALE]?.featured) {
                        const filteredIds = category.data[DEFAULT_LOCALE]?.featured.filter((id) => id !== res._id.toString()) || [];
                        const newCategoryData = {
                            en: {
                                ...category.data.en,
                                featured: filteredIds
                            },
                            'zh-cn': {
                                ...category.data['zh-cn'],
                                featured: filteredIds
                            },
                            'zh-tw': {
                                ...category.data['zh-tw'],
                                featured: filteredIds
                            }
                        };
                        promises.push(editCategory(category._id, newCategoryData));
                    }
                }
                const featuredArticleInSubCategory = subCategoryToEdit?.data[DEFAULT_LOCALE]?.featured || [];
                if ((values[DEFAULT_LOCALE].featuredSubCategory && subCategoryToEdit) && valuesToSend[DEFAULT_LOCALE].status === 'published') {
                    const slicedArray = getSlicedFeaturesList(featuredArticleInSubCategory, res._id.toString(), CATEGORY_FEATURED_LIMIT);
                    const newSubCategoryData = {
                        en: {
                            ...subCategoryToEdit.data.en,
                            featured: slicedArray
                        },
                        'zh-cn': {
                            ...subCategoryToEdit.data['zh-cn'],
                            featured: slicedArray
                        },
                        'zh-tw': {
                            ...subCategoryToEdit.data['zh-tw'],
                            featured: slicedArray
                        }
                    };
                    promises.push(editSubcategory({ categoryId: category._id, id: subCategoryToEdit._id, item: newSubCategoryData }));
                } else {
                    if (subCategoryToEdit) {
                        const filteredIds = subCategoryToEdit.data[DEFAULT_LOCALE]?.featured?.filter((id) => id !== res._id.toString()) || [];
                        const newSubCategoryData = {
                            en: {
                                ...subCategoryToEdit.data.en,
                                featured: filteredIds
                            },
                            'zh-cn': {
                                ...subCategoryToEdit.data['zh-cn'],
                                featured: filteredIds
                            },
                            'zh-tw': {
                                ...subCategoryToEdit.data['zh-tw'],
                                featured: filteredIds
                            }
                        };
                        promises.push(editSubcategory({ categoryId: category._id, id: subCategoryToEdit._id, item: newSubCategoryData }));
                    }
                }
                Promise.all(promises).then(() => {
                    onDone();
                });
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

    const handleChange = (values, changes) => {
        if (disabled && !changes.lang) {
            setFieldsChanged(true);
            setDisabled(false);
        }
        if (changes.status === 'private' || changes.status === 'draft' || ('hidden' in changes && changes.hidden)) {
            formRef.current.updateValues({
                featuredTopMain: false,
                featuredBottom: false,
                featuredBottomVote: false,
                featuredCommentarySection: false,
                featuredRight: false,
                featuredRightList: false,
                featuredTopSub: false,
                featuredCategory: false,
                featuredSubCategory: false
            });
        }
        if ('status' in changes) {
            if (values.hidden) {
                setFeaturedEnabled(false);
            } else {
                setFeaturedEnabled(changes.status === 'published');
            }
            setCurrentStatus(changes.status);
        }
        if ('hidden' in changes) {
            if (changes.hidden) {
                setFeaturedEnabled(false);
            } else {
                if (currentStatus === 'published') {
                    setFeaturedEnabled(true);
                }
            }
        }

        const changesKeys = Object.keys(changes);
        if (changesKeys.includes('featuredCategory') || changesKeys.includes('featuredSubCategory')) {
            return;
        }

        const isActiveFeaturedFlag =
            (changes.featuredTopMain && 'featuredTopMain') ||
            (changes.featuredBottom && 'featuredBottom') ||
            (changes.featuredBottomVote && 'featuredBottomVote') ||
            (changes.featuredCommentarySection && 'featuredCommentarySection') ||
            (changes.featuredRight && 'featuredRight') ||
            (changes.featuredRightList && 'featuredRightList') ||
            (changes.featuredTopSub && 'featuredTopSub') || null;

        setIsActiveFeaturedFlag(isActiveFeaturedFlag);

        if (isActiveFeaturedFlag) {
            formRef.current.updateValues({
                featuredTopMain: isActiveFeaturedFlag === 'featuredTopMain',
                featuredBottom: isActiveFeaturedFlag === 'featuredBottom',
                featuredBottomVote: isActiveFeaturedFlag === 'featuredBottomVote',
                featuredCommentarySection: isActiveFeaturedFlag === 'featuredCommentarySection',
                featuredRight: isActiveFeaturedFlag === 'featuredRight',
                featuredRightList: isActiveFeaturedFlag === 'featuredRightList',
                featuredTopSub: isActiveFeaturedFlag === 'featuredTopSub'
            });
        }
    };

    const handlePreviewClick = () => {
        if (editableItem.data[DEFAULT_LOCALE].status === 'published') {
            return window.open(`/${editableItem.data[DEFAULT_LOCALE].alias}`, '_blank', 'noreferrer');
        }

        if (editableItem.data[DEFAULT_LOCALE].status === 'private') {
            return window.open(`/preview/${editableItem.data[DEFAULT_LOCALE].alias}`, '_blank', 'noreferrer');
        }
    };
    const handleBlur = (field, values) => {
        if (field.name === 'title' && values[`${DEFAULT_LOCALE}_title`] && !values.alias) {
            const title = values[`${DEFAULT_LOCALE}_title`];
            const alias = replaceForbiddenSymbols(title);
            formRef.current.updateValues({ alias });
        }
    };

    return <div>
        <Form
            ref={formRef}
            data={currentItem?.data || newItemData}
            fields={getFields({
                formTitle: isNewItem ? 'Edit article' : 'Add article',
                categoriesOptions,
                subcategoriesOptions,
                authorsOptions,
                handlePickCategory,
                filename: filename,
                statusOptions: ARTICLE_STATUSES,
                disabled,
                isPreviewButtonShown,
                handlePreviewClick,
                onClose,
                isFeaturedEnabled,
                isActiveFeaturedFlag
            })}
            setCurrentValues={setCurrentValues}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onBlur={handleBlur}
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
    activeCategory: PropTypes.object,
    setFieldsChanged: PropTypes.func,
    onClose: PropTypes.func,
    page: PropTypes.object
};

ExampleSubcategoryItemForm.defaultProps = {
    page: {},
    categories: {},
    authors: {},
    item: {},
    activeSubcategory: {},
    activeCategory: {}
};

export default ExampleSubcategoryItemForm;
