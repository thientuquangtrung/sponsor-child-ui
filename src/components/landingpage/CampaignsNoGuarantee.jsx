import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useGetAllCampaignsQuery } from '@/redux/campaign/campaignApi';
import { Eye, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CampaignsNoGuarantee = () => {
    const [URLSearchParams] = useSearchParams();
    const {
        data: campaigns = [],
        isLoading,
        error,
    } = useGetAllCampaignsQuery({
        searchParams: URLSearchParams.toString(),
        hasGuarantee: false,
    });

    if (isLoading) {
        return <p>Đang tải danh sách chiến dịch...</p>;
    }

    if (error) {
        return <p>Lỗi khi tải dữ liệu: {error.message}</p>;
    }

    return (
        <div
            className="p-8 flex-1"
            style={{
                backgroundImage: `url(${'https://i.pinimg.com/control/564x/1a/05/07/1a05071b4b031859c93fa9657f05c53d.jpg'})`,
            }}
        >
            <h1 className="text-4xl font-extrabold mb-12 text-center bg-gradient-to-r from-teal-400 to-pink-500 text-transparent bg-clip-text">
                Hãy cùng chúng tôi bảo trợ các chiến dịch tuyệt vời này và mang lại niềm vui cho những trẻ em cần sự
                giúp đỡ!
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {campaigns.length > 0 &&
                    campaigns.map((campaign) => (
                        <Link
                            key={campaign.campaignID}
                            to={`/campaigns-no-guarantee-detail/${campaign.campaignID}`}
                            className="bg-white shadow-xl rounded-lg flex flex-col justify-between"
                        >
                            <div>
                                <img
                                    src={campaign?.thumbnailUrl}
                                    alt={campaign.title}
                                    className="w-full h-[250px] object-cover mb-4"
                                />
                                <h3 className="text-xl font-bold mb-2 px-4">{campaign?.title}</h3>
                                <div className="flex flex-row space-x-2 p-4">
                                    <MapPin size={24} />
                                    <p className="text-md text-gray-600">
                                        {`${campaign?.childProfile.ward}, ${campaign?.childProfile.district}, ${campaign?.childProfile.province}`}
                                    </p>
                                </div>
                            </div>
                            <Button className="space-x-2 bg-gradient-to-r from-teal-300 to-secondary text-white text-md font-semibold py-2 px-4 m-4 rounded-lg transition">
                                <Eye size={20} />
                                <span>Xem chi tiết</span>
                            </Button>
                        </Link>
                    ))}
            </div>
            {campaigns.length === 0 && (
                <p className="h-full w-full text-center text-2xl font-bold">Không tìm thấy chiến dịch nào</p>
            )}
        </div>
    );
};

export default CampaignsNoGuarantee;
