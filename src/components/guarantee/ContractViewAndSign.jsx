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
import { Download, Save, Trash } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const formSchema = z.object({
    fullName: z.string().min(1, "Vui lòng nhập Họ tên"),
    idNumber: z.string().min(1, "Vui lòng nhập Số CMND/CCCD "),
    phoneNumber: z.string().min(1, "Vui lòng nhập SĐT"),
    birthDate: z.date({
        required_error: "Vui lòng chọn Ngày sinh",
        invalid_type_error: "Đó không phải là một ngày hợp lệ",
    }),
    idIssueDate: z.date({
        required_error: "Vui lòng chọn Ngày cấp",
        invalid_type_error: "Đó không phải là một ngày hợp lệ",
    }),
    idIssuePlace: z.string().min(1, "Vui lòng nhập Nơi cấp"),
    address: z.string().min(1, "Vui lòng nhập Địa chỉ"),
});
const ContractContent = ({ partyB, signature }) => (
    <div className="p-8 bg-white text-black font-serif">
        <h1 className="text-2xl font-bold text-center">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>
        <h2 className="text-xl font-semibold text-center mb-2 mt-2 italic">Độc lập – Tự do – Hạnh phúc</h2>
        <p className="mb-6 text-center">*****</p>

        <h3 className="text-lg font-semibold text-center mb-8">HỢP ĐỒNG THAM GIA BẢO LÃNH CHIẾN DỊCH HỖ TRỢ TRẺ EM</h3>
        <div className='ml-6 text-sm'>
            <p className="mb-4">Số: ..../HĐ-BLHTTE</p>
            <p className="mb-6">Hôm nay, ngày ...... tháng ...... năm ........., tại ....................</p>
            <p className="font-semibold mb-4">Chúng tôi gồm có:</p>

            <div className="mb-6">
                <h4 className="font-semibold underline mb-2">1. BÊN CHO BẢO LÃNH:</h4>
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
                <h4 className="font-semibold">Điều 1: Thông tin về Chiến dịch</h4>
                <p>...</p>
            </div>


            <div className="mb-6">
                <h4 className="font-semibold">Điều 2: Quyền và nghĩa vụ của các bên</h4>
                <p>
                    2.1. Quyền và nghĩa vụ của Bên A:
                    <br />- Có trách nhiệm thông báo đầy đủ cho Bên B về số tiền đã huy động, các bước triển khai chiến dịch và tình hình sử dụng quỹ.
                    <br />- Đảm bảo tính minh bạch trong việc giải ngân và sử dụng quỹ, cung cấp báo cáo định kỳ cho Bên B khi được yêu cầu.
                    <br />- Chịu trách nhiệm liên lạc với Bên B để thông báo mọi vấn đề phát sinh trong quá trình thực hiện chiến dịch.
                    <br /><br />
                    2.2. Quyền và nghĩa vụ của Bên B:
                    <br />- Giám sát và hỗ trợ quá trình giải ngân số tiền đã huy động cho chiến dịch.
                    <br />- Báo cáo cho Bên A về việc sử dụng tiền đúng mục đích trong suốt quá trình thực hiện chiến dịch.
                    <br />- Có quyền yêu cầu báo cáo chi tiết từ Bên A về tiến độ của chiến dịch, số tiền giải ngân và kết quả hỗ trợ trẻ em.
                </p>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold">Điều 3: Điều khoản Giải ngân</h4>
                <p>
                    3.1. Bên A sẽ tiến hành giải ngân số tiền đã huy động từ Nhà tài trợ cho các hoạt động hỗ trợ trẻ em theo đúng kế hoạch đã được phê duyệt.
                    <br />
                    3.2. Bên B sẽ giám sát quá trình giải ngân này để đảm bảo tiền được sử dụng đúng mục đích.
                </p>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold">Điều 4: Cam kết về Tính minh bạch và Hợp pháp</h4>
                <p>
                    4.1. Cả hai bên cam kết tuân thủ các quy định pháp luật liên quan đến bảo trợ và hỗ trợ trẻ em.
                    <br />
                    4.2. Mọi thông tin về chiến dịch, số tiền giải ngân và các hoạt động triển khai sẽ được công khai và minh bạch.
                </p>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold">Điều 5: Hiệu lực Hợp đồng</h4>
                <p>
                    5.1. Hợp đồng này có hiệu lực từ ngày ký và kéo dài cho đến khi chiến dịch hoàn thành và các nghĩa vụ bảo lãnh của Bên B kết thúc.
                    <br />
                    5.2. Hợp đồng sẽ chấm dứt khi mọi nghĩa vụ của Bên A và Bên B được hoàn tất hoặc theo sự thỏa thuận giữa hai bên.
                </p>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold">Điều 6: Điều khoản Chấm dứt</h4>
                <p>
                    6.1. Hợp đồng có thể chấm dứt sớm nếu một trong hai bên vi phạm nghiêm trọng các điều khoản trong hợp đồng.
                    <br />
                    6.2. Bất kỳ tranh chấp nào phát sinh sẽ được giải quyết thông qua thương lượng giữa hai bên. Nếu không thể đạt được thỏa thuận, vụ việc sẽ được đưa ra tòa án có thẩm quyền.
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
    const sigCanvas = useRef({});
    const [partyB, setPartyB] = useState({});
    const contractRef = useRef(null);
    const [pdfLoading, setPdfLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            idNumber: "",
            phoneNumber: "",
            birthDate: null,
            idIssueDate: null,
            idIssuePlace: "",
            address: "",
        },
    });
    const handleClear = () => {
        sigCanvas.current.clear();
        setSignature(null);
    };

    const handleSave = () => {
        setSignature(sigCanvas.current.toDataURL());
    };

    const onSubmit = (data) => {
        const formattedData = {
            ...data,
            birthYear: data.birthDate ? data.birthDate.getFullYear().toString() : '',
            idIssueDate: data.idIssueDate ? data.idIssueDate.toLocaleDateString('vi-VN') : '',
        };
        setPartyB(formattedData);
        handleSave();
    };
    const generatePDF = async () => {
        setPdfLoading(true);
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

        pdf.save('contract.pdf');
        setPdfLoading(false);
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
            <div className="w-full lg:w-1/3 p-4 bg-white shadow-md font-sans">
                <h2 className="text-xl font-bold mb-4 text-center">Điền thông tin hợp đồng</h2>
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
                        />
                        <h2 className="font-semibold mb-2">Ký tên</h2>
                        <div className="border-2 border-gray-300 rounded-lg mb-4">
                            <SignatureCanvas
                                ref={sigCanvas}
                                canvasProps={{ width: 300, height: 150 }}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Button className="flex-1 border-2 border-[#faa099] text-[#e7726a] bg-white hover:bg-red-600 hover:text-white rounded-lg"
                                type="button" onClick={handleClear}>
                                <Trash className="h-4 w-4 mr-2" /> Xóa
                            </Button>
                            <Button className="flex-1 border-2 border-[#9faef5] text-[#9faef5] bg-white hover:bg-blue-600 hover:text-white rounded-lg"
                                type="submit">
                                <Save className="h-4 w-4 mr-2" /> Lưu
                            </Button>
                            <Button className="flex-1 border-2 border-[#44887d] text-[#44887d] bg-white hover:bg-green-600 hover:text-white rounded-lg"
                                onClick={generatePDF} disabled={pdfLoading}>
                                <Download className="h-4 w-4 mr-2" />
                                {pdfLoading ? 'Đang tạo PDF...' : 'Tải PDF'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default ContractViewAndSign;