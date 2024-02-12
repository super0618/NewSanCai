import request from 'superagent';
import base from '../base';

import getToken from '../../utils/getToken';

export default function ({ page = 1, size = 10, sort = 'asc', categoryId, subcategoryId, search, dateStart, dateEnd, status }) {
    const token = getToken();

    return base(
        request
            .get('/api/admin/article/paginated')
            .query({
                page: page,
                size: size,
                sort: sort,
                categoryId: categoryId,
                subcategoryId: subcategoryId,
                search: search,
                dateStart: dateStart,
                dateEnd: dateEnd,
                status: status
            })
            .set('Authorization', `Bearer ${token}`)
    );
}
