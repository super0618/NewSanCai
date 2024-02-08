import { fieldName as button } from '../Form/fields/FormFieldButton';
import { fieldName as divider } from '../Form/fields/FormFieldDivider';
import { fieldName as input } from '../Form/fields/FormFieldInput';
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
            field: divider,
            name: 'divider'
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Text',
                variant: 'h6'
            }
        },
        {
            field: input,
            name: 'text',
            settings: {
                label: 'Comment text',
                multiline: true
            },
            validators: [
                { name: 'required', options: { text: 'Enter comment text' } }
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
                label: 'Save'
            }
        }
    ];
}
