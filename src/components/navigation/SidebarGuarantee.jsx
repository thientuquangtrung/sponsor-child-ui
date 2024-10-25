import React, { useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, LayoutDashboard, BarChart2, Newspaper, User, LogOut, PanelsTopLeft, Menu, History, ReceiptText } from 'lucide-react';
import { Icons } from "@/components/icons";
import { useLogoutMutation } from "@/redux/auth/authApi";

const SidebarSponsor = () => {
    const location = useLocation();
    const [open, setOpen] = useState(true);
    const [logout] = useLogoutMutation();
    const handleLogout = () => {
        logout({ refreshToken });
        dispatch(LogoutUser());
    };

    const menus = [
        { icon: Home, label: 'Trang Chủ', path: '/guarantee' },
        { icon: LayoutDashboard, label: 'Quản Lý Chiến Dịch', path: '/guarantee/campaigns' },
        { icon: BarChart2, label: 'Thống Kê', path: '/guarantee/statistics' },
        { icon: History, label: 'Lịch sử quyên góp', path: '/guarantee/donation-history' },
        { icon: Newspaper, label: 'Tin Tức & Cập Nhật', path: '/guarantee/news' },
        { icon: User, label: 'Hồ Sơ Người Bảo Lãnh', path: '/guarantee/profile' },
        { icon: ReceiptText, label: 'Hợp đồng', path: '/guarantee/contracts' },
        { icon: LogOut, label: 'Đăng Xuất', onClick: handleLogout }
    ];


    const SidebarContent = ({ isMobile = false }) => (
        <div className={cn(
            "flex flex-col h-full",
            isMobile ? "bg-[#8cddcc]" : "bg-[#8cddcc] text-gray-950"
        )}>
            <div className="p-4 flex justify-between items-center">
                {open && (
                    <Link to="/" className="flex-shrink-0">
                        <Icons.textLogoBlack className="w-36 h-auto" />
                    </Link>
                )}
                <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
                    <PanelsTopLeft className="h-4 w-4 transition-transform duration-300 ease-in-out transform" />
                </Button>
            </div>
            <nav className="flex-1">
                {menus.map((menu, i) => (
                    <Link key={i} to={menu.path}>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start transition-all duration-300 ease-in-out transform hover:scale-105 hover:translate-x-2",
                                location.pathname === menu.path ? "bg-secondary" : "hover:bg-secondary/50",
                                !open && "px-6"
                            )}
                        >
                            <menu.icon className={cn("h-4 w-4 transition-transform duration-300 ease-in-out transform", open ? "mr-2" : "mr-0")} />
                            {open && <span className="font-semibold">{menu.label}</span>}
                        </Button>
                    </Link>
                ))}
            </nav>
        </div>
    );

    return (
        <>
            <div
                className={cn(
                    "min-h-screen duration-300 text-gray-100 hidden md:block",
                    open ? "w-64" : "w-16"
                )}
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