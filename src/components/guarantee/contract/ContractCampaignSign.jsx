import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Save, Send, Trash } from 'lucide-react';
import { useGetContractByIdQuery, useUpdateContractMutation } from '@/redux/contract/contractApi';
import { useSelector } from 'react-redux';
import { formatInTimeZone } from 'date-fns-tz';
import { Toaster, toast } from 'sonner';

import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetCampaignByIdQuery } from '@/redux/campaign/campaignApi';
import ContractCampaignContent from '@/components/guarantee/contract/ContractCampaignContent';
import { generatePDF2 } from '@/lib/utils';
import { UPLOAD_FOLDER, UPLOAD_NAME, uploadFile } from '@/lib/cloudinary';

const signDate = formatInTimeZone(new Date(), 'Asia/Ho_Chi_Minh', "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

const ContractCampaignSign = ({ onSign, onContractSent, campaignId, contractId }) => {
    const { user } = useSelector((state) => state.auth);
    const [signature, setSignature] = useState(null);
    const [isSigned, setIsSigned] = useState(false);
    const sigCanvas = useRef({});
    const contractRef = useRef(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [updateContract, { isLoading: isUpdatingContract }] = useUpdateContractMutation();
    const { data: campaignDetails, isLoading: isLoadingCampaign } = useGetCampaignByIdQuery(campaignId);
    const { data: contractDetails, isLoading: isLoadingContract } = useGetContractByIdQuery(contractId);

    if (contractDetails && contractDetails.status !== 0) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                    <div className="mb-4">
                        <svg
                            className="mx-auto h-16 w-16 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {contractDetails.status === 1
                            ? 'Hợp đồng đã được ký chờ xác nhận!'
                            : 'Hợp đồng đã được ký hoàn tất!'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {contractDetails.status === 1
                            ? 'Chữ ký của bạn đã được gửi. Vui lòng chờ phản hồi từ phía Admin.'
                            : 'Hợp đồng của bạn đã được xử lý hoàn tất.'}
                    </p>
                </div>
            </div>
        );
    }

    const handleClear = () => {
        sigCanvas.current.clear();
        setSignature(null);
        setIsSigned(false);
    };

    const handleSave = () => {
        setSignature(sigCanvas.current.toDataURL());
        setIsSigned(true);
        onSign(sigCanvas.current.toDataURL());
    };

    const handleUpload = async () => {
        if (!contractDetails) return;

        setUploadLoading(true);
        toast.promise(
            async () => {
                try {
                    // Upload signature to Cloudinary
                    const signatureBlob = await (await fetch(signature)).blob();
                    const signatureData = await uploadFile({
                        file: signatureBlob,
                        folder: UPLOAD_FOLDER.getCampaignDocumentFolder(campaignId),
                        customFilename: `${contractDetails.contractID}_${UPLOAD_NAME.SIGNATURE_GUARANTEE}`,
                        resourceType: 'raw',
                    });
                    const signatureUrl = signatureData.secure_url;

                    // Generate and upload PDF
                    const pdf = await generatePDF2(contractRef.current);
                    const pdfBlob = pdf.output('blob');
                    const pdfData = await uploadFile({
                        file: pdfBlob,
                        folder: UPLOAD_FOLDER.getCampaignDocumentFolder(campaignId),
                        customFilename: `${contractDetails.contractID}_${UPLOAD_NAME.CAMPAIGN_CONTRACT_SOFT}`,
                        resourceType: 'raw',
                    });
                    const pdfUrl = pdfData.secure_url;

                    await updateContract({
                        contractId: contractDetails.contractID,
                        contractType: contractDetails.contractType,
                        partyAType: contractDetails.partyAType,
                        // partyAID: contractDetails.partyAID,
                        partyBType: contractDetails.partyBType,
                        partyBID: contractDetails.partyBID,
                        signDate: signDate,
                        status: 1, // pending Admin sign
                        softContractUrl: pdfUrl,
                        hardContractUrl: '',
                        partyBSignatureUrl: signatureUrl,
                        campaignID: contractDetails.campaignID,
                    }).unwrap();

                    onSign(pdfUrl);
                    onContractSent();
                    return 'Hợp đồng đã được gửi thành công';
                } catch (error) {
                    console.error('Upload failed:', error);
                    throw error;
                } finally {
                    setUploadLoading(false);
                }
            },
            {
                loading: 'Đang gửi hợp đồng...',
                success: (message) => message,
                error: 'Gửi hợp đồng thất bại. Vui lòng thử lại.',
            },
        );
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
            <Toaster />

            <div className="w-full lg:w-2/3 p-4">
                <ScrollArea className="h-[calc(100vh-2rem)] lg:h-[calc(100vh-2rem)]">
                    {isLoadingCampaign ? (
                        <div className="flex items-center justify-center h-full">
                            <p>Đang tải hợp đồng ...</p>
                        </div>
                    ) : (
                        <div ref={contractRef}>
                            <ContractCampaignContent signature={signature} campaignDetails={campaignDetails} />
                        </div>
                    )}
                </ScrollArea>
            </div>
            <div className="w-full lg:w-1/3 p-4 bg-white shadow-md py-8 font-sans">
                <h2 className="font-semibold mb-2">Ký tên</h2>
                <div className="border-2 border-gray-300 rounded-lg mb-4 w-fit">
                    <SignatureCanvas ref={sigCanvas} canvasProps={{ width: 350, height: 150 }} />
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex space-x-2 mt-4">
                        <Button
                            className="flex-1 border-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                            type="button"
                            onClick={handleClear}
                        >
                            <Trash className="h-4 w-4 mr-2" /> Ký lại
                        </Button>
                        <Button
                            className="flex-1 border-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg"
                            onClick={handleSave}
                        >
                            <Save className="h-4 w-4 mr-2" /> Xác nhận
                        </Button>
                        <Button
                            className="flex-1 border-2 bg-[#f5b642] hover:bg-yellow-600 text-white"
                            onClick={handleUpload}
                            disabled={!isSigned || uploadLoading || isUpdatingContract}
                        >
                            <Send className="h-4 w-4 mr-2" />
                            {uploadLoading || isUpdatingContract ? 'Đang gửi...' : 'Gửi hợp đồng'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractCampaignSign;
