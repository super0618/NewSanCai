import { fieldName as button } from '../Form/fields/FormFieldButton';
import { fieldName as checkbox } from '../Form/fields/FormFieldCheckbox';
import { fieldName as checkboxes } from '../Form/fields/FormFieldCheckboxes';
import { fieldName as date } from '../Form/fields/FormFieldDate';
import { fieldName as divider } from '../Form/fields/FormFieldDivider';
import { fieldName as editor } from '../Form/fields/FormFieldEditor';
import { fieldName as files } from '../Form/fields/FormFieldFiles';
import { fieldName as input } from '../Form/fields/FormFieldInput';
import { fieldName as inputs } from '../Form/fields/FormFieldInputs';
import { fieldName as langs } from '../Form/fields/FormFieldLangs';
import { fieldName as radios } from '../Form/fields/FormFieldRadios';
import { fieldName as select } from '../Form/fields/FormFieldSelect';
import { fieldName as title } from '../Form/fields/FormFieldTitle';
import { fieldName as listWithForms } from '../Form/fields/FormFieldListWithForms';
import { fieldName as blocksConstructor } from '../Form/fields/FormFieldBLocksConstructor';

import InputForm from './innerForms/InputForm';
import SelectForm from './innerForms/SelectForm';

import { DEFAULT_LOCALE } from '../../../client/constants';

import getFieldsInnerForm from './getFieldsInnerForm';

export default function ({ disabled }) {
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
            field: title,
            name: 'titleField',
            settings: {
                label: 'Inputs field',
                variant: 'h6'
            }
        },
        {
            field: inputs,
            name: 'inputs',
            settings: {
                inputs: [{ name: 'input1', label: 'Input 1' }, { name: 'input2', label: 'Input 2' }, { name: 'input3', label: 'Input 3' }]
            },
            validators: [
                { name: 'required', options: { text: 'Заполните inputs' } }
            ]
        },
        {
            field: checkbox,
            name: 'checkbox',
            settings: {
                label: 'checkbox'
            },
            validators: [
                { name: 'required', options: { text: 'Заполните checkbox' } }
            ]
        },
        {
            field: checkboxes,
            name: 'checkboxes',
            settings: {
                options: [
                    { value: 'checkbox1', label: 'Чекбокс 1' },
                    { value: 'checkbox2', label: 'Чекбокс 2' }
                ]
            },
            validators: [
                { name: 'required', options: { text: 'Заполните checkboxes' } }
            ]
        },
        {
            field: radios,
            name: 'radios',
            settings: {
                options: [
                    { value: 'radio1', label: 'Радио 1' },
                    { value: 'radio2', label: 'Радио 2' }
                ]
            },
            validators: [
                { name: 'required', options: { text: 'Заполните radios' } }
            ]
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
            field: date,
            name: 'date',
            settings: {
                label: 'date'
            },
            validators: [
                { name: 'required', options: { text: 'Заполните date' } }
            ]
        },
        {
            field: divider,
            name: 'divider'
        },
        {
            field: editor,
            name: 'editor',
            settings: {},
            validators: [
                { name: 'required', options: { text: 'Заполните editor' } }
            ]
        },
        {
            field: files,
            name: 'files',
            settings: {
                webp: true
            },
            validators: [
                { name: 'required', options: { text: 'Заполните files' } }
            ]
        },
        {
            field: listWithForms,
            name: 'listWithForms',
            settings: {
                label: 'List with forms',
                getFormLabel: form => form[DEFAULT_LOCALE].input,
                getFields: getFieldsInnerForm
            }
        },
        {
            field: blocksConstructor,
            name: 'blocksConstructor',
            settings: {
                catalog: [
                    { id: 'blockWithInput', name: 'Block with input', component: InputForm },
                    { id: 'blockWithSelect', name: 'Block with select', component: SelectForm }
                ]
            }
        },
        {
            field: button,
            name: 'button',
            settings: {
                label: 'button',
                disabled
            }
        }
    ];
}
