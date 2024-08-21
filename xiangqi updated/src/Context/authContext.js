import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = (prop) => {
    const { children } = prop;
    
    const [user, setUser] = useState(null);
    const [authTokens, setAuthTokens] = useState(() => {
        const tokens = localStorage.getItem('authTokens');
        return tokens ? JSON.parse(tokens) : null;
    });

    useEffect(() => {
        if (authTokens) {
            const user = jwtDecode(authTokens.access);
            setUser(user);
        }
    }, [authTokens]);

    const login = (tokens) => {
        localStorage.setItem('authTokens', JSON.stringify(tokens));
        const user = jwtDecode(tokens.access);
        setUser(user);
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
