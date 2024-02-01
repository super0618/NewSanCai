import React, { useEffect, useState } from 'react';
import SearchContent from '../apps/client/components/SearchContent';
import getArticlesCategories from '../apps/client/services/server/getArticlesCategories';
import getAuthors from '../apps/client/services/server/getAuthors';
import getServerSidePropsGenerator from '../apps/client/utils/getServerSidePropsGenerator';
import { useRouter } from 'next/router';
import getPages from '../apps/client/services/server/getPages';

const Search = () => {
    const router = useRouter();
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (!router.isReady) return;

        if (router.query?.query) {
            setQuery(router.query.query);
        } else {
            setQuery('');
        }
    }, [router.query]);

    return (
        <>
            <SearchContent query={query}/>
        </>
    );
};

Search.propTypes = {
};

const services = [
    getArticlesCategories,
    getAuthors,
    getPages
];

export const getServerSideProps = async context => getServerSidePropsGenerator(context, services);

export default Search;
