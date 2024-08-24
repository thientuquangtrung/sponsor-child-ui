import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRegisterMutation } from '@/redux/auth/authApi';
import ButtonLoading from '../ui/loading-button';
import { useDispatch } from 'react-redux';
import { UpdateAuthentication } from '@/redux/auth/authActionCreators';

const formSchema = z.object({
    username: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(2).max(50),
});

export default function RegisterForm() {
    const [register, { isLoading }] = useRegisterMutation();
    const dispatch = useDispatch();

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        register(values)
            .unwrap()
            .then((res) => {
                console.log(res);
                dispatch(UpdateAuthentication(res.data));
                toast.success('Registered successfully!');
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.error || err.data?.error?.message || 'Try again later!');
            });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input className="text-lg h-12" placeholder="Họ tên hoặc biệt danh của bạn" {...field} />
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
                                <Input className="text-lg h-12" placeholder={'Nhập mật khẩu'} type={'password'} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <ButtonLoading isLoading={isLoading} className="text-white text-2xl w-full h-12 bg-gradient-to-r from-primary to-secondary" type="submit">
                    Đăng ký
                </ButtonLoading>
            </form>
        </Form>
    );
}
