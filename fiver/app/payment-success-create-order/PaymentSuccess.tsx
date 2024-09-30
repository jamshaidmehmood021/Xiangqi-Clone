"use client";

import React, { useEffect, useRef, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

//import { io } from 'socket.io-client';

import { useAppDispatch } from '@/app/redux/hooks'; 
import { createOrder } from '@/app/redux/slice/orderSlice';

import { AuthContext } from '@/app/context/authContext';

const PaymentSuccess = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const ref = useRef<boolean>(false); 
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext is not available');
  }

  const { userID } = authContext;
 
  const createOrderAndNotify = useCallback(async (order: any) => {
    const resultAction = await dispatch(createOrder(order));
    if (createOrder.fulfilled.match(resultAction)) {
      toast.success("Order placed successfully!");
    } else {
      toast.error("Failed to place the order.");
    }
  }, [dispatch]);

  useEffect(() => {
    const orderData = localStorage.getItem('orderData');
    if (orderData && !ref.current) { 
      ref.current = true;  
      const parsedOrder = JSON.parse(orderData);
      //const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND}`);
      //newSocket.emit('joinOrderRoom', parsedOrder.sellerId);
      createOrderAndNotify(parsedOrder);
      localStorage.removeItem('orderData');
    }
  }, [createOrderAndNotify]); 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6"
    style={{background: 'linear-gradient(135deg, rgba(30, 30, 30, 1) 0%, rgba(70, 70, 70, 1) 50%, rgba(30, 30, 30, 0.8) 100%)', minHeight: '100vh'}}>
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Thank you for your order! Your payment has been processed successfully.
        </p>
        <div className="mb-6">
          <svg className="w-16 h-16 mx-auto text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12.59l4.29-4.3a1 1 0 00-1.42-1.42L10 12.17l-2.29-2.3a1 1 0 00-1.42 1.42l4 4a1 1 0 001.42 0z" clipRule="evenodd" />
          </svg>
        </div>
        <button 
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300" 
          onClick={() => router.push(`/orders/${userID}`)}
        >
          View Your Orders
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
