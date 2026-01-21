import { useNavigate } from 'react-router-dom';

const useAuth = () => {
    const navigate = useNavigate();

    const isAuthenticated = () => {
        return !!localStorage.getItem('widgetic_user_id');
    };

    const getUserId = () => {
        return localStorage.getItem('widgetic_user_id');
    };

    const login = (userId) => {
        localStorage.setItem('widgetic_user_id', userId);
        navigate('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('widgetic_user_id');
        navigate('/login');
    };

    return { isAuthenticated, getUserId, login, logout };
};

export default useAuth;
