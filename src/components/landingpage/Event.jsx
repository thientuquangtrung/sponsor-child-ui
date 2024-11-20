import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Calendar, MapPin, Users, CheckCircle, Clock, ClipboardList, UserPlus, UserX, XCircle, CalendarX } from 'lucide-react';
import { useGetFilteredChildrenVisitTripsQuery } from '@/redux/childrenVisitTrips/childrenVisitTripsApi';
import LoadingScreen from '@/components/common/LoadingScreen';
import { visitStatus } from '@/config/combobox';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

const Event = () => {
    const navigate = useNavigate();
    const { data: events, isLoading } = useGetFilteredChildrenVisitTripsQuery({});

    const getStatusColor = (status) => {
        switch (status) {
            case 0: return 'text-rose-300';
            case 1: return 'text-sky-500';
            case 2: return 'text-yellow-500';
            case 3: return 'text-orange-500';
            case 4: return 'text-green-500';
            case 5: return 'text-red-500';
            case 6: return 'text-purple-500';
            default: return 'text-gray-500';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 0: return <ClipboardList className="w-4 h-4 mr-2 text-rose-300" />;
            case 1: return <UserPlus className="w-4 h-4 mr-2 text-sky-500" />;
            case 2: return <UserX className="w-4 h-4 mr-2 text-yellow-500" />;
            case 3: return <Clock className="w-4 h-4 mr-2 text-orange-500" />;
            case 4: return <CheckCircle className="w-4 h-4 mr-2 text-green-500" />;
            case 5: return <XCircle className="w-4 h-4 mr-2 text-red-500" />;
            case 6: return <CalendarX className="w-4 h-4 mr-2 text-purple-500" />;
            default: return <AlertCircle className="w-4 h-4 mr-2 text-gray-500" />;
        }
    };

    const handleShare = async (e, event) => {
        e.stopPropagation();
        try {
            const shareUrl = `${window.location.origin}/event/${event.id}`;

            if (navigator.share) {
                await navigator.share({
                    title: event.title,
                    text: event.description,
                    url: shareUrl
                });
            } else {
                await navigator.clipboard.writeText(shareUrl);
                toast.success('Đã sao chép liên kết vào clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            toast.error('Không thể chia sẻ liên kết');
        }
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div className="container mx-auto px-4 py-8 font-sans">
            <div className="flex items-center justify-center my-8">
                <div className="border-t-2 border-teal-500 w-20"></div>
                <h1 className="text-2xl font-semibold mx-4">Sự kiện Thiện nguyện</h1>
                <div className="border-t-2 border-teal-500 w-20"></div>
            </div>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => navigate('/events')}
                    className="underline cursor-pointer"
                >
                    Xem tất cả
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events?.slice(0, 3).map((event) => (
                    <div
                        key={event.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
                        onClick={() => navigate(`/event/${event.id}`)}
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
                                <span>{event.participantsCount}/{event.maxParticipants} người tham gia</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    {getStatusIcon(event.status)}
                                    <span className={`font-semibold ${getStatusColor(event.status)}`}>
                                        {visitStatus.find(s => s.value === event.status)?.label}
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => handleShare(e, event)}
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