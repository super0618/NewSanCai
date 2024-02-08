import { fieldName as button } from '../../../Form/fields/FormFieldButton';
import { fieldName as langs } from '../../../Form/fields/FormFieldLangs';
import { fieldName as title } from '../../../Form/fields/FormFieldTitle';
import { fieldName as files } from '../../../Form/fields/FormFieldFiles';
import { fieldName as select } from '../../../Form/fields/FormFieldSelect';
import { fieldName as input } from '../../../Form/fields/FormFieldInput';
import { fieldName as divider } from '../../../Form/fields/FormFieldDivider';
import { fieldName as radios } from '../../../Form/fields/FormFieldRadios';

export default function ({ authorsOptions }) {
    return [
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Photo form'
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
                label: 'Photo',
                variant: 'h6'
            }
        },
        {
            field: files,
            name: 'photo',
            settings: {
                webp: true,
                max: 1
            },
            langInsensitive: true,
            validators: [
                { name: 'required', options: { text: 'Upload article\'s photo' } }
            ]
        },
        {
            field: select,
            name: 'photoAuthor',
            settings: {
                label: 'Author of the photo',
                options: authorsOptions
            },
            validators: [
                { name: 'required', options: { text: 'Choose author of the photo' } }
            ],
            langInsensitive: true
        },
        {
            field: input,
            name: 'photoOrg',
            settings: {
                label: 'Photo organization'
            },
            validators: []
        },
        {
            field: input,
            name: 'photoDescription',
            settings: {
                label: 'Photo description',
                multiline: true
            },
            validators: [
                { name: 'required', options: { text: 'Photo description is required' } }
            ]
        },
        {
            field: input,
            name: 'photoLink',
            settings: {
                label: 'Photo link'
            },
            langInsensitive: true
        },
        {
            field: divider,
            name: 'divider'
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Settings',
                variant: 'h6'
            }
        },
        {
            field: radios,
            name: 'position',
            settings: {
                options: [
                    { value: 'left', label: 'Photo on the left' },
                    { value: 'right', label: 'Photo on the right' }
                ]
            },
            validators: [
                { name: 'required', options: { text: 'Pick photo position' } }
            ],
            langInsensitive: true
        },
        {
            field: input,
            name: 'size',
            settings: {
                label: 'Photo size in %',
                type: 'number',
                max: 100,
                min: 1
            },
            validators: [
                { name: 'required', options: { text: 'Set photo size' } }
            ],
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
