import { Navigate, Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { useSelector } from 'react-redux';
import Chat from './Chat';

export function Applayout() {
    const { user } = useSelector((state) => state.auth);

    if (!user) return <Navigate to="/auth/login" replace />;

    return (
        <>
            <div id="payment-container" style={{ position: 'fixed', zIndex: 99999999 }}></div>
            <Header />
            <div className="flex-grow flex flex-col">
                <div className="container px-4 md:px-8 flex-grow flex flex-col">
                    <Outlet />
                    <Chat />
                </div>
            </div>
            <Footer />
        </>
    );
}
