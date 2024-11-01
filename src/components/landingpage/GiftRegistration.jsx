import React from 'react';
import { Button } from '@/components/ui/button';
import { Gift, Package, Truck } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Định nghĩa schema cho form
const giftSchema = z.object({
    registrationDate: z.string().min(1, 'Vui lòng chọn ngày đăng ký'),
    giftType: z.string().min(1, 'Vui lòng chọn loại quà'),
    giftWeight: z.string()
        .min(1, 'Vui lòng nhập khối lượng quà')
        .refine(val => parseFloat(val) > 0, 'Khối lượng phải lớn hơn 0'),
    length: z.string()
        .min(1, 'VUi lòng nhập chiều dài quà')
        .refine(val => parseFloat(val) > 0, 'Chiều dài phải lớn hơn 0'),
    width: z.string()
        .min(1, 'Vui lòng nhập chiều rộng quà')
        .refine(val => parseFloat(val) > 0, 'Chiều rộng phải lớn hơn 0'),
    height: z.string()
        .min(1, 'Vui lòng nhập chiều cao quà')
        .refine(val => parseFloat(val) > 0, 'Chiều cao phải lớn hơn 0'),
    quantity: z.number().min(1, 'Vui lòng nhập số lượng quà').int('Số lượng phải là số nguyên'),
    deliveryMethod: z.enum(['direct', 'shipping']),
    paymentStatus: z.enum(['pending', 'completed']).default('pending'),
    luggageCapacityUsed: z.number().default(0),
});

// Giá trị khởi tạo cho form
const initialGiftForm = {
    registrationDate: new Date().toISOString().split('T')[0],
    giftType: '',
    giftWeight: '',
    length: '',
    width: '',
    height: '',
    quantity: 1,
    deliveryMethod: 'direct',
    paymentStatus: 'pending',
    luggageCapacityUsed: 0,
};

const GiftRegistration = ({ isOpen, onClose, onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(giftSchema),
        defaultValues: initialGiftForm,
    });

    const onSubmitForm = (data) => {
        const volumeUsed = (
            parseFloat(data.length) *
            parseFloat(data.width) *
            parseFloat(data.height)
        ) / 1000000;

        const formData = {
            ...data,
            luggageCapacityUsed: volumeUsed,
        };

        onSubmit(formData);
        reset(initialGiftForm);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-teal-600 flex items-center gap-2">
                        <Gift className="w-6 h-6" />
                        Đăng ký tặng quà
                    </DialogTitle>
                    <DialogDescription>
                        Vui lòng điền đầy đủ thông tin về món quà bạn muốn tặng
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">

                        <div className="space-y-2">
                            <Label htmlFor="giftType">Loại quà</Label>
                            <Select
                                onValueChange={(value) => setValue('giftType', value)}
                                value={watch('giftType')}
                            >
                                <SelectTrigger className={`border border-gray-300 ${errors.giftType ? 'border-2 border-red-600' : ''}`}>
                                    <SelectValue placeholder="Chọn loại quà" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="toys">Đồ chơi</SelectItem>
                                    <SelectItem value="books">Sách vở</SelectItem>
                                    <SelectItem value="clothes">Quần áo</SelectItem>
                                    <SelectItem value="food">Thực phẩm</SelectItem>
                                    <SelectItem value="other">Khác</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.giftType && (
                                <p className="text-sm text-red-500">{errors.giftType.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { id: 'length', label: 'Chiều dài (cm)' },
                            { id: 'width', label: 'Chiều rộng (cm)' },
                            { id: 'height', label: 'Chiều cao (cm)' }
                        ].map(({ id, label }) => (
                            <div key={id} className="space-y-2">
                                <Label htmlFor={id}>{label}</Label>
                                <Input
                                    id={id}
                                    type="number"
                                    {...register(id)}
                                    min="0"
                                    step="0.1"
                                    className={`border border-gray-300 ${errors[id] ? 'border-2 border-red-600' : ''}`}
                                />
                                {errors[id] && (
                                    <p className="text-sm text-red-500">{errors[id].message}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="giftWeight">Khối lượng (kg)</Label>
                            <Input
                                id="giftWeight"
                                type="number"
                                {...register('giftWeight')}
                                min="0"
                                step="0.1"
                                className={`border border-gray-300 ${errors.giftWeight ? 'border-2 border-red-600' : ''}`}
                            />
                            {errors.giftWeight && (
                                <p className="text-sm text-red-500">{errors.giftWeight.message}</p>
                            )}
                        </div>

                        <div className="flex-1 space-y-2">
                            <Label htmlFor="quantity">Số lượng quà</Label>
                            <Input
                                id="quantity"
                                type="number"
                                {...register('quantity')}
                                min="1"
                                className={`border border-gray-300 ${errors.quantity ? 'border-2 border-red-600' : ''}`}
                            />
                            {errors.quantity && (
                                <p className="text-sm text-red-500">{errors.quantity.message}</p>
                            )}
                        </div>
                    </div>


                    <div className="space-y-3">
                        <Label>Phương thức gửi quà</Label>
                        <RadioGroup
                            value={watch('deliveryMethod')}
                            onValueChange={(value) => setValue('deliveryMethod', value)}
                            className="flex flex-col space-y-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="direct" id="direct" />
                                <Label htmlFor="direct" className="flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Mang trực tiếp đến sự kiện
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="shipping" id="shipping" />
                                <Label htmlFor="shipping" className="flex items-center gap-2">
                                    <Truck className="w-4 h-4" />
                                    Gửi đến địa điểm tập kết
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset(initialGiftForm);
                                onClose();
                            }}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                            Xác nhận đăng ký
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default GiftRegistration;