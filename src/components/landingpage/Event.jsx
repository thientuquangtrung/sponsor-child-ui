import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Calendar, MapPin, Users, CheckCircle, Clock } from 'lucide-react';

const Event = () => {
    const [events, setEvents] = useState([
        {
            id: 1,
            title: "Chạy bộ gây quỹ cho trẻ em nghèo",
            date: "2023-09-15",
            location: "Công viên Thống Nhất, Hà Nội",
            participants: 500,
            image: "https://sonapharm.vn/wp-content/uploads/2023/10/BANNER-CHAY-LANG-SON-02-1-1.jpg",
            isOngoing: true,
        },
        {
            id: 2,
            title: "Dọn rác bãi biển Đà Nẵng",
            date: "2023-10-01",
            location: "Bãi biển Mỹ Khê, Đà Nẵng",
            participants: 200,
            image: "https://thanhnien.mediacdn.vn/Uploaded/huydat/2022_10_02/thanh-nien-don-rac-sau-bao-4-1195.jpg",
            isOngoing: false,
        },
        {
            id: 3,
            title: "Xây dựng thư viện cho trường học vùng cao",
            date: "2023-11-20",
            location: "Huyện Mèo Vạc, Hà Giang",
            participants: 50,
            image: "https://file1.dangcongsan.vn/data/0/images/2023/09/05/upload_2677/anh-5.jpg",
            isOngoing: false,
        },
    ]);


    const shareEvent = (event) => {
    };

    return (
        <div className="container mx-auto px-4 py-8 font-sans">
            <div className="flex items-center justify-center my-8">
                <div className="border-t-2 border-teal-500 w-20"></div>
                <h1 className="text-2xl font-semibold mx-4">Sự kiện Thiện nguyện</h1>
                <div className="border-t-2 border-teal-500 w-20"></div>
            </div>
            <div className="flex justify-end mb-4">
                <Link to="/" className="underline cursor-pointer">
                    Xem tất cả
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
                        <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2 truncate">{event.title}</h3>
                            <div className="flex items-center text-gray-600 mb-2 ">
                                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{event.date}</span>
                            </div>
                            <div className="flex items-center text-gray-600 mb-2 ">
                                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{event.location}</span>
                            </div>
                            <div className="flex items-center text-gray-600 mb-4 ">
                                <Users className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{event.participants} người tham gia</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    {event.isOngoing ? (
                                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                    ) : (
                                        <Clock className="w-4 h-4 mr-2 text-sky-500" />
                                    )}
                                    <span className={`font-semibold ${event.isOngoing ? 'text-green-500' : 'text-sky-500'}`}>
                                        {event.isOngoing ? 'Đang diễn ra' : 'Sắp tới'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => shareEvent(event)}
                                    className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                                >
                                    <ExternalLink className="w-5 h-5 mr-1" />
                                </button>
                            </div>



                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Event;
