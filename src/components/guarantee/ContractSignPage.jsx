import React, { useState } from 'react';
import ContractView from '@/components/guarantee/ContractSigningGuide';
import ContractSign from '@/components/guarantee/ContractViewAndSign';
import SendContract from '@/components/guarantee/SendContract';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from 'lucide-react';

const steps = ['Hướng dẫn', 'Xem lại và Ký hợp đồng', 'Gửi hợp đồng'];

const ContractSignPage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [signedContract, setSignedContract] = useState(null);

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    const handleContractDownload = (pdf) => {
        setContractPdf(pdf);
        nextStep();
    };

    const handleContractSign = (signedData) => {
        setSignedContract(signedData);
        nextStep();
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <ContractView onDownload={handleContractDownload} />;
            case 1:
                return <ContractSign onSign={handleContractSign} />;
            case 2:
                return <SendContract signedContract={signedContract} />;
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
                            <span className={`flex items-center justify-center w-5 h-5 mr-2 text-xs border ${currentStep === index ? 'border-green-600 dark:border-green-500' : 'border-gray-500 dark:border-gray-400'} rounded-full shrink-0`}>
                                {index + 1}
                            </span>
                            <span className="hidden sm:inline">{step}</span>
                            {index < steps.length - 1 && (
                                <svg className="w-3 h-3 ml-2 sm:ml-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 9 4-4-4-4M1 9l4-4-4-4" />
                                </svg>
                            )}
                        </li>
                    ))}
                </ol>
            </div>

            <div className="w-full mb-4 md:mb-8">
                {renderStep()}
            </div>

            <div className="w-full flex justify-between">
                <Button className="bg-gradient-to-b from-teal-400 to-teal-600 text-white px-3 py-1 md:px-6 md:py-2 rounded-lg shadow text-xs md:text-sm"
                    onClick={prevStep} disabled={currentStep === 0} >
                    <ArrowLeft className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" /> Quay lại
                </Button>
                <Button className="bg-gradient-to-b from-teal-400 to-teal-600 text-white px-3 py-1 md:px-6 md:py-2 rounded-lg shadow text-xs md:text-sm"
                    onClick={nextStep} disabled={currentStep === steps.length - 1}>
                    Tiếp theo <ArrowRight className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4" />
                </Button>
            </div>
        </div>
    );
};

export default ContractSignPage;