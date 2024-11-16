import { createSlice } from '@reduxjs/toolkit';
import { revertAll } from '../globalActions';

// ----------------------------------------------------------------------

const initialState = {
    notifications: [
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
    ],
};

export const slice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        newNotification(state, action) {
            state.notifications.unshift(action.payload);
        },
        addNotification(state, action) {
            state.notifications.push(action.payload);
        },
        removeNotification(state, action) {
            state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
        },
        clearNotifications(state) {
            state.notifications = [];
        },
        updateNotification(state, action) {
            const { id, ...updates } = action.payload;
            state.notifications = state.notifications.map((notification) =>
                notification.id === id ? { ...notification, ...updates } : notification,
            );
        },
    },
    extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
});

// Reducer
export default slice.reducer;
