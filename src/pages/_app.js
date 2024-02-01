import PropTypes from 'prop-types';

import { Provider } from 'react-redux';
import { useRouter } from 'next/router';

import dynamic from 'next/dynamic';

import '../apps/client/styles/app.css';

import { ADMIN_PANEL_URL } from '../apps/admin/constants/constants';

import AppClient from '../apps/client/components/AppClient';

import { useStore as useClientStore } from '../apps/client/store/store';
import { useStore as useAdminStore } from '../apps/admin/store/store';

// GLOBAL STYLES
import 'react-h5-audio-player/src/styles.scss';

const AppAdmin = dynamic(() => import('../apps/admin/components/AppAdmin'), { ssr: false });

const adminUrlRegex = new RegExp(`^${ADMIN_PANEL_URL}`);

const App = ({ Component, pageProps }) => {
    const { props = {}, actions = [], otherPageProps } = pageProps;
    const router = useRouter();
    const isAdminPanel = adminUrlRegex.test(router.pathname);
    const CurrentApp = isAdminPanel ? AppAdmin : AppClient;
    const useStore = isAdminPanel ? useAdminStore : useClientStore;
    const store = useStore({}, actions);

    return <Provider store={store}>
        <CurrentApp Component={Component} pageProps={{ ...otherPageProps, ...props }} />
    </Provider>;
};

App.propTypes = {
    Component: PropTypes.func,
    pageProps: PropTypes.object
};

export default App;
