import { fieldName as button } from '../Form/fields/FormFieldButton';
import { fieldName as input } from '../Form/fields/FormFieldInput';
import { fieldName as langs } from '../Form/fields/FormFieldLangs';
import { fieldName as title } from '../Form/fields/FormFieldTitle';
import { fieldName as divider } from '../Form/fields/FormFieldDivider';
import { fieldName as suggest } from '../Form/fields/FormFieldSuggestRequest';
import { fieldName as files } from '../Form/fields/FormFieldFiles';

export default function ({ formTitle, onInputChangeHandler, onValueChangeHandlerArticles }) {
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
            field: divider,
            name: 'divider'
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Header audio',
                variant: 'h6'
            }
        },
        {
            field: files,
            name: 'audioFile',
            settings: {
                max: 1,
                webp: false,
                accept: 'audio/mp3,audio/*;capture=microphone'
            },
            langInsensitive: true,
            validators: []
        },
        {
            field: input,
            name: 'audioTitle',
            settings: {
                label: 'Title for audio'
            },
            validators: []
        },
        {
            field: divider,
            name: 'divider'
        },
        {
            field: suggest,
            name: 'featured',
            settings: {
                label: 'Subcategory featured articles',
                onInputChangeHandler: onInputChangeHandler,
                onValueChangeHandler: onValueChangeHandlerArticles,
                multiple: true,
                max: 2
            },
            langInsensitive: true
        },
        {
            field: input,
            name: 'name',
            settings: {
                label: 'Subcategory name'
            },
            validators: [
                { name: 'required', options: { text: 'Name is required' } }
            ]
        },
        {
            field: input,
            name: 'alias',
            settings: {
                label: 'Subcategory alias'
            },
            langInsensitive: true,
            validators: [
                { name: 'required', options: { text: 'Alias is required' } }
            ]
        },
        {
            field: divider,
            name: 'divider'
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'SEO',
                variant: 'h6'
            }
        },
        {
            field: input,
            name: 'seoTitle',
            settings: {
                label: 'SEO title'
            },
            validators: [
                { name: 'required', options: { text: 'SEO title is required' } }
            ]
        },
        {
            field: input,
            name: 'seoDescription',
            settings: {
                label: 'SEO description',
                multiline: true
            },
            validators: [
                { name: 'required', options: { text: 'SEO description is required' } }
            ]
        },
        {
            field: input,
            name: 'seoKeywords',
            settings: {
                label: 'SEO keywords',
                multiline: true
            },
            validators: []
        },
        {
            field: divider,
            name: 'divider'
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
