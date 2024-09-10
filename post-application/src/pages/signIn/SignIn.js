import React, { useState, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import { Checkbox, FormControlLabel, Divider, Typography, Stack, Card } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import useAuth from 'hook/useAuth';
import { AuthContext } from 'context/authContext';

import Button from 'components/button';
import TextField from 'components/textField';
import { FacebookIcon, GoogleIcon } from 'muiCustomIcons/CustomIcons';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(3),
    margin: 'auto',
    maxWidth: '450px',
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[5],
  },
  signInContainer: {
    height: '100vh',
    padding: theme.spacing(4),
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  signInTitle: {
    width: '100%',
    textAlign: 'center',
    fontSize: 'clamp(2rem, 5vw, 2.5rem)',
    marginBottom: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(1),
  },
  signInButton: {
    borderRadius: theme.shape.borderRadius * 2,
    fontWeight: 'bold',
    padding: theme.spacing(1.5),
  },
  link: {
    fontWeight: 'bold',
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
  socialButton: {
    borderRadius: theme.shape.borderRadius * 2,
    fontWeight: 'bold',
    padding: theme.spacing(1.5),
  },
}));

const SignIn = () => {
  const classes = useStyles();
  const { setUser, setName, setUserID } = useContext(AuthContext);
  const navigate = useNavigate();
  const { apiCall } = useAuth();

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNavigation = useCallback(() => {
    navigate('/home');
  }, [navigate]);

  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const email = data.get('email');
      const password = data.get('password');

      setEmailError('');
      setPasswordError('');

      if (!email) {
        setEmailError('Email is required.');
        return;
      }

      if (!password) {
        setPasswordError('Password is required.');
        return;
      }

      setLoading(true);

      try {
        const response = await apiCall('/login', { email, password });

        if (response && response.token) {
          const decodedToken = jwtDecode(response.token);
          localStorage.setItem('Token', response.token);
          setUser(decodedToken.email);
          setName(decodedToken.name);
          setUserID(decodedToken.id);
          toast.success('Login successful!');
          handleNavigation();
        } else {
          toast.error(response.message || 'Login failed.');
        }
      } catch (error) {
        toast.error('An error occurred. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [apiCall, setUser, setName, setUserID, handleNavigation]
  );

  return (
    <Stack className={classes.signInContainer}>
      <Card variant="outlined" className={classes.card}>
        <Typography component="h1" variant="h4" className={classes.signInTitle}>
          Sign in
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
          <TextField
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="your@email.com"
            autoFocus
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="••••••"
            error={!!passwordError}
            helperText={passwordError}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
            sx={{ marginBottom: 2 }}
          />
          <Button type="submit" fullWidth variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Sign in'}
          </Button>
          <Typography sx={{ textAlign: 'center', marginTop: 2 }}>
            Don&apos;t have an account? <Link to="/signup" className={classes.link}>Sign up</Link>
          </Typography>
        </Box>
        <Divider className={classes.divider}>or</Divider>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert('Sign in with Google')}
            startIcon={<GoogleIcon />}
          >
            Sign in with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert('Sign in with Facebook')}
            startIcon={<FacebookIcon />}
          >
            Sign in with Facebook
          </Button>
        </Box>
      </Card>
    </Stack>
  );
};

export default SignIn;
