'use client';
import { useState, ChangeEvent, FormEvent, useContext } from 'react';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

import { FacebookIcon, GoogleIcon } from '@/app/muiCustomIcons/CustomIcons';

import useAuth from '@/app/hook/useAuth';
import { AuthContext } from '@/app/context/authContext';

interface SignInFormData {
  email: string;
  password: string;
}

interface DecodedToken {
  email: string;
  name: string;
  id: string;
}

export default function SignIn() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext is not available"); 
  }

  const { setUser, setName, setUserID,setToken } = authContext;

  const [formData, setFormData] = useState<SignInFormData>({ email: '', password: '' });
  const [error, setError] = useState<string>('');
  const { apiCall, loading } = useAuth();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    const response = await apiCall('http://localhost:5000/login', formData); 

    if (response?.error) {
      setError(response.error);
      toast.error(`Login Error: ${response.error}`);
    } else if (response?.data?.token) {
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      const decodedToken = jwtDecode<DecodedToken>(response.data.token);
      setUser(decodedToken.email);
      setName(decodedToken.name);
      setUserID(decodedToken.id);
      toast.success('Login successful!');
      setFormData({ email: '', password: '' });
      setError('');
      router.push('/home');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={6} sx={{ padding: 4, width: '100%', textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sign In
        </Typography>
        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
              autoComplete="email"
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
              autoComplete="current-password"
            />
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </form>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Don not have an account?
          <Link href="/signUp" passHref>
            <Button variant="text" color="primary">
              Sign up
            </Button>
          </Link>
        </Typography>

        <Divider sx={{ my: 2 }}>or</Divider>

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
      </Paper>
    </Container>
  );
}
