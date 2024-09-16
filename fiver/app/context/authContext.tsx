'use client';
import React, { createContext, useState, useEffect, memo, ReactNode } from 'react';
import {jwtDecode} from 'jwt-decode'; 
import { useRouter } from 'next/navigation';

interface DecodedToken {
  email: string;
  name: string;
  id: string;
}

interface AuthContextType {
  user: string | null;
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
  name: string | null;
  setName: React.Dispatch<React.SetStateAction<string | null>>;
  userID: string | null;
  setUserID: React.Dispatch<React.SetStateAction<string | null>>;
  userRole: string | null;
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
  profilePicture: string | null;
  setProfilePicture: React.Dispatch<React.SetStateAction<string | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = memo(({ children }) => {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [userRole , setUserRole] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(token);
          setToken(token);
          setUser(decodedToken.email);
          setName(decodedToken.name);
          setUserID(decodedToken.id);
        } catch (e) {
          console.error('Failed to decode token:', e);
        }
      } else {
        setUser(null);
        setName(null);
        setUserID(null);
      }
    };

    handleStorageChange(); 

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setName(null);
    setUserID(null);
    setUserRole(null);
    setProfilePicture(null);
    router.push('/');
  };

  const contextValue: AuthContextType = {
    user, setUser, name, setName, userID, setUserID,  userRole, setUserRole, profilePicture, setProfilePicture, logout,token, setToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
});

AuthProvider.displayName = 'AuthProvider';

export { AuthContext, AuthProvider };
