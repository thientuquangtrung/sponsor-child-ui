import UploadTracker from './components/common/UploadTracker';
import { ThemeProvider } from './contexts/ThemeContext';
import Router from './routes';
import { Toaster } from 'sonner';
import { Cloudinary } from "@cloudinary/url-gen";

export default function App() {
    // const cld = new Cloudinary({
    //     cloud: {
    //         cloudName: import.meta.env.VITE_CLOUD_NAME
    //     }
    //     }
    // )
    ;

    return (
        <ThemeProvider>
            <Router />
            <Toaster richColors />
            <UploadTracker />
        </ThemeProvider>
    );
}
