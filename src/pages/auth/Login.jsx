import { Link } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { toast } from 'sonner';

import logo from '@/assets/images/logo-short.png';
import logoGoogle from '@/assets/images/login-google.png';
import login from '@/assets/images/img-login.png';
import LoginForm from '@/components/auth/LoginForm';
import { auth, provider } from '@/lib/firebase';
import { useAuthWithProviderMutation } from '@/redux/auth/authApi';
import { useDispatch } from 'react-redux';
import ButtonLoading from '@/components/ui/loading-button';
import { UpdateAuthentication } from '@/redux/auth/authActionCreators';

const Login = () => {
    const dispatch = useDispatch();
    const [authWithProvider, { isLoading }] = useAuthWithProviderMutation();

    const handleAuthGoogle = () => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                // // This gives you a Google Access Token. You can use it to access the Google API.
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...

                const params = {
                    idToken: await user.getIdToken(),
                };

                // submit params to backend
                authWithProvider(params)
                    .unwrap()
                    .then((res) => {
                        dispatch(UpdateAuthentication(res));
                        toast.success('Logged in successfully!');
                    })
                    .catch((err) => {
                        console.log(err);
                        toast.error(err.error || err.data?.error?.message || 'Try again later!');
                    });
            })
            .catch((error) => {
                // Handle Errors here.
                // const errorCode = error.code;
                const errorMessage = error.message;
                // // The email of the user's account used.
                // const email = error.customData.email;
                // // The AuthCredential type that was used.
                // const credential = GoogleAuthProvider.credentialFromError(error);
                // // ...
                toast.error({ severity: 'error', message: errorMessage });
            });
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="absolute left-0 top-0 w-3/4 h-full bg-[#dff1f1]"></div>
            <div className="absolute right-0 top-0 w-1/4 h-full bg-[#7edad7]"></div>

            <div className="relative w-full flex flex-col md:flex-row justify-around px-4">
                <img src={login} alt="SponsorChild" className="w-full md:w-1/2 h-auto object-contain mb-6 md:mb-0" />
                <div className="w-full md:w-1/3 px-4 md:px-10 py-6 bg-white shadow-lg rounded-md">
                    <h1 className="text-3xl font-semibold mb-8 text-center">Đăng nhập</h1>
                    <LoginForm />
                    <div className="flex flex-col md:flex-row gap-1 justify-between mt-8 text-muted-foreground">
                        <p>
                            Bạn chưa có tài khoản?{' '}
                            <Link className="text-lg text-primary font-bold" to="/auth/register">
                                Đăng ký ngay
                            </Link>
                        </p>
                        <Link to={'/auth/reset-password'} className="underline text-secondary text-lg font-bold">
                            Quên mật khẩu?
                        </Link>
                    </div>
                    <div className="mt-8 flex items-center justify-center max-w-xs mx-auto">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-muted-foreground">hoặc tiếp tục với</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <ButtonLoading
                        isLoading={isLoading}
                        onClick={handleAuthGoogle}
                        className="mt-8 flex items-center justify-center mx-auto bg-white text-black py-2 px-4 rounded shadow hover:bg-gray-200"
                    >
                        <img className="w-6 h-auto" src={logoGoogle} alt="sponsor-child" />
                        <span className="ml-4 text-lg">Đăng nhập bằng Google</span>
                    </ButtonLoading>
                </div>
            </div>
        </div>
    );
};

export default Login;
