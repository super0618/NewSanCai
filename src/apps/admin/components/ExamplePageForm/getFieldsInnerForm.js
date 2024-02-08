import { fieldName as button } from '../Form/fields/FormFieldButton';
import { fieldName as input } from '../Form/fields/FormFieldInput';
import { fieldName as langs } from '../Form/fields/FormFieldLangs';
import { fieldName as title } from '../Form/fields/FormFieldTitle';

export default function (item) {
    return [
        {
            field: title,
            name: 'titleField',
            settings: {
                label: item ? 'Adding' : 'Editing'
            }
        },
        {
            field: langs,
            name: 'lang'
        },
        {
            field: input,
            name: 'input',
            settings: {
                label: 'input'
            },
            validators: [
                { name: 'required', options: { text: 'Заполните input' } }
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
