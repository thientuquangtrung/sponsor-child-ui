import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLoginMutation } from '@/redux/auth/authApi';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { UpdateAuthentication } from '@/redux/auth/authActionCreators';

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(2).max(50),
});

export default function LoginForm() {
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        login(values)
            .unwrap()
            .then((res) => {
                dispatch(UpdateAuthentication(res));
                toast.success('Logged in successfully!');
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-lg">Email</FormLabel>
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
                            <FormLabel className="text-lg">Mật khẩu</FormLabel>
                            <FormControl>
                                <Input
                                    className="text-lg h-12"
                                    placeholder={'Nhập mật khẩu'}
                                    type={'password'}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    className="w-full h-12 text-white text-2xl bg-gradient-to-r from-primary to-secondary"
                    type="submit"
                >
                    Đăng nhập
                </Button>
            </form>
        </Form>
    );
}
