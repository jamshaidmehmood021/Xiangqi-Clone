'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TextField, Button, MenuItem, InputLabel, Select, FormControl, CircularProgress, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import withAuth from '@/app/components/ProtectedRoute';
import TextEditor from '@/app/components/TextEditor';

import { updateGig } from '@/app/redux/slice/gigSlice';
import { useAppDispatch, useAppSelector } from '@/app/redux/store';
import { selectGigById } from '@/app/redux/slice/gigSlice';

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

const Video = styled('video')({
  width: '30%', 
  height: '30%', 
  borderRadius: '12px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
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

const EditGig = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [gigTitle, setGigTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const { id } = params;
  const gig: any = useAppSelector((state) => selectGigById(state, Number(id)));


  const bufferToString = (buffer: { data: number[] }): string => {
    return String.fromCharCode(...buffer.data);
  };

  useEffect(() => {
    if (gig) {
      setGigTitle(gig.title);
      setCategory(gig.category);
      setDescription(gig.description ? gig.description : '');
      if (gig.image) setImageFileName(gig.image ? gig.image.split('/').pop() || '' : '');
      if (gig.video) {
        setVideoPreview(gig.video && typeof gig.video === 'object' ? bufferToString(gig.video) : gig.video);
      }   
    }
  }, [gig]);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageFileName(file.name);
    }
  }, []);

  const handleVideoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('title', gigTitle);
    formData.append('category', category);
    formData.append('description', description);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    if (videoFile) {
      formData.append('video', videoFile);
    }

    const response = await dispatch(updateGig({ id: Number(id), formData }));

    if (response.payload.message === "Gig updated successfully") {
      toast.success('Gig updated successfully');
      router.push('/home');
    } else {
      toast.error('Gig update failed');
    }

    setLoading(false);
  }, [dispatch, gigTitle, category, description, imageFile, videoFile, router, id]);

  return (
    <PageContainer>
      <FormContainer elevation={6}>
        <Title>Edit Gig</Title>
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

          <label htmlFor="image-upload">
            <StyledButton variant="contained" fullWidth sx={{ mb: 2, mt: 2 }} onClick={() => imageInputRef.current?.click()}>
              Upload Image
            </StyledButton>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              hidden
              ref={imageInputRef}
              onChange={handleImageUpload}
            />
          </label>

          {imageFileName && (
            <Typography variant="body1">
              Image : {imageFileName}
            </Typography>
          )}

          <label htmlFor="video-upload">
            <StyledButton variant="contained" fullWidth sx={{ mb: 2, mt: 2 }} onClick={() => videoInputRef.current?.click()}>
              Upload Video
            </StyledButton>
            <input
              type="file"
              id="video-upload"
              accept="video/*"
              hidden
              ref={videoInputRef}
              onChange={handleVideoUpload}
            />
          </label>

          {videoPreview && (
            <Video controls>
              <source src={videoPreview} type="video/mp4" />
            </Video>
          )}

          <StyledButton type="submit" fullWidth sx={{ mt: 3 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Gig'}
          </StyledButton>
        </form>
      </FormContainer>
    </PageContainer>
  );
};

export default withAuth(EditGig);
