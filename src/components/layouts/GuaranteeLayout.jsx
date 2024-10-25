import { Outlet } from 'react-router-dom';
import SidebarGuarantee from '@/components/navigation/SidebarGuarantee';

export function GuaranteeLayout() {
    return (
        <div className="flex flex-1 overflow-hidden">
            <SidebarGuarantee />
            <main className="flex-1 overflow-y-auto bg-[#f3f4f6] dark:bg-gray-700 p-6">
                <Outlet />
            </main>
        </div>
    );
}
