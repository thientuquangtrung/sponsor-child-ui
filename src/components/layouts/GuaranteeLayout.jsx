import { Outlet } from 'react-router-dom';
import SidebarGuarantee from '@/components/navigation/SidebarGuarantee';
import icon from '@/assets/images/no-access.png';
import { useSelector } from 'react-redux';
import HeaderSidebar from '@/components/navigation/HeaderSidebar';

export function GuaranteeLayout() {
    const { user } = useSelector((state) => state.auth);

    if (user?.role !== 'Guarantee') {
        return (
            <div className="text-center my-auto text-[36px] text-gray-500 flex flex-col items-center">
                <img src={icon} className="w-[500px] h-[300px]" />
                Bạn không có quyền truy cập vào trang này.
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