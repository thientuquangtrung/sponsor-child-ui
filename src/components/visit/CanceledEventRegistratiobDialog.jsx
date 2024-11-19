import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, RefreshCw, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { bankName } from '@/config/combobox';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const refundFormSchema = z.object({
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
    const [selectedOption, setSelectedOption] = useState(null);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        resolver: zodResolver(refundFormSchema),
        defaultValues: {
            bankAccount: {
                name: '',
                number: '',
                bank: ''
            }
        }
    });

    const reloadPage = () => {
        window.location.reload();
    };

    const onSubmit = async (data) => {
        try {
            await onConfirmCancel({
                id: registrationData.id,
                status: 2,
                cancellationReason: 'Hoàn tiền do chuyến thăm bị hủy',
                bankAccountName: data.bankAccount.name,
                bankAccountNumber: data.bankAccount.number,
                bankName: parseInt(data.bankAccount.bank)
            });
            toast.success('Yêu cầu hoàn tiền đã được gửi');
            reset();
            setSelectedOption(null);
            onClose();
            setTimeout(reloadPage, 1000);
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
            setSelectedOption(null);
            onClose();
            setTimeout(reloadPage, 1000);
        } catch (error) {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
            console.error('Donation error:', error);
        }
    };

    const handleClose = () => {
        reset();
        setSelectedOption(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg">
                <DialogHeader className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 sticky top-0 z-10">
                    <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                        Chúng tôi xin lỗi vì sự bất tiện này. Chuyến thăm bạn đã đăng ký không thể diễn ra như dự kiến và đã bị hủy.
                    </DialogTitle>
                    <DialogDescription className="text-white/90 text-center text-lg mt-2">
                        Số tiền bạn đã thanh toán sẽ được hoàn lại đầy đủ. Nếu bạn cần hỗ trợ thêm, vui lòng chọn phương thức xử lý khoản thanh toán.</DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-4">
                    <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-gray-700 mb-2">
                            Bạn được hoàn lại 100% số tiền mà bạn đã thanh toán là: <span className="font-semibold">{visitCost?.toLocaleString('vi-VN')} VNĐ</span>.
                        </p>
                    </div>

                    {!selectedOption && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => setSelectedOption('refund')}
                                className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-teal-500 hover:bg-teal-50 transition-colors"
                            >
                                <RefreshCw className="w-12 h-12 text-teal-500 mb-3" />
                                <h3 className="text-lg font-semibold text-teal-700">Hoàn tiền</h3>
                                <p className="text-sm text-gray-600 text-center mt-2">
                                    Nhận lại khoản thanh toán vào tài khoản ngân hàng của bạn
                                </p>
                            </button>

                            <button
                                onClick={() => setSelectedOption('donate')}
                                className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-rose-400 hover:bg-rose-50 transition-colors"
                            >
                                <Heart className="w-12 h-12 text-rose-400 mb-3" />
                                <h3 className="text-lg font-semibold text-rose-600">Ủng hộ quỹ từ thiện</h3>
                                <p className="text-sm text-gray-600 text-center mt-2">
                                    Đóng góp khoản thanh toán vào quỹ chung hỗ trợ cộng đồng
                                </p>
                            </button>
                        </div>
                    )}

                    {selectedOption === 'donate' && (
                        <div className="bg-rose-50 rounded-lg p-6 text-center">
                            <h3 className="text-xl font-semibold text-rose-600 mb-4">
                                Xác nhận ủng hộ quỹ từ thiện
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Bạn đang chọn ủng hộ số tiền {visitCost?.toLocaleString('vi-VN')} VNĐ vào quỹ từ thiện.
                                Khoản ủng hộ này sẽ được sử dụng để hỗ trợ các hoạt động cộng đồng.
                            </p>
                            <div className="flex justify-center gap-3">
                                <Button
                                    type="button"
                                    onClick={() => setSelectedOption(null)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white"
                                >
                                    Quay lại
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleDonation}
                                    className="bg-rose-400 hover:bg-rose-500 text-white"
                                >
                                    Xác nhận ủng hộ
                                </Button>
                            </div>
                        </div>
                    )}

                    {selectedOption === 'refund' && (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    onClick={() => setSelectedOption(null)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white"
                                >
                                    Quay lại
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-teal-500 hover:bg-teal-600 text-white"
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
                            </div>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CanceledEventRegistrationDialog;