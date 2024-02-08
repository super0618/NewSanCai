import { fieldName as button } from '../../../Form/fields/FormFieldButton';
import { fieldName as langs } from '../../../Form/fields/FormFieldLangs';
import { fieldName as title } from '../../../Form/fields/FormFieldTitle';
import { fieldName as editor } from '../../../Form/fields/FormFieldEditor';

export default function () {
    return [
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Text form'
            }
        },
        {
            field: langs,
            name: 'lang'
        },
        {
            field: editor,
            name: 'text',
            settings: {},
            validators: [
                { name: 'required', options: { text: 'Fill the article text' } }
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
