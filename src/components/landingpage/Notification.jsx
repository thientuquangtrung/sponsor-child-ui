import React, { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Notification = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(3); // Số thông báo chưa đọc
    const dialogRef = useRef(null); // Tạo ref để theo dõi dialog
    const [notifications, setNotifications] = useState([]); 

    // Hàm toggle hiển thị
    const toggleDialog = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dialogRef.current && !dialogRef.current.contains(event.target)) {
            setIsOpen(false); 
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    

    return (
        <div className="relative">
            <div className="relative">
                <Bell className="text-black cursor-pointer" onClick={toggleDialog} size={26} />
                {notificationCount > 0 && (
                    <Badge
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center hover:bg-normal"
                    >
                        {notificationCount}
                    </Badge>
                )}
            </div>

            {isOpen && (
                <div
                    ref={dialogRef}
                    className="absolute right-0 top-8 bg-white shadow-xl rounded-lg p-4 w-[400px] max-h-[300px] overflow-y-auto"
                >
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold">Thông báo</h2>
                        <button
                            className="text-teal-500 text-sm"
                            onClick={() => {
                                setNotificationCount(0); 
                                setNotifications([]); 
                            }}
                        >
                            Đánh dấu đã đọc
                        </button>
                    </div>

                    {notifications.length > 0 ? (
                        <ul className="text-gray-400">
                            {notifications.map((notification, index) => (
                                <li key={index} className="my-1">{notification}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 text-center">Bạn không có thông báo nào</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notification;
