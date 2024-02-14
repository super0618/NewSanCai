import request from 'superagent';
import base from './base';

export default function (token) {
    return base(
        request
            .get('/api/admin/admin/profile')
            .set('Authorization', `Bearer ${token}`)
    );
}
