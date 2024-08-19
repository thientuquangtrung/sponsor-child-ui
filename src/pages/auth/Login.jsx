import logo from '@/assets/images/logo-short.png';
import login3d from '@/assets/images/login-3d-v2.png';
import LoginForm from '@/components/auth/LoginForm';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className="h-full w-full bg-primary flex flex-col md:flex-row items-center relative">
            <div className="flex-[1] p-8 h-full">
                <img className="w-12 h-auto" src={logo} alt="sponsor-child" />
                <h1 className="mt-8 md:mt-16 text-white text-lg">
                    Streamline Your Workflow with Powerful 3D Asset Management and Interactive Visualization
                </h1>
                <img
                    className="hidden md:block w-1/2 max-h-[600px] object-cover absolute bottom-1/2 translate-y-2/3 left-0 pointer-events-none user-select-none"
                    src={login3d}
                    alt="sponsor-child"
                />
            </div>
            <div className="h-full w-full md:flex-[2] bg-background rounded-tl-[32px] rounded-tr-[32px] md:rounded-tr-none md:rounded-bl-[32px] flex flex-col items-center justify-center">
                <div className="md:w-[500px] md:px-0 w-full px-4">
                    <h1 className="text-3xl font-semibold mb-8 md:mb-16">Sign in to your account</h1>
                    <LoginForm />
                    <div className="flex flex-col md:flex-row gap-1 justify-between mt-8 text-muted-foreground">
                        <p>
                            Do not have an account?{' '}
                            <Link className="text-primary" to="/auth/register">
                                Register
                            </Link>
                        </p>
                        <Link to={'/auth/reset-password'} className="underline">
                            Forgot password?
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
