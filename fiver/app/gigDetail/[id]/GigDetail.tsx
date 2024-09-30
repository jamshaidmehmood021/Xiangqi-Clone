'use client';
import React, { useContext } from 'react';
import { Typography, Card, CardContent, Avatar, Button } from '@mui/material';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { Image } from 'antd';

import { useAppSelector } from '@/app/redux/hooks';
import { selectGigById } from '@/app/redux/slice/gigSlice';

import { AuthContext } from '@/app/context/authContext';
import withAuth from '@/app/components/ProtectedRoute';

const Container = styled.div`
  padding: 3rem 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(7, 18, 31, 1) 0%, rgba(0, 0, 0, 0.8) 100%);
`;

const GigCard = styled(Card)`
  max-width: 900px;
  padding: 2.5rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  background-color: #fff;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  }
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
`;

const GridSection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  gap: 1rem; 
  margin: 2rem 0;
`;

const Video = styled.video`
  width: 100%; 
  height: auto; 
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const AvatarStyled = styled(Avatar)`
  width: 100px;
  height: 100px;
  border: 2px solid #0077ff;
  transition: transform 0.2s;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
`;

const ImageContainer = styled.div`
  img {
    width: 300px; 
    height: 300px; 
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const GigSection = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
`;

const ActionButton = styled(Button)`
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #0077ff;
  color: #fff;
  border-radius: 8px;
  transition: background-color 0.3s, transform 0.2s;
  &:hover {
    background-color: #005bb5;
    transform: translateY(-2px);
  }
`;
const Description = styled(Typography)`
  margin-top: 0.15rem;
  color: #555;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const GigDetails = ({ params }: { params: { id: string } }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext is not available');
  }

  const { role } = authContext;

  const router = useRouter();
  const { id } = params;
  const gig: any | undefined = useAppSelector((state) => selectGigById(state, Number(id)));

  if (!gig) return <div>Gig not found</div>;

  const bufferToString = (buffer: { data: number[] }): string => {
    return String.fromCharCode(...buffer.data);
  };

  const videoUrl = gig.video && typeof gig.video === 'object' ? bufferToString(gig.video) : gig.video;

  return (
    <Container>
      <GigCard>
        <DetailsContainer>
          {gig.user && (
            <UserSection>
              <AvatarStyled
                src={gig.user.profilePicture}
                alt={gig.user.name}
                onClick={() => router.push(`/profile/${gig.user.id}`)}
              />
              <UserDetails>
                <Typography variant="h6" color="textPrimary" gutterBottom>
                  {gig.user.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {gig.user.email}
                </Typography>
              </UserDetails>
            </UserSection>
          )}
          <GigSection>
            <GridSection>
              {videoUrl && (
                <Video controls>
                  <source src={videoUrl} type="video/mp4" />
                </Video>
              )}
              <ImageContainer>
                {gig.image && (
                  <Image 
                    src={gig.image as string} 
                    alt="Gig Image"
                  />
                )}
              </ImageContainer>
            </GridSection>

            <CardContent>
              <Typography variant="h4" gutterBottom> Gig Title: {gig.title}</Typography>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Gig Category: <span style={{ fontWeight: 'bold' }}>{gig.category}</span>
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {gig.description}
              </Typography>
              <Description>
                {gig.description ? `${gig.description}`
                    : gig.description || 'No description available.'
                  }
              </Description>
              {role === 'Buyer' && 
                <ActionButton variant="contained" onClick={() => router.push(`/chat/${gig.id}`)}>
                  Contact Seller
                </ActionButton>}
            </CardContent>
          </GigSection>
        </DetailsContainer>
      </GigCard>
    </Container>
  );
};

export default withAuth(GigDetails);
