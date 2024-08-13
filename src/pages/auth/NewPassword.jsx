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
                    <img className="size-8 absolute top-4 right-4 md:top-8 md:right-8" src={logo} alt="intratech" />
                    <h1 className="text-4xl font-semibold">New Credentials</h1>
                    <h2 className="text-muted-foreground mt-4 mb-8">
                        Your new password must be different from previously used passwords.
                    </h2>
                    <NewPasswordForm />
                </div>
            </div>
        </div>
    );
};

export default NewPassword;
