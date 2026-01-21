import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUserId = localStorage.getItem('widgetic_user_id');
        if (storedUserId) {
            setUserId(storedUserId);
        }
        setLoading(false);
    }, []);

    const login = (id) => {
        localStorage.setItem('widgetic_user_id', id);
        setUserId(id);
    };

    const logout = () => {
        localStorage.removeItem('widgetic_user_id');
        setUserId(null);
    };

    const isAuthenticated = !!userId;

    return (
        <AuthContext.Provider value={{ userId, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
};

export default AuthContext;
