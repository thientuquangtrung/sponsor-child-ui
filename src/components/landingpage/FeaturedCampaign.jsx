
// import React, { useRef } from 'react';
// import { Link } from 'react-router-dom';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// const FeaturedCampaign = () => {
//     const campaigns = [
//         { id: 1, image: 'https://file.hstatic.net/1000253775/article/mainpost_bffe369e7a9946ed9516abd5c36b828d.jpg', name: 'Xây trường cho em', creator: 'Tổ chức Vinamilk', progress: 14, goal: 20506000, daysLeft: 29 },
//         { id: 2, image: 'https://file.hstatic.net/1000253775/article/mainpost_bffe369e7a9946ed9516abd5c36b828d.jpg', name: 'Xây trường cho em', creator: 'Tổ chức Vinamilk', progress: 14, goal: 20506000, daysLeft: 29 },
//         { id: 3, image: 'https://file.hstatic.net/1000253775/article/mainpost_bffe369e7a9946ed9516abd5c36b828d.jpg', name: 'Xây trường cho em', creator: 'Tổ chức Vinamilk', progress: 14, goal: 20506000, daysLeft: 29 },
//         { id: 4, image: 'https://file.hstatic.net/1000253775/article/mainpost_bffe369e7a9946ed9516abd5c36b828d.jpg', name: 'Xây trường cho em', creator: 'Tổ chức Vinamilk', progress: 14, goal: 20506000, daysLeft: 29 },
//         { id: 5, image: 'https://file.hstatic.net/1000253775/article/mainpost_bffe369e7a9946ed9516abd5c36b828d.jpg', name: 'Xây trường cho em', creator: 'Tổ chức Vinamilk', progress: 14, goal: 20506000, daysLeft: 29 },
//         { id: 6, image: 'https://file.hstatic.net/1000253775/article/mainpost_bffe369e7a9946ed9516abd5c36b828d.jpg', name: 'Xây trường cho em', creator: 'Tổ chức Vinamilk', progress: 14, goal: 20506000, daysLeft: 29 },
//         { id: 7, image: 'https://file.hstatic.net/1000253775/article/mainpost_bffe369e7a9946ed9516abd5c36b828d.jpg', name: 'Xây trường cho em', creator: 'Tổ chức Vinamilk', progress: 14, goal: 20506000, daysLeft: 29 },
//     ];

//     const scrollContainerRef = useRef(null);

//     const scroll = (direction) => {
//         if (scrollContainerRef.current) {
//             scrollContainerRef.current.scrollBy({
//                 left: direction === 'right' ? 300 : -300,
//                 behavior: 'smooth',
//             });
//         }
//     };

//     return (
//         <div className="container mx-auto py-8 bg-[#f9f3ee]">
//             <h2 className="text-2xl font-bold mb-6 text-center">Chiến dịch gây quỹ nổi bật</h2>
//             <div className="flex justify-end mb-4">
//                 <Link to="/" className="text-[#E17153] cursor-pointer font-semibold">
//                     Xem thêm
//                 </Link>
//             </div>
//             <div className="relative">
//                 <button
//                     className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white text-gray-600 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 z-10"
//                     onClick={() => scroll('left')}
//                 >
//                     <ChevronLeft size={20} />
//                 </button>

//                 <div
//                     ref={scrollContainerRef}
//                     className="flex overflow-x-auto no-scrollbar space-x-4"
//                 >
//                     {campaigns.map((campaign) => (
//                         <div key={campaign.id} className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md relative">
//                             <img
//                                 src={campaign.image}
//                                 alt={campaign.name}
//                                 className="w-full h-48 object-cover rounded-t-lg"
//                             />
//                             <div className="absolute top-2 left-2 bg-white  text-xs py-1 px-2 rounded">
//                                 Còn {campaign.daysLeft} ngày
//                             </div>
//                             <div className="p-4">
//                                 <h3 className="text-lg font-semibold">{campaign.name}</h3>
//                                 <p className="text-sm text-gray-500">Tạo bởi: <span className="text-orange-500">{campaign.creator}</span></p>
//                                 <div className="mt-4 relative">
//                                     <div className="w-full bg-gray-200 rounded-full h-2.5">
//                                         <div
//                                             className="h-2.5 rounded-full"
//                                             style={{
//                                                 width: `${campaign.progress}%`,
//                                                 background: 'linear-gradient(to right,#feb47b, #ff7e5f)'
//                                             }}
//                                         ></div>
//                                     </div>
//                                     <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 pr-2">
//                                         {campaign.progress}%
//                                     </div>
//                                     <div className="text-sm text-gray-500 mt-4">
//                                         Đã đạt được <span className="text-orange-500 font-bold">{campaign.goal.toLocaleString('vi-VN')} VNĐ</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <button
//                     className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-white text-gray-600 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 z-10"
//                     onClick={() => scroll('right')}
//                 >
//                     <ChevronRight size={20} />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default FeaturedCampaign;

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FeaturedCampaign = () => {
    const campaigns = [
        { id: 1, image: 'https://file.hstatic.net/1000253775/article/mainpost_bffe369e7a9946ed9516abd5c36b828d.jpg', name: 'Xây trường cho em', creator: 'Tổ chức Vinamilk', progress: 14, goal: 20506000, daysLeft: 29 },
        { id: 2, image: 'https://file.hstatic.net/1000253775/article/mainpost_bffe369e7a9946ed9516abd5c36b828d.jpg', name: 'Hỗ trợ trẻ em vùng cao', creator: 'Quỹ Bảo trợ trẻ em', progress: 25, goal: 15000000, daysLeft: 45 },
        { id: 3, image: 'https://file.hstatic.net/1000253775/article/mainpost_bffe369e7a9946ed9516abd5c36b828d.jpg', name: 'Xây dựng thư viện số', creator: 'Hội Khuyến học', progress: 60, goal: 10000000, daysLeft: 15 },
        { id: 4, image: 'https://file.hstatic.net/1000253775/article/mainpost_bffe369e7a9946ed9516abd5c36b828d.jpg', name: 'Chương trình học bổng', creator: 'Quỹ Hy vọng', progress: 75, goal: 30000000, daysLeft: 60 },
        { id: 5, image: 'https://file.hstatic.net/1000253775/article/mainpost_bffe369e7a9946ed9516abd5c36b828d.jpg', name: 'Bảo tồn di sản văn hóa', creator: 'Hội Di sản Việt Nam', progress: 40, goal: 50000000, daysLeft: 90 },
        { id: 6, image: 'https://file.hstatic.net/1000253775/article/mainpost_bffe369e7a9946ed9516abd5c36b828d.jpg', name: 'Hỗ trợ người già neo đơn', creator: 'Hội Chữ thập đỏ', progress: 30, goal: 25000000, daysLeft: 30 },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef(null);

    const visibleCampaigns = campaigns.slice(currentIndex, currentIndex + 3);

    const scroll = (direction) => {
        if (direction === 'right' && currentIndex + 3 < campaigns.length) {
            setCurrentIndex(prevIndex => prevIndex + 1);
        } else if (direction === 'left' && currentIndex > 0) {
            setCurrentIndex(prevIndex => prevIndex - 1);
        }
    };

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
    }, [currentIndex]);

    return (
        <div className="container mx-auto py-8 bg-[#c1e2e2]">
            <h2 className="text-3xl font-bold mb-6 text-center">Chiến dịch gây quỹ nổi bật</h2>
            <div className="flex justify-end mb-4">
                <Link to="/" className="underline cursor-pointer font-semibold">
                    Xem thêm
                </Link>
            </div>
            <div className="relative">
                <button
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white text-gray-600 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 z-10"
                    onClick={() => scroll('left')}
                    disabled={currentIndex === 0}
                >
                    <ChevronLeft size={20} />
                </button>

                <div
                    ref={scrollContainerRef}
                    className="grid grid-cols-3 gap-4 overflow-hidden"
                >
                    {campaigns.map((campaign) => (
                        <Link to={`/campaign-detail/${campaign.id}`} key={campaign.id} className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md relative">
                            <img
                                src={campaign.image}
                                alt={campaign.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="absolute top-2 left-2 bg-white text-xs py-1 px-2 rounded">
                                Còn {campaign.daysLeft} ngày
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">{campaign.name}</h3>
                                <p className="text-sm text-gray-500">Tạo bởi: <span className="text-yellow-500">{campaign.creator}</span></p>
                                <div className="mt-4 relative">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="h-2.5 rounded-full"
                                            style={{
                                                width: `${campaign.progress}%`,
                                                background: 'linear-gradient(to right,#adf0ef, #27aca9)'
                                            }}
                                        ></div>
                                    </div>
                                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 pr-2">
                                        {campaign.progress}%
                                    </div>
                                    <div className="text-sm text-gray-500 mt-4">
                                        Đã đạt được <span className="text-primary font-bold">{campaign.goal.toLocaleString('vi-VN')} VNĐ</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-white text-gray-600 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 z-10"
                    onClick={() => scroll('right')}
                    disabled={currentIndex + 3 >= campaigns.length}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default FeaturedCampaign;
