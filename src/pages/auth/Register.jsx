import logo from '@/assets/images/logo-short.png';
import login from '@/assets/images/img-login.png';
import { Link } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center">
            <div
                className="absolute left-0 top-0 w-3/4 h-full"
                style={{
                    backgroundColor: '#dff1f1',
                }}
            ></div>

            <div
                className="absolute right-0 top-0 w-1/4 h-full"
                style={{
                    backgroundColor: '#7edad7',
                }}
            ></div>

            <div className="relative w-full flex justify-around px-4">
                <img src={login} alt="SponsorChild" className="w-1/2 h-auto object-contain" />

                <div className="w-1/3 px-10 py-6 bg-white shadow-lg rounded-md">
                    <h1 className="text-3xl font-semibold mt-8 mb-12 text-center">Đăng ký tài khoản</h1>
                    <RegisterForm />
                    <p className="my-8 text-muted-foreground">
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
