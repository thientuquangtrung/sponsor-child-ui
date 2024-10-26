import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    Home,
    LayoutDashboard,
    BarChart2,
    Newspaper,
    User,
    LogOut,
    PanelsTopLeft,
    Menu,
    History,
    ReceiptText,
} from 'lucide-react';
import { Icons } from '@/components/icons';
import { useLogoutMutation } from '@/redux/auth/authApi';

const SidebarSponsor = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [logout] = useLogoutMutation();

    const handleLogout = () => {
        logout({ refreshToken });
        dispatch(LogoutUser());
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const menus = [
        { icon: Home, label: 'Trang Chủ', path: '/guarantee' },
        { icon: LayoutDashboard, label: 'Quản Lý Chiến Dịch', path: '/guarantee/campaigns' },
        { icon: BarChart2, label: 'Thống Kê', path: '/guarantee/statistics' },
        { icon: History, label: 'Lịch sử quyên góp', path: '/guarantee/donation-history' },
        { icon: Newspaper, label: 'Tin Tức & Cập Nhật', path: '/guarantee/news' },
        { icon: User, label: 'Hồ Sơ Người Bảo Lãnh', path: '/guarantee/profile' },
        { icon: ReceiptText, label: 'Hợp đồng', path: '/guarantee/contracts' },
        { icon: LogOut, label: 'Đăng Xuất', onClick: handleLogout },
    ];

    const MenuItem = ({ icon: Icon, label, path, onClick }) => (
        <Link to={path} onClick={onClick}>
            <Button
                variant="ghost"
                className={cn(
                    'w-full justify-start transition-all duration-300 transform hover:scale-105',
                    location.pathname === path ? 'bg-secondary rounded-none hover:bg-secondary' : 'hover:bg-transparent',
                    !isSidebarOpen && 'px-6'
                )}
            >
                <Icon className={cn('h-4 w-4 transition-transform duration-300', isSidebarOpen ? 'mr-2' : 'mr-0')} />
                {isSidebarOpen && <span>{label}</span>}
            </Button>
        </Link>
    );

    const SidebarContent = ({ isMobile = false }) => (
        <div
            className={cn(
                'flex flex-col h-full',
                isMobile
                    ? 'bg-gradient-to-b from-rose-100 to-primary'
                    : 'bg-gradient-to-b from-rose-100 to-primary text-gray-950'
            )}
        >
            <div className="p-4 flex justify-between items-center">
                {isSidebarOpen && (
                    <Link to="/" className="flex-shrink-0">
                        <Icons.textLogoBlack className="w-36 h-auto" />
                    </Link>
                )}
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hover:bg-secondary">
                    <PanelsTopLeft className="h-4 w-4 transition-transform duration-300" />
                </Button>
            </div>
            <nav className="flex-1">
                {menus.map((menu, i) => (
                    <MenuItem key={i} {...menu} />
                ))}
            </nav>
        </div>
    );

    return (
        <>
            <div
                className={cn('min-h-screen duration-300 text-gray-100 hidden md:block', isSidebarOpen ? 'w-64' : 'w-16')}
                style={{ backgroundColor: '#8cddcc' }}
            >
                <SidebarContent />
            </div>

            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                        <Menu className="h-4 w-4" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                    <SidebarContent isMobile />
                </SheetContent>
            </Sheet>
        </>
    );
};

export default SidebarSponsor;
