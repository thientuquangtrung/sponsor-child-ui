import React, { useState } from 'react';
import SendHardContract from '@/components/guarantee/contract/SendHardContract';
import ContractSentConfirmation from '@/components/guarantee/contract/ContractSentConfirmation';
import { Button } from "@/components/ui/button";
import { ArrowBigRight, ArrowLeft, ArrowRight } from 'lucide-react';
import ContractSigningGuide from '@/components/guarantee/contract/ContractSigningGuide';
import ContractViewAndSign from '@/components/guarantee/contract/ContractViewAndSign';
import { useGetGuaranteeProfileQuery } from '@/redux/guarantee/guaranteeApi';
import { useSelector } from 'react-redux';
import LoadingScreen from '@/components/common/LoadingScreen';

const steps = ['Hướng dẫn', 'Xem và Ký hợp đồng', 'Gửi bản cứng hợp đồng', 'Xác nhận'];

const ContractGuarantee = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [signedContract, setSignedContract] = useState(null);
    const [contractSent, setContractSent] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const { data: guaranteeProfile, isLoading, error } = useGetGuaranteeProfileQuery(user?.userID, {
        skip: !user?.userID
    });

    if (isLoading) return <LoadingScreen />;

    if (error) {
        console.error('Error fetching guarantee profile:', error);
        return <div>Error loading profile</div>;
    }

    const nextStep = () => {
        if (currentStep === 1 && (!signedContract || !contractSent)) {
            alert("Vui lòng ký và gửi hợp đồng trước khi tiếp tục.");
            return;
        }
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    const handleContractSign = (signedData) => {
        setSignedContract(signedData);
    };

    const handleContractSent = () => {
        setContractSent(true);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <ContractSigningGuide />;
            case 1:
                return <ContractViewAndSign
                    onSign={handleContractSign}
                    onContractSent={handleContractSent}
                    guaranteeProfile={guaranteeProfile}
                />;
            case 2:
                return <SendHardContract
                    signedContract={signedContract}
                    guaranteeProfile={guaranteeProfile}
                />;
            case 3:
                return <ContractSentConfirmation />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-7xl mx-auto my-4 p-4 md:p-8 bg-[#c3e2da] rounded-lg">
            <div className="w-full mb-4 md:mb-8 overflow-x-auto">
                <ol className="flex items-center w-full p-2 md:p-3 space-x-2 text-xs md:text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4">
                    {steps.map((step, index) => (
                        <li key={index} className={`flex items-center ${currentStep === index ? 'text-green-600 dark:text-green-500' : ''}`}>
                            <span className={`flex items-center justify-center w-5 h-5 mr-2 text-xl border ${currentStep === index ? 'border-green-600 dark:border-green-500' : 'border-gray-500 dark:border-gray-400'} rounded-full shrink-0`}>
                                {index + 1}
                            </span>
                            <span className="hidden sm:inline">{step}</span>
                            {index < steps.length - 1 && (
                                <ArrowBigRight className="w-5 h-5 ml-2 sm:ml-4" />
                            )}
                        </li>
                    ))}
                </ol>
            </div>

            <div className="w-full mb-4 md:mb-8">
                {renderStep()}
            </div>

            <div className="w-full flex justify-between">
                <Button
                    className="bg-gradient-to-b from-teal-400 to-teal-600 text-white px-3 py-1 md:px-6 md:py-2 rounded-lg shadow text-xs md:text-sm"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                >
                    <ArrowLeft className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> Quay lại
                </Button>
                {currentStep < steps.length - 1 ? (
                    <Button
                        className="bg-gradient-to-b from-teal-400 to-teal-600 text-white px-3 py-1 md:px-6 md:py-2 rounded-lg shadow text-xs md:text-sm"
                        onClick={nextStep}
                        disabled={currentStep === 1 && (!signedContract || !contractSent)}
                    >
                        Tiếp theo <ArrowRight className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                ) : null}
            </div>
        </div>
    );
};

export default ContractGuarantee;