import React from 'react';
import { Link } from 'react-router-dom';
import { ModeToggle } from '@/components/common/ModeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { LogoutUser } from '@/redux/auth/authActionCreators';
import { useLogoutMutation } from '@/redux/auth/authApi';

const HeaderSidebar = () => {
    const [logout] = useLogoutMutation();
    const { user, refreshToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        logout({ refreshToken });
        dispatch(LogoutUser());
    };

    return (
        <header className="sticky top-0 z-40 flex w-full bg-white dark:bg-gray-950 h-16 shadow-md">
            <div className="flex w-full items-center justify-between px-4 md:px-6 2xl:px-11">
                <div className="ml-auto flex items-center gap-4">
                    <div className="hidden md:block">
                        <ModeToggle />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user?.imageUrl} alt={user?.fullname} />
                                    <AvatarFallback>{user?.fullname?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.fullname}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link to="/contact">Liên hệ</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to="/report">Báo cáo</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default HeaderSidebar;