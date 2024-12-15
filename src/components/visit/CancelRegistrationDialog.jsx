import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, CircleAlert } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bankName } from '@/config/combobox';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const cancelFormSchema = z.object({
    reason: z.string({
        required_error: 'Vui lòng nhập lý do hủy đăng ký'
    }).min(1, 'Vui lòng nhập lý do hủy đăng ký'),
    bankAccount: z.object({
        name: z.string({
            required_error: 'Vui lòng nhập tên chủ tài khoản'
        }).min(1, 'Vui lòng nhập tên chủ tài khoản'),
        number: z.string({
            required_error: 'Vui lòng nhập số tài khoản'
        }).min(1, 'Vui lòng nhập số tài khoản')
            .regex(/^\d+$/, 'Số tài khoản chỉ được chứa số'),
        bank: z.string({
            required_error: 'Vui lòng chọn ngân hàng'
        }).min(1, 'Vui lòng chọn ngân hàng')
    }).optional()
});
const CancelRegistrationDialog = ({
    isOpen,
    onClose,
    registrationData,
    onConfirmCancel,
    eventStatus,
    visitCost
}) => {
    const needsRefund = registrationData?.status === 1;
    const adminConfig = JSON.parse(localStorage.getItem('adminConfigs'))
    const refundPercentOpenRegistration = adminConfig['Visit_RefundPercentage_OpenRegistration'] || 85;
    const refundPercentClosedRegistration = adminConfig['Visit_RefundPercentage_ClosedRegistration'] || 65;
    const calculateRefundAmount = () => {
        if (!needsRefund || !visitCost) return 0;

        const refundPercentage = eventStatus === 1
            ? refundPercentOpenRegistration / 100
            : eventStatus === 2
                ? refundPercentClosedRegistration / 100
                : 0;
        return visitCost * refundPercentage;
    };
    const formSchema = needsRefund
        ? cancelFormSchema
        : cancelFormSchema.omit({ bankAccount: true });

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            reason: '',
            bankAccount: needsRefund ? {
                name: '',
                number: '',
                bank: ''
            } : undefined
        }
    });

    const onSubmit = async (data) => {
        try {
            const result = await onConfirmCancel({
                id: registrationData.id,
                status: needsRefund ? 2 : 3,
                cancellationReason: data.reason,
                bankAccountName: data.bankAccount?.name,
                bankAccountNumber: data.bankAccount?.number,
                bankName: data.bankAccount?.bank ? parseInt(data.bankAccount.bank) : undefined
            });

            if (result && (result.status === 2 || result.status === 3)) {
                toast.success(needsRefund ? 'Đã gửi yêu cầu hoàn tiền' : 'Đã hủy đăng ký thành công');
                reset();
                onClose();
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                throw new Error('Hủy đăng ký thất bại');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
            console.error('Cancel registration error:', error);
        }
    };
    const refundAmount = calculateRefundAmount();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg">
                <DialogHeader className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 sticky top-0 z-10">
                    <DialogTitle className="text-2xl font-bold text-center">
                        Hủy Đăng Ký Chuyến Thăm
                    </DialogTitle>
                    <DialogDescription className="text-white/90 text-center text-lg mt-2">
                        {needsRefund
                            ? 'Bạn đã thanh toán cho chuyến đi này. Việc hủy đăng ký sẽ yêu cầu hoàn tiền.'
                            : 'Dường như bạn chưa hoàn tất thanh toán cho chuyến thăm này. Bạn có thể hủy đăng ký và thực hiện lại quy trình đăng ký từ đầu.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="p-6 space-y-4">
                        {needsRefund && (
                            <>
                                <div className="bg-red-50 rounded-lg p-4">
                                    <h3 className="text-xl font-semibold text-teal-700 mb-3">
                                        Thông Tin Hoàn Tiền
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="space-y-1">
                                                <p className="text-gray-700">
                                                    Số tiền đã thanh toán: <span className="font-semibold">{visitCost?.toLocaleString('vi-VN')} VNĐ</span>
                                                </p>
                                                <p className="text-gray-700">
                                                    Số tiền sẽ được hoàn lại ({eventStatus === 1 ? `${refundPercentOpenRegistration}%` : `${refundPercentClosedRegistration}%`}):
                                                    <span className="font-semibold text-teal-600 ml-2">
                                                        {refundAmount.toLocaleString('vi-VN')} VNĐ
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-red-50 rounded-lg p-4">
                                    <h3 className="text-xl font-semibold text-teal-700 mb-3">
                                        Thông Tin Tài Khoản Nhận Hoàn Tiền
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                Tên chủ tài khoản
                                            </label>
                                            <Controller
                                                name="bankAccount.name"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        placeholder="Nhập tên chủ tài khoản"
                                                        className={errors.bankAccount?.name ? "border-red-500" : ""}
                                                    />
                                                )}
                                            />
                                            {errors.bankAccount?.name && (
                                                <p className="text-red-500 text-sm mt-1">{errors.bankAccount.name.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                Số tài khoản
                                            </label>
                                            <Controller
                                                name="bankAccount.number"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        placeholder="Nhập số tài khoản"
                                                        className={errors.bankAccount?.number ? "border-red-500" : ""}
                                                        onKeyPress={(e) => {
                                                            if (!/[0-9]/.test(e.key)) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        onPaste={(e) => {
                                                            e.preventDefault();
                                                            const pastedText = e.clipboardData.getData('text');
                                                            if (/^\d+$/.test(pastedText)) {
                                                                field.onChange(pastedText);
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/\D/g, '');
                                                            field.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            />
                                            {errors.bankAccount?.number && (
                                                <p className="text-red-500 text-sm mt-1">{errors.bankAccount.number.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-1 block">
                                                Ngân hàng
                                            </label>
                                            <Controller
                                                name="bankAccount.bank"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className={`w-full ${errors.bankAccount?.bank ? "border-red-500" : ""}`}>
                                                            <SelectValue placeholder="Chọn ngân hàng" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <div className="max-h-[200px] overflow-y-auto">
                                                                {bankName.map((bank) => (
                                                                    <SelectItem key={bank.value} value={bank.value.toString()}>
                                                                        {bank.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </div>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.bankAccount?.bank && (
                                                <p className="text-red-500 text-sm mt-1">{errors.bankAccount.bank.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="bg-red-50 rounded-lg p-4">
                            <h3 className="text-xl font-semibold text-teal-700 mb-3">
                                Lý Do Hủy Đăng Ký
                            </h3>
                            <Controller
                                name="reason"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        placeholder="Vui lòng chia sẻ lý do bạn muốn hủy đăng ký..."
                                        className={`min-h-[100px] resize-none ${errors.reason ? "border-red-500" : ""}`}
                                    />
                                )}
                            />
                            {errors.reason && (
                                <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="border-t flex justify-end gap-3 p-4 bg-white">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="px-6"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 bg-teal-500 hover:bg-teal-600 text-white"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang xử lý
                                </span>
                            ) : (
                                'Xác nhận hủy'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CancelRegistrationDialog;