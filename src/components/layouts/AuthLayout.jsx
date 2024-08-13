import { DEFAULT_PATH } from '@/config/app';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export function AuthLayout() {
    const { user } = useSelector((state) => state.auth);

    if (user) return <Navigate to={DEFAULT_PATH} replace />;

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <Outlet />
        </div>
    );
}
