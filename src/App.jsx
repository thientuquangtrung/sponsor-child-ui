import { Toaster } from 'sonner';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';

import { ThemeProvider } from './contexts/ThemeContext';
import Router from './routes';
import { store } from './redux/store';

export default function App() {
    return (
        <ReduxProvider store={store}>
            <ThemeProvider>
                <BrowserRouter>
                    <Router />
                    <Toaster richColors />
                </BrowserRouter>
            </ThemeProvider>
        </ReduxProvider>
    );
}
