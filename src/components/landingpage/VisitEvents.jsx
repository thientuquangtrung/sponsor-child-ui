import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Calendar, MapPin, Users, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import useDebounce from '@/hooks/useDebounce';
import banner from '@/assets/images/banner.png';
import useLocationVN from '@/hooks/useLocationVN';
const VisitEvent = () => {
    const { provinces } = useLocationVN();
    const navigate = useNavigate();

    const [events, setEvents] = useState([
        {
            id: 1,
            title: "Chạy bộ gây quỹ cho trẻ em nghèo",
            date: "2023-09-15",
            location: "Công viên Thống Nhất, Hà Nội",
            province: "Hà Nội",
            participants: 500,
            image: "https://sonapharm.vn/wp-content/uploads/2023/10/BANNER-CHAY-LANG-SON-02-1-1.jpg",
            status: "ongoing",
        },
        {
            id: 2,
            title: "Dọn rác bãi biển Đà Nẵng",
            date: "2023-10-01",
            location: "Bãi biển Mỹ Khê, Đà Nẵng",
            province: "Đà Nẵng",
            participants: 200,
            image: "https://thanhnien.mediacdn.vn/Uploaded/huydat/2022_10_02/thanh-nien-don-rac-sau-bao-4-1195.jpg",
            status: "upcoming",
        },
        {
            id: 3,
            title: "Xây dựng thư viện cho trường học vùng cao",
            date: "2023-11-20",
            location: "Huyện Mèo Vạc, Hà Giang",
            province: "Hà Giang",
            participants: 50,
            image: "https://file1.dangcongsan.vn/data/0/images/2023/09/05/upload_2677/anh-5.jpg",
            status: "completed",
        },

        {
            id: 4,
            title: "Chạy bộ gây quỹ cho trẻ em nghèo",
            date: "2023-09-15",
            location: "Công viên Thống Nhất, Hà Nội",
            province: "Hà Nội",
            participants: 500,
            image: "https://sonapharm.vn/wp-content/uploads/2023/10/BANNER-CHAY-LANG-SON-02-1-1.jpg",
            status: "ongoing",
        },
        {
            id: 5,
            title: "Dọn rác bãi biển Đà Nẵng",
            date: "2023-10-01",
            location: "Bãi biển Mỹ Khê, Đà Nẵng",
            province: "Đà Nẵng",
            participants: 200,
            image: "https://thanhnien.mediacdn.vn/Uploaded/huydat/2022_10_02/thanh-nien-don-rac-sau-bao-4-1195.jpg",
            status: "upcoming",
        },
        {
            id: 6,
            title: "Xây dựng thư viện cho trường học vùng cao",
            date: "2023-11-20",
            location: "Huyện Mèo Vạc, Hà Giang",
            province: "Hà Giang",
            participants: 50,
            image: "https://file1.dangcongsan.vn/data/0/images/2023/09/05/upload_2677/anh-5.jpg",
            status: "completed",
        },
        {
            id: 7,
            title: "Chạy bộ gây quỹ cho trẻ em nghèo",
            date: "2023-09-15",
            location: "Công viên Thống Nhất, Hà Nội",
            province: "Hà Nội",
            participants: 500,
            image: "https://sonapharm.vn/wp-content/uploads/2023/10/BANNER-CHAY-LANG-SON-02-1-1.jpg",
            status: "ongoing",
        },
        {
            id: 8,
            title: "Dọn rác bãi biển Đà Nẵng",
            date: "2023-10-01",
            location: "Bãi biển Mỹ Khê, Đà Nẵng",
            province: "Đà Nẵng",
            participants: 200,
            image: "https://thanhnien.mediacdn.vn/Uploaded/huydat/2022_10_02/thanh-nien-don-rac-sau-bao-4-1195.jpg",
            status: "upcoming",
        },
        {
            id: 9,
            title: "Xây dựng thư viện cho trường học vùng cao",
            date: "2023-11-20",
            location: "Huyện Mèo Vạc, Hà Giang",
            province: "Hà Giang",
            participants: 50,
            image: "https://file1.dangcongsan.vn/data/0/images/2023/09/05/upload_2677/anh-5.jpg",
            status: "completed",
        },
    ]);


    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [provinceFilter, setProvinceFilter] = useState("");
    const [filteredEvents, setFilteredEvents] = useState(events);

    useEffect(() => {
        let filtered = events;

        if (searchTerm) {
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(event => event.status === statusFilter);
        }

        if (provinceFilter) {
            filtered = filtered.filter(event => event.province === provinceFilter);
        }

        setFilteredEvents(filtered);
    }, [searchTerm, statusFilter, provinceFilter, events]);


    const handleShare = (eventId) => {
        e.stopPropagation();
    };
    const handleNavigateToDetail = (eventId) => {
        navigate(`/event/${eventId}`);
    };


    return (
        <div className="mx-auto py-8">
            <div className="relative bg-cover bg-center">
                <img src={banner} alt="banner" className="w-full object-cover rounded-lg shadow-md" />
            </div>

            <div className="flex items-center justify-center mt-8 mb-8">
                <div className="border-t-2 border-teal-500 w-16"></div>
                <h1 className="text-2xl font-semibold mx-4 text-gray-800">Sự kiện chuyến thăm trẻ</h1>
                <div className="border-t-2 border-teal-500 w-16"></div>

            </div>


            <div className="flex justify-between items-center mb-4 flex-wrap">
                <div className="flex space-x-2 flex-wrap">
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Trạng thái</SelectLabel>
                                <SelectItem value="ongoing">Đang diễn ra</SelectItem>
                                <SelectItem value="upcoming">Sắp tới</SelectItem>
                                <SelectItem value="completed">Đã kết thúc</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select
                        value={provinceFilter}
                        onValueChange={setProvinceFilter}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Chọn tỉnh thành" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Tỉnh</SelectLabel>
                                {provinces.map((province) => (
                                    <SelectItem key={province.id} value={province.name}>
                                        {province.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {(statusFilter || provinceFilter) && (
                        <Button
                            onClick={() => {
                                setStatusFilter("");
                                setProvinceFilter("");
                            }}
                            variant="outline"
                        >
                            <X className="w-4 h-4 mr-1" /> Xoá bộ lọc
                        </Button>
                    )}
                </div>

                <div className="relative mb-2">
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        type="text"
                        className="bg-white border border-gray-300 rounded-full pl-10 pr-4 py-2 w-64"
                        placeholder="Tìm kiếm tên sự kiện"
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                    <div
                        key={event.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
                        onClick={() => handleNavigateToDetail(event.id)}
                    >
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2 truncate">{event.title}</h3>
                            <div className="flex items-center text-gray-600 mb-2">
                                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{event.date}</span>
                            </div>
                            <div className="flex items-center text-gray-600 mb-2">
                                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{event.location}</span>
                            </div>
                            <div className="flex items-center text-gray-600 mb-4">
                                <Users className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{event.participants} người tham gia</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    {event.status === 'ongoing' ? (
                                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                    ) : event.status === 'upcoming' ? (
                                        <Clock className="w-4 h-4 mr-2 text-sky-500" />
                                    ) : (
                                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                    )}
                                    <span className={`font-semibold ${event.status === 'ongoing' ? 'text-green-500' :
                                        event.status === 'upcoming' ? 'text-sky-500' :
                                            'text-gray-500'
                                        }`}>
                                        {event.status === 'ongoing' ? 'Đang diễn ra' :
                                            event.status === 'upcoming' ? 'Sắp tới' :
                                                'Đã kết thúc'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleShare(event.id)}
                                    className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                                >
                                    <ExternalLink className="w-5 h-5 mr-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">Không tìm thấy sự kiện nào phù hợp với tiêu chí tìm kiếm</p>
                </div>
            )}
        </div>
    );
};

export default VisitEvent;