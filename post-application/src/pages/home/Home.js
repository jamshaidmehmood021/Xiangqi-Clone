import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, CircularProgress, Typography } from '@mui/material';
import { Bars } from 'react-loading-icons';

import Post from 'pages/post';  
import { fetchPosts } from 'slice/PostSlice'; 

const Home = () => {
    const dispatch = useDispatch();
    const { posts, status, error } = useSelector((state) => state.post);  

    useEffect(() => {
        dispatch(fetchPosts());  
    }, [dispatch]);

    if (status === 'loading') {
        return (
            <Container maxWidth="sm" sx={{ paddingTop: 2, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ paddingTop: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ paddingTop: 2 }}>
            {posts.length > 0 ? (
                posts.map((post, index) => (
                    <Post key={index} post={post} />
                ))
            ) : (
                <Bars stroke="#98ff98"/>
            )}
        </Container>
    );
};

export default Home;
