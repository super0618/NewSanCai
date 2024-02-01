import React from 'react';
import PrivacyPolicy from '../apps/client/components/PrivacyPolicy';
import getArticlesCategories from '../apps/client/services/server/getArticlesCategories';
import getAuthors from '../apps/client/services/server/getAuthors';
import getPages from '../apps/client/services/server/getPages';
import getStaticPropsGenerator from '../apps/client/utils/getStaticPropsGenerator';
import { useSelector } from 'react-redux';
import SEO from '../apps/client/components/SEO';
import { useIntl } from 'react-intl';

const Privacy = () => {
    const intl = useIntl();
    const pages = useSelector(({ data }) => data.pages);
    const page = pages.find(page => page.pageId === 'privacy');

    return (
        <>
            <SEO
                title={intl.formatMessage({ id: 'privacy.title' })}
            />
            <PrivacyPolicy page={page}/>
        </>
    );
};

Privacy.propTypes = {};

const services = [
    getArticlesCategories,
    getAuthors,
    getPages
];

export const getStaticProps = async context => getStaticPropsGenerator(context, services);

export default Privacy;
