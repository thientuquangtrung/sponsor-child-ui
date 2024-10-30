import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Share2, MapPin, Users, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useDebounce from '@/hooks/useDebounce';
import banner from '@/assets/images/banner.png';
import { useNavigate } from 'react-router-dom';

const VisitEvents = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('featured');
    const [showMore, setShowMore] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm);
    const [interestedEvents, setInterestedEvents] = useState(new Set());
    const navigate = useNavigate();

    const events = [
        {
            id: 1,
            title: "Thăm và tặng quà trẻ em tại Làng ABC",
            thumbnailUrl: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/9/28/thu-tuong-trung-thu-vien-huyet-hoc-5-16959075130811546794883.jpg",
            interestedCount: 150,
            participantsCount: 45,
            location: "Hà Nội",
            date: "2024-11-15",
            isEnded: false,
            isFeatured: true
        },
        {
            id: 2,
            title: "Chương trình thăm hỏi và vui chơi cùng trẻ em mồ côi",
            thumbnailUrl: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/9/28/thu-tuong-trung-thu-vien-huyet-hoc-5-16959075130811546794883.jpg",
            interestedCount: 200,
            participantsCount: 60,
            location: "TP. Hồ Chí Minh",
            date: "2024-11-20",
            isEnded: false,
            isFeatured: true
        },
        {
            id: 3,
            title: "Chuyến thăm và giao lưu cùng trẻ em tại Làng SOS",
            thumbnailUrl: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/9/28/thu-tuong-trung-thu-vien-huyet-hoc-5-16959075130811546794883.jpg",
            interestedCount: 120,
            participantsCount: 35,
            location: "Đà Nẵng",
            date: "2024-11-25",
            isEnded: false,
            isFeatured: false
        },
        {
            id: 4,
            title: "Ngày hội tình nguyện viên vì trẻ em",
            thumbnailUrl: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/9/28/thu-tuong-trung-thu-vien-huyet-hoc-5-16959075130811546794883.jpg",
            interestedCount: 175,
            participantsCount: 65,
            location: "Huế",
            date: "2024-11-30",
            isEnded: false,
            isFeatured: true
        },
        {
            id: 5,
            title: "Thăm trại trẻ mồ côi ABCD",
            thumbnailUrl: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/9/28/thu-tuong-trung-thu-vien-huyet-hoc-5-16959075130811546794883.jpg",
            interestedCount: 220,
            participantsCount: 80,
            location: "Hà Nội",
            date: "2024-12-05",
            isEnded: false,
            isFeatured: false
        },
        {
            id: 6,
            title: "Chương trình từ thiện tại Trung tâm Bảo trợ XYZ",
            thumbnailUrl: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/9/28/thu-tuong-trung-thu-vien-huyet-hoc-5-16959075130811546794883.jpg",
            interestedCount: 180,
            participantsCount: 55,
            location: "Cần Thơ",
            date: "2024-12-10",
            isEnded: false,
            isFeatured: true
        },
        {
            id: 7,
            title: "Ngày hội thiện nguyện vì trẻ em khó khăn",
            thumbnailUrl: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/9/28/thu-tuong-trung-thu-vien-huyet-hoc-5-16959075130811546794883.jpg",
            interestedCount: 230,
            participantsCount: 70,
            location: "Nha Trang",
            date: "2024-12-15",
            isEnded: false,
            isFeatured: false
        },
        {
            id: 8,
            title: "Thăm và tặng quà tại Trung tâm Nhân đạo",
            thumbnailUrl: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/9/28/thu-tuong-trung-thu-vien-huyet-hoc-5-16959075130811546794883.jpg",
            interestedCount: 160,
            participantsCount: 40,
            location: "Vũng Tàu",
            date: "2024-12-20",
            isEnded: false,
            isFeatured: true
        },
        {
            id: 9,
            title: "Chương trình thăm hỏi trẻ em vùng cao",
            thumbnailUrl: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/9/28/thu-tuong-trung-thu-vien-huyet-hoc-5-16959075130811546794883.jpg",
            interestedCount: 190,
            participantsCount: 50,
            location: "Sapa",
            date: "2024-12-25",
            isEnded: false,
            isFeatured: false
        },
        {
            id: 10,
            title: "Ngày hội vui chơi cho trẻ em có hoàn cảnh đặc biệt",
            thumbnailUrl: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/9/28/thu-tuong-trung-thu-vien-huyet-hoc-5-16959075130811546794883.jpg",
            interestedCount: 210,
            participantsCount: 65,
            location: "Hải Phòng",
            date: "2024-12-30",
            isEnded: false,
            isFeatured: true
        },
        {
            id: 11,
            title: "Thăm và tặng quà Tết cho trẻ em",
            thumbnailUrl: "/https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/9/28/thu-tuong-trung-thu-vien-huyet-hoc-5-16959075130811546794883.jpg",
            interestedCount: 240,
            participantsCount: 75,
            location: "Đà Lạt",
            date: "2025-01-05",
            isEnded: false,
            isFeatured: true
        },
        {
            id: 12,
            title: "Chương trình từ thiện đầu năm",
            thumbnailUrl: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/9/28/thu-tuong-trung-thu-vien-huyet-hoc-5-16959075130811546794883.jpg",
            interestedCount: 170,
            participantsCount: 45,
            location: "Hà Nội",
            date: "2025-01-10",
            isEnded: false,
            isFeatured: false
        }
    ];

    const handleInterested = (e, eventId) => {
        e.stopPropagation();
        setInterestedEvents(prev => {
            const newSet = new Set(prev);
            if (newSet.has(eventId)) {
                newSet.delete(eventId);
            } else {
                newSet.add(eventId);
            }
            return newSet;
        });
    };

    const handleShare = (eventId) => {
        e.stopPropagation();
    };
    const handleNavigateToDetail = (eventId) => {
        navigate(`/event/${eventId}`);
    };

    const filterButtons = [
        { id: 'featured', label: 'Nổi bật' },
        { id: 'nearby', label: 'Gần Tôi' },
        { id: 'following', label: 'Theo dõi' },
        { id: 'ended', label: 'Đã kết thúc' }
    ];

    const filteredEvents = events.filter(event => {
        const matchesSearch = !debouncedSearchTerm ||
            event.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (activeFilter === 'ended') return event.isEnded;
        if (activeFilter === 'featured') return event.isFeatured;
        if (activeFilter === 'nearby') return event.location === 'Hà Nội';
        if (activeFilter === 'following') return interestedEvents.has(event.id);

        return true;
    });

    const displayedEvents = showMore ? filteredEvents : filteredEvents.slice(0, 6);

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-16 h-16 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Chưa có sự kiện nào được quan tâm
            </h3>
            <p className="text-gray-500 text-center mb-6 max-w-md">
                Hãy khám phá và quan tâm các sự kiện để không bỏ lỡ những chương trình ý nghĩa nhé! 🌟
            </p>
            <Button
                variant="outline"
                className="hover:bg-teal-300 transition-colors"
                onClick={() => document.querySelector('[value="discover"]').click()}
            >
                Khám phá ngay
            </Button>
        </div>
    );

    const EventCard = ({ event }) => (
        <div
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => handleNavigateToDetail(event.id)}
        >
            <div className="relative">
                <img
                    src={event.thumbnailUrl}
                    alt={event.title}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm flex items-center gap-1 shadow-sm">
                    <MapPin className="w-4 h-4 text-teal-500" />
                    <span className="text-gray-700">{event.location}</span>
                </div>
                <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-sm font-medium ${event.isEnded
                    ? 'bg-red-100 text-red-600'
                    : 'bg-green-100 text-green-600'
                    }`}
                >
                    {event.isEnded ? 'Đã kết thúc' : 'Đang diễn ra'}
                </div>
            </div>
            <div className="p-5">
                <h3 className="font-semibold text-lg line-clamp-1 mb-4 text-gray-800 hover:text-teal-600 transition-colors">
                    {event.title}
                </h3>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4 text-teal-500" />
                        <span>{event.participantsCount} người tham gia</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Heart className="w-4 h-4 text-teal-500" />
                        <span>{event.interestedCount} quan tâm</span>
                    </div>
                </div>
                <div className="flex justify-between gap-3">
                    <Button
                        onClick={(e) => handleInterested(e, event.id)}
                        className={`flex-1 ${interestedEvents.has(event.id)
                            ? 'bg-teal-500 text-white hover:bg-teal-600'
                            : 'bg-teal-500 text-white hover:bg-teal-600'
                            }`}
                    >
                        <Heart className={`w-4 h-4 mr-2 ${interestedEvents.has(event.id) ? "fill-current" : ""}`} />
                        {interestedEvents.has(event.id) ? "Đã quan tâm" : "Quan tâm"}
                    </Button>
                    <Button
                        onClick={(e) => handleShare(e, event.id)}
                        variant="outline"
                        className="px-4 border border-teal-500 hover:bg-teal-50 hover:border-teal-600"
                    >
                        <Share2 className="w-4 h-4 text-teal-500" />
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="mx-auto py-8 px-4 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="relative bg-cover bg-center">
                    <img src={banner} alt="banner" className="w-full object-cover rounded-lg shadow-md" />
                </div>

                <div className="flex items-center justify-center mt-8 mb-8">
                    <div className="border-t-2 border-teal-500 w-16"></div>
                    <h1 className="text-3xl font-semibold mx-4 text-gray-800">Sự kiện chuyến thăm trẻ</h1>
                    <div className="border-t-2 border-teal-500 w-16"></div>
                </div>

                <Tabs defaultValue="discover" className="w-full">
                    <div className="max-w-md mx-auto mb-8">
                        <TabsList className="grid w-full grid-cols-2 bg-transparent gap-2">
                            <TabsTrigger
                                value="discover"
                                className="relative px-4 py-2 rounded-none transition-colors duration-200
                    data-[state=active]:bg-transparent
                    data-[state=active]:text-teal-500
                    hover:text-teal-500
                    after:content-['']
                    after:absolute
                    after:bottom-0
                    after:left-0
                    after:w-full
                    after:h-0.5
                    after:bg-teal-500
                    after:scale-x-0
                    data-[state=active]:after:scale-x-100
                    after:transition-transform
                    after:duration-300"
                            >
                                Khám phá
                            </TabsTrigger>
                            <TabsTrigger
                                value="interested"
                                className="relative px-4 py-2 rounded-none transition-colors duration-200
                    data-[state=active]:bg-transparent 
                    data-[state=active]:text-teal-500
                    hover:text-teal-500
                    after:content-['']
                    after:absolute
                    after:bottom-0
                    after:left-0
                    after:w-full
                    after:h-0.5
                    after:bg-teal-500
                    after:scale-x-0
                    data-[state=active]:after:scale-x-100
                    after:transition-transform
                    after:duration-300"
                            >
                                Đã quan tâm
                            </TabsTrigger>
                        </TabsList>
                    </div>


                    <div className="flex justify-between items-center mb-8">
                        <div className="flex gap-2 flex-wrap">
                            {filterButtons.map((button) => (
                                <Button
                                    key={button.id}
                                    variant={activeFilter === button.id ? "default" : "outline"}
                                    onClick={() => setActiveFilter(button.id)}
                                    className={`
                                        ${activeFilter === button.id
                                            ? 'bg-teal-500 text-white hover:bg-teal-600'
                                            : 'hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    {button.label}
                                </Button>
                            ))}
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm kiếm sự kiện..."
                                className="pl-10 pr-4 py-2 border rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                        </div>
                    </div>

                    <TabsContent value="discover">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayedEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                        {filteredEvents.length > 6 && !showMore && (
                            <div className="flex justify-center mt-12">
                                <Button
                                    onClick={() => setShowMore(true)}
                                    variant="outline"
                                    className="px-8 py-6 text-lg bg-teal-700 text-white hover:bg-teal-600 transition-colors"
                                >
                                    Xem thêm
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="interested">
                        {interestedEvents.size > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredEvents
                                    .filter(event => interestedEvents.has(event.id))
                                    .map(event => (
                                        <EventCard key={event.id} event={event} />
                                    ))}
                            </div>
                        ) : (
                            <EmptyState />
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    );
};

export default VisitEvents;