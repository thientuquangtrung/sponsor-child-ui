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
        <div className="container mx-auto py-8 bg-[#c1e2e2] font-sans">
            <div className="flex items-center justify-center my-8">
                <div className="border-t-2 border-teal-500 w-20"></div>
                <h1 className="text-2xl font-semibold mx-4">Chiến dịch gây quỹ nổi bật</h1>
                <div className="border-t-2 border-teal-500 w-20"></div>
            </div>
            <div className="flex justify-between items-center mb-4">
                <div>Tạo bởi: <span className='font-semibold'>Tổ chức</span></div>
                <Link to="/" className="underline cursor-pointer">
                    Xem thêm
                </Link>
            </div>
            <div className="relative">
                <button
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white text-gray-600 p-2 rounded-full 
                    shadow-md hover:bg-gray-100 transition-colors duration-200 z-10"
                    onClick={() => scroll('left')}
                    disabled={currentIndex === 0}
                >
                    <ChevronLeft size={20} />
                </button>

                <div
                    ref={scrollContainerRef}
                    className="grid grid-cols-3 gap-4 overflow-hidden"
                >
                    {visibleCampaigns.map((campaign) => (
                        <div key={campaign.id} className="bg-white rounded-lg shadow-md relative">
                            <img
                                src={campaign.image}
                                alt={campaign.name}
                                className="w-full h-48 object-cover rounded-t-md"
                            />
                            <div className="absolute top-2 left-2 bg-white text-rose-400 font-semibold rounded-full px-3 py-1 text-xs">
                                Còn {campaign.daysLeft} ngày
                            </div>
                            <div className="p-4">
                                <h3 className="mt-2 font-semibold line-clamp-2">{campaign.name}</h3>
                                <p className="text-sm text-gray-600 my-3">
                                    Tạo bởi <span className="font-bold text-yellow-500">{campaign.creator}</span>
                                </p>
                                <div className="mt-2 relative">
                                    <div className="h-2 w-full bg-gray-300 rounded">
                                        <div
                                            className="h-2 bg-green-500 rounded"
                                            style={{
                                                width: `${campaign.progress}%`,
                                                background: 'linear-gradient(to right, #7EDAD7, #69A6B8)',
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm mt-1">
                                            Đã đạt được:{' '}
                                            <span className="font-bold text-[#69A6B8]">
                                                {((campaign.progress / 100) * campaign.goal).toLocaleString()} VND
                                            </span>
                                        </p>
                                        <p className="font-bold text-sm">{campaign.progress}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-white text-gray-600 p-2 rounded-full
                     shadow-md hover:bg-gray-100 transition-colors duration-200 z-10"
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
