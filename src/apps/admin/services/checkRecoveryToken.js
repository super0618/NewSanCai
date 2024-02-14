import request from 'superagent';
import base from './base';

export default function ({ token, email }) {
    return base(
        request
            .get('/api/admin/admin/check-recovery-token')
            .query({ token, email })
    );
}
