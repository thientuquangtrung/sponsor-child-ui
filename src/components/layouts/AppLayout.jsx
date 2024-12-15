import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { useGetAdminConfigQuery } from '@/redux/adminConfig/adminConfigApi';
import FETCH_ADMIN_CONFIGS from '@/config/adminConfig';

export function AppLayout() {
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
    return (
        <>
            <div id="payment-container" style={{ position: 'fixed', zIndex: 99999999 }}></div>
            <Header />
            <div className="flex-grow flex flex-col">
                <div className="container px-4 md:px-8 flex-grow flex flex-col">
                    <Outlet />
                    {/* <Chat /> */}
                </div>
            </div>
            <Footer />
        </>
    );
}
