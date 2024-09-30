'use client';
import React, { useState, useCallback, useRef } from 'react';
import { TextField, Button, MenuItem, InputLabel, Select, FormControl, CircularProgress, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { useAppDispatch } from '@/app/redux/store';
import { createGig } from '@/app/redux/slice/gigSlice';

import withAuth from '@/app/components/ProtectedRoute';
import TextEditor from '@/app/components/TextEditor';

const PageContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, rgba(7, 18, 31, 1) 0%, rgba(0, 0, 0, 0.8) 100%)',
});

const FormContainer = styled(Paper)({
  padding: '40px',
  background: 'linear-gradient(135deg, rgba(30, 30, 30, 1) 0%, rgba(70, 70, 70, 1) 50%, rgba(30, 30, 30, 0.8) 100%)',
  color: 'white',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '600px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
  textAlign: 'center',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.02)',
  },
});

const StyledButton = styled(Button)({
  backgroundColor: '#007bff',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#0069d9',
  },
  fontWeight: 'bold',
});

const Title = styled(Typography)({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#f7f9fc',
  marginBottom: '30px',
});

const categories = [
  'Artificial Intelligence',
  'Machine Learning',
  'Data Science',
  'Web Development',
  'Mobile Development',
  'Cloud Computing',
  'DevOps',
  'Cybersecurity',
  'Blockchain',
];

const GigForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [gigTitle, setGigTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  
  const imageUploadRef = useRef<HTMLInputElement | null>(null);
  const videoUploadRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG/PNG/GIF).');
        return;
      }
      setImageFile(file);
    }
  }, []);

  const handleVideoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid video file (MP4/WebM/OGG).');
        return;
      }
      setVideoFile(file);
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', gigTitle);
    formData.append('category', category);
    formData.append('description', description);
    if (imageFile) formData.append('image', imageFile);
    if (videoFile) formData.append('video', videoFile);

    const response = await dispatch(createGig(formData));
    if (response.payload.message === 'Gig created successfully') {
      toast.success(response.payload.message);
      setLoading(false);
      router.push('/home');
    } else {
      toast.error('Gig creation failed');
      setLoading(false);
    }
  }, [dispatch, gigTitle, category, description, imageFile, videoFile, router]);

  return (
    <PageContainer>
      <FormContainer elevation={6}>
        <Title>Create a Gig</Title>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Gig Title"
            value={gigTitle}
            onChange={(e) => setGigTitle(e.target.value)}
            margin="normal"
            variant="filled"
            required
            sx={{ backgroundColor: '#fff', borderRadius: '10px', marginBottom: '20px' }}
          />
          <FormControl fullWidth margin="normal" sx={{ marginBottom: '20px' }}>
            <InputLabel variant="filled">Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ backgroundColor: '#fff', borderRadius: '10px' }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextEditor
            value={description}
            setValue={setDescription}
            placeholder="Enter the gig description here..."
            type="Gig"
          />
          <div style={{ marginTop: '20px' }}>
            <StyledButton
              variant="contained"
              fullWidth
              onClick={() => imageUploadRef.current?.click()}
            >
              Upload Image
            </StyledButton>
            <input
              type="file"
              ref={imageUploadRef}
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </div>
          {imageFile && (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Uploaded Image: {imageFile.name}
            </Typography>
          )}
          <div style={{ marginTop: '20px' }}>
            <StyledButton
              variant="contained"
              fullWidth
              onClick={() => videoUploadRef.current?.click()}
            >
              Upload Video (Optional)
            </StyledButton>
            <input
              type="file"
              ref={videoUploadRef}
              accept="video/*"
              hidden
              onChange={handleVideoUpload}
            />
          </div>

          {videoFile && (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Uploaded Video: {videoFile.name}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{
              backgroundColor: '#007bff',
              '&:hover': { backgroundColor: '#0069d9' },
              fontWeight: 'bold',
              marginTop: '30px',
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Gig'}
          </Button>
        </form>
      </FormContainer>
    </PageContainer>
  );
};

export default withAuth(GigForm);
