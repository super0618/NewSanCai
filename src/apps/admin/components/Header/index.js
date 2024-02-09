import React, { useState, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import routes from '../../constants/routes';

import Link from 'next/link';
import { useRouter } from 'next/router';

import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';

import { useDispatch } from 'react-redux';
import setAuthenticated from '../../store/actions/setAuthenticated';

import propOr from 'ramda/src/propOr';

import { ADMIN_PANEL_URL, TOKEN_LOCAL_STORAGE_NAME } from '../../constants/constants';

const useStyles = makeStyles({
    title: {
        flexGrow: 1
    },
    popper: {
        zIndex: 100
    },
    button: {
        textAlign: 'center'
    }
});

const Header = () => {
    const anchorEl = useRef();
    const dispatch = useDispatch();
    const [menuShowed, setMenuShowed] = useState(false);
    const classes = useStyles();
    const router = useRouter();

    const getHeaderTitle = () => {
        const match = routes.find(route => router.pathname === route.path);

        return propOr(<FormattedMessage id='header.thisPageDoesNotExist' />, 'title', match);
    };

    const handleToggle = () => {
        setMenuShowed(menuShowed => !menuShowed);
    };

    const handleClose = event => {
        if (anchorEl.current.contains(event.target)) {
            return;
        }

        setMenuShowed(false);
    };

    const handleLogout = () => {
        localStorage.setItem(TOKEN_LOCAL_STORAGE_NAME, '');
        dispatch(setAuthenticated(false));
    };

    return <AppBar position='static'>
        <Toolbar>
            <IconButton
                color='inherit'
                aria-label='Menu'
                onClick={handleToggle}
                ref={anchorEl}
            >
                <MenuIcon />
            </IconButton>
            <Popper open={menuShowed} anchorEl={anchorEl.current} className={classes.popper} transition>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList>
                                    {routes.map((route, i) => {
                                        if (route.notMenu) {
                                            return null;
                                        }
                                        return <Link href={route.path} key={i}>
                                            <MenuItem onClick={handleClose}>{route.title}</MenuItem>
                                        </Link>;
                                    })}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
            <Typography variant='h6' color='inherit' className={classes.title}>
                {getHeaderTitle()}
            </Typography>
            <Link href={`${ADMIN_PANEL_URL}/credentials`}>
                <Button color='inherit' className={classes.button}><FormattedMessage id='changeCredentials' /></Button>
            </Link>
            <Button color='inherit' onClick={handleLogout}><FormattedMessage id='goOut' /></Button>
        </Toolbar>
    </AppBar>;
};

export default Header;
