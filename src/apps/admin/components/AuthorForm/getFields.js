import { fieldName as button } from '../Form/fields/FormFieldButton';
import { fieldName as divider } from '../Form/fields/FormFieldDivider';
import { fieldName as files } from '../Form/fields/FormFieldFiles';
import { fieldName as input } from '../Form/fields/FormFieldInput';
import { fieldName as langs } from '../Form/fields/FormFieldLangs';
import { fieldName as title } from '../Form/fields/FormFieldTitle';

export default function ({ formTitle }) {
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
            field: divider,
            name: 'divider'
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Name',
                variant: 'h6'
            }
        },
        {
            field: input,
            name: 'name',
            settings: {
                label: 'Author\'s name'
            },
            validators: [
                { name: 'required', options: { text: 'Enter author\'s name' } }
            ]
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
            name: 'avatar',
            settings: {
                webp: true,
                max: 1
            },
            langInsensitive: true,
            validators: [
            ]
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Location',
                variant: 'h6'
            }
        },
        {
            field: input,
            name: 'location',
            settings: {
                label: 'Author\'s location'
            },
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
