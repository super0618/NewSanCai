import { fieldName as button } from '../Form/fields/FormFieldButton';
import { fieldName as title } from '../Form/fields/FormFieldTitle';
import { fieldName as select } from '../Form/fields/FormFieldSelect';
import { fieldName as divider } from '../Form/fields/FormFieldDivider';

export default function ({
    formTitle,
    categoriesOptions,
    subcategoriesOptions,
    handlePickCategory
}) {
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
            field: select,
            name: 'category',
            settings: {
                label: 'Category',
                options: categoriesOptions,
                onChangeCallback: handlePickCategory
            },
            validators: [
                {
                    name: 'required',
                    options: { text: 'Choose category' }
                }
            ],
            langInsensitive: true
        },
        {
            field: select,
            name: 'subcategory',
            settings: {
                label: subcategoriesOptions === undefined
                    ? 'Subcategory (choose category first)'
                    : subcategoriesOptions === null
                        ? 'Subcategory (no options available, please, add subcategories to current category)'
                        : 'Subcategory',
                options: subcategoriesOptions || [],
                disabled: !subcategoriesOptions,
                clearable: true
            },
            langInsensitive: true
        },
        {
            field: divider,
            name: 'divider'
        },
        {
            field: button,
            name: 'button',
            settings: {
                label: 'Move'
            }
        }
    ];
}
