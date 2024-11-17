import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreatePhysicalDonationMutation } from '@/redux/physicalDonations/physicalDonationApi';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { giftDeliveryMethod } from '@/config/combobox';

const giftSchema = z.object({
    giftTypeIndex: z.number().min(0, 'Vui lòng chọn loại quà'),
    amount: z.number().min(1, 'Số lượng phải lớn hơn 0'),
    giftWeight: z.number().min(0, 'Khối lượng phải lớn hơn 0'),
    length: z.number().min(0, 'Chiều dài phải lớn hơn 0'),
    width: z.number().min(0, 'Chiều rộng phải lớn hơn 0'),
    height: z.number().min(0, 'Chiều cao phải lớn hơn 0'),
    giftDeliveryMethod: z.number(),
});

const GiftRegistration = ({ isOpen, onClose, visitId, userId, giftRequestDetails }) => {
    const [createPhysicalDonation] = useCreatePhysicalDonationMutation();

    const form = useForm({
        resolver: zodResolver(giftSchema),
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
    // const deliveryMethod = form.watch('giftDeliveryMethod');

    const handleNumberInput = (e, onChange) => {
        let value = e.target.value;
        if (value.length > 1 && value[0] === '0' && value[1] !== '.') {
            value = value.replace(/^0+/, '');
        }
        if (value < 0 || value.startsWith('-')) {
            value = '';
        }
        onChange(value === '' ? '' : Number(value));
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
                amount: data.amount,
                giftWeight: data.giftWeight,
                length: data.length,
                width: data.width,
                height: data.height,
                giftDeliveryMethod: data.giftDeliveryMethod,
                giftType: selectedGift.giftType,
                unit: selectedGift.unit,
                userID: userId,
                visitID: visitId
            };


            await createPhysicalDonation(payload).unwrap();
            toast.success('Đăng ký tặng quà thành công!');
            onClose();
            form.reset();
        } catch (error) {
            toast.error('Đã có lỗi xảy ra. Vui lòng thử lại!');
            console.error('Error submitting gift registration:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg">
                <DialogHeader className="bg-gradient-to-r from-rose-500 to-rose-600 text-white p-6 sticky top-0 z-10">
                    <DialogTitle className="text-2xl font-bold text-center">
                        Đăng ký tặng quà
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="giftTypeIndex"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Loại quà</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(Number(value))}
                                                defaultValue={field.value.toString()}
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
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => handleNumberInput(e, field.onChange)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === '-' || e.key === 'e') {
                                                            e.preventDefault();
                                                        }
                                                    }}
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
                                            <FormLabel>Khối lượng (kg)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => handleNumberInput(e, field.onChange)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === '-' || e.key === 'e') {
                                                            e.preventDefault();
                                                        }
                                                    }}
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
                                            <FormLabel>Chiều dài (cm)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => handleNumberInput(e, field.onChange)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === '-' || e.key === 'e') {
                                                            e.preventDefault();
                                                        }
                                                    }}
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
                                            <FormLabel>Chiều rộng (cm)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => handleNumberInput(e, field.onChange)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === '-' || e.key === 'e') {
                                                            e.preventDefault();
                                                        }
                                                    }}
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
                                            <FormLabel>Chiều cao (cm)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => handleNumberInput(e, field.onChange)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === '-' || e.key === 'e') {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="giftDeliveryMethod"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phương thức giao quà</FormLabel>
                                        <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value.toString()}>
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

                            {/* {deliveryMethod === 2 && ( */}
                            <FormItem>
                                <FormLabel>Địa chỉ mang đến</FormLabel>
                                <FormControl>
                                    <Input
                                        value="Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức"
                                        className="bg-gray-100"
                                    />
                                </FormControl>
                            </FormItem>
                            {/* )} */}



                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" onClick={onClose}>
                                    Hủy
                                </Button>
                                <Button type="submit" className="bg-rose-500 hover:bg-rose-700 text-white">
                                    Đăng ký
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GiftRegistration;