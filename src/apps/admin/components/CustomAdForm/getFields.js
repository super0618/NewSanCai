import { fieldName as button } from '../Form/fields/FormFieldButton';
import { fieldName as files } from '../Form/fields/FormFieldFiles';
import { fieldName as input } from '../Form/fields/FormFieldInput';
import { fieldName as title } from '../Form/fields/FormFieldTitle';
import { fieldName as langs } from '../Form/fields/FormFieldLangs';
import { fieldName as listWithForms } from '../Form/fields/FormFieldListWithForms';

import getFieldsInnerForm from './getFieldsInnerForm';
import { DEFAULT_LOCALE } from '../../../client/constants';
import { PAGES_KEYS } from '../../constants/constants';
import { fieldName as checkbox } from '../Form/fields/FormFieldCheckbox';
import { fieldName as divider } from '../Form/fields/FormFieldDivider';

export default function ({ formTitle, categories, subCategories, articles, onSearch }) {
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
            field: input,
            name: 'name',
            settings: {
                label: 'type AD block name'
            },
            validators: [
                { name: 'required', options: { text: 'Name is required' } }
            ],
            langInsensitive: true
        },
        {
            field: input,
            name: 'link',
            settings: {
                label: 'type AD link'
            },
            validators: [
                { name: 'required', options: { text: 'Link is required' } }
            ],
            langInsensitive: true
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Upload photos of your AD. Please fill all three suggested formats, approximately: square (1x1), vertical(2x1) and horizontal(1x2)',
                variant: 'h5'
            }
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Square image',
                variant: 'h6'
            }
        },
        {
            field: files,
            name: 'photos',
            settings: {
                webp: true,
                max: 1
            },
            validators: [
                { name: 'required', options: { text: 'Add files' } }
            ],
            langInsensitive: true
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Vertical image',
                variant: 'h6'
            }
        },
        {
            field: files,
            name: 'photosVertical',
            settings: {
                webp: true,
                max: 1
            },
            validators: [
                { name: 'required', options: { text: 'Add files' } }
            ],
            langInsensitive: true
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Horizontal image',
                variant: 'h6'
            }
        },
        {
            field: files,
            name: 'photosHorizontal',
            settings: {
                webp: true,
                max: 1
            },
            validators: [
                { name: 'required', options: { text: 'Add files' } }
            ],
            langInsensitive: true
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Locations',
                variant: 'h6'
            }
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
