import React from 'react';
import { Link } from 'react-router-dom';
import { useGetAllCampaignsQuery } from '@/redux/campaign/campaignApi';
import LoadingScreen from '@/components/common/LoadingScreen';
import { campaignStatus } from '@/config/combobox';

const CampaignList = ({ excludeCampaignId }) => {
    const {
        data: campaigns = [],
        isLoading,
        error,
    } = useGetAllCampaignsQuery({
        hasGuarantee: true,
    });
    const filteredCampaigns = campaigns.filter((campaign) => campaign.campaignID !== excludeCampaignId);

    if (isLoading) {
        return <div><LoadingScreen /></div>;
    }

    if (error) {
        return <p>Lỗi khi tải các chiến dịch: {error.message}</p>;
    }
    const getStatusColor = (status) => {
        switch (status) {
            case 0:
                return 'text-rose-300';
            case 1:
                return 'text-sky-500';
            case 2:
                return 'text-yellow-500';
            case 3:
                return 'text-red-500';
            case 4:
                return 'text-green-500';
            case 5:
                return 'text-purple-500';
            case 6:
                return 'text-gray-500';
            case 7:
                return 'text-orange-500';
            case 8:
                return 'text-teal-500';
            case 9:
                return 'text-blue-500';
            default:
                return 'text-gray-500';
        }
    };
    return (
        <div>
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold my-8">Các chiến dịch khác</h2>
                <Link to="/donate-target" className="text-lg font-semibold text-[#69A6B8] hover:underline">
                    Xem tất cả
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {filteredCampaigns.slice(0, 3).map((campaign, index) => (
                    <Link
                        key={campaign.id}
                        to={`/campaign-detail/${campaign.campaignID}`}
                        className="bg-white rounded shadow-md"
                    >
                        <div className="relative">
                            <img
                                src={campaign?.thumbnailUrl || 'https://via.placeholder.com/400x300'}
                                alt={campaign?.title}
                                className="w-full h-48 object-cover rounded-t-md"
                            />
                            <div className="flex justify-between items-center mt-2">
                                <span className="absolute top-[10px] left-[10px] bg-white text-rose-400 font-semibold rounded-full px-3 py-1 text-xs">
                                    {Math.ceil((new Date(campaign?.endDate) - new Date()) / (1000 * 60 * 60 * 24)) > 0
                                        ? `Còn ${Math.ceil(
                                            (new Date(campaign?.endDate) - new Date()) / (1000 * 60 * 60 * 24),
                                        )} ngày`
                                        : 'Hết hạn gây quỹ'}
                                </span>
                                <span
                                    className={`bg-white  absolute top-[10px] right-[10px] font-semibold rounded-full px-3 py-1 text-xs ${getStatusColor(campaign.status)}`}>
                                    {campaignStatus.find(status => status.value === campaign.status)?.label || 'Không xác định'}
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="mt-2 font-semibold line-clamp-2">{campaign?.title}</h3>
                            <p className="text-sm text-gray-600 my-3">
                                Tạo bởi <span className="font-bold text-yellow-500">{campaign?.guaranteeName}</span>
                            </p>
                            <div className="mt-2">
                                <div className="h-2 w-full bg-gray-300 rounded">
                                    <div
                                        className="h-2 bg-green-500 rounded"
                                        style={{
                                            width: `${(campaign?.raisedAmount / campaign?.targetAmount) * 100}%`,
                                            background: 'linear-gradient(to right, #7EDAD7, #69A6B8)',
                                        }}
                                    ></div>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm mt-1">
                                        Đã đạt được:{' '}
                                        <span className="font-bold text-[#69A6B8]">
                                            {campaign?.raisedAmount.toLocaleString()} VND
                                        </span>
                                    </p>
                                    <p className="font-bold text-sm">
                                        {campaign?.raisedAmount >= campaign?.targetAmount
                                            ? '100%'
                                            : Math.floor((campaign?.raisedAmount / campaign?.targetAmount) * 100) + '%'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CampaignList;
