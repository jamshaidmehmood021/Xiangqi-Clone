import React, { createContext, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('Token');
        return token ? jwtDecode(token).email : null;
    });
    const [name, setName] = useState(() => {
        const token = localStorage.getItem('Token');
        return token ? jwtDecode(token).name : null;
    });
    const [userID, setUserID] = useState(() => {
        const token = localStorage.getItem('Token');
        return token ? jwtDecode(token).id : null;
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem('Token');
            if (token) {
                try {
                    setUser(jwtDecode(token).email);
                    setName(jwtDecode(token).name);
                } catch (e) {
                    console.error('Failed to decode token:', e);
                }
            } else {
                setUser(null);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const logout = () => {
        localStorage.removeItem('Token');
        setUser(null);
        navigate('/');
    };

    const contextValue = {
        user, setUser,name,setName,userID,setUserID, logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
