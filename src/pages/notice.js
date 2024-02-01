import React from 'react';
import WebsiteBrowserNotice from '../apps/client/components/WebsiteBrowserNotice';
import getArticlesCategories from '../apps/client/services/server/getArticlesCategories';
import getAuthors from '../apps/client/services/server/getAuthors';
import getPages from '../apps/client/services/server/getPages';
import getStaticPropsGenerator from '../apps/client/utils/getStaticPropsGenerator';
import { useSelector } from 'react-redux';
import SEO from '../apps/client/components/SEO';
import { useIntl } from 'react-intl';

const Notice = () => {
    const intl = useIntl();
    const pages = useSelector(({ data }) => data.pages);
    const page = pages.find(page => page.pageId === 'notice');

    return (
        <>
            <SEO
                title={intl.formatMessage({ id: 'notice.title' })}
            />
            <WebsiteBrowserNotice page={page}/>
        </>
    );
};

Notice.propTypes = {};

const services = [
    getArticlesCategories,
    getAuthors,
    getPages
];

export const getStaticProps = async context => getStaticPropsGenerator(context, services);

export default Notice;
