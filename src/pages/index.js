import React, { useEffect } from 'react';
import MainPageContent from '../apps/client/components/MainPageContent';
import getArticlesCategories from '../apps/client/services/server/getArticlesCategories';
import getAuthors from '../apps/client/services/server/getAuthors';
import getStaticPropsGenerator from '../apps/client/utils/getStaticPropsGenerator';
import { useRouter } from 'next/router';
import SEO from '../apps/client/components/SEO';
import { useDispatch, useSelector } from 'react-redux';
import getFeedArticles from '../apps/client/services/server/getFeedArticles';
import verifyEmail from '../apps/client/services/client/verifyEmail';
import verifySubscription from '../apps/client/services/client/verifySubscription';
import setSignInPopup from '../apps/client/store/actions/setSignInPopup';
import setResetPasswordPopup from '../apps/client/store/actions/setResetPasswordPopup';
import getArticles from '../apps/client/services/server/getArticles';
import getArticlesDiscussed from '../apps/client/services/server/getArticlesDiscussed';
import PropTypes from 'prop-types';
import getPhotoPosts from '../apps/client/services/server/getPhotoPosts';
import getVideoPosts from '../apps/client/services/server/getVideoPosts';
import getPages from '../apps/client/services/server/getPages';
import getArticlesByIdsFeatured from '../apps/client/services/server/getArticlesByIdsFeatured';
import setSubscriptionSuccessVerifiedPopup from '../apps/client/store/actions/setSubscriptionSuccessVerifiedPopup';

const Home = ({ articlesDiscussed, articles, photoPosts, videoPosts, votes, featuredArticles, featuredPosts }) => {
    const pages = useSelector(({ data }) => data.pages);
    const page = pages.find(page => page.pageId === 'main');
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!router.isReady) return;

        if (router.query?.['verify-token']) {
            verifyEmail({ token: router.query?.['verify-token'] }).then(() => {
                router.replace('/', undefined, { shallow: true }).then(() => {
                    dispatch(setSignInPopup(true));
                });
            });
        }

        if (router.query?.['subscription-token']) {
            verifySubscription({ token: router.query?.['subscription-token'], locale: router.locale }).then(() => {
                router.replace('/', undefined, { shallow: true }).then(() => {
                    dispatch(setSubscriptionSuccessVerifiedPopup(true));
                });
            });
        }

        if (router.query?.['restore-token']) {
            dispatch(setResetPasswordPopup(true));
        }
    }, [router.query]);

    return (
        <>
            {
                page &&
                <SEO
                    title={page.data[router.locale]?.seoTitle}
                    description={page.data[router.locale]?.seoDescription}
                    keywords={page.data[router.locale]?.seoKeywords}
                />
            }
            <MainPageContent
                page={page}
                articlesDiscussed={articlesDiscussed?.paginatedResults}
                articles={articles?.paginatedResults.slice(5)}
                articlesLast={articles?.paginatedResults.slice(0, 5)}
                photoPosts={photoPosts}
                videoPosts={videoPosts}
                votesList={votes}
                featuredArticles={featuredArticles || []}
                featuredPosts={featuredPosts || []}
            />
        </>
    );
};

const services = [
    getArticlesCategories,
    getAuthors,
    getPages,
    getArticlesDiscussed,
    getArticles,
    getPhotoPosts,
    getVideoPosts,
    getFeedArticles,
    getArticlesByIdsFeatured
];

export const getStaticProps = async context => getStaticPropsGenerator(context, services);

Home.propTypes = {
    articlesDiscussed: PropTypes.object,
    articles: PropTypes.object,
    photoPosts: PropTypes.object,
    videoPosts: PropTypes.object,
    votes: PropTypes.array,
    featuredArticles: PropTypes.array,
    featuredPosts: PropTypes.array
};

Home.defaultProps = {
    articlesDiscussed: { totalCount: 0, paginatedResults: [] },
    articles: { totalCount: 0, paginatedResults: [] },
    photoPosts: { totalCount: 0, paginatedResults: [] },
    videoPosts: { totalCount: 0, paginatedResults: [] },
    votes: null,
    featuredArticles: [],
    featuredPosts: []
};

export default Home;
