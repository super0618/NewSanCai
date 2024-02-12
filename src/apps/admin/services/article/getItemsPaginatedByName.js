import request from 'superagent';
import base from '../base';

import getToken from '../../utils/getToken';

export default function ({ page = 1, size = 10, sort = 'asc', categoryId, subcategoryId, excludeId, search, locale }) {
    const token = getToken();

    return base(
        request
            .get('/api/admin/article/paginated/name')
            .query({ search: search, page: page, size: size, sort: sort, categoryId: categoryId, subcategoryId: subcategoryId, excludeId: excludeId, locale })
            .set('Authorization', `Bearer ${token}`)
    );
}
