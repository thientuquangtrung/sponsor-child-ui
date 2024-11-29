import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { giftDeliveryMethod } from '@/config/combobox';
import { Loader2 } from 'lucide-react';

const physicalDonationSchema = z.object({
    giftTypeIndex: z.number({ required_error: 'Vui lòng chọn loại quà' }).min(0, 'Vui lòng chọn loại quà'),
    amount: z.preprocess(
        (val) => (val === '' ? undefined : Number(val)),
        z.number({ required_error: 'Vui lòng nhập số lượng' }).min(1, 'Số lượng phải lớn hơn 0')
    ),
    giftWeight: z.preprocess(
        (val) => (val === '' ? undefined : Number(val)),
        z.number({ required_error: 'Vui lòng nhập Tổng khối lượng' }).min(0, 'Tổng khối lượng phải lớn hơn 0')
    ),
    length: z.preprocess(
        (val) => (val === '' ? undefined : Number(val)),
        z.number({ required_error: 'Vui lòng nhập Tổng chiều dài' }).min(0, 'Tổng chiều dài phải lớn hơn 0')
    ),
    width: z.preprocess(
        (val) => (val === '' ? undefined : Number(val)),
        z.number({ required_error: 'Vui lòng nhập Tổng chiều rộng' }).min(0, 'Tổng chiều rộng phải lớn hơn 0')
    ),
    height: z.preprocess(
        (val) => (val === '' ? undefined : Number(val)),
        z.number({ required_error: 'Vui lòng nhập Tổng chiều cao' }).min(0, 'Tổng chiều cao phải lớn hơn 0')
    ),
    giftDeliveryMethod: z.number({ required_error: 'Vui lòng chọn phương thức vận chuyển' }).min(0, 'Vui lòng chọn phương thức vận chuyển'),
});


const PhysicalDonationForm = ({
    giftRequestDetails,
    userId,
    visitId,
    onClose,
    onBack,
    isLoading,
    createPhysicalDonation
}) => {
    const form = useForm({
        resolver: zodResolver(physicalDonationSchema),
        defaultValues: {
            giftTypeIndex: 0,
            amount: '',
            giftWeight: '',
            length: '',
            width: '',
            height: '',
            giftDeliveryMethod: 0,
        },
    });

    const selectedGiftType = giftRequestDetails?.[form.watch('giftTypeIndex')];

    const handleNumberInput = (e, onChange) => {
        let value = e.target.value;
        if (!/^\d*\.?\d*$/.test(value) && value !== '') {
            return;
        }
        if (value.length > 1 && value[0] === '0' && value[1] !== '.') {
            value = value.replace(/^0+/, '');
        }
        onChange(value);
    };

    const onSubmit = async (data) => {
        try {
            const selectedGift = giftRequestDetails[data.giftTypeIndex];
            const remainingAmount = selectedGift.amount - selectedGift.currentAmount;

            if (data.amount > remainingAmount) {
                toast.error(`Số lượng đăng ký không được vượt quá ${remainingAmount} ${selectedGift.unit}`);
                return;
            }

            const payload = {
                userID: userId,
                visitID: visitId,
                amount: Number(data.amount),
                giftWeight: Number(data.giftWeight),
                length: Number(data.length),
                width: Number(data.width),
                height: Number(data.height),
                giftDeliveryMethod: data.giftDeliveryMethod,
                giftType: selectedGift.giftType,
                unit: selectedGift.unit,
                donationType: 0
            };

            await createPhysicalDonation(payload).unwrap();

            toast.success('Đăng ký tặng quà thành công!');
            onClose();
            form.reset();
            window.location.reload();
        } catch (error) {
            toast.error('Đã có lỗi xảy ra. Vui lòng thử lại!');
            console.error('Error submitting physical donation:', error);
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
                                disabled={isLoading}
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
                <div className="grid grid-cols-3 gap-4">

                    <FormItem>
                        <FormLabel>Đơn vị</FormLabel>
                        <FormControl>
                            <Input
                                value={selectedGiftType?.unit || ''}
                                disabled
                                className="bg-gray-100"
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
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="giftWeight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tổng khối lượng quà (kg)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        {...field}
                                        onChange={(e) => handleNumberInput(e, field.onChange)}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="length"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tổng chiều dài (cm)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        {...field}
                                        onChange={(e) => handleNumberInput(e, field.onChange)}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="width"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tổng chiều rộng (cm)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        {...field}
                                        onChange={(e) => handleNumberInput(e, field.onChange)}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tổng chiều cao (cm)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        {...field}
                                        onChange={(e) => handleNumberInput(e, field.onChange)}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="giftDeliveryMethod"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phương thức giao quà</FormLabel>
                                <Select
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    defaultValue={field.value.toString()}
                                    disabled={isLoading}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn phương thức giao quà" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {giftDeliveryMethod.map((method) => (
                                            <SelectItem key={method.value} value={method.value.toString()}>
                                                {method.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormItem>
                        <FormLabel>Địa chỉ mang đến</FormLabel>
                        <FormControl>
                            <Input
                                value="Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức"
                                className="bg-gray-100"
                                disabled
                            />
                        </FormControl>
                    </FormItem>
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
                        disabled={isLoading}
                    >
                        {isLoading ? (
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

export default PhysicalDonationForm;