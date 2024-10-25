import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';
import ContractContent from '@/components/guarantee/contract/ContractCampaignContent';
import { useGetCampaignByIdQuery } from '@/redux/campaign/campaignApi';


const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'dd/MM/yyyy');
};
const SendHardContractCampaign = ({ campaignId }) => {
    const contractRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const { data: campaignDetails, isLoading: isLoadingCampaign } = useGetCampaignByIdQuery(campaignId);

    const partyB = {
        fullName: user.fullname,
        idNumber: user.idNumber,
        phoneNumber: user.phone,
        birthYear: formatDate(user.dateOfBirth),
        idIssueDate: formatDate(user.idIssueDate),
        idIssuePlace: user.idIssuePlace,
        address: user.address,
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


    const handleDownloadPDF = async () => {
        setIsGenerating(true);
        try {
            const pdf = await generatePDF();
            pdf.save('contract_campaign.pdf');
        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('Có lỗi xảy ra khi tạo PDF. Vui lòng thử lại sau.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
            <div className="w-full lg:w-2/3 p-4">
                <ScrollArea className="h-[calc(100vh-2rem)] lg:h-[calc(100vh-2rem)]">
                    <div ref={contractRef}>
                        <ContractContent
                            partyB={partyB}
                            campaignDetails={campaignDetails}
                        />
                    </div>
                </ScrollArea>


            </div>

            <div className="w-full lg:w-1/3 p-4 bg-white shadow-md pt-20 font-sans">

                <h2 className="text-2xl font-bold mb-6 text-center">Hướng Dẫn Gửi Hợp Đồng</h2>
                <ol className="list-decimal list-inside space-y-2 font-sans">
                    <li>Tải xuống file PDF hợp đồng bằng cách nhấn nút "Tải PDF" bên dưới.</li>
                    <li>In hợp đồng ra giấy.</li>
                    <li>Đọc kỹ nội dung và ký tên vào các vị trí được đánh dấu trong hợp đồng.</li>
                    <li>Gửi hợp đồng đã ký qua chuyển phát đến địa chỉ:</li>
                </ol>
                <p className="mt-4 font-semibold">
                    Lô E2a-7<br />
                    Đường D1, Đ. D1, Long Thạnh Mỹ<br />
                    Thành Phố Thủ Đức, Việt Nam
                </p>
                <div className="flex justify-center mt-4">
                    <Button
                        onClick={handleDownloadPDF}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={isGenerating}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        {isGenerating ? 'Đang tạo PDF...' : 'Tải PDF Hợp Đồng'}
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default SendHardContractCampaign;