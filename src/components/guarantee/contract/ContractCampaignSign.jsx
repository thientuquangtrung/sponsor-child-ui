import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Save, Send, Trash } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCreateContractMutation, useUpdateContractMutation } from '@/redux/contract/contractApi';
import { useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz'


import { Toaster, toast } from 'sonner';
import { useGetDisbursementDetailsQuery } from '@/redux/campaign/campaignApi';
import ContractCampaignContent from '@/components/guarantee/contract/ContractCampaignContent';

const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'dd/MM/yyyy');
};

const signDate = formatInTimeZone(new Date(), 'Asia/Ho_Chi_Minh', "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");



const ContractCampaignSign = ({ onSign, onContractSent, campaignId }) => {
    const { user } = useSelector((state) => state.auth);
    const [signature, setSignature] = useState(null);
    const [isSigned, setIsSigned] = useState(false);
    const sigCanvas = useRef({});
    const contractRef = useRef(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [createContract, { isLoading: isCreatingContract }] = useCreateContractMutation();
    const [updateContract, { isLoading: isUpdatingContract }] = useUpdateContractMutation();
    const { data: campaignDetails, isLoading: isLoadingCampaign } = useGetDisbursementDetailsQuery(campaignId);



    const partyB = {
        fullName: user.fullname,
        idNumber: user.idNumber,
        phoneNumber: user.phone,
        birthYear: formatDate(user.dateOfBirth),
        idIssueDate: formatDate(user.idIssueDate),
        idIssuePlace: user.idIssuePlace,
        address: user.address,
    };
    const handleClear = () => {
        sigCanvas.current.clear();
        setSignature(null);
        setIsSigned(false);
        toast.success('Chữ ký đã được xóa');


    };

    const handleSave = () => {
        setSignature(sigCanvas.current.toDataURL());
        setIsSigned(true);
        onSign(sigCanvas.current.toDataURL());
        toast.success('Chữ ký đã được lưu');

    };



    const generatePDF = async () => {
        const element = contractRef.current;
        const canvas = await html2canvas(element, {
            scale: 2,
            logging: false,
            useCORS: true,
            scrollY: -window.scrollY
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        let heightLeft = pdfHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft >= 0) {
            position = heightLeft - pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();
        }

        return pdf;
    };



    const handleUpload = async () => {
        setUploadLoading(true);
        toast.promise(
            async () => {
                try {
                    const pdf = await generatePDF();
                    const pdfBlob = pdf.output('blob');

                    const partyBID = user.userID;

                    const formData = new FormData();
                    formData.append('file', pdfBlob, 'register.pdf');
                    formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET_NAME);
                    formData.append('folder', `user_${partyBID}/guarantee/contracts`);
                    // formData.append('public_id', `${userId}/guarantee/contracts/register`);
                    // formData.append('overwrite', 'true'); // "Overwrite parameter is not allowed when using unsigned upload
                    // const response = await uploadPdf(formData).unwrap();

                    const response = await fetch(
                        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/raw/upload`,
                        {
                            method: 'POST',
                            body: formData,
                        }
                    );

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    // console.log('Upload successful:', data);

                    //  Create URL Cloudinary for PDF upload
                    const pdfUrl = data.secure_url;
                    console.log('PDF URL:', pdfUrl);

                    // Create Contract
                    const result = await createContract({
                        partyBID: partyBID,
                        contractType: 1,
                        campaignId: campaignId,
                    }).unwrap();
                    console.log(result);
                    console.log(result.contractID);


                    if (result && result.contractID) {
                        await updateContract({
                            contractId: result.contractID,
                            contractType: 1, // Campaign Contract
                            partyAType: 0, // Admin
                            partyAID: "f7b2a26b-75f2-4c43-88b1-df094c8bfb2e", //admin 1
                            partyBType: 1, // Guarantee
                            partyBID: user.userID,
                            signDate: signDate,
                            status: 0, // pending
                            softContractUrl: pdfUrl,
                            hardContractUrl: ""
                        }).unwrap();
                    }

                    // Update status  and noti for  component ContractSignPage

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
            }
        );
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
            <Toaster />

            <div className="w-full lg:w-2/3 p-4">
                <ScrollArea className="h-[calc(100vh-2rem)] lg:h-[calc(100vh-2rem)]">
                    {isLoadingCampaign ? (
                        <div className="flex items-center justify-center h-full">
                            <p>Đang tải hợp đồng ...</p>
                        </div>
                    ) : (
                        <div ref={contractRef}>
                            <ContractCampaignContent
                                partyB={partyB}
                                signature={signature}
                                campaignDetails={campaignDetails}
                            />
                        </div>
                    )}
                </ScrollArea>
            </div>
            <div className="w-full lg:w-1/3 p-4 bg-white shadow-md py-8 font-sans">

                <h2 className="font-semibold mb-2">Ký tên</h2>
                <div className="border-2 border-gray-300 rounded-lg mb-4">
                    <SignatureCanvas
                        ref={sigCanvas}
                        canvasProps={{ width: 300, height: 150 }}
                    />
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex space-x-2 mt-4">
                        <Button className="flex-1 border-2 bg-red-500  hover:bg-red-600 text-white rounded-lg"
                            type="button" onClick={handleClear}>
                            <Trash className="h-4 w-4 mr-2" /> Xóa
                        </Button>
                        <Button className="flex-1 border-2 bg-blue-500   hover:bg-blue-700 text-white rounded-lg"
                            onClick={handleSave}>
                            <Save className="h-4 w-4 mr-2" /> Lưu
                        </Button>
                        <Button
                            className="flex-1 border-2 bg-[#f5b642] hover:bg-yellow-600 text-white"
                            onClick={handleUpload}
                            disabled={!isSigned || uploadLoading || isCreatingContract || isUpdatingContract}
                        >
                            <Send className="h-4 w-4 mr-2" />
                            {uploadLoading || isCreatingContract || isUpdatingContract ? 'Đang gửi...' : 'Gửi hợp đồng'}
                        </Button>
                    </div>



                </div>

            </div >
        </div >
    );
};

export default ContractCampaignSign;