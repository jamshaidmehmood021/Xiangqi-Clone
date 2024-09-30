'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  email: string;
  name: string;
  id: string;
  role: string;
}

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  const ProtectedRoute = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.replace('/signIn');
        return;
      }

      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const userRole = decodedToken.role;

        const currentPath = window.location.pathname;

        if ((userRole === 'Seller' || userRole === 'Buyer') && currentPath === '/dashboard') {
          router.replace('/signIn');
          return;
        }

        if (userRole === 'Admin' && currentPath !== '/dashboard') {
          router.replace('/signIn');
          return;
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        router.replace('/signIn');
        return;
      }
    }, [router]);


    return <WrappedComponent {...props} />;
  };

  return ProtectedRoute;
};

export default withAuth;
