'use client';
import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import { AuthContext } from '@/app/context/authContext';
import useAuth from  '@/app/hook/useAuth';

const pages = ['Sign In', 'Sign Up'];
const settings = ['Profile', 'Dashboard', 'Logout'];

const Navbar = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext is not available");
  }

  const { token, user, userID, setUserRole, profilePicture, setProfilePicture, logout } = authContext;

  const { apiCall} = useAuth();
  const router = useRouter();
  
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (userID) {
        const response = await apiCall(`http://localhost:5000/user/${userID}`, undefined, 'GET', token);
        if (response?.data?.profilePicture) {
          setProfilePicture(response.data.profilePicture);
        }
        if (response?.data?.role) {
          setUserRole(response.data.role);
        }
      }
    };

    fetchUserData();
  }, [userID]);

  const pagesNavigation = (page: string) => {
    if (page === 'Sign Up') {
      router.push('/signUp');
    } else if (page === 'Sign In') {
      router.push('/signIn');
    }else if (page === 'Profile') {
      router.push('/profile');
    }else if (page === 'Dashboard') {
      router.push('/dashboard');
    }else if (page === 'Logout') {
      logout();
    }
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            Fiver Lite
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={() => pagesNavigation('')}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => pagesNavigation(page)}>
                  <Typography sx={{ textAlign: 'center', color: 'black', fontFamily: 'monospace' }}>
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            Fiver Lite
          </Typography>

          {!user && 
           <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, marginLeft: 'auto' }}>
             {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => pagesNavigation(page)} 
                  sx={{ my: 2, color: 'black', display: 'block', marginLeft: '70px' }}
                >
                  {page}
                </Button>
              ))}
            </Box>
          }

          {user && 
           <Box sx={{ flexGrow: 0, ml: 'auto' }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar 
                  alt="Missing Avtar" 
                  src={profilePicture as string}
                /> 
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center', color: 'black' }} 
                   onClick={() => pagesNavigation(setting)} >
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          }
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
