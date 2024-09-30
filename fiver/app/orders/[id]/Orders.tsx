'use client';
import React, { useEffect, useContext, useMemo, useCallback } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { fetchOrdersByUserId, updateOrderStatus } from '@/app/redux/slice/orderSlice'; 
import { AuthContext } from '@/app/context/authContext';
import OrderCard from '@/app/components/OrderCard';
import { Bars } from 'react-loading-icons';

const Orders = React.memo(() => {
  const dispatch = useAppDispatch();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext is not available');
  }

  const { userID, role } = authContext;
  const { orders, loading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    if (userID) {
      dispatch(fetchOrdersByUserId(Number(userID)));
    }
  }, [dispatch, userID]);

  const handleAccept = useCallback(async (orderId: number) => {
    const response = await dispatch(updateOrderStatus({ orderId, orderStatus: 'In Progress' }));
    if (response.payload.message === 'Order status updated successfully') {
      dispatch(fetchOrdersByUserId(Number(userID)));
    }
  }, [dispatch, userID]);

  const handleDecline = useCallback(async (orderId: number) => {
    const response = await dispatch(updateOrderStatus({ orderId, orderStatus: 'Declined' }));
    if (response.payload.message === 'Order status updated successfully') {
      dispatch(fetchOrdersByUserId(Number(userID)));
    }
  }, [dispatch, userID]);

  const handleComplete = useCallback(async (orderId: number) => {
    const response = await dispatch(updateOrderStatus({ orderId, orderStatus: 'Completed' }));
    if (response.payload.message === 'Order status updated successfully') {
      dispatch(fetchOrdersByUserId(Number(userID)));
    }
  }, [dispatch, userID]);

  const memoizedOrders = useMemo(() => (
    orders.map((order: any) => (
      <Grid item xs={12} sm={6} md={4} lg={4} key={order.orderId}>
        <OrderCard
          order={order}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onComplete={handleComplete}
          role={role as string}
        />
      </Grid>
    ))
  ), [orders, handleAccept, handleDecline, handleComplete, role]);

  return (
    <Container sx={{ padding: '70px' }}>
      <Typography variant="h4" gutterBottom sx={{color: 'white'}}>
        Your Orders
      </Typography>
      {loading ? (
        <div className="flex justify-center items-center">
          <Bars stroke="#3f51b5" width={50} />
        </div>
      ) : error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {memoizedOrders}
        </Grid>
      )}
    </Container>
  );
});

Orders.displayName = 'Orders';
export default Orders;
