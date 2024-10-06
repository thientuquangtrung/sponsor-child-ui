import logo from '@/assets/images/logo-short.png';
import login from '@/assets/images/img-login.png';
import { Link } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="absolute left-0 top-0 w-3/4 h-full bg-[#dff1f1]"></div>
            <div className="absolute right-0 top-0 w-1/4 h-full bg-[#7edad7]"></div>

            <div className="relative w-full flex flex-col md:flex-row justify-around px-4">
                <img src={login} alt="SponsorChild" className="w-full md:w-1/2 h-auto object-contain mb-6 md:mb-0" />

                <div className="w-full md:w-1/3 px-6 md:px-10 py-6 bg-white shadow-lg rounded-md">
                    <h1 className="text-3xl font-semibold mt-8 mb-12 text-center">Đăng ký tài khoản</h1>
                    <RegisterForm />
                    <p className="my-8 text-muted-foreground text-center">
                        Bạn đã có tài khoản?{' '}
                        <Link className="text-lg text-primary font-bold" to="/auth/login">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
