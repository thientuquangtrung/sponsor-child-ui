import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCampaignDetailsByIdQuery } from '@/redux/campaign/campaignApi';
import { Calendar, CircleArrowOutUpLeft, CircleArrowOutDownRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CampaignActivities = () => {
    const { id } = useParams();
    const { data, isLoading, isError } = useGetCampaignDetailsByIdQuery(id);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const statusMapping = {
        0: { label: 'Đã lên lịch', color: 'bg-blue-100 text-blue-600' },
        1: { label: 'Đang tiến hành', color: 'bg-yellow-100 text-yellow-600' },
        2: { label: 'Đã hoàn thành', color: 'bg-green-100 text-green-600' },
        3: { label: 'Đã kết thúc', color: 'bg-red-100 text-red-600' },
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <span className="text-gray-500">Đang tải hoạt động...</span>
            </div>
        );
    }

    if (isError || !data || !data.campaignActivities) {
        return (
            <div className="flex justify-center items-center py-10">
                <span className="text-red-500">Đã có lỗi tải hoạt động.</span>
            </div>
        );
    }

    let { campaignActivities } = data;

    campaignActivities = [...campaignActivities].sort((a, b) => new Date(b.activityDate) - new Date(a.activityDate));

    if (!campaignActivities.length) {
        return (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <p className="text-gray-600 italic mt-8">Hiện chiến dịch chưa có hoạt động bổ sung.</p>
            </div>
        );
    }

    return (
        <div className="relative py-4">
            {/* Timeline vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-100 h-full"></div>

            <div>
                {campaignActivities.map((activity, index) => {
                    const status = statusMapping[activity.status] || {
                        label: 'Đang xử lý',
                        color: 'bg-gray-100 text-gray-600',
                    };

                    // Choose icon alternately
                    const Icon = index % 2 === 0 ? CircleArrowOutUpLeft : CircleArrowOutDownRight;
                    const iconColor = index % 2 === 0 ? 'text-rose-400' : 'text-blue-500';

                    const imageUrl = activity.imageFolderUrl || 'https://via.placeholder.com/150';

                    return (
                        <div
                            key={activity.activityID}
                            className={`h-44 relative flex items-center ${
                                index % 2 === 0 ? 'justify-start' : 'justify-end'
                            }`}
                        >
                            {/* Timeline Icon */}
                            <div className={`absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 mt-4`}>
                                <Icon className={`w-6 h-6 ${iconColor}`} />
                            </div>

                            {/* Card Content */}
                            <div
                                className={`p-3 rounded-lg shadow-md w-5/12 bg-white ${
                                    // Adjusted width and padding
                                    index % 2 === 0
                                        ? 'ml-4 bg-gradient-to-r from-sky-50 to-green-50'
                                        : 'mr-4 bg-gradient-to-r from-green-50 to-sky-50'
                                }`}
                            >
                                {/* Image */}
                                <img
                                    src={imageUrl}
                                    alt={activity.description || 'Activity Image'}
                                    className="rounded-md mb-2 w-full h-24 object-cover"
                                />
                                {/* Description */}
                                <h3 className="font-semibold text-md text-gray-900">{activity.description}</h3>
                                <div>
                                    <p className="text-sm text-teal-600 mt-2 font-medium">
                                        Chi phí: <span>{activity.cost.toLocaleString('vi-VN')} ₫</span>
                                    </p>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(activity.activityDate)}</span>
                                    </div>
                                    <Badge
                                        className={`py-1 px-2 rounded-md text-sm font-medium hover:bg-normal ${status.color}`}
                                    >
                                        {status.label}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CampaignActivities;
