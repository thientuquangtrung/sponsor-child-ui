import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';

const ContractContent = ({ guaranteeProfile }) => {
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
                            <p>
                                <span className="inline-block w-36">Chức vụ:</span> {guaranteeProfile.position}
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

const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'dd/MM/yyyy');
};
const SendHardContract = ({ signedContract, guaranteeProfile }) => {
    const contractRef = useRef(null);
    const [isGenerating, setIsGenerating] = useState(false);

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

    const handleDownloadPDF = async () => {
        setIsGenerating(true);
        try {
            const pdf = await generatePDF();
            pdf.save('contract_unsigned.pdf');
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
                        <ContractContent guaranteeProfile={guaranteeProfile} />
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
                    Công ty ABC
                    <br />
                    123 Đường D, Quận 1<br />
                    Thành phố Hồ Chí Minh, Việt Nam
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

export default SendHardContract;
