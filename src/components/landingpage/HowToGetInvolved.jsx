import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Target, Share2 } from 'lucide-react';

const HowToGetInvolved = () => {
    const steps = [
        {
            icon: <UserPlus className="w-8 h-8" />,
            title: "Lập tài khoản",
            description: "Lập tài khoản minh bạch 4 số của MB Bank và tài khoản người dùng trên app Thiện Nguyện để bắt đầu sử dụng các tính năng gây quỹ minh bạch."
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: "Tạo chiến dịch",
            description: "Thiết kế, quản lý mục tiêu gây quỹ và đăng tải, cập nhật các hoạt động thiện nguyện bằng các thao tác đơn giản."
        },
        {
            icon: <Share2 className="w-8 h-8" />,
            title: "Chia sẻ chiến dịch",
            description: "Chia sẻ chiến dịch của bạn tới bạn bè, người thân và cộng đồng thông qua mạng xã hội. Đồng thời kêu gọi sự đồng hành lan tỏa chiến dịch."
        }
    ];

    return (
        <div className="container mx-auto px-4 py-12 font-sans">
            <div className="flex items-center justify-center my-8">
                <div className="border-t-2 border-teal-500 w-20"></div>
                <h1 className="text-2xl font-semibold mx-4">Làm thế nào để bắt đầu Thiện nguyện?</h1>
                <div className="border-t-2 border-teal-500 w-20"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                    <Card key={index} className="flex flex-col">
                        <CardHeader className="flex flex-col items-center">
                            <div className="rounded-full bg-secondary text-white p-3 mb-4">
                                {step.icon}
                            </div>
                            <CardTitle className="text-xl font-semibold mb-2">{step.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-gray-600">{step.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="mt-12 text-center">
                <Button size="lg" className="bg-gradient-to-l from-teal-200 to-rose-200">
                    Bắt Đầu Ngay
                </Button>
            </div>
        </div>
    );
};

export default HowToGetInvolved;
