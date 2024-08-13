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
    const [updatePassword, { isLoading, error, data }] = useNewPasswordMutation();
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
        updatePassword({ ...values, token: searchParams.get('token') });
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Something went wrong, please try again.</AlertDescription>
            </Alert>
        );
    }

    if (data) {
        return (
            <Alert className="text-green-600 border-green-600">
                <CircleCheck className="w-4 h-4 !text-green-600" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                    Password has been changed successfully. You can now{' '}
                    <Link replace className="underline" to={'/auth/login'}>
                        log in
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
                                <Input type="password" className="h-12" placeholder="password" {...field} />
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
                                <Input type="password" className="h-12" placeholder="confirm password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <ButtonLoading isLoading={isLoading} className="w-full h-12" type="submit">
                    Change Password
                </ButtonLoading>
            </form>
        </Form>
    );
}
