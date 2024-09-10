import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import FileBase64 from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from 'slice/PostSlice';
import Button from 'components/button';
import TextField from 'components/textField';

import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, FormControl, FormLabel, Typography, Stack, Divider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { AuthContext } from 'context/authContext';
import { toast } from 'react-toastify';

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
  addPostContainer: {
    height: '100vh',
    padding: theme.spacing(4),
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  addPostTitle: {
    width: '100%',
    textAlign: 'center',
    fontSize: 'clamp(2rem, 5vw, 2.5rem)',
    marginBottom: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

export const AddPost = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.post);
  const classes = useStyles();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    caption: '',
    date: null,
    description: '',
    image: '',
    email: user || '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, date: newDate });
  };

  const handleImageChange = (base64) => {
    setFormData({ ...formData, image: base64 });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(createPost(formData));

    if (createPost.fulfilled.match(result)) {
      toast.success(result.payload.message);
      navigate('/home');
    } else {
      console.error('Failed to create post:', result.payload);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack className={classes.addPostContainer}>
        <Card variant="outlined" className={classes.card}>
          <Typography component="h1" variant="h4" className={classes.addPostTitle}>
            New Post
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
          >
            <TextField
              id="caption"
              name="caption"
              label="Caption"
              placeholder="Enter a catchy caption"
              required
              value={formData.caption}
              onChange={handleInputChange}
            />

            <FormControl>
              <FormLabel htmlFor="date">Date</FormLabel>
              <DatePicker
                id="date"
                label="Post Date"
                value={formData.date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} id="date" name="date" label="Post Date" />}
              />
            </FormControl>

            <TextField
              id="description"
              name="description"
              label="Description"
              placeholder="Write something about your post"
              multiline
              rows={4}
              required
              value={formData.description}
              onChange={handleInputChange}
            />

            <FormControl>
              <FormLabel htmlFor="image">Upload Image</FormLabel>
              <FileBase64
                multiple={false}
                onDone={({ base64 }) => handleImageChange(base64)}
                accept="image/*"
              />
            </FormControl>

            <Button type="submit" fullWidth>
              {status === 'loading' ? 'Submitting...' : 'Add Post'}
            </Button>
          </Box>

          <Divider className={classes.divider} />

          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate('/home')}
          >
            Cancel
          </Button>
        </Card>
      </Stack>
    </LocalizationProvider>
  );
};

export default AddPost;
