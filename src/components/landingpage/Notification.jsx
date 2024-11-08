import React, { useState } from 'react';
import { Bell, Trash2, Ellipsis } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import notification from '@/assets/images/notification.jpg';

const Notification = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            name: 'Trần Thu Hà',
            action: 'đã bình luận về hoạt động của bạn trong chiến dịch',
            message: 'Thật tuyệt vời! Mình rất cảm động trước những đóng góp của bạn cho các em nhỏ.',
            time: '5 phút trước',
            profileImage: 'https://via.placeholder.com/400x300',
            isRead: false,
        },
        {
            id: 2,
            name: 'Nguyễn Văn Bình',
            action: 'đã quyên góp cho chiến dịch "Vì nụ cười trẻ thơ"',
            message: 'Số tiền: 500,000 VNĐ',
            time: '21 phút trước',
            profileImage: 'https://via.placeholder.com/400x300',
            isRead: false,
        },
        {
            id: 3,
            name: 'Hoàng Minh Đăng',
            action: 'đã xác nhận giải ngân cho các em tại trường tiểu học ABC',
            message: 'Số tiền: 1,000,000 VNĐ',
            time: '2 giờ trước',
            profileImage: 'https://via.placeholder.com/400x300',
            isRead: false,
        },
        {
            id: 4,
            name: 'Phạm Quang Huy',
            action: 'đã thích hoạt động mới trong chiến dịch "Vòng tay yêu thương"',
            message: 'Cùng nhau lan tỏa tình yêu thương!',
            time: '3 giờ trước',
            profileImage: 'https://via.placeholder.com/400x300',
            isRead: true,
        },
        {
            id: 5,
            name: 'Lê Thị Ngọc',
            action: 'đã bình luận về khoản quyên góp của bạn',
            message: 'Rất biết ơn sự đóng góp của bạn! Hy vọng chúng ta sẽ giúp được nhiều em nhỏ hơn.',
            time: '1 ngày trước',
            profileImage: 'https://via.placeholder.com/400x300',
            isRead: false,
        },
    ]);

    const notificationCount = notifications.filter((notification) => !notification.isRead).length;

    const toggleDialog = () => {
        setIsOpen(!isOpen);
    };

    const handleDeleteNotification = (event, id) => {
        event.stopPropagation();
        const updatedNotifications = notifications.filter((notification) => notification.id !== id);
        setNotifications(updatedNotifications);
    };

    const markAllAsRead = () => {
        const updatedNotifications = notifications.map((notification) => ({
            ...notification,
            isRead: true,
        }));
        setNotifications(updatedNotifications);
    };

    return (
        <div className="relative">
            <div className="relative">
                <Bell className="text-gray-700 cursor-pointer" onClick={toggleDialog} size={26} />
                {notificationCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-600 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full hover:bg-normal">
                        {notificationCount}
                    </Badge>
                )}
            </div>

            {isOpen && (
                <div className="absolute right-0 top-10 bg-white shadow-lg rounded-lg p-4 w-[420px] max-h-[500px] overflow-y-auto border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-semibold text-gray-800">Thông báo</h2>
                        <button className="text-teal-500 text-sm hover:underline" onClick={markAllAsRead}>
                            Đánh dấu đã đọc
                        </button>
                    </div>

                    {notifications.length > 0 ? (
                        <ul className="space-y-3">
                            {notifications.map((notification) => (
                                <li
                                    key={notification.id}
                                    className={`flex items-start p-3 rounded-lg ${
                                        notification.isRead ? 'bg-white' : 'bg-gray-100'
                                    } hover:bg-gray-200 hover:cursor-pointer transition relative`}
                                >
                                    <img
                                        src={notification.profileImage}
                                        alt={`${notification.name}'s profile`}
                                        className="w-10 h-10 rounded-full mr-3 border border-gray-300"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-semibold text-teal-500">{notification.name}</span>{' '}
                                            {notification.action}
                                        </p>
                                        <p className="text-sm text-gray-500">{notification.message}</p>
                                        <span className="text-xs text-gray-400">{notification.time}</span>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Ellipsis className="text-gray-500 cursor-pointer hover:text-gray-700" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            side="bottom"
                                            align="end"
                                            className="bg-white border border-gray-200 shadow-md rounded-md"
                                        >
                                            <DropdownMenuItem
                                                className="flex items-center space-x-2 px-2 py-2 text-sm text-gray-700 cursor-pointer"
                                                onClick={(event) => handleDeleteNotification(event, notification.id)}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                                <span>Xóa thông báo này</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center py-6">
                            <img src={notification} alt="notification" className="w-full h-full" />
                            <p className="text-gray-500 text-center italic">Hiện bạn chưa có thông báo mới</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notification;
