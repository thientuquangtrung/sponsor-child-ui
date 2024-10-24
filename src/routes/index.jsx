import { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

// layouts
import { Applayout } from '@/components/layouts/AppLayout';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { GuaranteeLayout } from '@/components/layouts/GuaranteeLayout';

// config
import { DEFAULT_PATH } from '../config/app';
import LoadingScreen from '@/components/common/LoadingScreen';
import CampaignDetail from '@/components/landingpage/CampaignDetail';
import DonateTarget from '@/components/landingpage/DonateTarget';
import PageIntroduction from '@/components/landingpage/PageIntroduction';
import RegistrationPage from '@/components/landingpage/RegistrationPage';
import DonationInformation from '@/components/landingpage/DonationInformation';
import CampaignsNoGuarantee from '@/components/landingpage/CampaignsNoGuarantee';
import ContractSignPage from '@/components/guarantee/contract/ContractSignPage';
import ContractCampaign from '@/components/guarantee/contract/ContractCampaign';

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
                { element: <ConfirmMailPage />, path: 'confirm-mail' },
                { element: <ResetPasswordPage />, path: 'reset-password' },
                { element: <NewPasswordPage />, path: 'new-password' },
            ],
        },
        {
            path: '/guarantee',
            element: <GuaranteeLayout />,
            children: [
                { element: <GuaranteeHome />, index: true },
                { element: <GuaranteeCampaigns />, path: 'campaigns' },
                { element: <DonationHistory />, path: 'donation-history' },
                { element: <CampaignCreate />, path: 'create-campaign' },

            ],
        },
        {
            path: '/',
            element: <Applayout />,
            children: [
                // { element: <Navigate to={DEFAULT_PATH} replace />, index: true },

                { element: <HomePage />, index: true },

                {
                    path: 'campaign-detail/:id',
                    element: <CampaignDetail />,
                },
                {
                    path: 'campaigns-no-guarantee',
                    element: <CampaignsNoGuarantee />
                },
                {
                    path: 'donate-target',
                    element: <DonateTarget />,
                },
                {
                    path: 'donate-target/info-donate/:id',
                    element: <DonationInformation />,
                },
                {
                    path: 'introduction',
                    element: <PageIntroduction />,
                },
                {
                    path: 'register',
                    element: <RegistrationPage />,
                },
                {
                    path: 'about',
                    element: <AboutPage />,
                },

                {
                    path: 'home',
                    element: <HomePage />,
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
                    path: 'contract',
                    element: <ContractSignPage />,
                },
                {
                    path: 'contract-campaign',
                    element: <ContractCampaign />,
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
const ConfirmMailPage = Loadable(lazy(() => import('../pages/auth/ConfirmMail')));
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

//guarantee
const GuaranteeHome = Loadable(lazy(() => import('@/components/guarantee/GuaranteeHome')));
const GuaranteeCampaigns = Loadable(lazy(() => import('@/components/guarantee/campaign/GuaranteeCampaigns')));
const DonationHistory = Loadable(lazy(() => import('@/components/guarantee/DonationHistory')));
const CampaignCreate = Loadable(lazy(() => import('@/components/guarantee/campaign/CampaignCreate')));

