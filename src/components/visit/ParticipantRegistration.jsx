import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, Luggage, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCanRegisterForVisitQuery, useCreateVisitTripRegistrationMutation, useCancelVisitRegistrationTransactionMutation, useGetVisitTripRegistrationsByUserAndVisitQuery, useUpdateVisitTripRegistrationMutation } from '@/redux/visitTripRegistration/visitTripRegistrationApi';
import { usePayOS } from 'payos-checkout';
import CancelRegistrationDialog from '@/components/visit/CancelRegistrationDialog';

const ParticipantRegistration = ({
    visitId,
    userId,
    maxParticipants,
    participantsCount
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
    const [showLuggageDialog, setShowLuggageDialog] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [selectedLuggage, setSelectedLuggage] = useState("0");
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
        setShowLuggageDialog(true);
    };

    const handleLuggageChange = (value) => {
        setSelectedLuggage(value);
    };

    const handleSubmitRegistration = async () => {
        try {
            const registrationData = {
                luggageCapacityUsed: parseInt(selectedLuggage),
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
            setShowLuggageDialog(false);
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
                className={`h-14 text-lg font-medium rounded-xl transition-all duration-300 ${participantsCount >= maxParticipants || isCheckingRegistration || isPendingRefund
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : isRegistered
                        ? 'bg-blue-300 hover:bg-blue-400 hover:shadow-lg hover:scale-[1.02] text-white'
                        : 'bg-teal-500 hover:bg-teal-600 hover:shadow-lg hover:scale-[1.02] text-white'
                    }`}
            >
                {renderButtonContent()}
            </Button>

            <Dialog open={showLuggageDialog} onOpenChange={() => setShowLuggageDialog(false)}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Luggage className="w-6 h-6" />
                            Chọn số lượng hành lý
                        </DialogTitle>
                        <DialogDescription>
                            Mỗi người được mang tối đa 2 kiện hành lý
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 px-4">
                        <div className="flex justify-center items-center">
                            <Select value={selectedLuggage} onValueChange={handleLuggageChange}>
                                <SelectTrigger className="w-3/4 px-4 h-12 justify-between text-base border-2 border-gray-300 rounded-lg hover:border-teal-500  transition-colors">
                                    <SelectValue placeholder="Chọn số lượng hành lý" />
                                </SelectTrigger>
                                <SelectContent className="text-sm">
                                    {[
                                        { value: "0", label: "Không có hành lý" },
                                        { value: "1", label: "1 kiện hành lý" },
                                        { value: "2", label: "2 kiện hành lý" },
                                    ].map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            className="h-12 text-base hover:bg-teal-200 focus:bg-teal-50 cursor-pointer"
                                        >
                                            <span className="flex text-sm items-center gap-3">
                                                {option.label}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                className="w-20 bg-slate-600 hover:bg-black text-white hover:text-white"
                                onClick={() => setShowLuggageDialog(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={handleSubmitRegistration}
                                disabled={isLoading}
                                className="w-20 bg-teal-500 hover:bg-teal-600 text-gray-100"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Đang ...
                                    </span>
                                ) : (
                                    'Tiếp tục'
                                )}
                            </Button>
                        </div>
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