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
import { useUploadPdfMutation } from '@/redux/cloudinary/cloudinaryApi';
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from '@cloudinary/react';
// const formSchema = z.object({
//     fullName: z.string().min(1, "Vui lòng nhập Họ tên"),
//     idNumber: z.string().min(1, "Vui lòng nhập Số CMND/CCCD "),
//     phoneNumber: z.string().min(1, "Vui lòng nhập SĐT"),
//     birthDate: z.date({
//         required_error: "Vui lòng chọn Ngày sinh",
//         invalid_type_error: "Đó không phải là một ngày hợp lệ",
//     }),
//     idIssueDate: z.date({
//         required_error: "Vui lòng chọn Ngày cấp",
//         invalid_type_error: "Đó không phải là một ngày hợp lệ",
//     }),
//     idIssuePlace: z.string().min(1, "Vui lòng nhập Nơi cấp"),
//     address: z.string().min(1, "Vui lòng nhập Địa chỉ"),
// });
const ContractContent = ({ partyB, signature }) => (
    <div className="p-8 bg-white text-black font-serif">
        <h1 className="text-2xl font-bold text-center">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>
        <h2 className="text-xl font-semibold text-center mb-2 mt-2 italic">Độc lập – Tự do – Hạnh phúc</h2>
        <p className="mb-6 text-center">*****</p>

        <h3 className="text-lg font-semibold text-center mb-8">HỢP ĐỒNG THAM GIA BẢO LÃNH </h3>
        <div className='ml-6 text-sm'>
            <p className="mb-4">Số: ..../HĐ-BLCD</p>
            <p className="mb-6">Hôm nay, ngày ...... tháng ...... năm ........., tại ....................</p>
            <p className="font-semibold mb-4">Chúng tôi gồm có:</p>

            <div className="mb-6">
                <h4 className="font-semibold underline mb-2">1. BÊN QUẢN TRỊ NỀN TẢNG SPONSOR CHILD:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p><span className="inline-block w-36">Họ tên:</span> NGUYỄN VĂN A</p>
                        <p><span className="inline-block w-36">Số CMND/CCCD:</span> 001234567890</p>
                        <p><span className="inline-block w-36">Số điện thoại:</span> 0123456789</p>
                    </div>
                    <div className="space-y-2">
                        <p><span className="inline-block w-20">Năm sinh:</span> 20/10/2010</p>
                        <div className="flex flex-wrap">
                            <p className="mr-4 mb-2"><span className="inline-block w-20">Cấp ngày:</span> 01/01/2015</p>
                            <p><span className="inline-block w-20">Nơi cấp:</span> Bình Định</p>
                        </div>
                    </div>
                </div>
                <p className="mt-2"><span className="inline-block w-36">Địa chỉ thường trú:</span> 123 ABC</p>
                <p className="font-semibold mt-2">Sau đây gọi là Bên A</p>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold underline mb-2">2. BÊN BẢO LÃNH:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p><span className="inline-block w-36">Họ tên:</span> {partyB.fullName || "......................................................."}</p>
                        <p><span className="inline-block w-36">Số CMND/CCCD:</span> {partyB.idNumber || "......................................................."}</p>
                        <p><span className="inline-block w-36">Số điện thoại:</span> {partyB.phoneNumber || "......................................................."}</p>
                    </div>
                    <div className="space-y-2">
                        <p><span className="inline-block w-20">Năm sinh:</span> {partyB.birthYear || ".................."}</p>
                        <div className="flex flex-wrap">
                            <p className="mr-4 mb-2"><span className="inline-block w-20">Cấp ngày:</span> {partyB.idIssueDate || ".................."}</p>
                            <p><span className="inline-block w-20">Nơi cấp:</span> {partyB.idIssuePlace || ".................."}</p>
                        </div>
                    </div>
                </div>
                <p className="mt-2"><span className="inline-block w-36">Địa chỉ thường trú:</span> {partyB.address ||
                    "...................................................................................................................................."}</p>
                <p className="font-semibold mt-2">Sau đây gọi là Bên B</p>
            </div>

            <p className="font-semibold">Cả hai bên cùng thống nhất ký kết hợp đồng tham gia bảo lãnh chiến dịch hỗ trợ trẻ em với các điều khoản như sau:</p>

            <div className="mb-6 mt-2">
                <h4 className="font-semibold">Điều 1: Mục đích hợp đồng </h4>
                <p>
                    1.1. Hợp đồng này quy định quyền hạn và trách nhiệm của Bên B  khi tham gia làm bảo lãnh cho các chiến dịch gây quỹ thuộc hệ thống.
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
                    <br /><br />
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
                    - Bên A có trách nhiệm cung cấp các hướng dẫn, quy trình và hỗ trợ cho Bên Bảo Lãnh khi cần thiết.
                    <br /><br />
                    3.2. <strong>Quản lý và kiểm tra:</strong> <br />
                    - Bên A sẽ giám sát và kiểm tra việc sử dụng quỹ, đảm bảo rằng quỹ được sử dụng đúng mục đích và theo quy định.
                </p>
            </div>

            <div className="mb-6 mt-2">
                <h4 className="font-semibold">Điều 4: Điều kiện và quy trình hủy bỏ tư cách Bên Bảo Lãnh</h4>
                <p>
                    4.1. <strong>Hủy bỏ tư cách Bên Bảo Lãnh:</strong> <br />
                    - Trong trường hợp Bên Bảo Lãnh không tuân thủ các quy định của hệ thống hoặc vi phạm các cam kết, Bên A có quyền hủy bỏ tư cách này.
                    <br /><br />
                    4.2. <strong>Hình phạt:</strong> <br />
                    - Nếu có sai phạm liên quan đến việc sử dụng quỹ, Bên Bảo Lãnh phải hoàn trả toàn bộ số tiền đã nhận nhưng chưa sử dụng đúng cam kết.
                </p>
            </div>

            <div className="mb-6 mt-2">
                <h4 className="font-semibold">Điều 5: Thông tin tài khoản và giao dịch</h4>
                <p>
                    5.1. <strong>Cung cấp thông tin chính xác:</strong> <br />
                    - Bên Bảo Lãnh phải cung cấp chính xác thông tin tài khoản ngân hàng để nhận quỹ. Mọi thay đổi phải được thông báo kịp thời và cập nhật trong hệ thống.
                    <br /><br />
                    5.2. <strong>Bảo mật thông tin:</strong> <br />
                    - Bên Bảo Lãnh cam kết bảo mật các thông tin liên quan đến tài khoản và dự án.
                </p>
            </div>

            <div className="mb-6 mt-2">
                <h4 className="font-semibold">Điều 6: Xử lý tranh chấp</h4>
                <p>
                    6.1. <strong>Giải quyết tranh chấp:</strong> <br />
                    - Mọi tranh chấp phát sinh từ việc thực hiện hợp đồng này sẽ được giải quyết thông qua thương lượng giữa hai bên. Nếu không thể đạt được thỏa thuận, vụ việc sẽ được đưa ra tòa án có thẩm quyền.
                </p>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold">Điều 7: Cam kết chung</h4>
                <p>Cả Bên A và Bên B đều xác nhận rằng tất cả thông tin trong hợp đồng là chính xác và hợp pháp. Cả hai bên cam kết thực hiện đầy đủ các điều khoản đã thỏa thuận.</p>
            </div>




            <div className="flex justify-between mt-12 mb-40">
                <div className="text-center">
                    <p className="font-semibold">Đại diện Bên A</p>
                    <p>(Ký, ghi rõ họ tên)</p>
                </div>
                <div className="text-center">
                    <p className="font-semibold">Đại diện Bên B</p>
                    <p>(Ký, ghi rõ họ tên)</p>
                    {signature && (
                        <img src={signature} alt="Chữ ký Bên B" className="mt-4" />
                    )}
                    <p className="mt-2">{partyB.fullName}</p>

                </div>
            </div>
            <div className="mb-6">
                <div className="border-t-2 mb-2"></div>
                <p className='text-center'>
                    Hợp đồng này được lập thành 03 bản, bên bảo lãnh giữ 01 bản, bên cho bảo lãnh giữ 02 bản và có giá trị pháp lý như nhau.
                </p>
            </div>
        </div>
    </div >

);

const ContractViewAndSign = () => {
    const [signature, setSignature] = useState(null);
    const [isSigned, setIsSigned] = useState(false);
    const sigCanvas = useRef({});
    const [partyB, setPartyB] = useState({});
    const contractRef = useRef(null);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadPdf] = useUploadPdfMutation();
    const cld = new Cloudinary({
        cloud: {
            cloudName: import.meta.env.VITE_CLOUD_NAME
        }
    });
    // const form = useForm({
    //     resolver: zodResolver(formSchema),
    //     defaultValues: {
    //         fullName: "",
    //         idNumber: "",
    //         phoneNumber: "",
    //         birthDate: null,
    //         idIssueDate: null,
    //         idIssuePlace: "",
    //         address: "",
    //     },
    // });

    const handleClear = () => {
        sigCanvas.current.clear();
        setSignature(null);
        setIsSigned(false);
    };

    const handleSave = () => {
        setSignature(sigCanvas.current.toDataURL());
        setIsSigned(true);
    };


    // const onSubmit = (data) => {
    //     const formattedData = {
    //         ...data,
    //         birthYear: data.birthDate ? data.birthDate.getFullYear().toString() : '',
    //         idIssueDate: data.idIssueDate ? data.idIssueDate.toLocaleDateString('vi-VN') : '',
    //     };
    //     setPartyB(formattedData);
    //     handleSave();
    // };
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
        setPdfLoading(true);
        try {
            const pdf = await generatePDF();
            pdf.save('register.pdf');
        } catch (error) {
            console.error('PDF generation failed:', error);
        } finally {
            setPdfLoading(false);
        }
    };

    const handleUpload = async () => {
        setUploadLoading(true);

        try {
            const pdf = await generatePDF();
            const pdfBlob = pdf.output('blob');

            const formData = new FormData();
            formData.append('file', pdfBlob, 'register.pdf');
            formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET_NAME);
            formData.append('folder', 'user_001/guarantee/contracts'); // test with user_001

            // const response = await uploadPdf(formData).unwrap();

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/raw/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorBody = await response.text();
                console.error('Error response:', errorBody);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // console.log('Upload successful:', data);

            //  Create URL Cloudinary for PDF upload
            const pdfUrl = data.secure_url;
            console.log('PDF URL:', pdfUrl);


        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploadLoading(false);
        }
    };



    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
            <div className="w-full lg:w-2/3 p-4">
                <ScrollArea className="h-[calc(100vh-2rem)] lg:h-[calc(100vh-2rem)]">
                    <div ref={contractRef}>
                        <ContractContent partyB={partyB} signature={signature} />
                    </div>
                </ScrollArea>
            </div>
            <div className="w-full lg:w-1/3 p-4 bg-white shadow-md py-8 font-sans">
                {/* <h2 className="text-xl font-bold mb-4 text-center">Điền thông tin hợp đồng</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Họ tên</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value?.toUpperCase()}
                                            placeholder="Nhập họ tên"
                                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                            className="uppercase border-2 border-gray-300 rounded-lg mb-4" />

                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="idNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Số CMND/CCCD</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            placeholder="Nhập CMND/CCCD"
                                            onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                                            className="border-2 border-gray-300 rounded-lg mb-4"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số điện thoại</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="Nhập số điện thoại"
                                                onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                                                className="border-2 border-gray-300 rounded-lg mb-4"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Controller
                                control={form.control}
                                name="birthDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Năm sinh</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                selected={field.value}
                                                onChange={(date) => field.onChange(date)}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="Chọn năm sinh"
                                                className="w-full border-2 border-gray-300 rounded-lg p-2"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">

                            <Controller
                                control={form.control}
                                name="idIssueDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ngày cấp</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                selected={field.value}
                                                onChange={(date) => field.onChange(date)}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="Chọn ngày cấp"
                                                className="w-full border-2 border-gray-300 rounded-lg p-2"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="idIssuePlace"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nơi cấp</FormLabel>
                                        <FormControl>
                                            <Input {...field}
                                                placeholder="Nhập nơi cấp"
                                                className="border-2 border-gray-300 rounded-lg mb-4" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Địa chỉ thường trú</FormLabel>
                                    <FormControl>
                                        <Input {...field}
                                            placeholder="Nhập Địa chỉ thường trú"
                                            className="rounded-lg border-gray-300" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                <h2 className="font-semibold mb-2">Ký tên</h2>
                <div className="border-2 border-gray-300 rounded-lg mb-4">
                    <SignatureCanvas
                        ref={sigCanvas}
                        canvasProps={{ width: 300, height: 150 }}
                    />
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex space-x-2 mt-4">
                        <Button className="flex-1 border-2 bg-[#faa099]  hover:bg-red-600 hover:text-white rounded-lg"
                            type="button" onClick={handleClear}>
                            <Trash className="h-4 w-4 mr-2" /> Xóa
                        </Button>
                        <Button className="flex-1 border-2 bg-blue-400   hover:bg-blue-600 hover:text-white rounded-lg"
                            onClick={handleSave}>
                            <Save className="h-4 w-4 mr-2" /> Lưu
                        </Button>
                        <Button className="flex-1 border-2 bg-[#f5b642]  hover:bg-yellow-600 hover:text-white"
                            onClick={handleUpload} disabled={!isSigned || uploadLoading}>
                            <Send className="h-4 w-4 mr-2" />
                            {uploadLoading ? 'Đang gửi...' : 'Gửi hợp đồng'}
                        </Button>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">

                        <ol className="list-decimal list-inside space-y-2 font-sans text-sm">
                            <li>Tải xuống file PDF hợp đồng bằng cách nhấn nút "Tải PDF" bên dưới.</li>
                            <li>In hợp đồng ra giấy.</li>
                            <li>Đọc kỹ nội dung và ký tên vào các vị trí được đánh dấu trong hợp đồng.</li>
                            <li>Gửi hợp đồng đã ký qua chuyển phát đến địa chỉ:</li>
                        </ol>
                        <p className="mt-4 font-semibold">
                            Công ty ABC<br />
                            123 Đường D, Quận 1<br />
                            Thành phố Hồ Chí Minh, Việt Nam
                        </p>

                    </div>

                    <Button className="flex-1 border-2 border-[#44887d] text-[#44887d] bg-white hover:bg-green-600 hover:text-white rounded-lg"
                        onClick={handleDownloadPDF} disabled={pdfLoading}>
                        <Download className="h-4 w-4 mr-2" />
                        {pdfLoading ? 'Đang tạo PDF...' : 'Tải PDF'}
                    </Button>

                </div>

                {/* </form>
        </Form> */}
            </div >
        </div >
    );
};

export default ContractViewAndSign;