import { ADMIN_PANEL_URL } from './constants';

export default [
    { id: 'general', path: ADMIN_PANEL_URL, title: 'General' },
    { id: 'main', path: `${ADMIN_PANEL_URL}/main`, title: 'Main Page' },
    { id: 'authors', path: `${ADMIN_PANEL_URL}/authors`, title: 'Authors' },
    { id: 'articles', path: `${ADMIN_PANEL_URL}/articles`, title: 'Articles' },
    { id: 'multimedia', path: `${ADMIN_PANEL_URL}/multimedia`, title: 'Multimedia' },
    { id: 'comments', path: `${ADMIN_PANEL_URL}/comments`, title: 'Comments Moderation' },
    { id: 'credentials', path: `${ADMIN_PANEL_URL}/credentials`, title: 'Changing Credentials', notMenu: true },
    { id: 'db', path: `${ADMIN_PANEL_URL}/db`, title: 'Database', notMenu: true },
    { id: 'votes', path: `${ADMIN_PANEL_URL}/votes`, title: 'Votes' },
    { id: 'customCommercial', path: `${ADMIN_PANEL_URL}/custom-ad`, title: 'Custom commercial' },
    { id: 'privacy', path: `${ADMIN_PANEL_URL}/privacy`, title: 'Privacy Policy' },
    { id: 'notice', path: `${ADMIN_PANEL_URL}/notice`, title: 'Website Browsing Notice' }

];
