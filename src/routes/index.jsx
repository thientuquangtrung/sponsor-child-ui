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
                { element: <ListDisbursementCampaign />, path: 'disbursement-campaigns' },
                { element: <DisbursementRequestDetail />, path: 'disbursement-request-detail/:id' },
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
                    path: 'general-fund',
                    element: <GeneralFund />,
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
const CampaignInfo = Loadable(lazy(() => import('@/components/guarantee/campaign/CampaignInfo')));
const ContractCampaign = Loadable(lazy(() => import('@/components/guarantee/contract/ContractCampaign')));
const CampaignGuaranteeDetail = Loadable(lazy(() => import('@/components/guarantee/campaign/CampaignGuaranteeDetail')));
const EventDetail = Loadable(lazy(() => import('@/components/landingpage/EventDetail')));
const VisitEvents = Loadable(lazy(() => import('@/components/landingpage/VisitEvents')));
const CampaignDetail = Loadable(lazy(() => import('@/components/landingpage/CampaignDetail')));
const DonateTarget = Loadable(lazy(() => import('@/components/landingpage/DonateTarget')));
const PageIntroduction = Loadable(lazy(() => import('@/components/landingpage/PageIntroduction')));
const RegistrationPage = Loadable(lazy(() => import('@/components/landingpage/RegistrationPage')));
const DonationInformation = Loadable(lazy(() => import('@/components/landingpage/DonationInformation')));
const CampaignsNoGuarantee = Loadable(lazy(() => import('@/components/landingpage/CampaignsNoGuarantee')));
const CampaignOverview = Loadable(lazy(() => import('@/components/landingpage/CampaignOverview')));
const ContractPage = Loadable(lazy(() => import('@/components/guarantee/contract/ContractPage')));
const ContractDetail = Loadable(lazy(() => import('@/components/guarantee/contract/ContractDetail')));
const ContractGuarantee = Loadable(lazy(() => import('@/components/guarantee/contract/ContractGuarantee')));
const DisbursementRequest = Loadable(lazy(() => import('@/components/guarantee/disbursement/DisbursementRequest')));
const CreateDisbursementRequest = Loadable(lazy(() => import('@/components/guarantee/disbursement/CreateDisbursementRequest')));
const DisbursementRequestDetail = Loadable(lazy(() => import('@/components/guarantee/disbursement/DisbursementRequestDetail')));
const ListDisbursementCampaign = Loadable(lazy(() => import('@/components/guarantee/disbursement/ListDisbursementCampaign')));
const GeneralFund = Loadable(lazy(() => import('@/components/fund/GeneralFund')));