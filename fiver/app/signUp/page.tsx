'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { FormControl , InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

import { FacebookIcon, GoogleIcon } from '@/app/muiCustomIcons/CustomIcons';

import useAuth from '@/app/hook/useAuth';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  profilePicture: File | string;
}

export default function SignUp() {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    password: '',
    role: '',
    profilePicture: ''
  });
  const [error, setError] = useState<string>('');
  const { apiCall, loading } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e: SelectChangeEvent<string>) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
    }
  };  
  
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
  
    const response = await apiCall('http://localhost:5000/signUP', formDataToSend, 'POST');
  
    if (response?.error) {
      setError(response.error || 'Sign Up failed');
      toast.error(`Sign Up Error: ${response.error}`);
      return;
    }
  
    toast.success('Sign Up successful!');
    setFormData({ name: '', email: '', password: '', role: '', profilePicture: '' });
    setError('');
  
    router.push('/signIn');
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Box sx={{ backgroundColor: 'white', padding: 4, borderRadius: 2, boxShadow: 3, width: '100%' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
        {error && <Typography color="error" align="center" sx={{ mb: 2 }}>{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              variant="outlined"
              required
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
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              variant="outlined"
              type="password"
              required
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                label="Role"
                required
              >
                <MenuItem value="Seller">Seller</MenuItem>
                <MenuItem value="Buyer">Buyer</MenuItem>
              </Select>
            </FormControl>
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
              >
                Upload Profile Picture
              </Button>
            </label>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ py: 1.5 }}
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
        <Typography align="center" sx={{ mt: 2 }}>
          Already have an account? <Button href="/signIn" variant="text">Log in</Button>
        </Typography>
        <Divider sx={{ my: 3 }}>or</Divider>
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
      </Box>
    </Container>
  );
}
