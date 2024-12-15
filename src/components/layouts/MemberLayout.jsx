import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetAdminConfigQuery } from '@/redux/adminConfig/adminConfigApi';
import FETCH_ADMIN_CONFIGS from '@/config/adminConfig';

export function MemberLayout() {
    const { user } = useSelector((state) => state.auth);
    const { data } = useGetAdminConfigQuery();
    if (data && data.length > 0) {
        const adminConfigs = data.reduce((acc, val) => {
            return {
                ...acc,
                [val.configKey]: +val.configValue
            }
        }, {})
        localStorage.setItem("adminConfigs", JSON.stringify(adminConfigs));
    }
    else {
        const adminConfigs = FETCH_ADMIN_CONFIGS.reduce((acc, val) => {
            return {
                ...acc,
                [val.configKey]: +val.configValue
            }
        }, {})
        localStorage.setItem("adminConfigs", JSON.stringify(adminConfigs));
    }
    if (!user) return <Navigate to="/auth/login" replace />;

    return <Outlet />;
}
