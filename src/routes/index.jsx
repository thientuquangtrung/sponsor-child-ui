import { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

// layouts
import { AppLayout } from '@/components/layouts/AppLayout';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { GuaranteeLayout } from '@/components/layouts/GuaranteeLayout';
import { MemberLayout } from '@/components/layouts/MemberLayout';

// config
import { DEFAULT_PATH } from '../config/app';
import LoadingScreen from '@/components/common/LoadingScreen';
import CampaignDetail from '@/components/landingpage/CampaignDetail';
import DonateTarget from '@/components/landingpage/DonateTarget';
import PageIntroduction from '@/components/landingpage/PageIntroduction';
import RegistrationPage from '@/components/landingpage/RegistrationPage';
import DonationInformation from '@/components/landingpage/DonationInformation';
import CampaignsNoGuarantee from '@/components/landingpage/CampaignsNoGuarantee';
import ContractCampaign from '@/components/guarantee/contract/ContractCampaign';
import CampaignOverview from '@/components/landingpage/CampaignOverview';
import ContractPage from '@/components/guarantee/contract/ContractPage';
import ContractDetail from '@/components/guarantee/contract/ContractDetail';
import ContractGuarantee from '@/components/guarantee/contract/ContractGuarantee';
import CampaignGuaranteeDetail from '@/components/guarantee/campaign/CampaignGuaranteeDetail';

import VisitEvents from '@/components/landingpage/VisitEvents';
import EventDetail from '@/components/landingpage/EventDetail';

import DisbursementRequest from '@/components/guarantee/campaign/DisbursementRequest';
import CreateDisbursementRequest from '@/components/guarantee/campaign/CreateDisbursementRequest';
import CampaignInfo from '@/components/guarantee/campaign/CampaignInfo';

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
                { element: <CampaignGuaranteeDetail />, path: 'campaign/:id' },
                { element: <DonationHistory />, path: 'donation-history' },
                { element: <CampaignInfo />, path: 'create-campaign' },
                { element: <ContractPage />, path: 'contracts' },
                { element: <ContractCampaign />, path: 'contract/contract-campaign/:contractID/:campaignID' },
                { element: <ContractDetail />, path: 'contract/:id' },
                { element: <DisbursementRequest />, path: 'disbursement-requests' },
                { element: <CreateDisbursementRequest />, path: 'create-disbursement-request' },
                { element: <Page404 />, path: '404' },
                { path: '*', element: <Navigate to="404" replace /> },
            ],
        },
        {
            path: '/',
            element: <AppLayout />,
            children: [
                { element: <Navigate to={DEFAULT_PATH} replace />, index: true },
                { path: 'home', element: <HomePage /> },
                {
                    path: 'introduction',
                    element: <PageIntroduction />,
                },
                {
                    path: 'about',
                    element: <AboutPage />,
                },
                {
                    path: 'campaign-detail/:id',
                    element: <CampaignDetail />,
                },
                {
                    path: 'campaigns-no-guarantee',
                    element: <CampaignsNoGuarantee />,
                },
                {
                    path: 'campaigns-no-guarantee-detail/:id',
                    element: <CampaignOverview />,
                },
                {
                    path: 'donate-target',
                    element: <DonateTarget />,
                },
                {
                    path: 'events',
                    element: <VisitEvents />,
                },
                {
                    path: 'event/:id',
                    element: <EventDetail />,
                },
                {
                    path: '',
                    element: <MemberLayout />,
                    children: [
                        {
                            path: 'profile',
                            element: <PageMyProfile />,
                        },
                        {
                            path: 'contract',
                            element: <ContractGuarantee />,
                        },
                        {
                            path: 'donate-target/info-donate/:id',
                            element: <DonationInformation />,
                        },
                        {
                            path: 'register',
                            element: <RegistrationPage />,
                        },
                    ],
                },
                { path: '404', element: <Page404 /> },
                { path: '*', element: <Navigate to="/404" replace /> },
            ],
        },
        { path: '*', element: <Navigate to="/404" replace /> },
    ]);
}

//auth
const LoginPage = Loadable(lazy(() => import('../pages/auth/Login')));
const RegisterPage = Loadable(lazy(() => import('../pages/auth/Register')));
const ConfirmMailPage = Loadable(lazy(() => import('../pages/auth/ConfirmMail')));
const ResetPasswordPage = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const NewPasswordPage = Loadable(lazy(() => import('../pages/auth/NewPassword')));

//login required
const PageMyProfile = Loadable(lazy(() => import('../pages/MyProfile')));

//app
const HomePage = Loadable(lazy(() => import('../pages/HomePage')));
const AboutPage = Loadable(lazy(() => import('../pages/AboutPage')));
const Page404 = Loadable(lazy(() => import('../pages/NoMatch')));

//guarantee
const GuaranteeHome = Loadable(lazy(() => import('@/components/guarantee/GuaranteeHome')));
const GuaranteeCampaigns = Loadable(lazy(() => import('@/components/guarantee/campaign/GuaranteeCampaigns')));
const DonationHistory = Loadable(lazy(() => import('@/components/guarantee/DonationHistory')));
// const CampaignCreate = Loadable(lazy(() => import('@/components/guarantee/campaign/CampaignCreate')));
