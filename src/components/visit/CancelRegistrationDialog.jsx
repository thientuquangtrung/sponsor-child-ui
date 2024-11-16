import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from "@/components/ui/alert";

const CancelRegistrationDialog = ({
    isOpen,
    onClose,
    registrationData,
    onConfirmCancel
}) => {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const needsRefund = registrationData?.status === 1;

    const handleSubmit = async () => {
        if (!reason.trim()) {
            toast.error('Vui lòng nhập lý do hủy đăng ký');
            return;
        }

        try {
            setIsSubmitting(true);
            await onConfirmCancel({
                id: registrationData.id,
                status: needsRefund ? 2 : 3, // 2: PendingRefund, 3: Cancelled
                cancellationReason: reason,
            });

            toast.success(needsRefund ? 'Đã gửi yêu cầu hoàn tiền' : 'Đã hủy đăng ký thành công');
            onClose();
        } catch (error) {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
            console.error('Cancel registration error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                        Hủy đăng ký chuyến đi
                    </DialogTitle>
                    <DialogDescription>
                        {needsRefund
                            ? 'Bạn đã thanh toán cho chuyến đi này. Việc hủy đăng ký sẽ yêu cầu hoàn tiền.'
                            : 'Bạn chưa thanh toán cho chuyến đi này. Việc hủy đăng ký sẽ không thể hoàn tác.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 p-4">
                    {needsRefund && (
                        <Alert className="bg-yellow-50 border-yellow-200">
                            <AlertDescription className="text-yellow-700">
                                Yêu cầu hoàn tiền sẽ được xử lý trong vòng 3-5 ngày làm việc.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Lý do hủy đăng ký <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Vui lòng nhập lý do hủy đăng ký..."
                            className="min-h-[100px] resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="w-24"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !reason.trim()}
                            className="w-32 bg-red-500 hover:bg-red-600 text-white"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang xử lý...
                                </span>
                            ) : (
                                'Xác nhận hủy'
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CancelRegistrationDialog;