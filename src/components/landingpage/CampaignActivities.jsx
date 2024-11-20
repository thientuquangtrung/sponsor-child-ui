import React from 'react';
import activity from '@/assets/images/activity.png';
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
                <span className="text-gray-500">Loading campaign activities...</span>
            </div>
        );
    }

    if (isError || !data || !data.campaignActivities) {
        return (
            <div className="flex justify-center items-center py-10">
                <span className="text-red-500">Error loading campaign activities.</span>
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
        <div className="relative">
            <img src={activity} alt="Campaign Activity" className="w-[50%] mx-auto" />
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
                    const iconColor = index % 2 === 0 ? 'text-rose-300' : 'text-yellow-500';

                    const imageUrl = activity.imageFolderUrl || 'https://via.placeholder.com/150';

                    return (
                        <div
                            key={activity.activityID}
                            className={`relative flex items-center ${
                                index % 2 === 0 ? 'justify-start' : 'justify-end'
                            }`}
                        >
                            {/* Timeline Icon */}
                            <div className={`absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 mt-4`}>
                                <Icon className={`w-6 h-6 ${iconColor}`} />
                            </div>

                            {/* Card Content */}
                            <div
                                className={`p-4 rounded-lg shadow-lg w-5/12 ${
                                    index % 2 === 0 ? 'ml-8 border-r-2 border-rose-300' : 'mr-8 border-l-2 border-yellow-500'
                                }`}
                            >
                                {/* Image */}
                                <img
                                    src={imageUrl}
                                    alt={activity.description || 'Activity Image'}
                                    className="rounded-md mb-4 w-full h-32 object-cover"
                                />
                                {/* Description */}
                                <h3 className="font-bold text-md text-gray-900">{activity.description}</h3>
                                <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
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
