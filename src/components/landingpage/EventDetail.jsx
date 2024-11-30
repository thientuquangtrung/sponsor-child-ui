import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2, MapPin, Calendar, Clock, Gift, Users, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useGetChildrenVisitTripsByIdQuery } from '@/redux/childrenVisitTrips/childrenVisitTripsApi';
import { formatDate } from '@/lib/utils';
import { visitStatus } from '@/config/combobox';
import ImageGallery from '@/components/landingpage/ImageGallery';
import { Icons } from '@/components/icons';
import ParticipantRegistration from '@/components/visit/ParticipantRegistration';
import { useSelector } from 'react-redux';
import ParticipantList from '@/components/visit/ParticipantList';
import GiftRegistration from '@/components/visit/GiftRegistration';
import HistoryTabs from '@/components/visit/HistoryTabs';
import { useCalculateRefundVisitQuery, useUpdateVisitTripRegistrationMutation } from '@/redux/visitTripRegistration/visitTripRegistrationApi';
import CanceledEventRegistrationDialog from '@/components/visit/CanceledEventRegistratiobDialog';

const EventDetail = () => {
    const { user } = useSelector((state) => state.auth);
    const { id } = useParams();
    const { data: event, isLoading, error } = useGetChildrenVisitTripsByIdQuery(id);
    const [showGiftDialog, setShowGiftDialog] = useState(false);
    const [showCanceledRegistrationModal, setShowCanceledRegistrationModal] = useState(false);
    const [hasProcessedCancellation, setHasProcessedCancellation] = useState(false);
    const [updateRegistration] = useUpdateVisitTripRegistrationMutation();
    const visitId = id;
    const userId = user?.userID
    const { data: calculateRefundData } = useCalculateRefundVisitQuery({
        userId,
        visitId
    });
    const hasCanceledRegistration = event?.status === 5 &&
        calculateRefundData?.isRefundable === true;

    useEffect(() => {
        if (hasCanceledRegistration) {
            setShowCanceledRegistrationModal(true);
        }
    }, [hasCanceledRegistration, event, user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 0: return 'text-rose-300';
            case 1: return 'text-sky-500';
            case 2: return 'text-yellow-500';
            case 3: return 'text-orange-500';
            case 4: return 'text-red-500';
            case 5: return 'text-gray-500';
            case 6: return 'text-purple-500';
            default: return 'text-gray-500';
        }
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

    const handleCancelRegistration = async (params) => {
        try {
            const result = await updateRegistration(params).unwrap();

            if (result?.success) {
                setShowCanceledRegistrationModal(false);
                setHasProcessedCancellation(true);
                window.location.reload();

                toast.success(
                    params.status === 2
                        ? 'Yêu cầu hoàn tiền đã được gửi'
                        : 'Cảm ơn sự ủng hộ của bạn!'
                );
            } else {
                throw new Error(result?.message || 'Xử lý thất bại');
            }
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
            console.error('Cancel registration error:', error);
        }
    };

    if (isLoading) return <div><LoadingScreen /></div>;
    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center text-red-500">
                <p className="text-xl font-semibold">Đã có lỗi xảy ra</p>
                <p className="text-gray-600">Vui lòng thử lại sau</p>
            </div>
        </div>
    );
    if (!event) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center text-gray-500">
                <p className="text-xl font-semibold">Không tìm thấy sự kiện</p>
            </div>
        </div>
    );

    const renderEventHeader = () => (
        <Card>
            <CardContent className="p-0">

                <ImageGallery
                    thumbnailUrl={event.thumbnailUrl}
                    imagesFolderUrl={event.imagesFolderUrl}
                />
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                        <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
                        <Badge
                            variant="outline"
                            className={`${getStatusColor(event.status)}`}
                        >
                            {visitStatus.find(status => status.value === event.status).label}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-gray-600">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-teal-500" />
                            <span>{event.province}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-teal-500" />
                            <span>{new Date(event.startDate).toLocaleDateString('vi-VN')} - {new Date(event.endDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-teal-500" />
                            <span>Xem lịch trình</span>
                        </div>
                    </div>
                    <div
                        className="prose max-w-none text-gray-600 rounded-lg p-6"
                        dangerouslySetInnerHTML={{ __html: event.description }}
                    />
                </div>
            </CardContent>
        </Card>
    );

    const renderRegistrationCard = () => (
        <>
            <div className="sticky top-8">
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                <Icons.logo className="h-10 w-10" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Đơn vị tổ chức</h3>
                                <p className="text-gray-600">Quỹ từ thiện SponsorChild</p>
                            </div>
                        </div>

                        <div className="space-y-6 p-6 bg-gradient-to-r from-teal-50 to-rose-50 rounded-xl shadow-sm">
                            <div className="flex gap-4 justify-center">
                                {(event.status === 1 || (event.status === 2 && event.visitRegistrations?.some(reg =>
                                    reg.userID === user?.userID && reg.status === 1
                                ))) && user?.userID && (
                                        <ParticipantRegistration
                                            visitId={id}
                                            userId={user?.userID}
                                            maxParticipants={event?.maxParticipants}
                                            participantsCount={event?.participantsCount}
                                            visitCost={event?.visitCost}
                                            eventStatus={event?.status}
                                        />
                                    )}
                                <Button
                                    onClick={handleShare}
                                    variant="outline"
                                    className="w-40 h-14 flex items-center justify-center rounded-xl border-2 text-teal-500 border-teal-500 hover:bg-teal-100 hover:border-teal-300 hover:text-teal-400 transition-all duration-300 hover:scale-[1.02]"
                                >
                                    <Share2 className="w-5 h-5 mr-2" />
                                    Chia sẻ
                                </Button>
                            </div>
                            <div className="pt-6 border-t border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 justify-center text-center">
                                    Thông tin đăng ký
                                </h3>
                                <ul className="space-y-3 text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-rose-400" />
                                        Hạn đăng ký: <span className="font-medium">{formatDate(event.registrationEndDate)}</span>
                                    </li>

                                    <li className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-rose-400" />
                                        <span>{event.participantsCount}/{event.maxParticipants} người đã tham gia</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Gift className="w-4 h-4 text-rose-400" />
                                        <span className="text-teal-600 font-medium">Lệ phí tham gia: {event.visitCost.toLocaleString()} VND/người</span>
                                    </li>
                                </ul>
                                <div className="flex justify-center">
                                    {event.status === 1 && (

                                        <Button
                                            onClick={() => setShowGiftDialog(true)}
                                            className="h-12 mt-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-all duration-300 hover:scale-[1.02]"
                                        >
                                            <Gift className="w-5 h-5 mr-2" />
                                            Đăng ký tặng quà
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card >
                {user && (
                    <HistoryTabs
                        visitId={id}
                        userId={user?.userID}
                    />
                )}
            </div>
        </>
    );

    const renderScheduleTab = () => (
        <>
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-6 text-teal-600">Lịch trình</h2>
                    <div className="space-y-8">
                        {event.travelItineraryDetails.map((day, dayIndex) => (
                            <div key={dayIndex}>
                                <h3 className="text-lg font-medium mb-4 text-teal-700 border-b pb-2">
                                    Ngày {dayIndex + 1}: {formatDate(day.date)}
                                </h3>
                                <div className="space-y-4">
                                    {day.activities.map((activity, actIndex) => (
                                        <div
                                            key={actIndex}
                                            className="flex border-l-4 border-teal-500 pl-4 bg-teal-50 hover:bg-teal-100 transition-colors p-3 rounded-r-lg"
                                        >
                                            <div className="w-32 font-medium text-teal-700">
                                                {activity.startTime} - {activity.endTime}
                                            </div>
                                            <div className="flex-1 text-gray-700">
                                                {activity.description}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="space-y-4 p-6">
                    <h2 className="text-xl font-semibold mb-4 text-teal-600">Những món quà sẻ chia yêu thương</h2>

                    <div className="grid grid-cols-2">
                        {event.giftRequestDetails.map((gift, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-between ${index % 2 === 0 ? "border-r-2 border-t-300 pr-4" : "pl-4"
                                    }`}
                            >
                                <div className="text-gray-700">
                                    <h4 className="font-medium">{gift.giftType}</h4>
                                </div>
                                <div className="text-teal-500 font-medium">
                                    {gift.currentAmount}/{gift.amount} {gift.unit} đã đăng ký trao gửi
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>


            </Card>
        </>
    );

    const renderRequirementsAndMaterials = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardContent className="p-6">
                    <h2 className="font-semibold mb-4 text-teal-600">Yêu cầu</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                        <li className="hover:text-teal-600 transition-colors">Đăng ký trước để ban tổ chức nắm rõ số lượng và lên kế hoạch cho sự kiện.
                        </li>
                        <li className="hover:text-teal-600 transition-colors">Có tinh thần thiện nguyện và yêu trẻ</li>
                        <li className="hover:text-teal-600 transition-colors">Tuân thủ các quy định của ban tổ chức</li>
                    </ul>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-6">
                    <h2 className="font-semibold mb-4 text-teal-600">Chuẩn bị</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                        <li className="hover:text-teal-600 transition-colors">Trang phục thoải mái, gọn gàng và phù hợp với tính chất của sự kiện</li>
                        <li className="hover:text-teal-600 transition-colors">Đồ dùng cá nhân </li>
                        <li className="hover:text-teal-600 transition-colors">Lưu lại thông tin liên lạc của người phụ trách để kịp thời giải quyết những vấn đề phát sinh.</li>
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
                        className="mx-auto mb-4 w-32 h-32 object-cover rounded-full"
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
        <ParticipantList visitRegistrations={event.visitRegistrations} />
    );
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-3 space-y-6">
                        {hasCanceledRegistration && !hasProcessedCancellation && (
                            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <AlertCircle className="text-orange-600 mr-2" />                                    <span className="mr-2 text-orange-600">
                                        Chuyến thăm bạn đã đăng ký không thể diễn ra như dự kiến và đã bị hủy. Bạn
                                    </span>
                                    <Button
                                        variant="link"
                                        className="text-orange-500 underline p-0 hover:text-orange-700"
                                        onClick={() => setShowCanceledRegistrationModal(true)}
                                    >
                                        vui lòng bấm vào đây
                                    </Button>
                                    <span className="ml-1 text-orange-500">chọn phương thức xử lý khoản thanh toán.</span>
                                </div>
                            </div>
                        )}</div>
                    <div className="lg:col-span-2 space-y-6">
                        {renderEventHeader()}

                        <Tabs defaultValue="details">
                            <TabsList className="flex space-x-2 bg-inherit">
                                <TabsTrigger value="details" className="relative py-1 px-4 text-md font-medium">
                                    Chi tiết chuyến thăm
                                </TabsTrigger>
                                <TabsTrigger value="activities" className="relative py-1 px-4 text-md font-medium">
                                    Hoạt động
                                </TabsTrigger>
                                <TabsTrigger value="responses" className="relative py-1 px-4 text-md font-medium">
                                    Danh sách đăng ký
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


            <GiftRegistration
                isOpen={showGiftDialog}
                onClose={() => setShowGiftDialog(false)}
                visitId={id}
                userId={user?.userID}
                giftRequestDetails={event.giftRequestDetails}
            />
            {hasCanceledRegistration && (
                <CanceledEventRegistrationDialog
                    calculateRefundData={calculateRefundData}
                    isOpen={showCanceledRegistrationModal}
                    onClose={() => setShowCanceledRegistrationModal(false)}
                    registrationData={event.visitRegistrations.find(
                        reg => reg.userID === user?.userID && reg.status === 1
                    )}
                    onConfirmCancel={handleCancelRegistration}
                />
            )}
        </div>
    );
};

export default EventDetail;