import { fieldName as button } from '../Form/fields/FormFieldButton';
import { fieldName as input } from '../Form/fields/FormFieldInput';
import { fieldName as langs } from '../Form/fields/FormFieldLangs';
import { fieldName as title } from '../Form/fields/FormFieldTitle';
import { fieldName as select } from '../Form/fields/FormFieldSelect';
import { fieldName as divider } from '../Form/fields/FormFieldDivider';
import { fieldName as date } from '../Form/fields/FormFieldDate';
import { fieldName as editor } from '../Form/fields/FormFieldEditor';
import { fieldName as checkbox } from '../Form/fields/FormFieldCheckbox';
import { fieldName as files } from '../Form/fields/FormFieldFiles';

export default function ({ formTitle, categoriesOptions, subcategoriesOptions, authorsOptions, handlePickCategory }) {
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
            field: select,
            name: 'category',
            settings: {
                label: 'Category',
                options: categoriesOptions,
                onChangeCallback: handlePickCategory
            },
            validators: [
                { name: 'required', options: { text: 'Choose category' } }
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
            field: input,
            name: 'alias',
            settings: {
                label: 'Alias'
            },
            langInsensitive: true,
            validators: [
                { name: 'required', options: { text: 'Alias is required' } }
            ]
        },
        {
            field: input,
            name: 'title',
            settings: {
                label: 'Title'
            },
            validators: [
                { name: 'required', options: { text: 'Article title is required' } }
            ]
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Post description',
                variant: 'h6'
            }
        },
        {
            field: editor,
            name: 'description',
            settings: {
                toolbar: [
                    'heading',
                    '|',
                    'alignment',
                    'bold',
                    'italic',
                    'underline',
                    'strikeThrough',
                    'link',
                    '|',
                    'bulletedList',
                    'numberedList',
                    '|',
                    'undo',
                    'redo'
                ]
            },
            validators: [
                { name: 'required', options: { text: 'Description is required' } }
            ]
        },
        {
            field: select,
            name: 'author',
            settings: {
                label: 'Author',
                options: authorsOptions
            },
            validators: [
                { name: 'required', options: { text: 'Choose author' } }
            ],
            langInsensitive: true
        },
        {
            field: date,
            name: 'date',
            settings: {
                label: 'Date',
                preloadToday: true
            },
            validators: [
                { name: 'required', options: { text: 'Pick date' } }
            ],
            langInsensitive: true
        },
        {
            field: divider,
            name: 'divider'
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Add Video via link (youtube, vimeo, twitch, facebook, wistia, dailymotion)...',
                variant: 'h6'
            }
        },
        {
            field: input,
            name: 'videoLink',
            settings: {
                label: 'Video link'
            },
            langInsensitive: true
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: '...or upload Video as a file',
                variant: 'h6'
            }
        },
        {
            field: files,
            name: 'videoFile',
            settings: {
                max: 1,
                webp: false,
                accept: 'video/*'
            },
            langInsensitive: true,
            validators: []
        },
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Post video preview image (optional)',
                variant: 'h6'
            }
        },
        {
            field: files,
            name: 'videoPreview',
            settings: {
                webp: true,
                max: 1
            },
            langInsensitive: true,
            validators: []
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
            validators: []
        },
        {
            field: input,
            name: 'seoDescription',
            settings: {
                label: 'SEO description',
                multiline: true
            },
            validators: []
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
            field: title,
            name: 'titleField',
            settings: {
                label: 'Post settings',
                variant: 'h6'
            }
        },
        {
            field: checkbox,
            name: 'hidden',
            settings: {
                label: 'Hidden'
            },
            langInsensitive: true
        },
        {
            field: checkbox,
            name: 'featuredVideo',
            settings: {
                label: 'Featured video'
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
                label: 'Save'
            }
        }
    ];
}
