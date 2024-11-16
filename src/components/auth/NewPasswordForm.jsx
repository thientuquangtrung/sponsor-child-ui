import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AlertCircle, CircleCheck } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useNewPasswordMutation } from '@/redux/auth/authApi';
import ButtonLoading from '@/components/ui/loading-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
    password: z.string().min(2).max(50),
    confirmPassword: z.string().min(2).max(50),
});

export default function NewPasswordForm() {
    const [updatePassword, { isLoading, isSuccess, isError }] = useNewPasswordMutation();
    const [searchParams, setSearchParams] = useSearchParams();

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
        updatePassword({
            newPassword: values.password,
            token: searchParams.get('token'),
            email: searchParams.get('email'),
        });
    }

    if (isError) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Something went wrong, please try again.</AlertDescription>
            </Alert>
        );
    }

    if (isSuccess) {
        return (
            <Alert className="text-green-600 border-green-600">
                <CircleCheck className="w-4 h-4 !text-green-600" />
                <AlertTitle>Thành công</AlertTitle>
                <AlertDescription>
                    Mật khẩu đã được thay đổi thành công. Bây giờ bạn có thể{' '}
                    <Link replace className="underline" to={'/auth/login'}>
                        Đăng nhập
                    </Link>
                    .
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="password" className="text-lg h-12" placeholder="Mật khẩu" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    type="password"
                                    className="text-lg h-12"
                                    placeholder="Nhập lại mật khẩu"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <ButtonLoading
                    isLoading={isLoading}
                    className="text-white w-full h-12 text-2xl bg-gradient-to-r from-primary to-secondary"
                    type="submit"
                >
                    Thay đổi mật khẩu
                </ButtonLoading>
            </form>
        </Form>
    );
}
