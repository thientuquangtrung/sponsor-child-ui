import React, { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save, Send, Trash } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';
import { useGetContractsByTypeAndPartyBQuery, useUpdateContractMutation } from '@/redux/contract/contractApi';
import { useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';

import { formatInTimeZone } from 'date-fns-tz';
import { toast } from 'sonner';
const formatDate = (dateString) => {
    if (!dateString) return '.....................';
    return format(new Date(dateString), 'dd/MM/yyyy');
};

const ContractContent = ({ guaranteeProfile, signature }) => {
    console.log(guaranteeProfile);
    const today = new Date();
    const formattedToday = format(today, "dd' tháng 'MM' năm 'yyyy");
    const renderPartyB = () => {
        if (!guaranteeProfile) {
            return (
                <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p>
                                <span className="inline-block w-36">Họ tên:</span> .........................
                            </p>
                            <p>
                                <span className="inline-block w-36">Số CMND/CCCD:</span> .........................
                            </p>
                            <p>
                                <span className="inline-block w-36">Số điện thoại:</span> .........................
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p>
                                <span className="inline-block w-20">Năm sinh:</span> .........................
                            </p>
                            <div className="flex flex-wrap">
                                <p className="mr-4 mb-2">
                                    <span className="inline-block w-20">Cấp ngày:</span> .........................
                                </p>
                                <p>
                                    <span className="inline-block w-20">Nơi cấp:</span> .........................
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className="mt-2">
                        <span className="inline-block w-36">Địa chỉ thường trú:</span> .........................
                    </p>
                </div>
            );
        }

        if (guaranteeProfile.guaranteeType === 0) {
            return (
                <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p>
                                <span className="inline-block w-36">Họ tên:</span> {guaranteeProfile.fullname}
                            </p>
                            <p>
                                <span className="inline-block w-36">Số CMND/CCCD:</span>{' '}
                                {guaranteeProfile.citizenIdentification}
                            </p>
                            <p>
                                <span className="inline-block w-36">Số điện thoại:</span> {guaranteeProfile.phoneNumber}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p>
                                <span className="inline-block w-20">Năm sinh:</span>{' '}
                                {formatDate(guaranteeProfile.dateOfBirth)}
                            </p>
                            <div className="flex flex-wrap">
                                <p className="mr-4 mb-2">
                                    <span className="inline-block w-20">Cấp ngày:</span>{' '}
                                    {formatDate(guaranteeProfile.issueDate)}
                                </p>
                                <p>
                                    <span className="inline-block w-20">Nơi cấp:</span> {guaranteeProfile.issueLocation}
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className="mt-2">
                        <span className="inline-block w-36">Địa chỉ thường trú:</span>{' '}
                        {guaranteeProfile.permanentAddress}
                    </p>
                </div>
            );
        } else {
            return (
                <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p>
                                <span className="inline-block w-36">Tên tổ chức:</span>{' '}
                                {guaranteeProfile.organizationName}
                            </p>
                            <p>
                                <span className="inline-block w-36">Người đại diện:</span>{' '}
                                {guaranteeProfile.representativeName}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p>
                                <span className="inline-block w-36">Số điện thoại:</span>{' '}
                                {guaranteeProfile.organizationPhoneNumber}
                            </p>

                        </div>
                    </div>
                    <p className="mt-2">
                        <span className="inline-block w-36">Địa chỉ tổ chức:</span>{' '}
                        {guaranteeProfile.organizationAddress}
                    </p>
                </div>
            );
        }
    };

    return (
        <div className="p-8 bg-white text-black font-serif">
            <h1 className="text-2xl font-bold text-center">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>
            <h2 className="text-xl font-semibold text-center mb-2 mt-2 italic">Độc lập – Tự do – Hạnh phúc</h2>
            <p className="mb-6 text-center">*****</p>

            <h3 className="text-lg font-semibold text-center mb-8">HỢP ĐỒNG THAM GIA BẢO LÃNH </h3>
            <div className="ml-6 text-sm">
                <p className="mb-4">Số: 100/HĐ-BLCD</p>
                <p className="mb-6">Hôm nay, {formattedToday}, tại ....................</p>
                <p className="font-semibold mb-4">Chúng tôi gồm có:</p>

                <div className="mb-6">
                    <h4 className="font-semibold underline mb-2">1. BÊN QUẢN TRỊ NỀN TẢNG SPONSOR CHILD:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <p>
                                <span className="inline-block w-36">Họ tên:</span> NGUYỄN VĂN A
                            </p>
                            <p>
                                <span className="inline-block w-36">Số CMND/CCCD:</span> 001234567890
                            </p>
                            <p>
                                <span className="inline-block w-36">Số điện thoại:</span> 0123456789
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p>
                                <span className="inline-block w-20">Năm sinh:</span> 20/10/2010
                            </p>
                            <div className="flex flex-wrap">
                                <p className="mr-4 mb-2">
                                    <span className="inline-block w-20">Cấp ngày:</span> 01/01/2015
                                </p>
                                <p>
                                    <span className="inline-block w-20">Nơi cấp:</span> Bình Định
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className="mt-2">
                        <span className="inline-block w-36">Địa chỉ thường trú:</span> 123 ABC
                    </p>
                    <p className="font-semibold mt-2">Sau đây gọi là Bên A</p>
                </div>

                <div className="mb-6">
                    <h4 className="font-semibold underline mb-2">2. BÊN BẢO LÃNH:</h4>
                    {renderPartyB()}
                    <p className="font-semibold mt-2">Sau đây gọi là Bên B</p>
                </div>

                <p className="font-semibold">
                    Cả hai bên cùng thống nhất ký kết hợp đồng tham gia bảo lãnh chiến dịch hỗ trợ trẻ em với các điều
                    khoản như sau:
                </p>

                <div className="mb-6 mt-2">
                    <h4 className="font-semibold">Điều 1: Mục đích hợp đồng </h4>
                    <p>
                        1.1. Hợp đồng này quy định quyền hạn và trách nhiệm của Bên B khi tham gia làm bảo lãnh cho các
                        chiến dịch gây quỹ thuộc hệ thống.
                        <br />
                        1.2. Bên B cam kết tuân thủ các quy định và quy trình của hệ thống gây quỹ SponsorChild.
                    </p>
                </div>

                <div className="mb-6 mt-2">
                    <h4 className="font-semibold">Điều 2: Quyền và trách nhiệm của Bên Bảo Lãnh</h4>
                    <p>
                        2.1. <strong>Quyền của Bên Bảo Lãnh:</strong> <br />
                        - Nhận tiền gây quỹ theo các điều kiện và cam kết đã ký kết với Bên A. <br />
                        - Được hỗ trợ từ Bên A khi cần thiết trong quá trình thực hiện các chiến dịch gây quỹ.
                        <br />
                        <br />
                        2.2. <strong>Trách nhiệm của Bên Bảo Lãnh:</strong> <br />
                        - Cam kết sử dụng nguồn quỹ đúng mục đích theo từng chiến dịch cụ thể. <br />
                        - Nộp báo cáo tiến độ đúng thời gian và đầy đủ chứng từ minh bạch cho từng đợt giải ngân. <br />
                        - Chịu trách nhiệm hoàn toàn về việc sử dụng quỹ và thông tin cung cấp trong báo cáo.
                    </p>
                </div>

                <div className="mb-6 mt-2">
                    <h4 className="font-semibold">Điều 3: Trách nhiệm của Bên A </h4>
                    <p>
                        3.1. <strong>Hỗ trợ Bên Bảo Lãnh:</strong> <br />
                        - Bên A có trách nhiệm cung cấp các hướng dẫn, quy trình và hỗ trợ cho Bên Bảo Lãnh khi cần
                        thiết.
                        <br />
                        <br />
                        3.2. <strong>Quản lý và kiểm tra:</strong> <br />- Bên A sẽ giám sát và kiểm tra việc sử dụng
                        quỹ, đảm bảo rằng quỹ được sử dụng đúng mục đích và theo quy định.
                    </p>
                </div>

                <div className="mb-6 mt-2">
                    <h4 className="font-semibold">Điều 4: Điều kiện và quy trình hủy bỏ tư cách Bên Bảo Lãnh</h4>
                    <p>
                        4.1. <strong>Hủy bỏ tư cách Bên Bảo Lãnh:</strong> <br />
                        - Trong trường hợp Bên Bảo Lãnh không tuân thủ các quy định của hệ thống hoặc vi phạm các cam
                        kết, Bên A có quyền hủy bỏ tư cách này.
                        <br />
                        <br />
                        4.2. <strong>Hình phạt:</strong> <br />- Nếu có sai phạm liên quan đến việc sử dụng quỹ, Bên Bảo
                        Lãnh phải hoàn trả toàn bộ số tiền đã nhận nhưng chưa sử dụng đúng cam kết.
                    </p>
                </div>

                <div className="mb-6 mt-2">
                    <h4 className="font-semibold">Điều 5: Thông tin tài khoản và giao dịch</h4>
                    <p>
                        5.1. <strong>Cung cấp thông tin chính xác:</strong> <br />
                        - Bên Bảo Lãnh phải cung cấp chính xác thông tin tài khoản ngân hàng để nhận quỹ. Mọi thay đổi
                        phải được thông báo kịp thời và cập nhật trong hệ thống.
                        <br />
                        <br />
                        5.2. <strong>Bảo mật thông tin:</strong> <br />- Bên Bảo Lãnh cam kết bảo mật các thông tin liên
                        quan đến tài khoản và dự án.
                    </p>
                </div>

                <div className="mb-6 mt-2">
                    <h4 className="font-semibold">Điều 6: Xử lý tranh chấp</h4>
                    <p>
                        6.1. <strong>Giải quyết tranh chấp:</strong> <br />- Mọi tranh chấp phát sinh từ việc thực hiện
                        hợp đồng này sẽ được giải quyết thông qua thương lượng giữa hai bên. Nếu không thể đạt được thỏa
                        thuận, vụ việc sẽ được đưa ra tòa án có thẩm quyền.
                    </p>
                </div>

                <div className="mb-6">
                    <h4 className="font-semibold">Điều 7: Cam kết chung</h4>
                    <p>
                        Cả Bên A và Bên B đều xác nhận rằng tất cả thông tin trong hợp đồng là chính xác và hợp pháp. Cả
                        hai bên cam kết thực hiện đầy đủ các điều khoản đã thỏa thuận.
                    </p>
                </div>

                <div className="flex justify-between mt-12 mb-40">
                    <div className="text-center">
                        <p className="font-semibold">Đại diện Bên A</p>
                        <p>(Ký, ghi rõ họ tên)</p>
                    </div>
                    <div className="text-center">
                        <p className="font-semibold">Đại diện Bên B</p>
                        <p>(Ký, ghi rõ họ tên)</p>
                        {signature && <img src={signature} alt="Chữ ký Bên B" className="mt-4" />}
                        <p className="mt-2">{guaranteeProfile.fullname}</p>
                    </div>
                </div>
                <div className="mb-6">
                    <div className="border-t-2 mb-2"></div>
                    <p className="text-center">
                        Hợp đồng này được lập thành 03 bản, bên Bảo lãnh giữ 01 bản, bên Quản trị nền tảng SponsorChild
                        giữ 02 bản và có giá trị pháp lý như nhau.
                    </p>
                </div>
            </div>
        </div>
    );
};

const signDate = formatInTimeZone(new Date(), 'Asia/Ho_Chi_Minh', "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

const ContractViewAndSign = ({ onSign, onContractSent, guaranteeProfile, onNextStep }) => {
    const { user } = useSelector((state) => state.auth);
    const [signature, setSignature] = useState(null);
    const [isSigned, setIsSigned] = useState(false);
    const sigCanvas = useRef({});
    const contractRef = useRef(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const { data: contracts, isLoading } = useGetContractsByTypeAndPartyBQuery({
        contractType: 0,
        partyBId: user?.userID,
    });
    const [updateContract, { isLoading: isUpdatingContract }] = useUpdateContractMutation();
    const [currentContractId, setCurrentContractId] = useState(null);

    useEffect(() => {
        if (contracts && contracts.length > 0) {
            setCurrentContractId(contracts[0].contractID);

            if (contracts[0].status !== 0) {
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
                                {contracts[0].status === 1
                                    ? "Hợp đồng đã được ký chờ xác nhận!"
                                    : "Hợp đồng đã được ký hoàn tất!"}
                            </h2>
                            <p className="text-gray-600 mb-6">
                                {contracts[0].status === 1
                                    ? "Chữ ký của bạn đã được gửi. Vui lòng chờ phản hồi từ phía Admin."
                                    : "Hợp đồng của bạn đã được xử lý hoàn tất."}
                            </p>
                        </div>
                    </div>
                );
            }
        }
    }, [contracts]);

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

    const generatePDF = async () => {
        const element = contractRef.current;
        const canvas = await html2canvas(element, {
            scale: 2,
            logging: false,
            useCORS: true,
            scrollY: -window.scrollY,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true,
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
    const uploadToCloudinary = async (file, folder) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET_NAME);
        formData.append('folder', folder);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/raw/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        return response.json();
    };
    const handleUpload = async () => {
        setUploadLoading(true);
        toast.promise(
            async () => {
                try {
                    const pdf = await generatePDF();
                    const pdfBlob = pdf.output('blob');
                    const partyBID = user.userID;

                    // Upload signature
                    const signatureBlob = await (await fetch(signature)).blob();
                    const signatureData = await uploadToCloudinary(
                        signatureBlob,
                        `user_${partyBID}/guarantee/signatures_guaranteed`,
                    );
                    const signatureUrl = signatureData.secure_url;

                    // Upload PDF
                    const pdfData = await uploadToCloudinary(
                        pdfBlob,
                        `user_${partyBID}/guarantee/contracts_guaranteed`,
                    );
                    const pdfUrl = pdfData.secure_url;



                    await updateContract({
                        contractId: currentContractId,
                        contractType: 0, // Guarantee Contract
                        partyAType: 0, // Admin
                        partyBType: 1, // Guarantee
                        partyBID: user.userID,
                        signDate: signDate,
                        status: 1, // pending Admin sign
                        softContractUrl: pdfUrl,
                        hardContractUrl: '',
                        partyBSignatureUrl: signatureUrl,
                    }).unwrap();
                    onSign(pdfUrl);
                    onContractSent();
                    onNextStep();
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
            <div className="w-full lg:w-2/3 p-4">
                <ScrollArea className="h-[calc(100vh-2rem)] lg:h-[calc(100vh-2rem)]">
                    <div ref={contractRef}>
                        <ContractContent guaranteeProfile={guaranteeProfile} signature={signature} />
                    </div>
                </ScrollArea>
            </div>
            <div className="w-full lg:w-1/3 p-4 bg-white shadow-md py-8 font-sans">
                <h2 className="font-semibold mb-2">Ký tên</h2>
                <div className="border-2 border-gray-300 rounded-lg mb-4">
                    <SignatureCanvas ref={sigCanvas} canvasProps={{ width: 370, height: 150 }} />
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex space-x-2 mt-4">
                        <Button
                            className="flex-1 border-2 bg-red-500  hover:bg-red-600 text-white rounded-lg"
                            type="button"
                            onClick={handleClear}
                        >
                            <Trash className="h-4 w-4 mr-2" /> Kí lại
                        </Button>
                        <Button
                            className="flex-1 border-2 bg-blue-500   hover:bg-blue-700 text-white rounded-lg"
                            onClick={handleSave}
                        >
                            <Save className="h-4 w-4 mr-2" /> Xác nhận
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

export default ContractViewAndSign;
