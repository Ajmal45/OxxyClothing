import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Spinner className="h-8 w-8 text-black" />
            </div>
        );
    }

    return user ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
