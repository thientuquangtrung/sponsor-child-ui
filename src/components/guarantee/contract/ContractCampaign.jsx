import React, { useState, useEffect } from 'react';
import ContractCampaignSign from '@/components/guarantee/contract/ContractCampaignSign';
import SendHardContract from '@/components/guarantee/contract/SendHardContract';
import ContractSentConfirmation from '@/components/guarantee/contract/ContractSentConfirmation';
import { Button } from "@/components/ui/button";
import { ArrowBigRight, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useFetchAllCampaignsQuery } from '@/redux/campaign/campaignApi';

const steps = ['Chọn chiến dịch', 'Xem và Ký hợp đồng', 'Gửi bản cứng hợp đồng', 'Xác nhận'];

const ContractCampaign = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [signedContract, setSignedContract] = useState(null);
    const [contractSent, setContractSent] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [campaignData, setCampaignData] = useState(null);

    const { data: campaigns, isLoading, error } = useFetchAllCampaignsQuery();

    useEffect(() => {
        if (selectedCampaign && campaigns) {
            const selected = campaigns.find(
                campaign => campaign.campaignID === selectedCampaign
            );
            setCampaignData(selected);
        }
    }, [selectedCampaign, campaigns]);

    const resetStepData = (step) => {
        if (step <= 0) {
            setSelectedCampaign(null);
            setCampaignData(null);
            setSignedContract(null);
            setContractSent(false);
        } else if (step <= 1) {
            setSignedContract(null);
            setContractSent(false);
        }
    };

    const nextStep = () => {
        if (currentStep === 0 && !selectedCampaign) {
            alert("Vui lòng chọn một chiến dịch trước khi tiếp tục.");
            return;
        }
        if (currentStep === 1 && (!signedContract || !contractSent)) {
            alert("Vui lòng ký và gửi hợp đồng trước khi tiếp tục.");
            return;
        }
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const prevStep = () => {
        const newStep = Math.max(currentStep - 1, 0);
        setCurrentStep(newStep);
        resetStepData(newStep);
    };

    const handleContractSign = (signedData) => {
        setSignedContract(signedData);
    };

    const handleContractSent = () => {
        setContractSent(true);
    };

    const handleCampaignSelect = (campaignId) => {
        setSelectedCampaign(campaignId);
    };

    const CampaignSelection = () => {
        if (isLoading) return <div className="text-center">Đang tải danh sách chiến dịch...</div>;
        if (error) return <div className="text-red-500">Có lỗi xảy ra khi tải danh sách chiến dịch</div>;

        return (
            <Card className="w-full">
                <CardHeader>
                    <h2 className="text-2xl text-center font-bold">Chọn chiến dịch tham gia bảo lãnh</h2>
                </CardHeader>
                <CardContent>
                    <div className="h-[600px] overflow-y-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {campaigns?.map((campaign) => (
                                <div
                                    key={campaign.campaignID}
                                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedCampaign === campaign.campaignID
                                        ? 'border-teal-500 shadow-lg'
                                        : 'border-transparent hover:border-teal-300'
                                        }`}
                                    onClick={() => handleCampaignSelect(campaign.campaignID)}
                                >
                                    <div className="aspect-video relative">
                                        <img
                                            src={campaign.thumbnailUrl}
                                            alt={campaign.title}
                                            className="w-full h-full object-cover"
                                        />
                                        {selectedCampaign === campaign.campaignID && (
                                            <div className="absolute top-2 right-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-gray-900 line-clamp-2">
                                            {campaign.title}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <CampaignSelection />;
            case 1:
                return (
                    <ContractCampaignSign
                        onSign={handleContractSign}
                        onContractSent={handleContractSent}
                        campaignId={selectedCampaign}
                        campaignData={campaignData}
                    />
                );
            case 2:
                return (
                    <SendHardContract
                        signedContract={signedContract}
                        campaignData={campaignData}
                    />
                );
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
                            <span className={`flex items-center justify-center w-5 h-5 mr-2 text-xl border ${currentStep === index ? 'border-green-600 dark:border-green-500' : 'border-gray-500 dark:border-gray-400'
                                } rounded-full shrink-0`}>
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
                        disabled={
                            (currentStep === 0 && !selectedCampaign) ||
                            (currentStep === 1 && (!signedContract || !contractSent))
                        }
                    >
                        Tiếp theo <ArrowRight className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                ) : null}
            </div>
        </div>
    );
};

export default ContractCampaign;