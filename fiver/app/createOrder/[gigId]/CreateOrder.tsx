'use client';

import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { selectGigById } from '@/app/redux/slice/gigSlice';
import { fetchOrdersByGigAndUserId } from '@/app/redux/slice/orderSlice';
import { Gig } from '@/app/redux/slice/gigSlice';
import { AuthContext } from '@/app/context/authContext';
import withAuth from '@/app/components/ProtectedRoute';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import UploadIcon from '@mui/icons-material/Upload';

const CreateOrder = ({ params }: { params: { gigId: string } }) => {
  const [amount, setAmount] = useState(0);
  const [deadline, setDeadline] = useState('');
  const [orderFound, setOrderFound] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState(''); 
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { gigId } = params;
  const gig: Gig | undefined = useAppSelector((state) => selectGigById(state, Number(gigId)));
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext is not available');
  }

  const { userID, token } = authContext;
  const buyerId = userID;
  const sellerId = gig?.userId;

  useEffect(() => {
    const fetchOrder = async () => {
      const result = await dispatch(fetchOrdersByGigAndUserId({ gigId: Number(gig?.id), userId: Number(userID) }));
      if (result.payload !== 'No orders found for this buyer and gig combination.') {
        toast.error('You already have an active order on this gig.');
        setOrderFound(true);
      }
    };
    fetchOrder();
  }, [gig, dispatch, userID]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }

    try {
      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/uploadFile`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadData.message || 'File upload failed');
      }

      const uploadedFileName = uploadData.fileName; 

      const orderData = {
        gigId,
        buyerId,
        sellerId,
        amount,
        deadline,
        file: uploadedFileName, 
      };

      localStorage.setItem('orderData', JSON.stringify(orderData));
      router.push(`/payment/${amount}`);

    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(7, 18, 31, 1) 0%, rgba(0, 0, 0, 0.8) 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            minHeight: '400px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(30, 30, 30, 1) 0%, rgba(70, 70, 70, 1) 50%, rgba(30, 30, 30, 0.8) 100%)',
            color: 'white',
            borderRadius: '16px',
            width: '100%', 
            maxWidth: '500px', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3,
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'scale(1.02)',
            },
          }}
        >

          <Typography variant="h4" gutterBottom>
            Create an Order
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <TextField
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                variant="filled"
                fullWidth
                required
                sx={{ background: 'white', borderRadius: '10px', maxWidth: '400px' }}
              />
            </Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <TextField
                label="Deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                variant="filled"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ background: 'white', borderRadius: '10px', maxWidth: '400px' }}
              />
            </Box>

            <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip,.mp4" 
                style={{ display: 'none' }}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<UploadIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #ff4081 30%, #ff80ab 90%)',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #ff4081 20%, #f50057 80%)',
                    },
                  }}
                >
                  {fileName ? `Change File (${fileName})` : 'Upload File'}
                </Button>
              </label>
              {fileName && (
                <Typography variant="caption" sx={{ color: 'white', mt: 1 }}>
                  {fileName}
                </Typography>
              )}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={orderFound}
              sx={{ mb: 2, borderRadius: '10px', maxWidth: '400px' }}
            >
              {orderFound ? <CircularProgress size={24} color="inherit" /> : 'Place Order'}
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default withAuth(CreateOrder);
