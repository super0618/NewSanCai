import { fieldName as button } from '../Form/fields/FormFieldButton';
import { fieldName as input } from '../Form/fields/FormFieldInput';
import { fieldName as langs } from '../Form/fields/FormFieldLangs';
import { fieldName as title } from '../Form/fields/FormFieldTitle';
import { fieldName as select } from '../Form/fields/FormFieldSelect';
import { fieldName as divider } from '../Form/fields/FormFieldDivider';
import { fieldName as date } from '../Form/fields/FormFieldDate';
import { fieldName as files } from '../Form/fields/FormFieldFiles';
import { fieldName as checkbox } from '../Form/fields/FormFieldCheckbox';
import { fieldName as editor } from '../Form/fields/FormFieldEditor';

export default function ({
    formTitle,
    categoriesOptions,
    subcategoriesOptions,
    authorsOptions,
    handlePickCategory,
    filename,
    statusOptions,
    disabled,
    isPreviewButtonShown,
    handlePreviewClick,
    onClose,
    isFeaturedEnabled,
    isActiveFeaturedFlag
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
            name: 'audioFileHeader',
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
            name: 'audioTitleHeader',
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
            field: input,
            name: 'title',
            settings: {
                label: 'Title'
            },
            validators: [
                {
                    name: 'required',
                    options: { text: 'Article title is required' }
                }
            ]
        },
        {
            field: input,
            name: 'alias',
            settings: {
                label: 'Alias',
                forbiddenSymbols: [':', '/', '.', '?', '&', '=', '#', '+', '%', '@', '_']
            },
            langInsensitive: true,
            validators: [
                {
                    name: 'required',
                    options: { text: 'Alias is required' }
                }
            ]
        },
        {
            field: input,
            name: 'shortDescription',
            settings: {
                label: 'Short description',
                multiline: true
            },
            validators: [
                {
                    name: 'required',
                    options: { text: 'Short description is required' }
                }
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
                {
                    name: 'required',
                    options: { text: 'Choose author' }
                }
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
                {
                    name: 'required',
                    options: { text: 'Pick date' }
                }
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
                label: 'Article text',
                variant: 'h6'
            }
        },
        {
            field: editor,
            name: 'description',
            settings: {
                type: 'articleImage',
                filename: filename
            },
            validators: [
                {
                    name: 'required',
                    options: { text: 'Fill the article description' }
                }
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
                label: 'Preview photo',
                variant: 'h6'
            }
        },
        {
            field: files,
            name: 'avatar',
            settings: {
                webp: true,
                max: 1,
                type: 'articleImage',
                filename: filename
            },
            langInsensitive: true,
            validators: [
                {
                    name: 'required',
                    options: { text: 'Upload preview photo' }
                }
            ]
        },
        {
            field: select,
            name: 'photoAuthor',
            settings: {
                label: 'Author of the photo',
                options: [{ label: 'Clear', value: '' }, ...authorsOptions]
            },
            validators: [],
            langInsensitive: true
        },
        {
            field: input,
            name: 'photoOrg',
            settings: {
                label: 'Photo organization'
            },
            validators: []
        },
        {
            field: input,
            name: 'photoDescription',
            settings: {
                label: 'Photo description',
                multiline: true
            },
            validators: []
        },
        {
            field: input,
            name: 'photoLink',
            settings: {
                label: 'Photo link'
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
                label: 'Article citation',
                variant: 'h6'
            }
        },
        {
            field: input,
            name: 'citationText',
            settings: {
                label: 'Citation Text',
                multiline: true
            },
            validators: []
        },
        {
            field: input,
            name: 'citationAuthor',
            settings: {
                label: 'Citation Author'
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
                label: 'Article audio',
                variant: 'h6'
            }
        },
        {
            field: input,
            name: 'audioTitle',
            settings: {
                label: 'Audio Title'
            },
            validators: []
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
            name: 'tags',
            settings: {
                label: 'Article tags'
            },
            validators: []
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
                label: 'Article settings',
                variant: 'h6'
            }
        },
        /*
        {
            field: checkbox,
            name: 'hidden',
            settings: {
                label: 'Hidden'
            },
            langInsensitive: true
        },
        */
        {
            field: select,
            name: 'status',
            settings: {
                label: 'Status',
                options: statusOptions
            },
            validators: [
                {
                    name: 'required',
                    options: { text: 'Choose status' }
                }
            ],
            langInsensitive: true
        },
        ...(isPreviewButtonShown
            ? [{
                field: button,
                name: 'button',
                settings: {
                    label: 'Preview',
                    onClick: handlePreviewClick
                }
            }]
            : []),
        ...(isFeaturedEnabled
            ? [
                {
                    field: checkbox,
                    name: 'featuredTopMain',
                    settings: {
                        label: 'Top big featured articles',
                        disabled: isActiveFeaturedFlag && isActiveFeaturedFlag !== 'featuredTopMain'
                    },
                    langInsensitive: true
                },
                {
                    field: checkbox,
                    name: 'featuredTopSub',
                    settings: {
                        label: 'Top small featured articles',
                        disabled: isActiveFeaturedFlag && isActiveFeaturedFlag !== 'featuredTopSub'
                    },
                    langInsensitive: true
                },
                {
                    field: checkbox,
                    name: 'featuredBottom',
                    settings: {
                        label: 'Bottom featured articles',
                        disabled: isActiveFeaturedFlag && isActiveFeaturedFlag !== 'featuredBottom'
                    },
                    langInsensitive: true
                },
                {
                    field: checkbox,
                    name: 'featuredBottomVote',
                    settings: {
                        label: 'Bottom featured articles (are applied, when vote for main page is missing)',
                        disabled: isActiveFeaturedFlag && isActiveFeaturedFlag !== 'featuredBottomVote'
                    },
                    langInsensitive: true
                },
                {
                    field: checkbox,
                    name: 'featuredRight',
                    settings: {
                        label: 'Right bar featured articles',
                        disabled: isActiveFeaturedFlag && isActiveFeaturedFlag !== 'featuredRight'
                    },
                    langInsensitive: true
                },
                {
                    field: checkbox,
                    name: 'featuredCategory',
                    settings: {
                        label: 'In category features'
                    },
                    langInsensitive: true
                },
                {
                    field: checkbox,
                    name: 'featuredSubCategory',
                    settings: {
                        label: 'In sub category features(sub category must be selected above)'
                    },
                    langInsensitive: true
                },
                {
                    field: checkbox,
                    name: 'featuredRightList',
                    settings: {
                        label: 'Commentary section 1',
                        disabled: isActiveFeaturedFlag && isActiveFeaturedFlag !== 'featuredRightList'
                    },
                    langInsensitive: true
                },
                {
                    field: checkbox,
                    name: 'featuredCommentarySection',
                    settings: {
                        label: 'Commentary section 2',
                        disabled: isActiveFeaturedFlag && isActiveFeaturedFlag !== 'featuredCommentarySection'
                    },
                    langInsensitive: true
                }
            ]
            : []),
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
        },
        {
            field: button,
            name: 'button',
            settings: {
                label: 'Close',
                onClick: onClose
            }
        }
    ];
}
