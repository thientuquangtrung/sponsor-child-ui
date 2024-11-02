import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, MapPin, Users, Calendar, Clock, CheckCircle2, Search, CheckCircle, UserPlus, CalendarCheck, Gift } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import GiftRegistration from './GiftRegistration';
import { toast } from 'sonner';

const PersonList = ({ people, searchTerm }) => {
    const filteredPeople = people.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {filteredPeople.map(person => (
                <div key={person.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                    <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-full" />
                    <span className="text-gray-700">{person.name}</span>
                </div>
            ))}
            {filteredPeople.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                    Không tìm thấy kết quả
                </div>
            )}
        </div>
    );
};

const RegistrationDialog = ({ open, onClose }) => (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="text-center text-2xl font-semibold text-green-600">
                    <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-8 h-8" />
                        Đăng ký thành công!
                    </div>
                </DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4">
                <p className="text-gray-600">
                    Cảm ơn bạn đã đăng ký tham gia sự kiện. Chúng tôi sẽ gửi email xác nhận và thông tin chi tiết cho bạn.
                </p>
                <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700">
                    Đóng
                </Button>
            </div>
        </DialogContent>
    </Dialog>
);

const EventDetail = () => {
    const [isInterested, setIsInterested] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [searchInterested, setSearchInterested] = useState('');
    const [searchParticipants, setSearchParticipants] = useState('');
    const [showGiftDialog, setShowGiftDialog] = useState(false);

    const interestedPeople = [
        { id: 1, name: "Nguyễn Văn A", avatar: "/api/placeholder/40/40" },
        { id: 2, name: "Trần Thị B", avatar: "/api/placeholder/40/40" },
        { id: 3, name: "Lê Văn C", avatar: "/api/placeholder/40/40" },
        { id: 4, name: "Phạm Thị D", avatar: "/api/placeholder/40/40" },
    ];

    const participants = [
        { id: 1, name: "Hoàng Văn X", avatar: "/api/placeholder/40/40" },
        { id: 2, name: "Nguyễn Thị Y", avatar: "/api/placeholder/40/40" },
    ];

    const event = {
        id: 1,
        title: "Thăm và tặng quà trẻ em tại Làng ABC",
        description: "Chương trình thăm và tặng quà cho các em nhỏ tại Làng trẻ em ABC, nơi đang nuôi dưỡng hơn 100 trẻ em có hoàn cảnh đặc biệt. Chúng tôi sẽ tổ chức các hoạt động vui chơi, giao lưu văn nghệ và tặng quà cho các em.",
        thumbnailUrl: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/9/28/thu-tuong-trung-thu-vien-huyet-hoc-5-16959075130811546794883.jpg",
        interestedCount: 150,
        participantsCount: 45,
        maxParticipants: 60,
        location: "Làng trẻ em ABC, Quận Hoàng Mai, Hà Nội",
        date: "2024-11-15",
        time: "08:00 - 17:00",
        isEnded: false,
        organizerName: "Tổ chức Thiện nguyện SponsorChild",
        organizerLogo: "/api/placeholder/100/100",
        schedule: [
            { time: "08:00 - 08:30", activity: "Tập trung và điểm danh" },
            { time: "08:30 - 09:00", activity: "Phổ biến chương trình" },
            { time: "09:00 - 11:30", activity: "Hoạt động giao lưu và vui chơi cùng các em" },
            { time: "11:30 - 13:30", activity: "Nghỉ trưa" },
            { time: "13:30 - 15:30", activity: "Tổ chức văn nghệ" },
            { time: "15:30 - 16:30", activity: "Trao quà và giao lưu" },
            { time: "16:30 - 17:00", activity: "Tổng kết chương trình" }
        ],
        requirements: [
            "Có tinh thần thiện nguyện và yêu trẻ",
            "Cam kết tham gia đầy đủ thời gian",
            "Mang theo giấy tờ tùy thân"
        ],
        materials: [
            "Áo đồng phục tình nguyện viên (sẽ được cung cấp)",
            "Giày dép phù hợp để vận động",
            "Bình nước cá nhân",
            "Khẩu trang"
        ]
    };

    const handleRegister = () => {
        setIsRegistered(true);
        setShowSuccessDialog(true);
    };

    const handleInterested = () => {
        setIsInterested(!isInterested);
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: event.title,
                    text: event.description,
                    url: window.location.href,
                });
            } else {
                const url = window.location.href;
                await navigator.clipboard.writeText(url);
                toast.success('Đã sao chép liên kết vào clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleGiftSubmit = (formData) => {
        setShowGiftDialog(false);
    };

    const renderEventHeader = () => (
        <Card>
            <CardContent className="p-0">
                <img
                    src={event.thumbnailUrl}
                    alt={event.title}
                    className="w-full h-[400px] object-cover rounded-t-lg"
                />
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                        <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
                        <Badge variant="outline" className={`${event.isEnded ? 'text-red-500 border-red-500' : 'text-green-500 border-green-500'}`}>
                            {event.isEnded ? 'Đã kết thúc' : 'Đang diễn ra'}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-gray-600">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-teal-500" />
                            <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-teal-500" />
                            <span>{new Date(event.date).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-teal-500" />
                            <span>{event.time}</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Users className="w-5 h-5 text-teal-500" />
                            <span>{event.participantsCount}/{event.maxParticipants} người tham gia</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Heart className="w-5 h-5 text-teal-500" />
                            <span>{event.interestedCount} quan tâm</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const renderRegistrationCard = () => (
        <Card className="sticky top-8">
            <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <img
                        src={event.organizerLogo}
                        alt={event.organizerName}
                        className="w-12 h-12 rounded-full"
                    />
                    <div>
                        <h3 className="font-medium text-gray-900">Đơn vị tổ chức</h3>
                        <p className="text-gray-600">{event.organizerName}</p>
                    </div>
                </div>
                <div className="space-y-6 p-6 bg-gradient-to-r from-teal-50 to-rose-50 rounded-xl shadow-sm">
                    <div className="flex justify-center">
                        <Button
                            onClick={handleRegister}
                            disabled={isRegistered || event.isEnded}
                            className={`h-14 text-lg font-medium rounded-xl transition-all duration-300 ${isRegistered
                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                : 'bg-teal-500 hover:bg-teal-600 hover:shadow-lg hover:scale-[1.02] text-white'
                                }`}
                        >
                            {isRegistered ? (
                                <span className="flex items-center justify-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    Đã đăng ký tham gia
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <UserPlus className="w-5 h-5" />
                                    Đăng ký tham gia
                                </span>
                            )}
                        </Button>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Button
                            onClick={handleInterested}
                            variant="outline"
                            className={`flex-1 h-12 rounded-xl border-2 text-teal-500 border-teal-500 hover:bg-pink-100 transition-all duration-300 hover:scale-[1.02] ${isInterested
                                ? 'border-pink-300 text-pink-400 hover:bg-pink-50'
                                : 'hover:border-pink-300 hover:text-pink-400'
                                }`}
                        >
                            <Heart className={`w-5 h-5 mr-2   transition-colors ${isInterested ? 'fill-pink-400 text-pink-400' : ''}`} />
                            {isInterested ? 'Đã quan tâm' : 'Quan tâm'}
                        </Button>
                        <Button
                            onClick={handleShare}
                            variant="outline"
                            className="flex-1 h-12 rounded-xl border-2 text-teal-500 border-teal-500 hover:bg-teal-100 hover:border-teal-300 hover:text-teal-400 transition-all duration-300 hover:scale-[1.02]"
                        >
                            <Share2 className="w-5 h-5 mr-2" />
                            Chia sẻ
                        </Button>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CalendarCheck className="w-5 h-5 text-teal-500" />
                            Thông tin đăng ký
                        </h3>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-rose-400" />
                                Hạn đăng ký: <span className="font-medium">{new Date(event.date).toLocaleDateString('vi-VN')}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-rose-400" />
                                Số lượng còn nhận: <span className="font-medium">{event.maxParticipants - event.participantsCount} người</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Gift className="w-4 h-4 text-rose-400" />
                                <span className="text-teal-600 font-medium">Miễn phí tham gia</span>
                            </li>
                        </ul>
                        <div className="flex justify-center">
                            <Button
                                onClick={() => setShowGiftDialog(true)}
                                className="h-12 mt-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-all duration-300 hover:scale-[1.02]"
                            >
                                <Gift className="w-5 h-5 mr-2" />
                                Đăng ký tặng quà
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const renderScheduleTab = () => (
        <Card>
            <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-teal-600">Lịch trình</h2>
                <div className="space-y-4">
                    {event.schedule.map((item, index) => (
                        <div key={index} className="flex border-l-4 border-teal-500 pl-4 bg-teal-50 hover:bg-teal-100 transition-colors">
                            <div className="w-32 font-medium text-teal-700">{item.time}</div>
                            <div className="flex-1 text-gray-700">{item.activity}</div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );

    const renderRequirementsAndMaterials = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardContent className="p-6">
                    <h2 className="font-semibold mb-4 text-teal-600">Yêu cầu</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                        {event.requirements.map((req, index) => (
                            <li key={index} className="hover:text-teal-600 transition-colors">{req}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <h2 className="font-semibold mb-4 text-teal-600">Chuẩn bị</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                        {event.materials.map((item, index) => (
                            <li key={index} className="hover:text-teal-600 transition-colors">{item}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );

    const renderNoActivities = () => (
        <Card>
            <CardContent className="p-6">
                <div className="text-center py-8">
                    <img
                        src="https://i.pinimg.com/564x/75/ee/05/75ee0595862c4a0253a82e773cdfd9c1.jpg"
                        alt="No activities"
                        className="mx-auto mb-4 w-32 h-32 object-cover rounded-full" // Thay đổi kích thước và kiểu
                    />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                        Chưa có hoạt động nào
                    </h3>
                    <p className="text-gray-600">
                        Hãy chờ đợi các hoạt động thú vị sắp diễn ra nhé! 🌟
                    </p>
                </div>
            </CardContent>
        </Card>
    );

    const renderResponsesList = () => (
        <Card>
            <CardContent className="p-6">
                <Tabs defaultValue="interested">
                    <TabsList className="space-x-2 bg-inherit">
                        <TabsTrigger value="interested" className="relative py-1 px-4 text-md font-medium">
                            Người quan tâm ({interestedPeople.length})
                        </TabsTrigger>
                        <TabsTrigger value="participants" className="relative py-1 px-4 text-md font-medium">
                            Người tham gia ({participants.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="interested" className="mt-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    placeholder="Tìm kiếm người quan tâm..."
                                    value={searchInterested}
                                    onChange={(e) => setSearchInterested(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <PersonList
                                people={interestedPeople}
                                searchTerm={searchInterested}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="participants" className="mt-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    placeholder="Tìm kiếm người tham gia..."
                                    value={searchParticipants}
                                    onChange={(e) => setSearchParticipants(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <PersonList
                                people={participants}
                                searchTerm={searchParticipants}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {renderEventHeader()}

                        <Tabs defaultValue="details">
                            <TabsList className="flex space-x-2 bg-inherit">
                                <TabsTrigger value="details" className="relative py-1 px-4 text-md font-medium">
                                    Chi tiết sự kiện
                                </TabsTrigger>
                                <TabsTrigger value="activities" className="relative py-1 px-4 text-md font-medium">
                                    Hoạt động
                                </TabsTrigger>
                                <TabsTrigger value="responses" className="relative py-1 px-4 text-md font-medium">
                                    Danh sách phản hồi
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="space-y-6 mt-6">
                                {renderScheduleTab()}
                                {renderRequirementsAndMaterials()}
                            </TabsContent>

                            <TabsContent value="activities" className="mt-6">
                                {renderNoActivities()}
                            </TabsContent>

                            <TabsContent value="responses" className="mt-6">
                                {renderResponsesList()}
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="lg:col-span-1">
                        {renderRegistrationCard()}
                    </div>
                </div>
            </div>

            <RegistrationDialog
                open={showSuccessDialog}
                onClose={() => setShowSuccessDialog(false)}
            />

            <GiftRegistration
                isOpen={showGiftDialog}
                onClose={() => setShowGiftDialog(false)}
                onSubmit={handleGiftSubmit}
            />
        </div>
    );
};

export default EventDetail;