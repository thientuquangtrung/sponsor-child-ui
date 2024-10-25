import { Outlet } from 'react-router-dom';
import SidebarGuarantee from '@/components/navigation/SidebarGuarantee';
import icon from '@/assets/images/no-access.png';
import { useSelector } from 'react-redux';

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
        <div className="flex">
            <SidebarGuarantee />
            <div className="flex-grow">
                <Outlet />
            </div>
        </div>
    );
}
