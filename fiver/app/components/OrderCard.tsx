'use client';
import React, { useEffect, useState, useCallback, useContext } from 'react';
import { Typography, Card, CardContent, Button } from '@mui/material';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import { useAppDispatch } from '@/app/redux/hooks';
import { fetchRatingsByOrderId, createRating } from '@/app/redux/slice/ratingSlice';
import { AuthContext } from '@/app/context/authContext';
import RatingModal from '@/app/components/RatingModal';

interface Order {
  orderId: number;
  buyerId: number;
  sellerId: number;
  amount: string;
  orderStatus: string;
  deadline: string;
  filePath?: string;
}

interface OrderCardProps {
  order: Order;
  onAccept: (orderId: number) => void;
  onDecline: (orderId: number) => void;
  onComplete: (orderId: number) => void;
  role: string;
}

const TimerContainer = styled.div<{ completed: boolean }>`
  background-color: ${({ completed }) => (completed ? '#38a169' : '#ffb703')};
  color: ${({ completed }) => (completed ? 'white' : 'black')};
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const StyledCard = styled(Card)`
  margin: 1.5rem;
  padding: 1.5rem;
  border-radius: 15px;
  position: relative; 
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease-in-out;
  background-color: #fff0f5;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.18);
  }
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const BoldTypography = styled(Typography)`
  font-weight: 600;
  color: #2d3748;
`;

const FileContainer = styled.div`
  margin-top: 1rem;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 10px;
  background-color: #f9f9f9;
`;

const FileLink = styled.a`
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledButton = styled(Button)`
  margin-top: 1rem;
  background-color: #3f51b5;
  color: white;
  &:hover {
    background-color: #2c3e9d;
  }
  transition: background-color 0.3s ease;
`;

const AcceptButton = styled(Button)`
  background-color: #38a169;
  color: white;

  &:hover {
    background-color: #2f855a;
  }
  transition: background-color 0.3s ease;
`;

const DeclineButton = styled(Button)`
  background-color: #e53e3e;
  color: white;

  &:hover {
    background-color: #c53030;
  }
  transition: background-color 0.3s ease;
`;

const OrderCard: React.FC<OrderCardProps> = React.memo(({ order, onAccept, onDecline, onComplete, role }) => {
  const dispatch = useAppDispatch();
  const authContext = useContext(AuthContext);
  const { userID } = authContext || {};

  const [timer, setTimer] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isRated, setIsRated] = useState(false);
  const [existingRating, setExistingRating] = useState<any>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleRatingSubmit = async (rating: number | null) => {
    if (rating !== null && userID) {
      const ratingData = {
        ratingValue: rating,
        buyerId: order.buyerId,
        sellerId: order.sellerId,
        orderId: order.orderId,
        raterId: Number(userID),
      };
      const response = await dispatch(createRating(ratingData));
      if (response.meta.requestStatus === 'fulfilled') {
        setIsRated(true);
        toast.success('Thanks for your Time!');
      }
    }
  };

  const fetchExistingRating = useCallback(async () => {
    if (userID) {
      const response = await dispatch(fetchRatingsByOrderId({ orderId: order.orderId, userId: Number(userID), role }));
      if (response.payload !== "Rating exists for this user on this order") {
        const ratings = response.payload.rating;
        if (ratings) {
          setExistingRating(ratings);
          setIsRated(true);
        }
      }
    }
  }, [dispatch, order.orderId, role, userID]);

  useEffect(() => {
    fetchExistingRating();
  }, [fetchExistingRating]);

  const calculateTimeLeft = useCallback(() => {
    const deadlineDate = new Date(order.deadline);
    const currentTime = new Date();
    const difference = deadlineDate.getTime() - currentTime.getTime();

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      return { days, hours, minutes, seconds };
    }
    return null;
  }, [order.deadline]);

  useEffect(() => {
    if (order.orderStatus === 'In Progress') {
      const intervalId = setInterval(() => {
        const timeLeft = calculateTimeLeft();
        setTimer(timeLeft);
        if (timeLeft === null && order.orderStatus !== 'Completed') {
          onComplete(order.orderId);
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [calculateTimeLeft, onComplete, order]);

  const renderTimer = () => {
    if (order.orderStatus === 'Completed') {
      return <Typography>Order is completed.</Typography>;
    }
    if (order.orderStatus === 'In Progress' && timer) {
      return (
        <Typography>
          {timer.days}d {timer.hours}h {timer.minutes}m {timer.seconds}s
        </Typography>
      );
    }
    return <Typography>Not Started Yet</Typography>;
  };

  const renderButtons = () => {
    if (order.orderStatus === 'Pending' && role === 'Seller') {
      return (
        <ButtonGroup>
          <AcceptButton onClick={() => onAccept(order.orderId)}>Accept</AcceptButton>
          <DeclineButton onClick={() => onDecline(order.orderId)}>Decline</DeclineButton>
        </ButtonGroup>
      );
    }

    if (role === 'Buyer' && order.orderStatus !== 'Completed') {
      return (
        <StyledButton variant="contained" onClick={() => onComplete(order.orderId)}>
          Mark as Complete
        </StyledButton>
      );
    }

    if (!isRated && order.orderStatus === 'Completed') {
      return (
        <>
          <StyledButton onClick={handleOpenModal}>Rate {role === 'Seller' ? 'Buyer' : 'Seller'}</StyledButton>
          <RatingModal open={isModalOpen} handleClose={handleCloseModal} handleRatingSubmit={handleRatingSubmit} initialRating={existingRating?.ratingValue || 0} />
        </>
      );
    }
    return null;
  };

  return (
    <StyledCard>
      <CardContent>
        <TimerContainer completed={order.orderStatus === 'Completed'}>
          {renderTimer()}
        </TimerContainer>
        <OrderInfo>
          <BoldTypography>Order ID: {order.orderId}</BoldTypography>
          <BoldTypography>Amount: {order.amount}</BoldTypography>
          <BoldTypography>Order Status: {order.orderStatus}</BoldTypography>
        </OrderInfo>

        {order.filePath && (
          <FileContainer>
            <FileLink href={order.filePath} target="_blank" rel="noopener noreferrer" download>
              Download File
            </FileLink>
          </FileContainer>
        )}

        {renderButtons()}
      </CardContent>
    </StyledCard>
  );
});

OrderCard.displayName = 'OrderCard';
export default OrderCard;
