import React from 'react';
import confirmMail from '@/assets/images/confirm-mail.svg';
import logo from '@/assets/images/logo-short.png';
import { Link, useSearchParams } from 'react-router-dom';
import { useConfirmMailQuery } from '@/redux/auth/authApi';
import LoadingScreen from '@/components/common/LoadingScreen';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CircleCheck } from 'lucide-react';

export default function ConfirmMail() {
    const [searchParams, setSearchParams] = useSearchParams();
    const oobCode = searchParams.get('oobCode');

    const { isLoading, isError, isSuccess } = useConfirmMailQuery(oobCode);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div className="h-screen w-full bg-primary flex items-center justify-center">
            <div className="shadow-lg relative w-full md:w-3/4 min-h-[600px] p-4 md:p-8 bg-background rounded-3xl flex flex-col md:flex-row items-center">
                <div className="flex-1 md:mr-4 flex">
                    <img className="w-3/4 mx-auto md:w-full" src={confirmMail} alt="intratech-forgot-password" />
                </div>
                <div className="flex-1 h-full">
                    <img
                        className="size-12 absolute top-4 right-4 md:top-8 md:right-8"
                        src={logo}
                        alt="sponsor-child"
                    />
                    <h1 className="text-4xl font-semibold">Xác nhận email</h1>
                    <h2 className="text-muted-foreground mt-4 mb-8"></h2>
                    {isSuccess && (
                        <Alert className="text-green-600 border-green-600">
                            <CircleCheck className="w-4 h-4 !text-green-600" />
                            <AlertTitle>Thành công</AlertTitle>
                            <AlertDescription>
                                Email đã được xác nhận. Vui lòng{' '}
                                <Link replace className="underline" to={'/auth/login'}>
                                    Đăng nhập
                                </Link>
                                .
                            </AlertDescription>
                        </Alert>
                    )}
                    {isError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                Xác thực email không thành công. Vui lòng{' '}
                                <Link replace className="underline" to={'/auth/register'}>
                                    Đăng kí
                                </Link>
                                .
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
}
