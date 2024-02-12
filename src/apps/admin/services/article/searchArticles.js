import request from 'superagent';
import base from '../base';

import getToken from '../../utils/getToken';

export default function ({ searchText, categoryId, subcategoryId }) {
    const token = getToken();

    return base(
        request
            .get('/api/admin/article/searchArticle')
            .set('Authorization', `Bearer ${token}`)
            .query({ searchText: searchText, categoryId, subcategoryId })
    );
}
