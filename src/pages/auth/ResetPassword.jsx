import forgotPassword from '@/assets/images/forgot-password.svg';
import logo from '@/assets/images/logo-short.png';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

const ResetPassword = () => {
    return (
        <div className="h-screen w-full bg-primary flex items-center justify-center">
            <div className="shadow-lg relative w-full md:w-3/4 min-h-[600px] p-4 md:p-8 bg-background rounded-3xl flex flex-col md:flex-row items-center">
                <div className="flex-1 md:mr-4 flex">
                    <img className="w-3/4 mx-auto md:w-full" src={forgotPassword} alt="intratech-forgot-password" />
                </div>
                <div className="flex-1 h-full">
                    <img className="size-12 absolute top-4 right-4 md:top-8 md:right-8" src={logo} alt="sponsor-child" />
                    <h1 className="text-4xl font-semibold">
                        Quên <br /> Mật khẩu của bạn?
                    </h1>
                    <h2 className="text-muted-foreground mt-4 mb-8">
                    Nhập địa chỉ email được liên kết với tài khoản của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.
                    </h2>
                    <ResetPasswordForm />
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
