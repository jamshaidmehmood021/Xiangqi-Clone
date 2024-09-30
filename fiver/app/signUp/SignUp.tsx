'use client';
import { useState, ChangeEvent, FormEvent, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { CircularProgress } from '@mui/material';

import { FacebookIcon, GoogleIcon } from '@/app/muiCustomIcons/CustomIcons';

import useAuth from '@/app/hook/useAuth';
import Image from 'next/image';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  profilePicture: File | string;
}

const SignUp = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    password: '',
    role: '',
    profilePicture: ''
  });
  const [error, setError] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { apiCall, loading } = useAuth();
  const router = useRouter();

  const currentTab = 1;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    router.push(newValue === 0 ? '/signIn' : '/signUp');
  };

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
  }, []);

  const handleRoleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setFormData(prevData => ({ ...prevData, role: e.target.value }));
  }, []);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prevData => ({ ...prevData, profilePicture: file }));
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.role || !formData.profilePicture) {
      setError('All fields are required');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('role', formData.role);
    formDataToSend.append('profilePicture', formData.profilePicture);

    const response = await apiCall(`${process.env.NEXT_PUBLIC_BACKEND}/signUP`, formDataToSend, 'POST');

    if (response?.error) {
      setError(response.error || 'Sign Up failed');
      toast.error(`Sign Up Error: ${response.error}`);
      return;
    }

    toast.success('Sign Up successful!');
    setFormData({ name: '', email: '', password: '', role: '', profilePicture: '' });
    setImagePreview(null);
    setError('');

    router.push('/signIn');
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(7, 18, 31, 1) 0%, rgba(0, 0, 0, 0.8) 100%)'
    }}>
      <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', padding: 2 }}>
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(30, 30, 30, 1) 0%, rgba(70, 70, 70, 1) 50%, rgba(30, 30, 30, 0.8) 100%)',
            color: 'white',
            borderRadius: '16px',
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'scale(1.02)',
            }
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Tabs value={currentTab} onChange={handleTabChange} centered textColor="inherit">
              <Tab label="Log In" sx={{
                '&.Mui-selected': { fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'monospace' },
                '&:hover': { borderRadius: "5px", backgroundColor: '#f7f9fc', color: 'black' }
              }}
              />
              <Tab label="Sign Up" sx={{
                '&.Mui-selected': { fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'monospace' },
                '&:hover': { borderRadius: "5px", backgroundColor: '#f7f9fc', color: 'black' }
              }} />
            </Tabs>
          </Box>
          {error && <Typography variant="body2" color="error" sx={{ mb: 2 }}>{error}</Typography>}
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                variant="filled"
                required
                sx={{ background: 'white', borderRadius: '10px' }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                variant="outlined"
                type="email"
                required
                sx={{ background: 'white', borderRadius: '10px' }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                variant="filled"
                type="password"
                required
                sx={{ background: 'white', borderRadius: '10px' }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <select
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'white',
                  border: '1px solid lightgray',
                  color: 'black',
                }}
              >
                <option value="" disabled>Select Role</option>
                <option value="Seller">Seller</option>
                <option value="Buyer">Buyer</option>
              </select>
            </Box>
            <Box sx={{ mb: 3 }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="profilePicture"
              />
              <label htmlFor="profilePicture">
                <Button
                  component="span"
                  variant="outlined"
                  fullWidth
                  sx={{ borderColor: 'white', color: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                >
                  Upload Profile Picture
                </Button>
              </label>
              {imagePreview && (
                <Box sx={{ mt: 2 }}>
                  <Image
                    src={imagePreview}
                    alt="Profile Preview"
                    width={100}
                    height={100}
                    style={{ borderRadius: '4px', objectFit: 'cover' }}
                  />
                </Box>
              )}
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                mb: 2,
                borderRadius:'10px',
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
            </Button>
          </form>
          <Divider sx={{ my: 2 }}>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign up with Google')}
              startIcon={<GoogleIcon />}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Sign up with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign up with Facebook')}
              startIcon={<FacebookIcon />}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Sign up with Facebook
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}

export default SignUp;
