import newPassword from '@/assets/images/new-password.svg';
import logo from '@/assets/images/logo-short.png';
import NewPasswordForm from '@/components/auth/NewPasswordForm';

const NewPassword = () => {
    return (
        <div className="h-screen w-full bg-primary flex items-center justify-center">
            <div className="shadow-lg relative w-full md:w-3/4 min-h-[600px] p-4 md:p-8 bg-background rounded-3xl flex flex-col md:flex-row items-center">
                <div className="flex-1 md:mr-4 flex">
                    <img className="w-3/4 mx-auto md:w-full" src={newPassword} alt="intratech-forgot-password" />
                </div>
                <div className="flex-1 h-full">
                    <img
                        className="size-12 absolute top-4 right-4 md:top-8 md:right-8"
                        src={logo}
                        alt="sponsor-child"
                    />
                    <h1 className="text-4xl font-semibold">Mật khẩu mới</h1>
                    <h2 className="text-muted-foreground mt-4 mb-8">
                        Mật khẩu mới của bạn phải khác với mật khẩu đã sử dụng trước đó.
                    </h2>
                    <NewPasswordForm />
                </div>
            </div>
        </div>
    );
};

export default NewPassword;
