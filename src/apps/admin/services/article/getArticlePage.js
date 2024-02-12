import request from 'superagent';
import base from '../base';
import getToken from '../../utils/getToken';

export default function (link) {
    const token = getToken();

    return base(
        request
            .get('/api/admin/article/zhengjian')
            .query({ link: link })
            .set('Authorization', `Bearer ${token}`)
    )
        .then(result => {
            return result;
        });
}
