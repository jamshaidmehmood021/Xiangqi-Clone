import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from '@/app/toastContainer';
import { AuthProvider } from '@/app/context/authContext';
import StoreProvider from '@/app/StoreProvider';
import Navbar from '@/app/navbar/Navbar'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <StoreProvider>
            <Navbar />
            {children}
          </StoreProvider>
        </AuthProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
