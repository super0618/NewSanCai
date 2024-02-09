import { fieldName as button } from '../Form/fields/FormFieldButton';
import { fieldName as langs } from '../Form/fields/FormFieldLangs';
import { fieldName as title } from '../Form/fields/FormFieldTitle';
import { fieldName as divider } from '../Form/fields/FormFieldDivider';
import { fieldName as editor } from '../Form/fields/FormFieldEditor';
import { TOOLBAR_FOR_EDITOR } from '../../constants/constants';

export default function ({ disabled }) {
    return [
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Website Browsing Notice'
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
            field: editor,
            name: 'text',
            settings: {
                toolbar: TOOLBAR_FOR_EDITOR
            },
            validators: [
                {
                    name: 'required',
                    options: { text: 'Fill the browsing notice text' }
                }
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
