import React, { useState } from 'react';
import banner from '@/assets/images/banner.png';

const DonateTarget = () => {
    const [activeTab, setActiveTab] = useState('all');

    const campaigns = [
        {
            daysLeft: 38,
            image: 'https://chuthapdophutho.org.vn/uploads/news/2016_12/e2.jpg',
            title: 'Ủng hộ các Gia đình chịu ảnh hưởng chất độc da cam/Dioxin',
            description: 'Quỹ nạn nhân chất độc da cam Dioxin Việt Nam',
            raisedAmount: 700904077,
            targetAmount: 1000000000,
        },
        {
            daysLeft: 122,
            image: 'https://cdn.vntour.com.vn/storage/media/img/2016/08/25/net-hon-nhien-tre-em-vung-cao5_1472097871.jpg',
            title: 'Lời khẩn cầu của một người mẹ tìm liều thuốc mắc nhất thế giới để cứu mạng con',
            description: 'Quynh Thai',
            raisedAmount: 17139519164,
            targetAmount: 40000000000,
        },
        {
            daysLeft: 148,
            image: 'https://toquoc.mediacdn.vn/2020/6/1/ngam-net-dep-hon-nhien-cua-tre-em-vung-cao10-15909769396692063692588.jpg',
            title: 'Ta thêm lòng tiếp sức, để bớt cuộc chia ly năm 2024',
            description: 'Như chưa hề có cuộc chia ly',
            raisedAmount: 1444774693,
            targetAmount: 5000000000,
        },
        {
            daysLeft: 103,
            image: 'https://static.thiennguyen.app/public/donate-target/photo/2023/12/5/a82f2737-5fa3-4f50-88ff-e42dd797daa9.jpg', // Replace with actual image URL
            title: 'Kêu gọi quỹ Mixed Nuts - phụng sự ước mơ Người Thầy G.M.R',
            description: 'Biến Ước Mơ Thành Hiện Thực',
            raisedAmount: 86391855,
            targetAmount: 200000000,
        },
        {
            daysLeft: 60,
            image: 'https://static.thiennguyen.app/public/donate-target/photo/2024/8/8/7b89fee8-efb8-45e4-bfd0-c7c2365bd485.jpg', // Replace with actual image URL
            title: 'VIÊN PHONG 2 - TRAO YÊU THƯƠNG - TRAO HI VỌNG',
            description: 'Biến Ước Mơ Thành Hiện Thực',
            raisedAmount: 15890686,
            targetAmount: 20000000,
        },
        {
            daysLeft: 61,
            image: 'https://static.thiennguyen.app/public/donate-target/photo/2024/2/14/a6e9b23e-8819-412f-bdc0-34fa886375b4.jpg', // Replace with actual image URL
            title: 'QUỸ BẢO VỆ SỰ SỐNG ( PHÒNG SINH, TRỒNG CÂY) Lần 2',
            description: 'Cộng Đồng Kết Nối Hạ Tầng 3 Miền Bắc Trung Nam',
            raisedAmount: 59526127,
            targetAmount: 72000000,
        },
        {
            daysLeft: 1,
            image: 'https://static.thiennguyen.app/public/donate-target/photo/2024/8/14/5b3568cb-e5d1-4c26-bccf-d4bed0258df2.jpg', // Replace with actual image URL
            title: 'xin mọi người giúp đỡ hoàn cảnh chị Tuổi',
            description: 'Thiện Nguyện Những Người Con Hải Hậu Nam Định',
            raisedAmount: 58460434,
            targetAmount: 100000000,
        },
        {
            daysLeft: 242,
            image: 'https://static.thiennguyen.app/public/donate-target/photo/2024/5/8/8902f1f1-24c2-4fce-93e9-a6cb19bd01ce.jpg',
            title: 'Phủ xanh Đất Mẹ 63 tỉnh thành',
            description: 'Gieo Mầm Xanh Toàn Cầu',
            raisedAmount: 100602396,
            targetAmount: 1000000000,
        },
        {
            daysLeft: 15,
            image: 'https://static.thiennguyen.app/public/donate-target/photo/2024/8/27/929cebbe-2560-472d-88c6-3432276dcac3.jpg',
            title: 'TRĂNG THU BIÊN CƯƠNG',
            description: 'TRUYỀN HÌNH QPVN',
            raisedAmount: 2186000,
            targetAmount: 500000000,
        },
    ];

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="mx-auto py-8 px-4">
            <div className="relative bg-cover bg-center">
                <img src={banner} alt="banner" className="w-full object-cover rounded-lg shadow-md" />
            </div>

            <div className="flex items-center justify-center my-8">
                <div className="border-t-2 border-teal-500 w-16"></div>
                <h1 className="text-2xl font-semibold mx-4">Chiến dịch gây quỹ nổi bật</h1>
                <div className="border-t-2 border-teal-500 w-16"></div>
            </div>

            <div className="flex justify-between items-center mb-4 flex-wrap">
                <div className="flex space-x-2 flex-wrap">
                    <select className="bg-white border border-gray-300 rounded px-4 py-2 mb-2">
                        <option>Đang thực hiện</option>
                        <option>Đã kết thúc</option>
                    </select>
                    <select className="bg-white border border-gray-300 rounded px-4 py-2 mb-2">
                        <option>Danh mục</option>
                        <option>Sức khỏe</option>
                        <option>Giáo dục</option>
                        <option>Môi trường</option>
                    </select>
                    <select className="bg-white border border-gray-300 rounded px-4 py-2 mb-2">
                        <option>Khu vực</option>
                        <option>Miền Bắc</option>
                        <option>Miền Trung</option>
                        <option>Miền Nam</option>
                    </select>
                </div>

                <div className="relative mb-2">
                    <input
                        type="text"
                        className="bg-white border border-gray-300 rounded-full pl-10 pr-4 py-2 w-64"
                        placeholder="Tìm kiếm tên chiến dịch"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-4.35-4.35M16.11 9.17a6.94 6.94 0 11-13.87 0 6.94 6.94 0 0113.87 0z"
                            />
                        </svg>
                    </span>
                </div>
            </div>

            <div className="flex justify-start space-x-8 mb-4">
                {['all', 'organization', 'individual'].map((tab) => (
                    <button
                        key={tab}
                        className={`text-lg font-semibold ${
                            activeTab === tab ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-700'
                        }`}
                        onClick={() => handleTabClick(tab)}
                    >
                        {tab === 'all' ? 'Tất cả' : tab === 'organization' ? 'Tổ chức' : 'Cá nhân'}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {campaigns.map((campaign, index) => (
                    <div key={index} className="bg-white rounded shadow-md overflow-hidden">
                        <div className="relative">
                            <img
                                src={campaign.image}
                                alt={campaign.title}
                                className="w-full h-48 object-cover rounded-t-md"
                            />
                            <div className="absolute top-2 left-2 bg-white text-rose-400 font-semibold rounded-full px-3 py-1 text-xs">
                                Còn {campaign.daysLeft} ngày
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="mt-2 font-semibold line-clamp-2">{campaign.title}</h3>
                            <p className="text-sm text-gray-600 my-3">
                                Tạo bởi <span className="font-bold text-yellow-500">{campaign.description}</span>
                            </p>
                            <div className="mt-2">
                                <div className="h-2 w-full bg-gray-300 rounded">
                                    <div
                                        className="h-2 bg-green-500 rounded"
                                        style={{
                                            width: `${(campaign.raisedAmount / campaign.targetAmount) * 100}%`,
                                            background: 'linear-gradient(to right, #7EDAD7, #69A6B8)',
                                        }}
                                    ></div>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm mt-1">
                                        Đã đạt được:{' '}
                                        <span className="font-bold text-[#69A6B8]">
                                            {campaign.raisedAmount.toLocaleString()} VND
                                        </span>
                                    </p>
                                    <p className="font-bold text-sm">
                                        {Math.round((campaign.raisedAmount / campaign.targetAmount) * 100)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DonateTarget;

// import React, { useState } from 'react';
// import banner from '@/assets/images/banner.png';
// import { Link } from 'react-router-dom'; // Import Link from react-router-dom
// import { useGetAllCampaignsQuery } from '@/redux/campaign/campaignApi'; // Import campaign API

// const DonateTarget = () => {
//     const [activeTab, setActiveTab] = useState('all');
//     const { data: campaigns = [], isLoading, error } = useGetAllCampaignsQuery(); // Fetch campaigns using the API

//     const handleTabClick = (tab) => {
//         setActiveTab(tab);
//     };

//     if (isLoading) {
//         return <p>Loading campaigns...</p>;
//     }

//     if (error) {
//         return <p>Error loading campaigns: {error.message}</p>;
//     }

//     return (
//         <div className="mx-auto py-8 px-4">
//             <div className="relative bg-cover bg-center">
//                 <img src={banner} alt="banner" className="w-full object-cover rounded-lg shadow-md" />
//             </div>

//             <div className="flex items-center justify-center my-8">
//                 <div className="border-t-2 border-teal-500 w-16"></div>
//                 <h1 className="text-2xl font-semibold mx-4">Chiến dịch gây quỹ nổi bật</h1>
//                 <div className="border-t-2 border-teal-500 w-16"></div>
//             </div>

//             <div className="flex justify-start space-x-8 mb-4">
//                 {['all', 'organization', 'individual'].map((tab) => (
//                     <button
//                         key={tab}
//                         className={`text-lg font-semibold ${
//                             activeTab === tab ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-700'
//                         }`}
//                         onClick={() => handleTabClick(tab)}
//                     >
//                         {tab === 'all' ? 'Tất cả' : tab === 'organization' ? 'Tổ chức' : 'Cá nhân'}
//                     </button>
//                 ))}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//                 {campaigns.map((campaign) => (
//                     <Link
//                         key={campaign.campaignID}
//                         to={`/campaign-detail/${campaign.campaignID}`} // Navigate to CampaignDetail page
//                         className="bg-white rounded shadow-md overflow-hidden"
//                     >
//                         <div className="relative">
//                             <img
//                                 src={campaign.thumbnailUrl || 'https://via.placeholder.com/400x300'}
//                                 alt={campaign.title}
//                                 className="w-full h-48 object-cover rounded-t-md"
//                             />
//                             <div className="absolute top-2 left-2 bg-white text-rose-400 font-semibold rounded-full px-3 py-1 text-xs">
//                                 {/* Calculate days left */}
//                                 Còn {Math.max(0, Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)))} ngày
//                             </div>
//                         </div>
//                         <div className="p-4">
//                             <h3 className="mt-2 font-semibold line-clamp-2">{campaign.title}</h3>
//                             <p className="text-sm text-gray-600 my-3">
//                                 {/* Show guaranteeName instead of guaranteeID */}
//                                 Tạo bởi <span className="font-bold text-yellow-500">{campaign.guaranteeName}</span>
//                             </p>
//                             <div className="mt-2">
//                                 <div className="h-2 w-full bg-gray-300 rounded">
//                                     <div
//                                         className="h-2 bg-green-500 rounded"
//                                         style={{
//                                             width: `${(campaign.raisedAmount / campaign.targetAmount) * 100}%`,
//                                             background: 'linear-gradient(to right, #7EDAD7, #69A6B8)',
//                                         }}
//                                     ></div>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <p className="text-sm mt-1">
//                                         Đã đạt được:{' '}
//                                         <span className="font-bold text-[#69A6B8]">
//                                             {campaign.raisedAmount.toLocaleString()} VND
//                                         </span>
//                                     </p>
//                                     <p className="font-bold text-sm">
//                                         {Math.round((campaign.raisedAmount / campaign.targetAmount) * 100)}%
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </Link>
//                 ))}
//             </div>
//         </div>
//     );
// };
// export default DonateTarget;
