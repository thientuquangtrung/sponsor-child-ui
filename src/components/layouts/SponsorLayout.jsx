import { Outlet } from 'react-router-dom';
import SidebarSponsor from '@/components/navigation/SidebarSponsor';

export function SponsorLayout() {
    return (
        <div className="flex">
            <SidebarSponsor />
            <div className="flex-grow">
                <Outlet />
            </div>
        </div>
    );
}
