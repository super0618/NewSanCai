export const TOKEN_LOCAL_STORAGE_NAME = 'new-san-cai';
export const ADMIN_PANEL_DEV = '/admin';
export const ADMIN_PANEL_PROD = '/admin';
export const ADMIN_PANEL_URL =
  process.env.NODE_ENV === 'production' ? ADMIN_PANEL_PROD : ADMIN_PANEL_DEV;
export const RECOVERY_URL = `${ADMIN_PANEL_URL}/recovery`;
export const ADMIN_LOCALE = 'en'; // en / uk / ru

export const AD_PAGES_ALIASES = {
    mainPage: 'mainPage',
    multimediaPage: 'multimediaPage',
    categoryPage: 'categoryPage',
    subCategoryPage: 'subCategoryPage',
    articlePage: 'articlePage'
};

export const AVAILABLE_PAGES = [
    { value: AD_PAGES_ALIASES.mainPage, label: 'Main page' },
    { value: AD_PAGES_ALIASES.multimediaPage, label: 'Multimedia page' },
    { value: AD_PAGES_ALIASES.categoryPage, label: 'Category page' },
    { value: AD_PAGES_ALIASES.subCategoryPage, label: 'Subcategory page' },
    { value: AD_PAGES_ALIASES.articlePage, label: 'Article page' }
];

export const PAGES_KEYS = {
    [AD_PAGES_ALIASES.mainPage]: 'Main page',
    [AD_PAGES_ALIASES.multimediaPage]: 'Multimedia page',
    [AD_PAGES_ALIASES.categoryPage]: 'Category page',
    [AD_PAGES_ALIASES.subCategoryPage]: 'Subcategory page',
    [AD_PAGES_ALIASES.articlePage]: 'Article page'
};

export const TOOLBAR_FOR_EDITOR = [
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
    'horizontalLine',
    'undo',
    'redo'
];
