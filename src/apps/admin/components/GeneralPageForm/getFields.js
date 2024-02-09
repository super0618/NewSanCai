import { fieldName as button } from '../Form/fields/FormFieldButton';
import { fieldName as langs } from '../Form/fields/FormFieldLangs';
import { fieldName as title } from '../Form/fields/FormFieldTitle';
import { fieldName as divider } from '../Form/fields/FormFieldDivider';
import { fieldName as files } from '../Form/fields/FormFieldFiles';
import { fieldName as input } from '../Form/fields/FormFieldInput';

export default function ({ disabled }) {
    return [
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'General'
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
                label: 'Header',
                variant: 'h4'
            }
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Header background image',
                variant: 'h6'
            }
        },
        {
            field: files,
            name: 'headerBanner',
            settings: {
                webp: true,
                max: 1
            },
            langInsensitive: true,
            validators: [
                { name: 'required', options: { text: 'Upload header\'s photo' } }
            ]
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Header link',
                variant: 'h6'
            }
        },
        {
            field: input,
            name: 'headerLink1Text',
            settings: {
                label: 'Link text'
            },
            validators: []
        },
        {
            field: input,
            name: 'headerLink1Href',
            settings: {
                label: 'Link address'
            },
            langInsensitive: true,
            validators: []
        },
        {
            field: divider,
            name: 'divider'
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Day info',
                variant: 'h4'
            }
        },
        {
            field: input,
            name: 'holiday',
            settings: {
                label: 'Today\'s holiday'
            },
            validators: []
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Today\'s holiday image',
                variant: 'h6'
            }
        },
        {
            field: files,
            name: 'holidayBanner',
            settings: {
                webp: true,
                max: 1
            },
            langInsensitive: true,
            validators: [
                { name: 'required', options: { text: 'Upload header\'s photo' } }
            ]
        },
        {
            field: divider,
            name: 'divider'
        },
        {
            field: button,
            name: 'button',
            settings: {
                label: 'Save',
                disabled
            }
        }
    ];
}
