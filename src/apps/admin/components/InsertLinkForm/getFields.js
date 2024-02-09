import { fieldName as button } from '../Form/fields/FormFieldButton';
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
            field: input,
            name: 'link',
            settings: {
                label: 'Article link'
            },
            langInsensitive: true,
            validators: [
                { name: 'required', options: { text: 'Link is required' } }
            ]
        },
        {
            field: button,
            name: 'button',
            settings: {
                label: 'Add'
            }
        }
    ];
}
