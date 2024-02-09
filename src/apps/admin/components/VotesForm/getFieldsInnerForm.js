import { fieldName as button } from '../Form/fields/FormFieldButton';
import { fieldName as title } from '../Form/fields/FormFieldTitle';
import { fieldName as suggest } from '../Form/fields/FormFieldSuggest';
import { fieldName as select } from '../Form/fields/FormFieldSelect';

import { AVAILABLE_PAGES } from '../../constants/constants';
import { DEFAULT_LOCALE } from '../../../client/constants';

export default function ({ categories, subCategories, onSearch, articles }) {
    return (item, currentValues) => {
        // eslint-disable-next-line no-unused-vars,max-len
        const subcategoryOptions = subCategories?.filter((subcategory) => subcategory.category === (currentValues?.category || (item && item[DEFAULT_LOCALE]?.category)));

        return [
            {
                field: title,
                name: 'title',
                settings: {
                    label: 'Select page'
                }
            },
            {
                field: select,
                name: 'page',
                settings: {
                    label: 'Select page',
                    options: AVAILABLE_PAGES
                },
                validators: [
                    { name: 'required', options: { text: 'Page is required' } }
                ],
                langInsensitive: true
            },
            // eslint-disable-next-line max-len
            ...((currentValues?.page ? ((currentValues?.page === 'categoryPage') || (currentValues?.page === 'subCategoryPage') || (currentValues?.page === 'articlePage')) : ((item && item[DEFAULT_LOCALE]?.page === 'categoryPage') || (item && item[DEFAULT_LOCALE]?.page === 'subCategoryPage') || (item && item[DEFAULT_LOCALE]?.page === 'articlePage')))
                ? [{
                    field: suggest,
                    name: 'category',
                    settings: {
                        multiple: false,
                        label: 'Select category',
                        options: categories
                    },
                    validators: [],
                    langInsensitive: true
                }]
                : []
            ),
            ...((currentValues?.page ? (currentValues?.page === 'multimediaPage') : (item && item[DEFAULT_LOCALE]?.page === 'multimediaPage'))
                ? [{
                    field: suggest,
                    name: 'category',
                    settings: {
                        multiple: false,
                        label: 'Select category',
                        options: categories
                    },
                    validators: [],
                    langInsensitive: true
                }]
                : []
            ),
            // eslint-disable-next-line max-len
            ...((currentValues?.page ? (currentValues?.category && (currentValues?.page === 'subCategoryPage' || (currentValues?.page === 'articlePage'))) : (item && item[DEFAULT_LOCALE]?.category && (item[DEFAULT_LOCALE]?.page === 'subCategoryPage' || item[DEFAULT_LOCALE]?.page === 'articlePage')))
                ? [{
                    field: suggest,
                    name: 'subcategory',
                    settings: {
                        multiple: false,
                        label: 'Select sub category',
                        // eslint-disable-next-line max-len
                        options: subcategoryOptions
                    },
                    validators: [],
                    langInsensitive: true
                }]
                : []),
            ...((currentValues?.page ? (currentValues?.page === 'articlePage') : (item && item[DEFAULT_LOCALE]?.page === 'articlePage'))
                ? [{
                    field: suggest,
                    name: 'articleId',
                    settings: {
                        multiple: false,
                        label: 'Select article(type to search)',
                        options: articles,
                        // eslint-disable-next-line max-len
                        onSearch: (e) => onSearch({ categoryId: categories.length ? (currentValues?.category || item && item[DEFAULT_LOCALE]?.category) : '', subcategoryId: subcategoryOptions?.length ? (currentValues?.subcategory || item && item[DEFAULT_LOCALE]?.subcategory) : '', event: e })()
                    },
                    validators: [],
                    langInsensitive: true
                }]
                : []
            ),
            {
                field: button,
                name: 'button',
                settings: {
                    label: 'Add'
                }
            }
        ];
    };
}
