import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(()=> localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

useEffect(() => {
    if(token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
}, [token, user]);

const login = async (email, password) => {
    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const contentType = response.headers.get("content-type");
        let data = {};
        
        if (contentType && contentType.includes("application/json") && response.status !== 204) {
            data = await response.json();
        } else if (response.status === 204 || response.status === 200) {
            return { success: false, message: 'Server returned empty response.' };
        }

        if (response.ok) {
            setToken(data.token);
            setUser(data.user);
            return { success: true };
        }else{
            return { success: false, message: data.message || 'Login failed' };
        }
    } catch (error) {
        console.error('Login Error (Network/Server):', error);
        return { success: false, message: 'Network error or server unavailable.' }; 
    }
};

const logout = () => {
    setToken(null);
    setUser(null);  
}

const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
};

return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

