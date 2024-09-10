import { Outlet } from 'react-router-dom';
import SidebarGuarantee from '@/components/navigation/SidebarGuarantee';

export function GuaranteeLayout() {
    return (
        <div className="flex">
            <SidebarGuarantee />
            <div className="flex-grow">
                <Outlet />
            </div>
        </div>
    );
}
