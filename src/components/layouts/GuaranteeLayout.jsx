import { Outlet, useNavigate } from 'react-router-dom';
import SidebarGuarantee from '@/components/navigation/SidebarGuarantee';
import icon from '@/assets/images/no-access.png';
import { useSelector } from 'react-redux';

import HeaderSidebar from '@/components/navigation/HeaderSidebar';

import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';


export function GuaranteeLayout() {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const redirectToHome = () => {
        navigate('/');
    };

    if (user?.role !== 'Guarantee') {
        return (
            <div className="text-center my-auto text-[36px] text-gray-500 flex flex-col items-center space-y-4">
                <img src={icon} className="w-[500px] h-[300px]" alt="No Access" />
                <p>Bạn không có quyền truy cập vào trang này.</p>
                <Button
                    onClick={redirectToHome}
                    className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 flex items-center space-x-2"
                >
                    <Home className="w-5 h-5" /> 
                    <span className='text-md'>Quay về Trang Chủ</span>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#1a222c] dark:text-white flex flex-col lg:flex-row">
            <SidebarGuarantee />
            <div className="flex-1 flex flex-col h-screen">
                <HeaderSidebar />
                <main className="flex-1 overflow-y-auto bg-[#f3f4f6] dark:bg-gray-700 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}