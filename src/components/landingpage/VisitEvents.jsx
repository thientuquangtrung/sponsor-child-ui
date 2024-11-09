import React, { useState } from 'react';
import { X, ExternalLink, Calendar, MapPin, Users, CheckCircle, Clock, CalendarX, UserX, UserPlus, ClipboardList, XCircle } from 'lucide-react';
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
import useLocationVN from '@/hooks/useLocationVN';
import banner from '@/assets/images/banner.png';
import { useGetAllChildrenVisitTripsQuery, useGetChildrenVisitTripsByProvinceQuery } from '@/redux/childrenVisitTrips/childrenVisitTripsApi';
import LoadingScreen from '@/components/common/LoadingScreen';
import { visitStatus } from '@/config/combobox';
import { formatDate } from '@/lib/utils';

const VisitEvent = () => {
    const { provinces } = useLocationVN();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [provinceFilter, setProvinceFilter] = useState("");
    const [visibleEvents, setVisibleEvents] = useState(9);

    const { data: allEvents, isLoading } = useGetAllChildrenVisitTripsQuery();

    const { data: provinceEvents } = useGetChildrenVisitTripsByProvinceQuery(provinceFilter, {
        skip: !provinceFilter,
    });

    const events = provinceFilter ? provinceEvents : allEvents;

    const filteredEvents = events?.filter(event => {
        const matchesSearch = !searchTerm ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = !statusFilter || event.status === parseInt(statusFilter);

        return matchesSearch && matchesStatus;
    }) || [];


    const handleLoadMore = () => {
        setVisibleEvents(prev => prev + 9);
    };

    const displayedEvents = filteredEvents.slice(0, visibleEvents);
    const hasMoreEvents = filteredEvents.length > visibleEvents;

    const getStatusColor = (status) => {
        switch (status) {
            case 0: // Đã lên kế hoạch
                return 'text-rose-300';
            case 1: // Đang mở đăng ký
                return 'text-sky-500';
            case 2: // Đã đóng đăng ký
                return 'text-yellow-500';
            case 3: // Đang chờ
                return 'text-orange-500';
            case 4: // Đã hoàn thành
                return 'text-green-500';
            case 5: // Đã hủy
                return 'text-red-500';
            case 6: // Đã hoãn
                return 'text-purple-500';
            default:
                return 'text-gray-500';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 0:
                return <ClipboardList className="w-4 h-4 mr-2 text-rose-300" />;
            case 1:
                return <UserPlus className="w-4 h-4 mr-2 text-sky-500" />;
            case 2:
                return <UserX className="w-4 h-4 mr-2 text-yellow-500" />;
            case 3:
                return <Clock className="w-4 h-4 mr-2 text-orange-500" />;
            case 4:
                return <CheckCircle className="w-4 h-4 mr-2 text-green-500" />;
            case 5:
                return <XCircle className="w-4 h-4 mr-2 text-red-500" />;
            case 6:
                return <CalendarX className="w-4 h-4 mr-2 text-purple-500" />;
            default:
                return <AlertCircle className="w-4 h-4 mr-2 text-gray-500" />;
        }
    };
    const handleNavigateToDetail = (eventId) => {
        navigate(`/event/${eventId}`);
    };

    const handleShare = (e, eventId) => {
        e.stopPropagation();
    };

    if (isLoading) {
        return <div><LoadingScreen /></div>;
    }

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
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Trạng thái</SelectLabel>
                                {visitStatus.map((status) => (
                                    <SelectItem key={status.value} value={status.value.toString()}>
                                        {status.label}
                                    </SelectItem>
                                ))}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                {displayedEvents.map((event) => (
                    <div
                        key={event.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
                        onClick={() => handleNavigateToDetail(event.id)}
                    >
                        <img
                            src={event.thumbnailUrl}
                            alt={event.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2 truncate">{event.title}</h3>
                            <div className="flex items-center text-gray-600 mb-2">
                                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                <span>
                                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                                </span>
                            </div>
                            <div className="flex items-center text-gray-600 mb-2">
                                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{event.province}</span>
                            </div>
                            <div className="flex items-center text-gray-600 mb-4">
                                <Users className="w-4 h-4 mr-2 text-gray-500" />
                                <span>{event.maxParticipants} người tham gia</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    {getStatusIcon(event.status)}
                                    <span className={`font-semibold ${getStatusColor(event.status)}`}>
                                        {visitStatus.find(s => s.value === event.status)?.label}
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => handleShare(e, event.id)}
                                    className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                                >
                                    <ExternalLink className="w-5 h-5 mr-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {hasMoreEvents && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleLoadMore}
                        className="px-6 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors duration-200 flex items-center gap-2"
                    >
                        Xem thêm

                    </button>
                </div>
            )}

            {filteredEvents.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">
                        Không tìm thấy sự kiện nào phù hợp với tiêu chí tìm kiếm
                    </p>
                </div>
            )}
        </div>
    );
};

export default VisitEvent;