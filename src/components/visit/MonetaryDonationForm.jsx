import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { usePayOS } from 'payos-checkout';

const monetaryDonationSchema = z.object({
    giftTypeIndex: z.number({ required_error: 'Vui lòng chọn loại quà' }).min(0, 'Vui lòng chọn loại quà'),
    amount: z.preprocess(
        (val) => (val === '' ? undefined : Number(val)),
        z.number({ required_error: 'Vui lòng nhập số lượng' }).min(1, 'Số lượng phải lớn hơn 0')
    ),
});

const MonetaryDonationForm = ({
    giftRequestDetails,
    userId,
    visitId,
    onClose,
    onBack,
    createPhysicalDonation
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [payOSConfig, setPayOSConfig] = useState({
        RETURN_URL: window.location.origin,
        ELEMENT_ID: 'payment-container',
        CHECKOUT_URL: null,
        onSuccess: () => {
            toast.success('Thanh toán thành công');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        },
        onCancel: () => {
            toast.error('Thanh toán thất bại');
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        }
    });

    const { open } = usePayOS(payOSConfig);

    useEffect(() => {
        if (payOSConfig.CHECKOUT_URL != null) {
            open();
            onClose();
        }
    }, [payOSConfig, onClose]);

    const form = useForm({
        resolver: zodResolver(monetaryDonationSchema),
        defaultValues: {
            giftTypeIndex: 0,
            amount: '',
        },
    });

    const selectedGiftType = giftRequestDetails?.[form.watch('giftTypeIndex')];

    const handleNumberInput = (e, onChange) => {
        let value = e.target.value.replace(/\D/g, '');
        if (!value) {
            value = '0';
        }
        if (value.startsWith('0') && value.length > 1) {
            value = value.replace(/^0+/, '');
        }
        const formattedValue = parseInt(value, 10).toLocaleString('vi-VN');
        onChange(formattedValue);
    };

    const calculateTotalPrice = () => {
        const amount = form.watch('amount');
        const selectedGift = giftRequestDetails[form.watch('giftTypeIndex')];
        return amount ? Number(amount) * selectedGift.unitPrice : 0;
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const selectedGift = giftRequestDetails[data.giftTypeIndex];
            const remainingAmount = selectedGift.amount - selectedGift.currentAmount;

            if (data.amount > remainingAmount) {
                toast.error(`Số lượng đăng ký không được vượt quá ${remainingAmount} ${selectedGift.unit}`);
                setIsSubmitting(false);
                return;
            }

            const payload = {
                userID: userId,
                visitID: visitId,
                giftType: selectedGift.giftType,
                amount: Number(data.amount),
                unit: selectedGift.unit,
                donationType: 1,
                totalPrice: calculateTotalPrice(),
                cancelURL: window.location.origin,
                returnURL: window.location.origin
            };

            const response = await createPhysicalDonation(payload).unwrap();

            if (response.paymentDetails && response.paymentDetails.checkoutUrl) {
                setPayOSConfig(prevConfig => ({
                    ...prevConfig,
                    CHECKOUT_URL: response.paymentDetails.checkoutUrl,
                }));
            } else {
                toast.error('Không thể tạo liên kết thanh toán. Vui lòng thử lại.');
            }
        } catch (error) {
            const errorMessage = error.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại!';
            toast.error(errorMessage);
            console.error('Error submitting monetary donation:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="giftTypeIndex"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Loại quà</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(Number(value))}
                                defaultValue={field.value.toString()}
                                disabled={isSubmitting}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn loại quà" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {giftRequestDetails.map((gift, index) => (
                                        <SelectItem
                                            key={index}
                                            value={index.toString()}
                                        >
                                            {gift.giftType} (Còn lại: {gift.amount - gift.currentAmount} {gift.unit})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormItem>
                        <FormLabel>Đơn vị</FormLabel>
                        <FormControl>
                            <Input
                                value={selectedGiftType?.unit || ''}
                                disabled
                                className="bg-gray-100 w-1/2"
                            />
                        </FormControl>
                    </FormItem>

                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Số lượng</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        {...field}
                                        onChange={(e) => handleNumberInput(e, field.onChange)}
                                        disabled={isSubmitting}
                                        className="w-1/2"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <p className="text-sm font-semibold">
                    Giá mỗi {selectedGiftType?.unit}: {selectedGiftType?.unitPrice.toLocaleString()} VND
                </p>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between">
                        <span className="font-medium">Tổng giá trị:</span>
                        <span className="font-bold text-rose-600">
                            {calculateTotalPrice().toLocaleString()} VND
                        </span>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="hover:bg-gray-200"

                    >
                        Quay lại
                    </Button>
                    <Button
                        type="submit"
                        className="bg-rose-500 hover:bg-rose-700 text-white"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang xử lý
                            </>
                        ) : (
                            'Đăng ký'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default MonetaryDonationForm;