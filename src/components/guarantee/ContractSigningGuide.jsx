import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Truck, Send, Download } from 'lucide-react';

const GuideStep = ({ icon, title, content }) => (
    <Card className="mb-4">
        <CardHeader>
            <CardTitle className="flex items-center">
                {icon}
                <span className="ml-2">{title}</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p>{content}</p>
        </CardContent>
    </Card>
);

const ContractSigningGuide = () => {
    return (
        <div className="container mx-auto p-4 font-sans">
            <h1 className="text-2xl font-bold mb-6 text-center">Hướng dẫn thực hiện Hợp đồng tham gia Bảo lãnh Chiến dịch</h1>
            <ScrollArea className="h-[calc(100vh-100px)]">
                <GuideStep
                    icon={<Download className="h-6 w-6" />}
                    title="Bước 1: Tải file hợp đồng"
                    content="Tải xuống bản hợp đồng từ hệ thống. Đảm bảo bạn đọc kỹ và hiểu rõ tất cả các điều khoản trước khi ký kết."
                />


                <GuideStep
                    icon={<Send className="h-6 w-6" />}
                    title="Bước 2: Gửi bản hợp đồng qua hệ thống"
                    content="Điền các thông tin và thực hiện ký trên hệ thống. Tải xuống file PDF và tiến hành gửi file này qua hệ thống."
                />
                <GuideStep
                    icon={<Truck className="h-6 w-6" />}
                    title="Bước 3: Gửi bản có chữ ký tay qua chuyển phát"
                    content="Gửi bản hợp đồng có chữ ký tay qua dịch vụ chuyển phát đến địa chỉ của chúng tôi. Đảm bảo sử dụng dịch vụ chuyển phát an toàn và có thể theo dõi."
                />
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle>Lưu ý:</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Đảm bảo thông tin cá nhân của bạn chính xác trước khi ký kết.</li>
                            <li>Giữ một bản sao của hợp đồng đã ký cho hồ sơ của bạn.</li>
                            <li>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi trước khi ký kết.</li>
                            <li>Quá trình ký kết chỉ hoàn tất khi chúng tôi nhận được cả bản cứng và bản điện tử của hợp đồng.</li>
                        </ul>
                    </CardContent>
                </Card>
            </ScrollArea>
        </div>
    );
};

export default ContractSigningGuide;