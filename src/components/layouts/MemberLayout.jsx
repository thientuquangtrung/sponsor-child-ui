import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function MemberLayout() {
    const { user } = useSelector((state) => state.auth);

    if (!user) return <Navigate to="/auth/login" replace />;

    return <Outlet />;
}
