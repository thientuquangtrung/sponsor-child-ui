import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import register1 from '@/assets/images/register-1.png';
import register2 from '@/assets/images/register-2.png';
import OrganizationRegistrationForm from './OrganizationRegistrationForm';
import PersonalRegistrationForm from './PersonalRegistrationForm'; 

const RegistrationPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState(''); 

    const handleOrganizationClick = () => {
        setFormType('organization');
        setShowForm(true);
    };

    const handlePersonalClick = () => {
        setFormType('personal');
        setShowForm(true);
    };

    return (
        <div className="container mx-auto px-4">
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
                            <img src={register1} alt="Đăng ký tài khoản tổ chức" className="rounded-lg shadow-xl w-full h-auto" />
                        </div>

                        {/* Personal Account Registration */}
                        <div
                            className="w-full md:w-1/2 relative py-6 flex-shrink-0 hover:cursor-pointer"
                            onClick={handlePersonalClick}
                        >
                            <img src={register2} alt="Đăng ký tài khoản cá nhân" className="rounded-lg shadow-xl w-full h-auto" />
                        </div>
                    </div>
                </div>
            )}

            {showForm && formType === 'organization' && <OrganizationRegistrationForm />}
            {showForm && formType === 'personal' && <PersonalRegistrationForm />}
        </div>
    );
};

export default RegistrationPage;
