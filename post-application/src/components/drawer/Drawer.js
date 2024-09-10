import React, { useContext, useState, memo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTheme, useMediaQuery } from '@mui/material';
import { makeStyles } from '@material-ui/core';
import { Drawer, Typography, Divider } from '@material-ui/core';
import InstagramIcon from '@mui/icons-material/Instagram';
import { List, ListItem, ListItemIcon,ListItemText} from '@material-ui/core';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { AuthContext } from 'context/authContext';

const drawerWidth = 200;
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', 
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    icon: {
        marginRight: '10px',
        color: '#e7133b',
    },
    titleContainer: {
        display: 'flex',
        alignItems: 'center',
        padding: '20px',
    },
    title: {
        color: '#E4405F',
    },
    active: {
        background: '#f4f4f4',
    },
    list: {
        marginTop: '100px',
    },
    listItem: {
        marginBottom: '20px',
    },
}));

const DrawerComponent = memo(({ children }) => {
    const customClasses = useStyles();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false);

    const handleDrawerToggle = useCallback(() => {
        setOpen(prevOpen => !prevOpen);
    }, []);

    const menuItems = [
        {
            text: 'Home',
            icon: <HomeIcon sx={{ color: '#000000' }} />,
            path: '/home',
            showWhenLoggedIn: true,
        },
        {
            text: 'Login',
            icon: <LoginIcon sx={{ color: '#000000' }} />,
            path: '/',
            showWhenLoggedOut: true,
        },
        {
            text: 'Sign Up',
            icon: <HowToRegIcon sx={{ color: '#000000' }} />,
            path: '/signup',
            showWhenLoggedOut: true,
        },
        {
            text: 'Add Post',
            icon: <AddCircleOutlineIcon sx={{ color: '#000000' }} />,
            path: '/addPost',
            showWhenLoggedIn: true,
        },
        {
            text: 'Log Out',
            icon: <LogoutIcon sx={{ color: '#000000' }} />,
            onClick: logout,
            showWhenLoggedIn: true,
        },

    ];
    return (
        <div className={customClasses.root}>
            {isMobile && (
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleDrawerToggle}
                    style={{ margin: 16 }}
                >
                    <MenuIcon />
                </IconButton>
            )}
            <Drawer
               className={customClasses.drawer}
               classes={{ paper: customClasses.drawerPaper }}
               variant={isMobile ? 'temporary' : 'permanent'}
               anchor="left"
               open={isMobile ? open : true}
               onClose={() => isMobile && setOpen(false)}
            >
                <div>
                    <div className={customClasses.titleContainer}>
                        <InstagramIcon fontSize="large" className={customClasses.icon} />
                        <Typography variant="h5" className={customClasses.title}>
                            Instagram
                        </Typography>
                    </div>

                    <List className={customClasses.list}>
                        {menuItems
                            .filter(item => (item.showWhenLoggedOut && !user) || (item.showWhenLoggedIn && user))
                            .map(item => (
                                <ListItem
                                    button
                                    key={item.text}
                                    onClick={() => item.onClick ? item.onClick() : navigate(item.path)}
                                    className={`${location.pathname === item.path ? customClasses.active : ''} ${customClasses.listItem}`}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItem>
                            ))}
                    </List>
                </div>
                {user && (
                    <>
                        <Divider />
                        <List>
                            <ListItem
                                button
                                onClick={() => navigate(`/profile/${user}`)}
                                className={customClasses.profileMenu}
                            >
                                <ListItemIcon>
                                    <AccountCircleIcon sx={{ color: '#000000' }} />
                                </ListItemIcon>
                                <ListItemText primary="Profile" />
                            </ListItem>
                        </List>
                    </>
                )}
            </Drawer>

            <div className={customClasses.page}>
                {children}
            </div>
        </div>
    );
});

DrawerComponent.propTypes = {
    children: PropTypes.node,
  };
  
export default DrawerComponent;
