import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        try {
            const res = await api.get('/admin/auth/me');
            setUser(res.data.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (window.location.pathname.startsWith('/admin')) {
            checkAuth();
        } else {
            setLoading(false);
        }

        const handleUnauthorized = () => {
            setUser(null);
            if (window.location.pathname.startsWith('/admin')) {
                window.location.href = '/admin/login';
            }
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, [checkAuth]);

    const login = async (email, password) => {
        const res = await api.post('/admin/auth/login', { email, password });
        setUser(res.data.data);
        return res.data;
    };

    const logout = async () => {
        await api.post('/admin/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
