import { fieldName as button } from '../../../Form/fields/FormFieldButton';
import { fieldName as langs } from '../../../Form/fields/FormFieldLangs';
import { fieldName as select } from '../../../Form/fields/FormFieldSelect';
import { fieldName as title } from '../../../Form/fields/FormFieldTitle';

export default function () {
    return [
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Пример'
            }
        },
        {
            field: langs,
            name: 'lang'
        },
        {
            field: select,
            name: 'select',
            settings: {
                label: 'Select',
                options: [
                    { value: 'select1', label: 'Селект 1' },
                    { value: 'select2', label: 'Селект 2' }
                ]
            },
            validators: [
                { name: 'required', options: { text: 'Заполните select' } }
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
