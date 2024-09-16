'use client';
import React, { useState } from 'react';
import { TextField, Button, MenuItem, InputLabel, Select, FormControl } from '@mui/material';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';

import { useAppDispatch } from '@/app/redux/store';
import { createGig } from '@/app/redux/slice/gigSlice';
import { useRouter } from 'next/navigation';

const PageContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f0f0f0',
  padding: '10px',
});

const FormContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '500px',
  padding: '30px',
  borderRadius: '10px',
  backgroundColor: '#f9f9f9',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const StyledButton = styled(Button)({
  backgroundColor: '#4caf50',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#45a049',
  },
  marginBottom: '16px',
});

const Title = styled('h2')({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '20px',
});

const VideoInput = styled('input')({
  display: 'none',
});

const GigForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [gigTitle, setGigTitle] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const categories = ['AI', 'ML', 'Data Science', 'Web Development', 'Mobile Apps', 'Cloud', 'DevOps'];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', gigTitle);
    formData.append('category', category);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    if (videoFile) {
      formData.append('video', videoFile);
    }

    const response = await dispatch(createGig(formData));
    if (response.payload.message === 'Gig created successfully') {
      toast.success(response.payload.message);
      router.push('/');
    } else {
      toast.error('Gig creation failed');
    }
  };

  return (
    <PageContainer>
      <FormContainer>
        <Title>Create a Gig</Title>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Gig Title"
            value={gigTitle}
            onChange={(e) => setGigTitle(e.target.value)}
            margin="normal"
            sx={{ backgroundColor: '#fff', borderRadius: '5px' }}
          />

          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                sx={{ backgroundColor: '#fff', borderRadius: '5px' }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <label htmlFor="image-upload">
            <StyledButton variant="contained" component="span" fullWidth>
              Upload Image
            </StyledButton>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </label>

          <label htmlFor="video-upload">
            <StyledButton variant="contained" component="span" fullWidth>
              Upload Video (Optional)
            </StyledButton>
            <VideoInput
              type="file"
              id="video-upload"
              accept="video/*"
              onChange={handleVideoUpload}
            />
          </label>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0069d9' } }}
          >
            Create Gig
          </Button>
        </form>
      </FormContainer>
    </PageContainer>
  );
};

export default GigForm;
