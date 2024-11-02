import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import Chat from './Chat';

export function AppLayout() {
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
