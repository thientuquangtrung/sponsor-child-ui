import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';

const ContractSentConfirmation = () => {
    const navigate = useNavigate();

    const handleNavigateHome = () => {
        navigate('/');
    };

    return (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-xl shadow-lg max-w-3xl mx-auto my-8 border border-green-200">
            <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">Cảm ơn bạn đã hoàn thành quá trình ký và gửi hợp đồng!</h2>
            <div className="bg-white p-6 rounded-lg shadow-inner">
                <p className="text-gray-700 mb-6 text-lg">Chúng tôi sẽ xem xét và liên hệ với bạn trong thời gian sớm nhất.</p>
                <p className="font-semibold text-xl text-green-500 mb-4">Các bước tiếp theo:</p>
                <ul className="space-y-3">
                    <li className="flex items-start">
                        <CheckCircle className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">Chúng tôi sẽ xem xét hợp đồng của bạn trong vòng 3-5 ngày làm việc.</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">Bạn sẽ nhận được email xác nhận khi hợp đồng được chấp nhận.</span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">Nếu cần bổ sung thông tin, chúng tôi sẽ liên hệ qua email hoặc số điện thoại bạn đã cung cấp.</span>
                    </li>
                </ul>
            </div>
            <div className="mt-8 text-center">
                <Button
                    variant="default"
                    size="lg"
                    onClick={handleNavigateHome}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                >
                    Quay lại Trang chủ
                </Button>
            </div>
        </div>
    );
};

export default ContractSentConfirmation;