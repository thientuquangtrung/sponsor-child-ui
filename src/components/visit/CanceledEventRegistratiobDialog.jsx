import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CircleAlert, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { bankName } from '@/config/combobox';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const refundFormSchema = z.object({
    reason: z.string({
        required_error: 'Vui lòng nhập lý do hủy'
    }).min(1, 'Vui lòng nhập lý do hủy'),
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
    })
});

const CanceledEventRegistrationDialog = ({
    isOpen,
    onClose,
    registrationData,
    onConfirmCancel,
    visitCost
}) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: zodResolver(refundFormSchema),
        defaultValues: {
            reason: '',
            bankAccount: {
                name: '',
                number: '',
                bank: ''
            }
        }
    });

    const onSubmit = async (data) => {
        try {
            await onConfirmCancel({
                id: registrationData.id,
                status: 2,
                cancellationReason: data.reason,
                bankAccountName: data.bankAccount.name,
                bankAccountNumber: data.bankAccount.number,
                bankName: parseInt(data.bankAccount.bank)
            });
            toast.success('Yêu cầu hoàn tiền đã được gửi');
            reset();
            onClose();
        } catch (error) {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
            console.error('Refund error:', error);
        }
    };

    const handleDonation = async () => {
        try {
            await onConfirmCancel({
                id: registrationData.id,
                status: 4,
                cancellationReason: 'Ủng hộ quỹ từ thiện'
            });
            toast.success('Cảm ơn sự ủng hộ của bạn!');
            onClose();
        } catch (error) {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
            console.error('Donation error:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg">
                <DialogHeader className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 sticky top-0 z-10">
                    <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                        <CircleAlert className="w-6 h-6" />
                        Chuyến Thăm Đã Bị Hủy
                    </DialogTitle>
                    <DialogDescription className="text-white/90 text-center text-lg mt-2">
                        Bạn đã thanh toán cho chuyến đi này. Việc chuyến thăm bị hủy bạn sẽ được hoàn tiền.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="p-6 space-y-4">
                        <div className="bg-yellow-50 rounded-lg p-4">
                            <p className="text-gray-700 mb-2">
                                Số tiền đã thanh toán: <span className="font-semibold">{visitCost?.toLocaleString('vi-VN')} VNĐ</span>
                            </p>
                            <p className="text-gray-600 text-sm">Bạn có thể chọn hoàn tiền hoặc ủng hộ vào quỹ chung.</p>
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

                        <div className="bg-red-50 rounded-lg p-4">
                            <h3 className="text-xl font-semibold text-teal-700 mb-3">
                                Lý Do Hủy Đăng Ký
                            </h3>
                            <Controller
                                name="reason"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        placeholder="Vui lòng chia sẻ lý do bạn muốn hủy đăng ký..."
                                        className={`w-full min-h-[100px] resize-none rounded-lg p-2 border ${errors.reason ? "border-red-500" : ""}`}
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
                            className="px-6 bg-gray-700 hover:bg-gray-800 text-white"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 bg-rose-400 hover:bg-rose-500 text-white"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang xử lý
                                </span>
                            ) : (
                                'Xác nhận hoàn tiền'
                            )}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleDonation}
                            className="px-6 bg-teal-500 hover:bg-teal-600 text-white"
                        >
                            Thay vào đó, tôi muốn ủng hộ quỹ từ thiện
                        </Button>
                    </div>
                </form>


            </DialogContent>
        </Dialog>
    );
};

export default CanceledEventRegistrationDialog;