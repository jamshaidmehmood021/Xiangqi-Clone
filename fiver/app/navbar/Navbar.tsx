'use client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import { AuthContext } from '@/app/context/authContext';
import useAuth from '@/app/hook/useAuth';

const Navbar = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is not available");
  }
  const { user, role, userID, setUserRole, profilePicture, setProfilePicture, logout } = authContext || {};

  const router = useRouter();
  const { apiCall } = useAuth();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const fetchUserData = useCallback(async () => {
    if (userID) {
      try {
        const response = await apiCall(`${process.env.NEXT_PUBLIC_BACKEND}/user/${userID}`, undefined, 'GET');
        if (response?.data) {
          setProfilePicture(response.data.profilePicture);
          setUserRole(response.data.role);
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    }
  }, [userID, apiCall, setProfilePicture, setUserRole]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleOpenUserMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  }, []);

  const handleCloseUserMenu = useCallback(() => {
    setAnchorElUser(null);
  }, []);

  const pagesNavigation = useCallback((page: string) => {
    switch (page) {
      case 'Home':
        router.push('/home');
        break;
      case 'Profile':
        router.push(`/profile/${userID}`);
        break;
      case 'Dashboard':
        router.push('/dashboard');
        break;
      case 'Your Orders':
        router.push(`/orders/${userID}`);
        break;
      case 'Logout':
        logout();
        break;
      default:
        break;
    }
  }, [router, userID, logout]);

  const handleCreateGig = () => {
    router.push('/gigs');
  };

  const settings = useCallback(() => {
    if (role === 'Admin') {
      return ['Dashboard', 'Logout'];
    }
    return ['Home', 'Profile', 'Your Orders', 'Logout'];
  }, [role]);

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
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
              {role === 'Seller' && (
                <Button
                  onClick={handleCreateGig}
                  sx={{ my: 2, marginRight: '20px', backgroundColor: '#004225', color: 'white' }}
                >
                  Create Gig
                </Button>
              )}
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Profile Picture" src={profilePicture as string} />
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
                {settings().map((setting) => (
                  <MenuItem key={setting} onClick={() => pagesNavigation(setting)}>
                    <Typography sx={{ textAlign: 'center', color: 'black' }}>
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
