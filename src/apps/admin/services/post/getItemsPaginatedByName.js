import request from 'superagent';
import base from '../base';

import getToken from '../../utils/getToken';

export default function ({ page = 1, size = 10, sort = 'asc', categoryId, subcategoryId, excludeId, search, type, locale }) {
    const token = getToken();

    return base(
        request
            .get('/api/admin/post/paginated/name')
            .query({
                // eslint-disable-next-line max-len
                search: search, page: page, size: size, sort: sort, categoryId: categoryId, subcategoryId: subcategoryId, excludeId: excludeId, type: type, locale
            })
            .set('Authorization', `Bearer ${token}`)
    );
}
