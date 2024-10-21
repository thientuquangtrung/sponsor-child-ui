import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, UserCheck, FileCheck, UserRoundCheck } from 'lucide-react';
import register1 from '@/assets/images/register-1.png';
import register2 from '@/assets/images/register-2.png';
import OrganizationRegistrationForm from './OrganizationRegistrationForm';
import PersonalRegistrationForm from './PersonalRegistrationForm';

const RegistrationPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState('');
    const [registrationComplete, setRegistrationComplete] = useState(
        localStorage.getItem('registrationComplete') === 'true' || false,
    );
    const [progressStep, setProgressStep] = useState(2);

    useEffect(() => {
        // const isRegistered = localStorage.getItem('registrationComplete') === 'true';
        // setRegistrationComplete(isRegistered);
        // Lấy bước tiến trình từ localStorage nếu có
        // const savedStep = localStorage.getItem('progressStep');
        // if (savedStep) {
        //     setProgressStep(Number(savedStep));
        // }
    }, []);

    const handleOrganizationClick = () => {
        setFormType('organization');
        setShowForm(true);
    };

    const handlePersonalClick = () => {
        setFormType('personal');
        setShowForm(true);
    };

    const handleFormSubmit = () => {
        localStorage.setItem('registrationComplete', 'true');
        setRegistrationComplete(true);
        setProgressStep(2);
        localStorage.setItem('progressStep', '1');
        setShowForm(false);
    };

    const handleNextStep = () => {
        if (progressStep < 4) {
            const nextStep = progressStep + 1;
            setProgressStep(nextStep);
            localStorage.setItem('progressStep', nextStep.toString());
        }
    };

    const calculateProgressPercentage = () => {
        return (progressStep / 4) * 100;
    };

    return (
        <div className="container mx-auto px-4">
            {!showForm && !registrationComplete && (
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
            {registrationComplete && (
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
                            <Progress value={calculateProgressPercentage()} className="h-2 bg-gray-200" />
                            <div className="absolute w-full top-[-10px] flex justify-between items-center text-white font-bold px-10">
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

                        <div className="relative flex justify-between items-center">
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
                        {progressStep < 4 && (
                            <button onClick={handleNextStep} className="bg-teal-500 text-white py-2 px-4 rounded">
                                Tiếp tục
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
