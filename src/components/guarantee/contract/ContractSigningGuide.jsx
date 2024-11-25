import React, { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Truck, Send } from 'lucide-react';
import { useCheckGuaranteeStatusQuery } from '@/redux/guarantee/guaranteeApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

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
    const { user } = useSelector((state) => state.auth);
    const { data: guaranteeStatus, isLoading } = useCheckGuaranteeStatusQuery(user.userID);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && (!guaranteeStatus || (guaranteeStatus.status !== 1 && guaranteeStatus.status !== 3))) {
            navigate('/');
        }
    }, [guaranteeStatus, isLoading, navigate]);

    const handleCreateNew = () => {
        navigate('/register');
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-48">Loading...</div>;
    }

    if (guaranteeStatus?.status === 3) {
        return (
            <div className="container mx-auto p-4 max-w-2xl">
                <div className="space-y-6">
                    <Alert variant="destructive" className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <AlertTitle className="text-xl font-semibold text-red-700 mb-2">
                            Yêu cầu trở thành bảo lãnh bị từ chối
                        </AlertTitle>
                        <AlertDescription className="text-red-600">
                            {guaranteeStatus.rejectionReason || "Yêu cầu bảo lãnh của bạn không được chấp nhận"}
                        </AlertDescription>
                    </Alert>

                    <div className="flex justify-center">
                        <Button
                            onClick={handleCreateNew}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                                  text-white px-8 py-3 rounded-lg shadow-lg transform transition-transform 
                                  duration-200 hover:scale-105 font-medium"
                        >
                            Tạo yêu cầu mới
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 font-sans">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Hướng dẫn thực hiện Hợp đồng tham gia Bảo lãnh Chiến dịch
            </h1>
            <ScrollArea className="h-[calc(100vh-100px)]">
                <GuideStep
                    icon={<Send className="h-6 w-6" />}
                    title="Bước 1: Gửi bản hợp đồng qua hệ thống"
                    content="Điền các thông tin và thực hiện ký trên hệ thống."
                />

                <GuideStep
                    icon={<Truck className="h-6 w-6" />}
                    title="Bước 2: Gửi bản hợp đồng có chữ ký tay qua chuyển phát"
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
                            <li>
                                Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi trước khi
                                ký kết.
                            </li>
                            <li>
                                Quá trình ký kết chỉ hoàn tất khi chúng tôi nhận được cả bản cứng và bản điện tử của hợp
                                đồng.
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </ScrollArea>
        </div>
    );
};

export default ContractSigningGuide;