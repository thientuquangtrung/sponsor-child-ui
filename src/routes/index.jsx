import { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

// layouts
import { Applayout } from '@/components/layouts/AppLayout';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { SponsorLayout } from '@/components/layouts/SponsorLayout';



// config
import { DEFAULT_PATH } from '../config/app';
import LoadingScreen from '@/components/common/LoadingScreen';

const Loadable = (Component) => {
    const LoadableComponent = (props) => {
        return (
            <Suspense fallback={<LoadingScreen />}>
                <Component {...props} />
            </Suspense>
        );
    };

    LoadableComponent.displayName = `Loadable(${Component.displayName || Component.name})`;

    return LoadableComponent;
};

// "/app"

export default function Router() {
    return useRoutes([
        {
            path: '/auth',
            element: <AuthLayout />,
            children: [
                { element: <LoginPage />, path: 'login' },
                { element: <RegisterPage />, path: 'register' },
                { element: <ResetPasswordPage />, path: 'reset-password' },
                { element: <NewPasswordPage />, path: 'new-password' },
            ],
        },
        {
            path: '/sponsor',
            element: <SponsorLayout />,
            children: [
                { element: <SponsorHome />, index: true },
                { element: <SponsorCampaigns />, path: 'campaigns' },
                { element: <DonationHistory />, path: 'donation-history' },
                { element: <AddCampaign />, path: 'campaigns/add' },



            ],
        },
        {
            path: '/',
            element: <Applayout />,
            children: [
                // { element: <Navigate to={DEFAULT_PATH} replace />, index: true },

                { element: <HomePage />, index: true },

                {
                    path: 'about',
                    element: <AboutPage />,
                },

                {
                    path: 'assets',
                    element: <PageMyAssets />,
                },
                {
                    path: 'assets/add',
                    element: <PageAddAsset />,
                },
                {
                    path: 'assetshub',
                    element: <PageAssetsHub />,
                },
                {
                    path: 'profile',
                    element: <PageMyProfile />,
                },
                {
                    path: 'empty',
                    element: <PageEmpty />,
                },
                { path: '404', element: <Page404 /> },
                { path: '*', element: <Navigate to="/404" replace /> },
            ],
        },
        { path: '*', element: <Navigate to="/404" replace /> },
    ]);
}

const LoginPage = Loadable(lazy(() => import('../pages/auth/Login')));
const RegisterPage = Loadable(lazy(() => import('../pages/auth/Register')));
const ResetPasswordPage = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const NewPasswordPage = Loadable(lazy(() => import('../pages/auth/NewPassword')));

const PageMyProfile = Loadable(lazy(() => import('../pages/asset-pages/MyProfile')));
const PageMyAssets = Loadable(lazy(() => import('../pages/asset-pages/MyAssets')));
const PageAddAsset = Loadable(lazy(() => import('../pages/asset-pages/AddAsset')));
const PageAssetsHub = Loadable(lazy(() => import('../pages/asset-pages/AssetsHub')));

const PageEmpty = Loadable(lazy(() => import('../pages/Empty')));
const Page404 = Loadable(lazy(() => import('../pages/NoMatch')));

const HomePage = Loadable(lazy(() => import('../pages/HomePage')));
const AboutPage = Loadable(lazy(() => import('../pages/AboutPage')));

//sponsor 
const SponsorHome = Loadable(lazy(() => import('@/components/sponsor/SponsorHome')));
const SponsorCampaigns = Loadable(lazy(() => import('@/components/sponsor/SponsorCampaigns')));
const DonationHistory = Loadable(lazy(() => import('@/components/sponsor/DonationHistory')));
const AddCampaign = Loadable(lazy(() => import('@/components/sponsor/AddCampaign')));

