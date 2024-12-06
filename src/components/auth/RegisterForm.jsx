import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRegisterMutation } from '@/redux/auth/authApi';
import ButtonLoading from '@/components/ui/loading-button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
    fullname: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(2).max(50),
    gender: z.number(),
});

export default function RegisterForm() {
    const [register, { isLoading }] = useRegisterMutation();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullname: '',
            email: '',
            password: '',
            gender: 0,
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        register(values)
            .unwrap()
            .then((res) => {
                // dispatch(UpdateAuthentication(res.data));
                toast.success(
                    'Đăng ký thành công! Email xác minh đã được gửi đến địa chỉ email của bạn.');
            })
            .catch((err) => {
                if (err.status === 400) {
                    let errorMessage = 'Đã xảy ra lỗi khi tạo tài khoản.';

                    if (err.data?.message) {
                        switch (err.data.message) {
                            case "User with this email already exists.":
                                errorMessage = 'Email này đã có người dùng đăng ký!';
                                break;
                            default:
                                errorMessage = err.data.message;
                        }
                    }

                    toast.error(errorMessage);

                    if (errorMessage.includes('chiến dịch cho trẻ em')) {
                        form.setError('childIdentificationCode', {
                            type: 'manual',
                            message: errorMessage
                        });
                    }
                } else {
                    console.error('Failed to create campaign:', error);
                    toast.error('Đã xảy ra lỗi! Vui lòng thử lại.');
                }
            });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    className="text-lg h-12"
                                    placeholder="Họ tên hoặc biệt danh của bạn"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input className="text-lg h-12" placeholder="Nhập địa chỉ email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    endIcon={
                                        showPassword ? (
                                            <Eye
                                                className="cursor-pointer"
                                                onClick={() => setShowPassword(!showPassword)}
                                            />
                                        ) : (
                                            <EyeOff
                                                className="cursor-pointer"
                                                onClick={() => setShowPassword(!showPassword)}
                                            />
                                        )
                                    }
                                    className="text-lg h-12"
                                    placeholder={'Nhập mật khẩu'}
                                    type={showPassword ? 'text' : 'password'}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex space-x-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value={0} />
                                        </FormControl>
                                        <FormLabel className="font-normal">Nam</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value={1} />
                                        </FormControl>
                                        <FormLabel className="font-normal">Nữ</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value={2} />
                                        </FormControl>
                                        <FormLabel className="font-normal">Khác</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <ButtonLoading
                    isLoading={isLoading}
                    className="text-white text-2xl w-full h-12 bg-gradient-to-r from-primary to-secondary"
                    type="submit"
                >
                    Đăng ký
                </ButtonLoading>
            </form>
        </Form>
    );
}
