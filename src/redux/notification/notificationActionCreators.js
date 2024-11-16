import { slice } from './notificationReducer';
import { revertAll } from '../globalActions';

export const NewNotification = (newNotification) => {
    return (dispatch, getState) => {
        const formattedNotification = formatNotification(newNotification);
        dispatch(slice.actions.newNotification(formattedNotification));
    };
};

//============== format notification functions ==============
const formatNotification = (notification) => {
    return {
        id: notification.id,
        name: notification.user?.fullName || 'Unknown User',
        action: getNotificationAction(notification.type, notification.campaign?.name),
        message: notification.message,
        time: formatTime(notification.createdAt),
        profileImage: notification.user?.avatarUrl || 'https://via.placeholder.com/400x300',
        isRead: notification.isRead
    };
};

const getNotificationAction = (type, campaignName) => {
    const actions = {
        0: 'đã bình luận về hoạt động của bạn',
        1: `đã quyên góp cho chiến dịch "${campaignName}"`,
        2: 'đã xác nhận giải ngân',
        3: 'đã thích hoạt động mới',
        // Add more types as needed
    };
    return actions[type] || 'đã thực hiện một hành động';
};

const formatTime = (createdAt) => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} giờ trước`;
    return `${Math.floor(diffMinutes / 1440)} ngày trước`;
};
