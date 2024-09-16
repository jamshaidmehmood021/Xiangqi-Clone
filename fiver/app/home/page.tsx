'use client'
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { fetchAllGigs } from '@/app/redux/slice/gigSlice';
import { Grid, Card, CardContent, Typography, Avatar, Select, MenuItem, InputLabel, FormControl, CardMedia, SelectChangeEvent, Box } from '@mui/material';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  background-color: #f9f9f9;
`;

const GigCard = styled(Card)`
  max-width: 300px;
  margin: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

const GigAvatar = styled(Avatar)`
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
`;

const FilterContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Home = () => {
  const dispatch = useAppDispatch();
  const { gigs, loading, error } = useAppSelector((state) => state.gigs);

  const [category, setCategory] = useState(''); 

  useEffect(() => {
    dispatch(fetchAllGigs()); 
  }, [dispatch]);

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategory(event.target.value as string); 
  };

  const filteredGigs = category
    ? gigs.filter((gig) => gig.category === category)
    : gigs;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <FilterContainer>
        <Typography variant="h4">Gigs</Typography>

      <Box sx={{mb: 3}}>
        <FormControl variant="outlined">
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={category}
            onChange={handleCategoryChange}
            label="Filter by Category"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="AI">AI</MenuItem>
            <MenuItem value="ML">ML</MenuItem>
            <MenuItem value="DS">Data Science</MenuItem>
            <MenuItem value="Web Dev">Web Development</MenuItem>
            <MenuItem value='Js'>Javascript</MenuItem>
          </Select>
        </FormControl>
        </Box>
      </FilterContainer>
      

      <Grid container spacing={3}>
        {filteredGigs.map((gig) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={gig.id}>
            <GigCard>
              <CardContent>
                <GigAvatar src={gig.user.profilePicture} alt={gig.user.name} />

                <Typography variant="h6">{gig.title}</Typography>
                <Typography color="textSecondary">{gig.category}</Typography>
                <Typography variant="body2">Posted by: {gig.user.name}</Typography>

                {gig.image && (
                  <CardMedia
                    component="img"
                    height="150"
                    image={gig.image}
                    alt={`${gig.title} image`}
                    style={{ marginTop: '1rem' }}
                  />
                )}
              </CardContent>
            </GigCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
