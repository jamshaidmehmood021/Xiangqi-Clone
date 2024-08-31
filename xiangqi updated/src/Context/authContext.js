import React, { createContext, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; 

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => {
        const tokens = localStorage.getItem('authTokens');
        return tokens ? JSON.parse(tokens) : null;
    });

    const [user, setUser] = useState(() => {
        if (authTokens && authTokens.access) {
            try {
                return jwtDecode(authTokens.access).user_id;
            } catch (e) {
                return null; 
            }
        }
        return null; 
    });

    const login = (access, refresh) => {
        const tokens = { access, refresh }; 
        localStorage.setItem('authTokens', JSON.stringify(tokens));
        try {
            setUser(jwtDecode(access).user_id);
        } catch (e) {
            setUser(null);
        }
        setAuthTokens(tokens);
    };

    const logout = () => {
        localStorage.removeItem('authTokens');
        setAuthTokens(null);
        setUser(null);
    };

    const contextValue = {
        user,
        authTokens,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
