import React, { useEffect, useMemo, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, UserCheck, FileCheck, UserRoundCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import register1 from '@/assets/images/register-1.png';
import register2 from '@/assets/images/register-2.png';
import OrganizationRegistrationForm from './OrganizationRegistrationForm';
import PersonalRegistrationForm from './PersonalRegistrationForm';
import { useCheckGuaranteeStatusQuery } from '@/redux/guarantee/guaranteeApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '@/components/common/LoadingScreen';

const RegistrationPage = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState('');
    const { data: guaranteeStatus, isLoading, refetch } = useCheckGuaranteeStatusQuery(user?.userID, {
        skip: !user?.userID,
    });

    const progressStep = useMemo(() => {
        if (guaranteeStatus) {
            switch (guaranteeStatus.status) {
                case 0: // Pending
                    return 2;
                case 1: // InContractSigning
                    return 3;
                case 2: // Approve
                    return 4;
                case 3: // Rejected
                    return 1;
            }
        }
        return 0;
    }, [guaranteeStatus]);

    const handleOrganizationClick = () => {
        setFormType('organization');
        setShowForm(true);
    };

    const handlePersonalClick = () => {
        setFormType('personal');
        setShowForm(true);
    };

    const handleFormSubmit = () => {
        setShowForm(false);
        refetch();
    };

    const calculateProgressPercentage = (status) => {
        switch (status) {
            case 0: // Pending
                return 40;
            case 1: // InContractSigning
                return 60;
            case 2: // Approve
                return 100;
            case 3: // Rejected
                return 20;
            default:
                return 0;
        }
    };


    if (isLoading) {
        return <div><LoadingScreen /></div>;
    }

    if (!guaranteeStatus || guaranteeStatus.status === 3) {
        return (
            <div className="container mx-auto px-4">
                {guaranteeStatus?.status === 3 && (
                    <Alert className="mt-4 p-4 bg-red-50 border mb-4 border-red-200 rounded-md">
                        <AlertTitle className="text-red-700 font-semibold mb-2">Yêu cầu đăng ký bị từ chối</AlertTitle>
                        <AlertDescription className="text-red-600">
                            Lý do:  {guaranteeStatus.rejectionReason || "Yêu cầu đăng ký của bạn không được chấp nhận"}
                        </AlertDescription>
                    </Alert>
                )}

                {!showForm && (
                    <div className="flex flex-col bg-[#c3e2da] py-8 rounded-lg shadow-md">
                        <h1 className="text-2xl font-semibold mb-6 text-center">
                            Đăng ký mở Tài khoản trở thành Người Bảo Lãnh
                        </h1>
                        <div className="flex flex-col md:flex-row justify-center space-x-0 md:space-x-4 px-6">
                            {/* Organization Account Registration */}
                            <div
                                className="w-full md:w-1/2 relative py-6 flex-shrink-0 hover:cursor-pointer"
                                onClick={handleOrganizationClick}
                            >
                                <img
                                    src={register1}
                                    alt="Đăng ký tài khoản tổ chức"
                                    className="rounded-lg shadow-xl w-full h-auto"
                                />
                                <Alert className="mt-2 bg-green-50 border border-green-200 rounded-md">
                                    <AlertDescription className="text-green-600">
                                        Được bảo lãnh đồng thời nhiều chiến dịch, không lo bị gián đoạn hay hạn chế về số lượng chiến dịch đang diễn ra.
                                    </AlertDescription>
                                </Alert>
                            </div>

                            {/* Personal Account Registration */}
                            <div
                                className="w-full md:w-1/2 relative py-6 flex-shrink-0 hover:cursor-pointer"
                                onClick={handlePersonalClick}
                            >
                                <img
                                    src={register2}
                                    alt="Đăng ký tài khoản cá nhân"
                                    className="rounded-lg shadow-xl w-full h-auto"
                                />
                                <Alert className="mt-2 bg-green-50 border border-green-200 rounded-md">
                                    <AlertDescription className="text-green-600">
                                        Được bảo lãnh tối đa 2 chiến dịch. Chỉ được tạo chiến dịch mới khi chiến dịch hiện tại đã hoàn thành hoặc bị từ chối.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </div>
                    </div>
                )}

                {showForm && formType === 'organization' && <OrganizationRegistrationForm onSubmit={handleFormSubmit} />}
                {showForm && formType === 'personal' && <PersonalRegistrationForm onSubmit={handleFormSubmit} />}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <div className="bg-gradient-to-t from-teal-100 to-zinc-50 p-8 rounded-lg text-center shadow-md">
                <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                    Cảm ơn bạn đã đăng ký trở thành Nhà Bảo Lãnh của Sponsor Child
                </h2>
                <p className="text-lg">
                    Chúng tôi đã nhận được đăng ký của bạn. Vui lòng chờ admin duyệt, và chúng tôi sẽ gửi thông báo
                    đến bạn.
                </p>

                <div className="mt-16 space-y-4 relative">
                    <div className="relative mb-8">
                        <Progress
                            value={calculateProgressPercentage(guaranteeStatus.status)}
                            className="h-2 bg-gray-200"
                        />
                        <div className="absolute w-full top-[-10px] flex justify-evenly items-center text-white font-bold">
                            <div
                                className={`w-8 h-8 flex items-center justify-center rounded-full ${progressStep >= 1 ? 'bg-teal-500' : 'bg-gray-400'
                                    }`}
                            >
                                1
                            </div>
                            <div
                                className={`w-8 h-8 flex items-center justify-center rounded-full ${progressStep >= 2 ? 'bg-teal-500' : 'bg-gray-400'
                                    }`}
                            >
                                2
                            </div>
                            <div
                                className={`w-8 h-8 flex items-center justify-center rounded-full ${progressStep >= 3 ? 'bg-teal-500' : 'bg-gray-400'
                                    }`}
                            >
                                3
                            </div>
                            <div
                                className={`w-8 h-8 flex items-center justify-center rounded-full ${progressStep >= 4 ? 'bg-teal-500' : 'bg-gray-400'
                                    }`}
                            >
                                4
                            </div>
                        </div>
                    </div>

                    <div className="relative flex justify-evenly items-center">
                        <div className="flex flex-col items-center">
                            <CheckCircle
                                className={`w-8 h-8 ${progressStep >= 1 ? 'text-teal-500' : 'text-gray-300'}`}
                            />
                            <p
                                className={`mt-2 text-sm font-semibold ${progressStep >= 1 ? 'text-teal-500' : 'text-gray-400'
                                    }`}
                            >
                                Đã gửi đơn đăng ký
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <UserCheck
                                className={`w-8 h-8 ${progressStep >= 2 ? 'text-teal-500' : 'text-gray-300'}`}
                            />
                            <p
                                className={`mt-2 text-sm font-semibold ${progressStep >= 2 ? 'text-teal-500' : 'text-gray-400'
                                    }`}
                            >
                                Chờ Admin duyệt
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <FileCheck
                                className={`w-8 h-8 ${progressStep >= 3 ? 'text-teal-500' : 'text-gray-400'}`}
                            />
                            <p
                                className={`mt-2 text-sm font-semibold ${progressStep >= 3 ? 'text-teal-500' : 'text-gray-400'
                                    }`}
                            >
                                Ký hợp đồng
                            </p>
                        </div>

                        <div className="flex flex-col items-center">
                            <UserRoundCheck
                                className={`w-8 h-8 ${progressStep >= 4 ? 'text-teal-500' : 'text-gray-300'}`}
                            />
                            <p
                                className={`mt-2 text-sm font-semibold ${progressStep >= 4 ? 'text-teal-500' : 'text-gray-400'
                                    }`}
                            >
                                Hoàn tất đăng ký
                            </p>
                        </div>
                    </div>

                    {progressStep === 3 && (
                        <button
                            onClick={() => {
                                navigate('/contract');
                            }}
                            className="bg-teal-500 text-white py-2 px-4 rounded"
                        >
                            Kí hợp đồng
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;