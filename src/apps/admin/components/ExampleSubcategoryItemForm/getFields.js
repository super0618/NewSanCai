import { fieldName as button } from '../Form/fields/FormFieldButton';
import { fieldName as input } from '../Form/fields/FormFieldInput';
import { fieldName as langs } from '../Form/fields/FormFieldLangs';
import { fieldName as title } from '../Form/fields/FormFieldTitle';
import { fieldName as select } from '../Form/fields/FormFieldSelect';

export default function ({ formTitle, categoriesOptions }) {
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
            field: select,
            name: 'category',
            settings: {
                label: 'Category',
                options: categoriesOptions
            },
            validators: [
                { name: 'required', options: { text: 'Заполните select' } }
            ],
            langInsensitive: true
        },
        {
            field: input,
            name: 'name',
            settings: {
                label: 'Name'
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
