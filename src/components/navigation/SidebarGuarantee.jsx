import React, { useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, LayoutDashboard, BarChart2, Newspaper, User, PanelsTopLeft, Menu, History, ReceiptText, CircleDollarSign } from 'lucide-react';
import { Icons } from "@/components/icons";

const SidebarGuarantee = () => {
    const location = useLocation();
    const [open, setOpen] = useState(true);

    const menus = [
        // { icon: Home, label: 'Trang Chủ', path: '/guarantee' },
        { icon: LayoutDashboard, label: 'Quản Lý Chiến Dịch', path: '/guarantee/campaigns' },
        // { icon: BarChart2, label: 'Thống Kê', path: '/guarantee/statistics' },
        // { icon: History, label: 'Lịch sử quyên góp', path: '/guarantee/donation-history' },
        // { icon: Newspaper, label: 'Tin Tức & Cập Nhật', path: '/guarantee/news' },
        // { icon: User, label: 'Hồ Sơ Người Bảo Lãnh', path: '/guarantee/profile' },
        { icon: ReceiptText, label: 'Hợp đồng', path: '/guarantee/contracts' },
        { icon: CircleDollarSign, label: 'Yêu cầu giải ngân', path: '/guarantee/disbursement-requests' },
    ];

    const SidebarContent = ({ isMobile = false }) => (
        <div className={cn(
            'flex flex-col h-screen sticky top-0',
            isMobile ? 'bg-gradient-to-b from-rose-100 to-primary'
                : 'bg-gradient-to-b from-rose-100 to-primary text-gray-950'
        )}>
            <div className="p-4 flex justify-between items-center">
                {open && (
                    <Link to="/" className="flex-shrink-0">
                        <Icons.textLogoBlack className="w-36 h-auto" />
                    </Link>
                )}
                {!isMobile && (
                    <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="hover:bg-secondary/50">
                        <PanelsTopLeft className="h-4 w-4 transition-transform duration-300 ease-in-out transform" />
                    </Button>
                )}
            </div>
            <nav className="flex-1">
                {menus.map((menu, i) => (
                    menu.onClick ? (
                        <Button
                            key={i}
                            variant="ghost"
                            onClick={menu.onClick}
                            className={cn(
                                "w-full justify-start transition-all duration-300 ease-in-out transform hover:scale-105 hover:translate-x-2",
                                !open && "px-6"
                            )}
                        >
                            <menu.icon className={cn("h-4 w-4 transition-transform duration-300 ease-in-out transform", open ? "mr-2" : "mr-0")} />
                            {open && <span className="font-semibold">{menu.label}</span>}
                        </Button>
                    ) : (
                        <Link key={i} to={menu.path}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start transition-all duration-300 ease-in-out transform hover:scale-105 hover:translate-x-2",
                                    location.pathname === menu.path ? "bg-secondary hover:bg-secondary rounded-none" : "hover:bg-normal",
                                    !open && "px-6"
                                )}
                            >
                                <menu.icon className={cn("h-5 w-5 transition-transform duration-300 ease-in-out transform", open ? "mr-4" : "mr-0")} />
                                {open && <span className="text-[16px]">{menu.label}</span>}
                            </Button>
                        </Link>
                    )
                ))}
            </nav>
        </div>
    );

    return (
        <>
            <aside
                className={cn(
                    "h-screen sticky top-0 duration-300 text-gray-100 hidden md:block z-50",
                    open ? "w-64" : "w-16"
                )}
                style={{ backgroundColor: '#8cddcc' }}
            >
                <SidebarContent />
            </aside>

            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-50">
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

export default SidebarGuarantee;