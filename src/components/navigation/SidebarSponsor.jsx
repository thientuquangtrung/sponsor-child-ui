import React, { useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, LayoutDashboard, BarChart2, Newspaper, User, LogOut, PanelsTopLeft, Menu, History } from 'lucide-react';

const SidebarSponsor = () => {
    const location = useLocation();
    const [open, setOpen] = useState(true);

    const menus = [
        { icon: Home, label: 'Trang Chủ', path: '/sponsor' },
        { icon: LayoutDashboard, label: 'Quản Lý Chiến Dịch', path: '/sponsor/campaigns' },
        { icon: BarChart2, label: 'Thống Kê', path: '/sponsor/statistics' },
        { icon: History, label: 'Lịch sử quyên góp', path: '/sponsor/donation-history' },
        { icon: Newspaper, label: 'Tin Tức & Cập Nhật', path: '/sponsor/news' },
        { icon: User, label: 'Hồ Sơ Người Bảo Lãnh', path: '/sponsor/profile' },
    ];

    const handleLogout = () => {
    };

    const SidebarContent = ({ isMobile = false }) => (
        <div className={cn(
            "flex flex-col h-full",
            isMobile ? "bg-background" : "bg-primary text-gray-950"
        )}>
            <div className="p-4 flex justify-end">
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
                            {open && <span>{menu.label}</span>}
                        </Button>
                    </Link>
                ))}
            </nav>
            <div className="p-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100 transition-all duration-300 ease-in-out transform hover:scale-105 hover:translate-x-2"
                    onClick={handleLogout}
                >
                    <LogOut className={cn("h-4 w-4 transition-transform duration-300 ease-in-out transform", open ? "mr-2" : "mr-0")} />
                    {open && <span>Đăng Xuất</span>}
                </Button>
            </div>
        </div>
    );

    return (
        <>
            <div
                className={cn(
                    "bg-[#0e0e0e] min-h-screen duration-300 text-gray-100 hidden md:block",
                    open ? "w-64" : "w-16"
                )}
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