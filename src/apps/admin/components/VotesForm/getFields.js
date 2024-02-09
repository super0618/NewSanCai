import { fieldName as button } from '../Form/fields/FormFieldButton';
import { fieldName as input } from '../Form/fields/FormFieldInput';
import { fieldName as langs } from '../Form/fields/FormFieldLangs';
import { fieldName as title } from '../Form/fields/FormFieldTitle';
import { fieldName as listWithForms } from '../Form/fields/FormFieldListWithForms';
import { fieldName as editor } from '../Form/fields/FormFieldEditor';
import { fieldName as blocksConstructorSingle } from '../Form/fields/FormFieldBLocksConstructorSingle';

import { DEFAULT_LOCALE } from '../../../client/constants';

import getFieldsInnerForm from './getFieldsInnerForm';
import TextForm from './innerForms/TextForm';
import { PAGES_KEYS } from '../../constants/constants';
import { fieldName as divider } from '../Form/fields/FormFieldDivider';
import { fieldName as date } from '../Form/fields/FormFieldDate';
import { fieldName as checkbox } from '../Form/fields/FormFieldCheckbox';

export default function ({ formTitle, categories, subCategories, articles, onSearch }) {
    const preloadedDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    const year = preloadedDate.getFullYear();
    const month = preloadedDate.getMonth() + 1;
    const day = preloadedDate.getDate();
    const preloadedDateFormatted = `${year}-${month.toString().length === 1 ? `0${month}` : month}-${day.toString().length === 1 ? `0${day}` : day}`;

    return [
        {
            field: title,
            name: 'titleField',
            settings: {
                label: formTitle
            }
        },
        {
            field: langs,
            name: 'lang'
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Title',
                variant: 'h6'
            }
        },
        {
            field: input,
            name: 'title',
            settings: {
                label: 'type vote block title'
            },
            validators: [
                { name: 'required', options: { text: 'Title for vote is required' } }
            ]
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Description',
                variant: 'h6'
            }
        },
        {
            field: editor,
            name: 'editor',
            settings: {},
            validators: [
                { name: 'required', options: { text: 'Description is required' } }
            ]
        },
        {
            field: divider,
            name: 'divider'
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Voting options',
                variant: 'h6'
            }
        },
        {
            field: blocksConstructorSingle,
            name: 'votingOptions',
            settings: {
                catalog: [
                    { id: 'option', name: 'Vote Option', component: TextForm }
                ]
            },
            langInsensitive: true
        },
        {
            field: divider,
            name: 'divider'
        },
        {
            field: listWithForms,
            name: 'priorities',
            settings: {
                label: 'Select locations',
                getFormLabel: form => PAGES_KEYS[form[DEFAULT_LOCALE].page],
                getFields: getFieldsInnerForm({ categories, subCategories, onSearch, articles })
            },
            langInsensitive: true
        },
        {
            field: checkbox,
            name: 'showAll',
            settings: {
                label: 'Show in all locations'
            },
            langInsensitive: true
        },
        {
            field: divider,
            name: 'divider'
        },
        {
            field: date,
            name: 'date',
            settings: {
                label: 'Vote finish date',
                preloadTomorrow: true,
                min: preloadedDateFormatted
            },
            validators: [
                { name: 'required', options: { text: 'Pick date' } }
            ],
            langInsensitive: true
        },
        {
            field: divider,
            name: 'divider'
        },
        {
            field: checkbox,
            name: 'hidden',
            settings: {
                label: 'Hidden'
            },
            langInsensitive: true
        },
        {
            field: divider,
            name: 'divider'
        },
        {
            field: button,
            name: 'button',
            settings: {
                label: 'Save'
            }
        }
    ];
}
