import { fieldName as button } from '../Form/fields/FormFieldButton';
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
            field: input,
            name: 'name',
            settings: {
                label: 'Category name'
            },
            validators: [
                { name: 'required', options: { text: 'Name is required' } }
            ]
        },
        {
            field: button,
            name: 'button',
            settings: {
                label: 'button'
            }
        }
    ];
}
