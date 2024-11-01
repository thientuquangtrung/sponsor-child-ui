import React, { useEffect, useMemo, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, UserCheck, FileCheck, UserRoundCheck } from 'lucide-react';
import register1 from '@/assets/images/register-1.png';
import register2 from '@/assets/images/register-2.png';
import OrganizationRegistrationForm from './OrganizationRegistrationForm';
import PersonalRegistrationForm from './PersonalRegistrationForm';
import { useCheckGuaranteeStatusQuery } from '@/redux/guarantee/guaranteeApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState('');
    const { data: guaranteeStatus, isLoading } = useCheckGuaranteeStatusQuery(user?.userID, { skip: !user?.userID });

    useEffect(() => {
        if (!user) navigate('/auth/login', { replace: true });
    }, [user]);

    const progressStep = useMemo(() => {
        if (guaranteeStatus) {
            switch (guaranteeStatus.status) {
                case 0: // Pending
                    return 2;
                case 1: // InContractSigning
                    return 3;
                case 2: // Approve
                    return 4;
            }
        }
        return 0;
    });

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
    };

    const calculateProgressPercentage = (status) => {
        switch (status) {
            case 0: // Pending
                return 40;
            case 1: // InContractSigning
                return 60;
            case 2: // Approve
                return 100;
        }
    };

    if (isLoading) {
        return <p className="text-center text-2xl font-semibold">Loading...</p>;
    }

    return (
        <div className="container mx-auto px-4">
            {!showForm && !guaranteeStatus && (
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
                        </div>
                    </div>
                </div>
            )}

            {/* Hiển thị thông báo sau khi đăng ký */}
            {guaranteeStatus && (
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
                                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                        progressStep >= 1 ? 'bg-teal-500' : 'bg-gray-400'
                                    }`}
                                >
                                    1
                                </div>
                                <div
                                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                        progressStep >= 2 ? 'bg-teal-500' : 'bg-gray-400'
                                    }`}
                                >
                                    2
                                </div>
                                <div
                                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                        progressStep >= 3 ? 'bg-teal-500' : 'bg-gray-400'
                                    }`}
                                >
                                    3
                                </div>
                                <div
                                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                        progressStep >= 4 ? 'bg-teal-500' : 'bg-gray-400'
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
                                    className={`mt-2 text-sm font-semibold ${
                                        progressStep >= 1 ? 'text-teal-500' : 'text-gray-400'
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
                                    className={`mt-2 text-sm font-semibold ${
                                        progressStep >= 2 ? 'text-teal-500' : 'text-gray-400'
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
                                    className={`mt-2 text-sm font-semibold ${
                                        progressStep >= 3 ? 'text-teal-500' : 'text-gray-400'
                                    }`}
                                >
                                    Ký hợp đồng
                                </p>
                            </div>

                            <div className="flex flex-col items-center">
                                <UserRoundCheck
                                    className={`w-8 h-8 ${progressStep >= 4 ? 'text-teal-500' : 'text-gray-400'}`}
                                />
                                <p
                                    className={`mt-2 text-sm font-semibold ${
                                        progressStep >= 4 ? 'text-teal-500' : 'text-gray-400'
                                    }`}
                                >
                                    Hoàn tất đăng ký
                                </p>
                            </div>
                        </div>

                        {/* Để test qua bước tiếp theo */}
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
            )}

            {/* Hiển thị form đăng ký nếu người dùng chưa hoàn thành */}
            {showForm && formType === 'organization' && <OrganizationRegistrationForm onSubmit={handleFormSubmit} />}
            {showForm && formType === 'personal' && <PersonalRegistrationForm onSubmit={handleFormSubmit} />}
        </div>
    );
};

export default RegistrationPage;
