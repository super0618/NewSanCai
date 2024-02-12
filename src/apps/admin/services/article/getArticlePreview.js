import request from 'superagent';
import base from '../base';

export default function (context) {
    const locale = context?.locale;
    const alias = (context?.params || context?.query)?.slug;
    const token = localStorage.getItem('new-san-cai');

    return base(
        request
            .get('/api/admin/article/getArticlePreview')
            .query({ locale: locale, alias: alias })
            .set('Authorization', `Bearer ${token}`)
    )
        .then(article => {
            return {
                articleItem: article
            };
        }).catch((e) => e);
}
