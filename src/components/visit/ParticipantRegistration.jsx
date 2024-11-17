import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, ScrollText, Loader2, CreditCard, CheckCircle, Calendar, CircleAlert } from 'lucide-react';
import { toast } from 'sonner';
import { useCanRegisterForVisitQuery, useCreateVisitTripRegistrationMutation, useCancelVisitRegistrationTransactionMutation, useGetVisitTripRegistrationsByUserAndVisitQuery, useUpdateVisitTripRegistrationMutation } from '@/redux/visitTripRegistration/visitTripRegistrationApi';
import { usePayOS } from 'payos-checkout';
import CancelRegistrationDialog from '@/components/visit/CancelRegistrationDialog';

const ParticipantRegistration = ({
    visitId,
    userId,
    maxParticipants,
    participantsCount,
}) => {
    const { data: canRegister, isLoading: isCheckingRegistration } = useCanRegisterForVisitQuery({ userId, visitId });
    const { data: registrationData } = useGetVisitTripRegistrationsByUserAndVisitQuery({
        userId,
        visitId
    });
    const [updateRegistration] = useUpdateVisitTripRegistrationMutation();

    const activeRegistration = registrationData?.find(reg => reg.status === 0 || reg.status === 1);
    const isPendingRefund = registrationData?.some(reg => reg.status === 2);
    const isRegistered = !canRegister;

    const [createRegistration, { isLoading }] = useCreateVisitTripRegistrationMutation();
    const [cancelRegistration, { isLoading: isCanceling }] = useCancelVisitRegistrationTransactionMutation();
    const [showTermsDialog, setShowTermsDialog] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState(null);

    const [payOSConfig, setPayOSConfig] = useState({
        RETURN_URL: window.location.origin,
        ELEMENT_ID: 'payment-container',
        CHECKOUT_URL: null,
        onSuccess: (event) => {
            toast.success('Thanh toán thành công');
            setShowPaymentDialog(false);
            setPaymentDetails(null);
            window.location.reload();
        },
        onCancel: async (event) => {
            try {
                const orderCode = event.orderCode;
                await cancelRegistration(orderCode).unwrap();
                toast.error('Thanh toán thất bại');
                window.location.reload();
            } catch (error) {
                console.error('Error canceling registration:', error);
                window.location.reload();
            }
        },
        onExit: async (event) => {
            try {
                const orderCode = event.orderCode;
                await cancelRegistration(orderCode).unwrap();
                toast.error('Thanh toán thất bại');
            } catch (error) {
                console.error('Error canceling registration:', error);
            }
        },
    });

    const { open, exit } = usePayOS(payOSConfig);

    const handleRegister = async () => {
        if (participantsCount >= maxParticipants) {
            toast.error('Số lượng người tham gia đã đạt tối đa!');
            return;
        }
        setShowTermsDialog(true);
    };

    const handleSubmitRegistration = async () => {
        try {
            const registrationData = {
                visitID: visitId,
                userID: userId,
                cancelUrl: window.location.origin,
                returnUrl: window.location.origin
            };

            const response = await createRegistration(registrationData).unwrap();
            setPayOSConfig((oldConfig) => ({
                ...oldConfig,
                CHECKOUT_URL: response.paymentDetails.checkoutUrl,
            }));
            setShowTermsDialog(false);
            setShowPaymentDialog(true);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại!');
            console.error('Registration error:', error);
        }
    };

    const handleCancelRegistration = () => {
        if (activeRegistration) {
            setShowCancelDialog(true);
        } else {
            toast.error('Không tìm thấy thông tin đăng ký!');
        }
    };

    const handleConfirmCancel = async (params) => {
        try {
            await updateRegistration(params).unwrap();
            toast.success('Cập nhật trạng thái thành công');
            window.location.reload();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
            console.error('Update error:', error);
        }
    };

    useEffect(() => {
        if (payOSConfig.CHECKOUT_URL != null) {
            open();
        }
    }, [payOSConfig, open]);

    const renderButtonContent = () => {
        if (isPendingRefund) {
            return (
                <span className="flex items-center justify-center gap-2">
                    Đang hoàn tiền
                </span>
            );
        } else if (isRegistered) {
            return (
                <span className="flex items-center justify-center gap-2">
                    Hủy đăng ký
                </span>
            );
        } else {
            return (
                <span className="flex items-center justify-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Đăng ký tham gia
                </span>
            );
        }
    };

    return (
        <>
            <Button
                onClick={isRegistered ? handleCancelRegistration : handleRegister}
                disabled={participantsCount >= maxParticipants || isCheckingRegistration || isPendingRefund}
                variant={isRegistered ? "outline" : "default"}
                className={`h-14 text-lg font-medium rounded-xl transition-all duration-300 ${participantsCount >= maxParticipants || isCheckingRegistration || isPendingRefund
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : isRegistered
                        ? 'border-2 text-teal-500 border-teal-500 hover:bg-teal-100 hover:border-teal-300 hover:text-teal-400 hover:scale-[1.02]'
                        : 'bg-teal-500 hover:bg-teal-600 hover:shadow-lg hover:scale-[1.02] text-white'
                    }`}
            >
                {renderButtonContent()}
            </Button>
            <Dialog open={showTermsDialog} onOpenChange={() => setShowTermsDialog(false)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg">
                    <DialogHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 sticky top-0 z-10">
                        <DialogTitle className="text-2xl font-bold text-center">
                            Tham Gia Chuyến Thăm Trẻ Em
                        </DialogTitle>
                        <DialogDescription className="text-white/90 text-center text-lg mt-2">
                            Hãy cùng chúng tôi tạo nên những khoảnh khắc ý nghĩa và đáng nhớ
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-6 space-y-4">
                        <div className="bg-teal-50 rounded-lg p-4">
                            <h3 className="text-xl font-semibold text-teal-700 mb-3">
                                Trải Nghiệm Đặc Biệt Đang Chờ Đón Bạn
                            </h3>
                            <p className="text-gray-700">
                                Chuyến thăm này không chỉ mang lại cho bạn cơ hội tìm hiểu và trải nghiệm, mà còn là dịp để kết nối, sẻ chia và tạo nên những khoảnh khắc ý nghĩa khó quên.
                            </p>
                            <ul className="mt-3 space-y-2">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 shrink-0 mt-1 text-teal-500" />
                                    <span>
                                        Gặp gỡ và giao lưu với trẻ em, tìm hiểu về hoàn cảnh sống của các em và cùng nhau tạo nên những niềm vui nhỏ bé.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 shrink-0 mt-1 text-teal-500" />
                                    <span>
                                        Tham gia các hoạt động vui chơi giáo dục bổ ích, giúp trẻ phát triển tư duy và kỹ năng một cách tự nhiên qua những trò chơi hấp dẫn.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 shrink-0 mt-1 text-teal-500" />
                                    <span>
                                        Tạo những kỷ niệm đáng nhớ không chỉ với các em nhỏ mà còn với những người đồng hành trong hành trình đầy cảm xúc này.
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-teal-50 rounded-lg p-4">
                            <h3 className="text-xl font-semibold text-teal-700 mb-3">
                                Quy Trình Đăng Ký Đơn Giản
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-teal-100 text-teal-600 font-bold">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Xác nhận tham gia</h4>
                                        <p className="text-gray-600">
                                            Đọc kỹ và đồng ý với các điều khoản tham gia được đưa ra để đảm bảo bạn hiểu rõ quyền lợi cũng như trách nhiệm của mình khi tham gia chương trình.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-teal-100 text-teal-600 font-bold">
                                        2
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Thanh toán</h4>
                                        <p className="text-gray-600">
                                            Sử dụng mã QR được cung cấp để hoàn tất quá trình thanh toán một cách nhanh chóng và bảo mật, đảm bảo suất tham gia của bạn được xác nhận.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-teal-50 rounded-lg p-4">
                            <h3 className="text-xl font-semibold text-teal-700 mb-3">
                                Chính Sách Hoàn Tiền
                            </h3>
                            <ul className="space-y-2 text-gray-700">
                                <li className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 shrink-0 text-teal-500" />
                                    <span>Hủy trước ngày kết thúc đăng ký chuyến thăm: Hoàn lại 85% phí tham gia</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 shrink-0 text-teal-500" />
                                    <span>Hủy sau ngày kết thúc đăng ký chuyến thăm: Hoàn lại 65% phí tham gia</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CircleAlert className="w-5 h-5 shrink-0 text-teal-500" />
                                    <span>Không hoàn tiền khi chuyến thăm đã bắt đầu</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="sticky bottom-0 border-t flex justify-end gap-3 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowTermsDialog(false)}
                            className="px-6"
                        >
                            Để sau
                        </Button>
                        <Button
                            onClick={handleSubmitRegistration}
                            disabled={isLoading}
                            className="px-6 bg-teal-500 hover:bg-teal-600 text-white"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang xử lý
                                </span>
                            ) : (
                                'Tiếp tục đăng ký'
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <CancelRegistrationDialog
                isOpen={showCancelDialog}
                onClose={() => setShowCancelDialog(false)}
                registrationData={activeRegistration}
                onConfirmCancel={handleConfirmCancel}
            />
        </>
    );
};

export default ParticipantRegistration;