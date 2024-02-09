import { fieldName as button } from '../Form/fields/FormFieldButton';
import { fieldName as langs } from '../Form/fields/FormFieldLangs';
import { fieldName as title } from '../Form/fields/FormFieldTitle';
import { fieldName as suggest } from '../Form/fields/FormFieldSuggestRequest';
import { fieldName as divider } from '../Form/fields/FormFieldDivider';
import { fieldName as input } from '../Form/fields/FormFieldInput';
import { fieldName as files } from '../Form/fields/FormFieldFiles';

export default function ({
    disabled, onInputChangeHandlerArticles, onInputChangeHandlerPosts, onValueChangeHandlerArticles, onValueChangeHandlerPosts, selectedFeatured
}) {
    return [
        {
            field: title,
            name: 'titleField',
            settings: {
                label: 'Main page'
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
            validators: [
                { name: 'required', options: { text: 'Pick audio' } }
            ]
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
            name: 'featuredTopMain',
            settings: {
                label: 'Top big featured articles',
                onInputChangeHandler: onInputChangeHandlerArticles,
                onValueChangeHandler: onValueChangeHandlerArticles,
                selectedFeatured: selectedFeatured,
                multiple: true,
                max: 1
            },
            langInsensitive: true
        },
        {
            field: suggest,
            name: 'featuredTopSub',
            settings: {
                label: 'Top small featured articles',
                onInputChangeHandler: onInputChangeHandlerArticles,
                onValueChangeHandler: onValueChangeHandlerArticles,
                selectedFeatured: selectedFeatured,
                multiple: true,
                max: 4
            },
            langInsensitive: true
        },
        {
            field: suggest,
            name: 'featuredBottom',
            settings: {
                label: 'Bottom featured articles',
                onInputChangeHandler: onInputChangeHandlerArticles,
                onValueChangeHandler: onValueChangeHandlerArticles,
                selectedFeatured: selectedFeatured,
                multiple: true,
                max: 2
            },
            langInsensitive: true
        },
        {
            field: suggest,
            name: 'featuredVideo',
            settings: {
                label: 'Bottom featured video',
                onInputChangeHandler: onInputChangeHandlerPosts,
                onValueChangeHandler: onValueChangeHandlerPosts,
                multiple: true,
                max: 1
            },
            langInsensitive: true
        },
        {
            field: suggest,
            name: 'featuredBottomVote',
            settings: {
                label: 'Bottom featured articles (are applied, when vote for main page is missing)',
                onInputChangeHandler: onInputChangeHandlerArticles,
                onValueChangeHandler: onValueChangeHandlerArticles,
                selectedFeatured: selectedFeatured,
                multiple: true,
                max: 4
            },
            langInsensitive: true
        },
        {
            field: suggest,
            name: 'featuredRight',
            settings: {
                label: 'Right bar featured articles',
                onInputChangeHandler: onInputChangeHandlerArticles,
                onValueChangeHandler: onValueChangeHandlerArticles,
                selectedFeatured: selectedFeatured,
                multiple: true,
                max: 1
            },
            langInsensitive: true
        },
        {
            field: suggest,
            name: 'featuredRightList',
            settings: {
                label: 'Commentary section 1',
                onInputChangeHandler: onInputChangeHandlerArticles,
                onValueChangeHandler: onValueChangeHandlerArticles,
                selectedFeatured: selectedFeatured,
                multiple: true,
                max: 4
            },
            langInsensitive: true
        },
        {
            field: suggest,
            name: 'featuredCommentarySection',
            settings: {
                label: 'Commentary section 2',
                onInputChangeHandler: onInputChangeHandlerArticles,
                onValueChangeHandler: onValueChangeHandlerArticles,
                selectedFeatured: selectedFeatured,
                multiple: true
            },
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
            field: button,
            name: 'button',
            settings: {
                label: 'Save',
                disabled
            }
        }
    ];
}
