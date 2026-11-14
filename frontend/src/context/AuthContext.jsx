import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AuthContext creates a shared data tunnel accessible by any component.
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * On page refresh, check if a session already exists in localStorage.
     */
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    /**
     * Called upon successful login or registration.
     * Saves credentials to both React state and browser localStorage.
     */
    const login = (authData) => {
        const { accessToken, ...userData } = authData;

        setToken(accessToken);
        setUser(userData);

        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    /**
     * Clears state and localStorage, effectively logging the user out.
     */
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                login,
                logout,
                loading,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to easily consume the AuthContext in any component:
 * const { user, logout, isAuthenticated } = useAuth();
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};