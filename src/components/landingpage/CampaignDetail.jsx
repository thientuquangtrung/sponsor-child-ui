import React, { useState } from 'react';
import { Clock, MapPin, Check, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CampaignList from './CampaignList';
import logo from '@/assets/images/logo-short.png';
import campaign1 from '@/assets/images/campaign_1.jpg';
import DonationList from './DonationList';
import { useNavigate } from 'react-router-dom';

const CampaignDetail = () => {
    const [activeTab, setActiveTab] = useState('story');
    const navigate = useNavigate();

    const navigateToInfoDonate = (id) => {
        navigate(`/donate-target/info-donate/${id}`);
    };

    const campaign = {
        title: 'Ủng hộ các Gia đình chịu ảnh hưởng chất độc da cam/Dioxin',
        description: 'Thắp sáng tương lai cho các gia đình chịu ảnh hưởng bởi chất độc da cam.',
        targetAmount: 1000000000,
        raisedAmount: 675955281,
        daysLeft: 40,
        address: '35 Đường Hồ Mễ Trì, Phường Mễ Trì, Quận Nam Từ Liêm, Thành Phố Hà Nội',
    };

    const donations = [
        { donor: 'PHAM DUC NAM', amount: '10.000 VND', time: '22:08:17 - 28/08/2024' },
        { donor: 'VOONG MINH ANH', amount: '50.000 VND', time: '21:42:58 - 28/08/2024' },
        { donor: 'NGUYEN LE TRUNG THANH', amount: '500.000 VND', time: '21:30:28 - 28/08/2024' },
        { donor: 'CHUYỂN TIỀN LIÊN NGÂN HÀNG', amount: '50.000 VND', time: '21:21:56 - 28/08/2024' },
        { donor: 'TRAN NGOC ANH', amount: '200.000 VND', time: '20:25:28 - 28/08/2024' },
        { donor: 'NGUYEN MINH QUANG', amount: '4.000 VND', time: '20:18:06 - 28/08/2024' },
        { donor: 'CHUYỂN TIỀN LIÊN NGÂN HÀNG', amount: '20.000 VND', time: '20:06:05 - 28/08/2024' },
        { donor: 'CHUYỂN TIỀN LIÊN NGÂN HÀNG', amount: '50.000 VND', time: '20:00:44 - 28/08/2024' },
        { donor: 'PHAM QUANG THANH', amount: '5.000.000 VND', time: '19:00:09 - 28/08/2024' },
        { donor: 'NGO MANH DUNG', amount: '20.000 VND', time: '18:49:34 - 28/08/2024' },
    ];

    const partners = [
        {
            name: 'Nguyễn Văn Ngọc',
            raised: '1.000.000 VND',
            startDate: '24/08/2024',
            avatar: 'https://via.placeholder.com/50',
        },
        {
            name: 'phunghiep17042000',
            raised: '2.000 VND',
            startDate: '09/08/2024',
            avatar: 'https://via.placeholder.com/50',
        },
        {
            name: 'Ông chủ Kim 2k',
            raised: '0 VND',
            startDate: '10/08/2024',
            avatar: 'https://via.placeholder.com/50',
        },
        {
            name: 'ZENOR BENEVOLENT SOCIAL ENTERPRISE JSC',
            raised: '0 VND',
            startDate: '12/08/2024',
            avatar: 'https://via.placeholder.com/50',
        },
        {
            name: 'Luce',
            raised: '0 VND',
            startDate: '17/08/2024',
            avatar: 'https://via.placeholder.com/50',
        },
        {
            name: 'Tuan Tranvan',
            raised: '0 VND',
            startDate: '17/08/2024',
            avatar: 'https://via.placeholder.com/50',
        },
    ];

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row md:space-x-8">
                <div className="w-full md:w-3/5 bg-white">
                    <h1 className="text-2xl font-semibold">{campaign.title}</h1>
                    <div className="campaign-image-container relative mb-6">
                        <img src={campaign1} alt={campaign.title} className="w-full h-auto rounded-lg shadow-xl mt-6" />
                        <img src={logo} alt="Logo" className="absolute top-0 right-0 m-2 w-20 h-20" />
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="flex space-x-2 bg-inherit">
                            <TabsTrigger value="story" className={`relative py-1 px-4 text-md font-medium`}>
                                Câu chuyện
                            </TabsTrigger>
                            <TabsTrigger value="activities" className={`relative py-1 px-4 text-md font-medium`}>
                                Hoạt động
                            </TabsTrigger>
                            <TabsTrigger value="donations" className={`relative py-1 px-4 text-md font-medium`}>
                                Danh sách ủng hộ ({donations.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="story" className="p-4">
                            <p>
                                Cuộc chiến tranh hóa học do Mỹ tiến hành ở Việt Nam từ năm 1961 đến năm 1971 đã làm cho
                                4,8 triệu người Việt Nam bị phơi nhiễm, hơn 3 triệu người là nạn nhân; nhiều người mắc
                                bệnh hiểm nghèo, bị dị dạng, dị tật, thiểu năng trí tuệ; di chứng da cam đã truyền sang
                                thế hệ thứ 4, gây biết bao thảm cảnh cho các thế hệ người Việt Nam. Mặc dù được Đảng,
                                Nhà nước, các cấp, các ngành quan tâm, ban hành các chính sách hỗ trợ, nhưng hầu hết nạn
                                nhân và gia đình NNCĐDC vẫn gặp nhiều khó khăn, thiếu thốn cả về vật chất lẫn tinh thần.
                                Nhiều hoàn cảnh nghèo khó, bệnh tật làm cho gia đình kiệt quệ, do vậy rất cần sự sẻ
                                chia, giúp đỡ từ cộng đồng, để nạn nhân có cơ hội được chăm sóc sức khỏe, khám chữa
                                bệnh, cải thiện cuộc sống, vượt khó vươn lên hòa nhập cộng đồng.
                            </p>
                        </TabsContent>

                        <TabsContent value="activities" className="p-4">
                            <p className="text-gray-400 italic text-center mt-8">Chiến dịch chưa có hoạt động</p>
                        </TabsContent>

                        <TabsContent value="donations" className="p-4">
                            <DonationList donations={donations} />
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="w-full md:w-2/5 mt-4 md:mt-0 bg-white">
                    <div className="shadow-xl p-4 rounded-lg">
                        <div className="flex items-center mb-4 space-x-5">
                            <img
                                src="https://static.thiennguyen.app/public/user/profile/2024/7/10/1e9cee97-78a0-4b2f-b655-1af4ac05a0e9.jpg"
                                className="w-12 h-12 rounded-full border-[#69A6B8] border-[3px]"
                            />
                            <div>
                                <span className="text-gray-500">Tiền ủng hộ được chuyển đến</span>
                                <div className="flex items-center">
                                    <h1 className="w-[80%] text-lg font-bold text-[#69A6B8] truncate max-w-xs mr-2">
                                        Quỹ nạn nhân chất độc da cam
                                    </h1>
                                    <div className="bg-[#69A6B8] p-1 rounded-full">
                                        <Check className="text-white" size={10} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="my-4 border-2 border-gray-100" />

                        <div className="flex flex-row justify-between">
                            <div className="flex items-center mt-2 space-x-3">
                                <div className="bg-amber-300 p-2 rounded-full border border-white">
                                    <Target className="text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold">Mục tiêu chiến dịch</div>
                                    <div className="text-lg font-bold text-[#69A6B8]">
                                        {campaign.targetAmount.toLocaleString('vi-VN')} VNĐ
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center mt-2 space-x-3">
                                <div className="bg-rose-300 p-2 rounded-full border border-white">
                                    <Clock className="text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold">Thời gian còn lại</div>
                                    <div className="text-lg font-bold text-[#69A6B8]">{campaign.daysLeft} ngày</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center mt-6">
                            <MapPin className="text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600">{campaign.address}</span>
                        </div>

                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="h-2.5 rounded-full"
                                    style={{
                                        width: `${(campaign.raisedAmount / campaign.targetAmount) * 100}%`,
                                        background: 'linear-gradient(to right, #7EDAD7, #69A6B8)',
                                    }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-2 text-sm text-gray-600">
                                <div>
                                    Đã đạt được:{' '}
                                    <span className="text-[#69A6B8] font-bold">
                                        {campaign.raisedAmount.toLocaleString('vi-VN')} VNĐ
                                    </span>
                                </div>
                                <p>{Math.round((campaign.raisedAmount / campaign.targetAmount) * 100)}%</p>
                            </div>
                        </div>

                        <div className="flex mt-4 space-x-2">
                            <Button variant="outline" className="flex-1 hover:bg-zinc-100">
                                Đồng hành gây quỹ
                            </Button>
                            <Button className="flex-1 bg-gradient-to-r from-primary to-secondary text-white" onClick={navigateToInfoDonate}>
                                Ủng hộ
                            </Button>
                        </div>
                    </div>

                    <div className="mt-12 shadow-xl p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-black">
                            Đồng hành gây quỹ <span className="text-[#69A6B8]">({partners.length})</span>
                        </h3>
                        <div className="mt-4 space-y-3 h-[300px] overflow-y-auto">
                            {partners.map((partner, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <img src={partner.avatar} alt={partner.name} className="w-10 h-10 rounded-full" />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800">{partner.name}</h4>
                                        <p className="text-sm text-gray-500 italic">Đã kêu gọi {partner.raised}</p>
                                        <p className="text-xs text-gray-400 italic">
                                            Ngày bắt đầu: {partner.startDate}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 shadow-xl p-4 rounded-lg shadow-gray-300">
                        <h3 className="text-lg font-semibold text-black">Thông tin người vận động</h3>

                        <hr className="my-4 border-2 border-gray-100" />

                        <div className="flex items-center mb-4 space-x-5">
                            <img
                                src="https://static.thiennguyen.app/public/user/profile/2024/7/10/1e9cee97-78a0-4b2f-b655-1af4ac05a0e9.jpg"
                                className="w-14 h-14 rounded-full border-[#69A6B8] border-[3px]"
                            />
                            <div>
                                <div className="flex items-center">
                                    <h1 className="w-[80%] text-lg font-bold text-[#69A6B8] truncate max-w-xs mr-2">
                                        Quỹ nạn nhân chất độc da cam
                                    </h1>
                                    <div className="bg-[#69A6B8] p-1 rounded-full">
                                        <Check className="text-white" size={10} />
                                    </div>
                                </div>
                                <span className="text-xs bg-teal-50 text-teal-600 px-2 py-1 rounded-full inline-block mt-1">
                                    Tổ chức
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-2">
                            <img
                                className="w-4"
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/1200px-Gmail_icon_%282020%29.svg.png"
                            />
                            <a
                                href="https://mail.google.com/mail/u/0/#inbox?compose=new"
                                className="text-sm text-gray-700"
                            >
                                quydacamtrunguong@gmail.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="mt-16 border-2 border-gray-100" />

            <CampaignList />
        </div>
    );
};

export default CampaignDetail;
