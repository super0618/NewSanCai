import { fieldName as button } from '../../../Form/fields/FormFieldButton';
import { fieldName as langs } from '../../../Form/fields/FormFieldLangs';
import { fieldName as title } from '../../../Form/fields/FormFieldTitle';
import { fieldName as input } from '../../../Form/fields/FormFieldInput';
import { fieldName as divider } from '../../../Form/fields/FormFieldDivider';
import { fieldName as files } from '../../../Form/fields/FormFieldFiles';

export default function () {
    return [
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Video form'
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
                label: 'Video form',
                variant: 'h6'
            }
        },
        {
            field: input,
            name: 'videoLink',
            settings: {
                label: 'Video link'
            },
            validators: [
                { name: 'required', options: { text: 'Video link' } }
            ],
            langInsensitive: true
        },
        {
            field: input,
            name: 'videoDescription',
            settings: {
                label: 'Video description',
                multiline: true
            },
            validators: [
                { name: 'required', options: { text: 'Video description is required' } }
            ]
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Video preview',
                variant: 'h6'
            }
        },
        {
            field: files,
            name: 'videoPreview',
            settings: {
                webp: true,
                max: 1
            },
            langInsensitive: true,
            validators: []
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
