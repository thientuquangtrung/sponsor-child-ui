import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { useGetAllCampaignsQuery } from '@/redux/campaign/campaignApi';
import { campaignStatus, guaranteeType } from '@/config/combobox';

const FeaturedCampaign = () => {
    const { data: campaigns = [], isLoading, error } = useGetAllCampaignsQuery({ hasGuarantee: true });
    const campaignsWithGuaranteeType = guaranteeType
        .map((item) => ({
            ...item,
            campaigns: campaigns.filter((campaign) => campaign.guaranteeType === item.value),
        }))
        .filter((item) => item.campaigns.length > 0);

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
        <div className="container space-y-8 py-8 bg-gradient-to-b from-teal-100 to-rose-100 font-sans">
            <div className="flex items-center justify-center">
                <div className="border-t-2 border-teal-500 w-20"></div>
                <h1 className="text-2xl font-semibold mx-4">Chiến dịch gây quỹ nổi bật</h1>
                <div className="border-t-2 border-teal-500 w-20"></div>
            </div>
            {isLoading && <p className="text-center text-xl font-semibold">Đang tải...</p>}
            {campaignsWithGuaranteeType.map((item) => (
                <div key={item.value}>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            Tạo bởi: <span className="font-semibold">{item.label}</span>
                        </div>
                        <Link to="/donate-target" className="underline cursor-pointer">
                            Xem thêm
                        </Link>
                    </div>
                    <Carousel className="relative">
                        <CarouselPrevious />
                        <CarouselContent>
                            {item.campaigns.map((campaign) => (
                                <CarouselItem
                                    key={campaign.campaignID}
                                    itemsPerView={3}
                                    className="bg-white rounded-lg relative "
                                >
                                    <Link to={`/campaign-detail/${campaign.campaignID}`}>
                                        <img
                                            src={campaign?.thumbnailUrl || 'https://via.placeholder.com/400x300'}
                                            alt={campaign?.title}
                                            className="w-full h-48 object-cover rounded-t-md"
                                        />
                                        <span className="absolute top-[10px] left-[10px] bg-white text-rose-400 font-semibold rounded-full px-3 py-1 text-xs">
                                            {Math.ceil((new Date(campaign?.endDate) - new Date()) / (1000 * 60 * 60 * 24)) > 0
                                                ? `Còn ${Math.ceil(
                                                    (new Date(campaign?.endDate) - new Date()) / (1000 * 60 * 60 * 24),
                                                )} ngày`
                                                : 'Hết hạn gây quỹ'}
                                        </span>

                                        <span
                                            className={`
        bg-white  absolute top-[10px] right-[10px] font-semibold rounded-full px-3 py-1 text-xs
        ${getStatusColor(campaign.status)}
    `}
                                        >
                                            {campaignStatus.find(status => status.value === campaign.status)?.label || 'Không xác định'}
                                        </span>
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold line-clamp-2">{campaign?.title}</h3>
                                            <p className="text-sm text-gray-600 my-3">
                                                Tạo bởi{' '}
                                                <span className="font-bold text-yellow-500">
                                                    {campaign?.guaranteeName}
                                                </span>
                                            </p>
                                            <div className="relative mt-2">
                                                <div className="h-2 w-full bg-gray-300 rounded">
                                                    <div
                                                        className="h-2 bg-green-500 rounded"
                                                        style={{
                                                            width: `${(campaign?.raisedAmount / campaign?.targetAmount) * 100
                                                                }%`,
                                                            background: 'linear-gradient(to right, #7EDAD7, #69A6B8)',
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between">
                                                    <p className="text-sm mt-4">
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
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselNext />
                    </Carousel>
                </div>
            ))}
            {campaignsWithGuaranteeType.length === 0 && (
                <p className="text-center text-gray-600">Hiện chưa có chiến dịch nào được bảo lãnh.</p>
            )}
        </div>
    );
};

export default FeaturedCampaign;