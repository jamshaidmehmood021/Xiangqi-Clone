import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authTokens, setAuthTokens] = useState(() => {
        const tokens = localStorage.getItem('authTokens');
        return tokens ? JSON.parse(tokens) : null;
    });


    const login = (access, refresh, username) => {
        const tokens = { access, refresh }; 
        localStorage.setItem('authTokens', JSON.stringify(tokens));
        setUser(username); 
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
