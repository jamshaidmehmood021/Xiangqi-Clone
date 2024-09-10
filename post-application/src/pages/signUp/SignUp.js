import React, { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import { Checkbox, FormControlLabel, Divider, Typography, Stack, Card } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress'; // For loading spinner

import { GoogleIcon, FacebookIcon } from 'muiCustomIcons/CustomIcons';
import useAuth from 'hook/useAuth';
import { toast } from 'react-toastify';

import Button from 'components/button';
import TextField from 'components/textField';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[5],
    [theme.breakpoints.up('sm')]: {
      width: '450px',
    },
  },
  signUpContainer: {
    height: '100vh',
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    width: '100%',
    fontSize: 'clamp(2rem, 10vw, 2.15rem)',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  button: {
    borderRadius: theme.shape.borderRadius,
    fontWeight: 'bold',
  },
  dividerText: {
    color: theme.palette.text.secondary,
  },
  socialButton: {
    borderRadius: theme.shape.borderRadius,
    fontWeight: 'bold',
  },
}));

const SignUp = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { apiCall, error } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const getFormData = useCallback((event) => {
    const data = new FormData(event.currentTarget);
    return {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
    };
  }, []);

  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (loading) return; 
      setLoading(true);

      const formData = getFormData(event);

      try {
        const response = await apiCall('/signup', formData);

        if (response && response.error === false) {
          toast.success('Sign up successful!');
          navigate('/');
        } else {
          toast.error(response.message || 'Sign up failed.');
        }
      } catch (error) {
        toast.error('An error occurred. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [apiCall, navigate, getFormData, loading] 
  );

  const handleGoogleSignUp = useCallback(() => {
    alert('Sign up with Google');
  }, []);

  const handleFacebookSignUp = useCallback(() => {
    alert('Sign up with Facebook');
  }, []);

  return (
    <Stack className={classes.signUpContainer}>
      <Card className={classes.card} variant="outlined">
        <Typography component="h1" variant="h4" className={classes.title}>
          Sign up
        </Typography>
        <Box component="form" onSubmit={onSubmit} className={classes.form}>
          <TextField
            id="name"
            name="name"
            label="Full name"
            placeholder="Jon Snow"
            autoComplete="name"
          />
          <TextField
            id="email"
            name="email"
            label="Email"
            placeholder="your@email.com"
            autoComplete="email"
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            placeholder="••••••"
            autoComplete="new-password"
          />
          <FormControlLabel
            control={<Checkbox value="allowExtraEmails" color="primary" />}
            label="I want to receive updates via email."
          />
          <Button type="submit" fullWidth variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign up'}
          </Button>
          <Typography sx={{ textAlign: 'center' }}>
            Already have an account? <Link to="/" style={{ fontWeight: 'bold' }}>Sign in</Link>
          </Typography>
        </Box>
        <Divider className={classes.divider}>or</Divider>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleSignUp}
            startIcon={<GoogleIcon />}
          >
            Sign up with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleFacebookSignUp}
            startIcon={<FacebookIcon />}
          >
            Sign up with Facebook
          </Button>
        </Box>
      </Card>
    </Stack>
  );
};

export default SignUp;
