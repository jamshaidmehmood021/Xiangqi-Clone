'use client';
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Typography, Container, Tabs, Tab, Divider, Grid, Card, CardContent, Avatar, IconButton, Button } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { Flag, Edit, Delete } from '@mui/icons-material';
import { Image } from 'antd';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { fetchGigsByUserId, deleteGig } from '@/app/redux/slice/gigSlice';
import { fetchAverageRating } from '@/app/redux/slice/ratingSlice';

import useAuth from '@/app/hook/useAuth';
import { AuthContext } from '@/app/context/authContext';

import Stars from '@/app/components/Stars';
import withAuth from '@/app/components/ProtectedRoute';

const GigCard = React.memo(styled(Card)`
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease-in-out;
  border-radius: 8px;

  &:hover {
    transform: scale(1.05);
  }
`);

const CardContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const UserDetails = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const GigAvatar = styled(Avatar)`
  width: 40px;
  height: 40px;
  margin-right: 1rem;
`;

const Description = styled(Typography)`
  margin-top: 0.15rem;
  color: #555;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const useStyles = makeStyles((theme) => ({
  profileContainer: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(4),
    backgroundColor: '#f2f2f2',
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3),
    backgroundColor: '#ffffff',
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(4),
    boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
  },
  avatar: {
    marginRight: theme.spacing(3),
    border: `3px solid ${theme.palette.primary.main}`, 
    borderRadius: '50%',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  tabsContainer: {
    marginTop: theme.spacing(4),
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(1),
  },
  noGigsMessage: {
    textAlign: 'center',
    marginTop: '2rem',
    color: '#888',
    fontStyle: 'italic',
  },
}));

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture: string;
}

interface Gig {
  id: string;
  image: string;
  title: string;
  category: string;
  user: User;
  description: string;
}

const Profile = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext is not available");
  }

  const averageRating = useAppSelector((state) => state.ratings.averageRating); 

  const { token } = authContext;
  const { apiCall } = useAuth();
  const { id } = params;

  const [user, setUser] = useState<User|null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [gigs, setGigs] = useState<Gig[]>([]);

  const memoizedApiCall = useCallback(apiCall, [token,apiCall]);

  useEffect(() => {
    const fetchData = async () => {
      let response: any;
      try {
        if (id) {
          response = await memoizedApiCall(`${process.env.NEXT_PUBLIC_BACKEND}/user/${id}`, undefined, 'GET', token);
          if (response && response.data) {
            setUser(response.data);
          }
        }
        const result = await dispatch(fetchGigsByUserId(id));

        if (fetchGigsByUserId.fulfilled.match(result)) {
          setGigs(result.payload);
        }

        await dispatch(fetchAverageRating({ userId: Number(id), role: response.data.role }));
      } catch (error) {
        console.log(error);
        toast.error('An unexpected error occurred');
      }
    };

    fetchData();
  }, [id, memoizedApiCall, dispatch, token]);

  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  }, []);

  const handleDelete = useCallback(async (gigId: string) => {
    try {
      const result = await dispatch(deleteGig(gigId));

      if (deleteGig.fulfilled.match(result)) {
        toast.success('Gig deleted successfully');
        setGigs((prevGigs) => prevGigs.filter((gig) => gig.id !== gigId));
      } else {
        throw new Error('Failed to delete gig');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the gig');
    }
  }, [dispatch]);

  return (
    <Container className={classes.profileContainer} maxWidth="md">
      <div className={classes.profileHeader}>
        {user && (
          <>
            <Image
              className={classes.avatar}
              style={{ width: 150, height: 150 }}
              alt="Profile Avatar"
              src={user.profilePicture}
            />
            <div className={classes.profileInfo}>
              <Typography variant="h4" style={{ fontWeight: 'bold', color: '#333' }}>
                {user.name}
                <Flag style={{ marginLeft: 8 }} />
              </Typography>
              <Typography variant="body1" style={{ color: '#555' }}>{user.email}</Typography>
              <Typography variant="body1" style={{ color: '#555' }}>Role: {user.role}</Typography>

              <Typography variant="body1" style={{ marginTop: '1rem' }}>
                <Stars averageRating={averageRating} /> 
              </Typography>
            </div>
          </>
        )}
      </div>
      <Divider />
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        className={classes.tabsContainer}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Gigs" />
      </Tabs>
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {gigs.length > 0 ? (
            gigs.map((gig: Gig) => (
              <Grid item xs={12} sm={6} md={4} key={gig.id}>
                <GigCard>
                  {gig.image && (
                    <Image
                      width="100%"
                      height={150}
                      alt="Gig Image"
                      src={gig.image as string}
                      style={{ borderRadius: '8px 8px 0 0' }}
                    />
                  )}
                  <CardContent>
                    <CardContentWrapper>
                      <UserDetails>
                        <GigAvatar src={gig.user.profilePicture} alt={gig.user.name} />
                        <div>
                          <Typography variant="h6" style={{ fontWeight: 'bold', color: '#333' }}>{gig.title}</Typography>
                          <Typography color="textSecondary">{gig.category}</Typography>
                          <Typography variant="body2" color="textSecondary">Owner: {gig.user.name}</Typography>
                        </div>
                      </UserDetails>
                      <Description>
                          {gig.description && gig.description.length > 30
                            ? `${gig.description.substring(0, 20)}... `
                            : gig.description || 'No description available.'
                          }
                          {gig.description && gig.description.length > 30 && (
                            <Button
                              onClick={() => router.push(`/gigDetail/${gig.id}`)}
                              sx={{ textTransform: 'none', padding: 0, color: '#ff5722' }} 
                            >
                              Show More
                            </Button>
                          )}
                      </Description>
                    </CardContentWrapper>
                  </CardContent>
                  <div className={classes.cardActions}>
                    <IconButton onClick={() => handleDelete(gig.id)}>
                      <Delete />
                    </IconButton>
                    <IconButton onClick={() => router.push(`/editGigs/${gig.id}`)}>
                      <Edit />
                    </IconButton>
                  </div>
                </GigCard>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" className={classes.noGigsMessage}>
              No gigs found.
            </Typography>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default withAuth(Profile);
