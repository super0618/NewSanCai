import { fieldName as title } from '../../../Form/fields/FormFieldTitle';
import { fieldName as langs } from '../../../Form/fields/FormFieldLangs';
import { fieldName as input } from '../../../Form/fields/FormFieldInput';
import { fieldName as button } from '../../../Form/fields/FormFieldButton';

export default function () {
    return [
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Add Options'
            }
        },
        {
            field: langs,
            name: 'lang'
        },
        {
            field: input,
            name: 'variant',
            settings: {
                label: 'Variant'
            },
            validators: [
                { name: 'required', options: { text: 'Inputs need to be filled' } }
            ]
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
