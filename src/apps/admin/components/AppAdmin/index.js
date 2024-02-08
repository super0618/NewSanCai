import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';
import setAdmin from '../../store/actions/setAdmin';
import setToken from '../../store/actions/setToken';
import setAuthenticated from '../../store/actions/setAuthenticated';

import getProfile from '../../services/getProfile';
import { useRouter } from 'next/router';

import Header from '../Header';
import SignIn from '../SignIn';
import Recovery from '../Recovery';
import CircularProgress from '@material-ui/core/CircularProgress';

import isNil from 'ramda/src/isNil';

import { RECOVERY_URL, ADMIN_LOCALE, TOKEN_LOCAL_STORAGE_NAME } from '../../constants/constants';
import { IntlProvider } from 'react-intl';

import translations from '../../translations';
import Notifications from '../Notifications';

const AppAdmin = ({ Component, pageProps }) => {
    const authenticated = useSelector(({ application }) => application.authenticated);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_LOCAL_STORAGE_NAME);

        getProfile(token)
            .then(({ admin }) => {
                dispatch(setToken(token));
                dispatch(setAdmin(admin));
                dispatch(setAuthenticated(true));
            })
            .catch(() => {
                dispatch(setAuthenticated(false));
            });
    }, []);

    const getCurrentComponent = () => {
        if (router.asPath.indexOf(RECOVERY_URL) === 0) {
            return <Recovery />;
        }

        if (isNil(authenticated)) {
            return <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <CircularProgress />
            </div>;
        }

        if (!authenticated) {
            return <SignIn />;
        }

        return <main>
            <Header />
            <Notifications />
            <Component {...pageProps} />
        </main>;
    };

    return <IntlProvider locale={ADMIN_LOCALE} messages={translations[ADMIN_LOCALE]} textComponent={Fragment}>
        {getCurrentComponent()}
    </IntlProvider>;
};

AppAdmin.propTypes = {
    Component: PropTypes.func,
    pageProps: PropTypes.object
};

export default AppAdmin;
