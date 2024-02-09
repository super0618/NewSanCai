import React from 'react';

import RecoveryRequestForm from '../RecoveryRequestForm/';
import RecoveryForm from '../RecoveryForm';

import { makeStyles } from '@material-ui/core/styles';

import { useRouter } from 'next/router';

const useStyles = makeStyles({
    root: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const Recovery = () => {
    const router = useRouter();
    const { query } = router;
    const recoveryToken = query['recovery-token'];
    const email = query.email;
    const classes = useStyles();

    return <div className={classes.root}>
        {!recoveryToken ? <RecoveryRequestForm /> : <RecoveryForm token={recoveryToken} email={email} />}
    </div>;
};

export default Recovery;
