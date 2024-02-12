import request from 'superagent';
import base from '../base';
import getToken from '../../utils/getToken';

export default function (texts) {
    const token = getToken();

    return base(
        request
            .post('/api/admin/article/translate')
            .send({ texts })
            .set('Authorization', `Bearer ${token}`)
    )
        .then(result => {
            return result;
        });
}
