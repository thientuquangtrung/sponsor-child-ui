import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AlertCircle, CircleCheck } from 'lucide-react';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useResetPasswordMutation } from '@/redux/auth/authApi';
import ButtonLoading from '@/components/ui/loading-button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
    email: z.string().min(2).max(50),
});

export default function ResetPasswordForm() {
    const [resetPassword, { isLoading, error, data }] = useResetPasswordMutation();

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
        resetPassword(values);
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
                <AlertDescription>Reset password link has been sent to your email.</AlertDescription>
            </Alert>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input className="h-12" placeholder="Email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <ButtonLoading isLoading={isLoading} className="w-full h-12" type="submit">
                    Continue
                </ButtonLoading>
            </form>
        </Form>
    );
}
