import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    BadgeCheck,
    Receipt,
    Calendar,
    ChevronDown,
    ChevronUp,
    FileText,
    Webcam,
    Target
} from 'lucide-react';
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Progress
} from "@/components/ui/progress";

const Activity = () => {
    const [expandedActivities, setExpandedActivities] = useState({});

    const toggleActivity = (id) => {
        setExpandedActivities(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const activityPeriods = [
        {
            id: 1,
            title: 'Đợt bảo trợ 1',
            startDate: '01/03/2024',
            endDate: '15/03/2024',
            totalAmount: 25000000,
            usedAmount: 25000000,
            activities: [
                {
                    id: 'act-1',
                    title: 'Thanh toán học phí học kỳ 1',
                    amount: 15000000,
                    date: '05/03/2024',
                    description: 'Thanh toán học phí học kỳ 1 năm học 2024-2025',
                    status: 'Đã thanh toán',
                    attachments: [
                        { name: 'Biên lai học phí.pdf', url: '#' },
                        { name: 'Hợp đồng đào tạo.pdf', url: '#' }
                    ]
                },
                {
                    id: 'act-2',
                    title: 'Chi phí sinh hoạt tháng 3',
                    amount: 1000000,
                    date: '10/03/2024',
                    description: 'Chi phí ăn uống và sinh hoạt cơ bản',
                    status: 'Đã thanh toán',
                    attachments: [
                        { name: 'Báo cáo chi tiêu.xlsx', url: '#' }
                    ]
                }
            ]
        },
        {
            id: 2,
            title: "Đợt bảo trợ 2",
            startDate: "16/03/2024",
            endDate: "31/03/2024",
            totalAmount: 30000000,
            usedAmount: 6000000,
            activities: [
                {
                    id: "act-3",
                    title: "Mua sách vở và dụng cụ học tập",
                    amount: 3000000,
                    date: "20/03/2024",
                    description: "Mua sách vở, bút và dụng cụ học tập cho trẻ em được bảo trợ",
                    status: "Đã thanh toán",
                    attachments: [
                        { name: "Hóa đơn mua sách vở.pdf", url: "#" },
                        { name: "Ảnh dụng cụ học tập.jpg", url: "#" }
                    ]
                },
                {
                    id: "act-4",
                    title: "Phí sinh hoạt tháng 4",
                    amount: 3000000,
                    date: "25/03/2024",
                    description: "Chi phí sinh hoạt bao gồm tiền ăn uống, điện nước cho trẻ em được bảo trợ trong tháng 4/2024",
                    status: "Đã thanh toán",
                    attachments: [
                        { name: "Biên nhận phí sinh hoạt.pdf", url: "#" }
                    ]
                }
            ]
        }

    ];

    return (
        <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Tổng quan hoạt động</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activityPeriods.map(period => (
                        <Card key={`summary-${period.id}`} className="overflow-hidden border-none shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-4 mb-4">
                                    <div className="p-3 bg-teal-50 rounded-xl">
                                        <Target className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">{period.title}</h3>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <Calendar className="w-4 h-4" />
                                            <span>{period.startDate} - {period.endDate}</span>
                                        </div>
                                    </div>
                                </div>
                                <Progress
                                    value={(period.usedAmount / period.totalAmount) * 100}
                                    className="h-2 mb-4 "
                                />
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <span className="text-teal-500 block mb-1 font-semibold">Đã chi</span>
                                        <span className="text-teal-500 font-semibold">
                                            {period.usedAmount.toLocaleString()}đ
                                        </span>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <span className="text-gray-500 block mb-1">Còn lại</span>
                                        <span className="text-gray-900 font-semibold">
                                            {(period.totalAmount - period.usedAmount).toLocaleString()}đ
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-teal-100"></div>

                <div className="space-y-8">
                    {activityPeriods.map((period) => (
                        <div key={period.id} className="relative ml-12">
                            <div className="absolute -left-[44px] p-2 bg-white rounded-full border-2 border-teal-500">
                                <Webcam className="w-6 h-6 text-teal-500" />
                            </div>

                            <Card className="border-none shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <div className="flex items-center space-x-3">
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {period.title}
                                                </h3>
                                                <button
                                                    onClick={() => toggleActivity(period.id)}
                                                    className="p-1 hover:bg-teal-50 rounded-full transition-colors"
                                                >
                                                    {expandedActivities[period.id] ?
                                                        <ChevronUp className="w-5 h-5 text-teal-500" /> :
                                                        <ChevronDown className="w-5 h-5 text-teal-500" />
                                                    }
                                                </button>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>{period.startDate} - {period.endDate}</span>
                                            </div>
                                            <div className="mt-2 text-sm font-medium text-gray-700">
                                                Tổng giải ngân: {period.totalAmount.toLocaleString()}đ
                                            </div>
                                        </div>
                                        <span className="px-4 py-2 bg-teal-50 text-green-700 rounded-full text-sm font-medium">
                                            {Math.round((period.usedAmount / period.totalAmount) * 100)}% hoàn thành
                                        </span>
                                    </div>

                                    {expandedActivities[period.id] && (
                                        <div className="mt-6 space-y-4">
                                            {period.activities.map((activity) => (
                                                <div
                                                    key={activity.id}
                                                    className="border-l-2 border-teal-200 pl-4 ml-2 relative"
                                                >
                                                    <div className="absolute -left-[5px] top-3 w-2 h-2 rounded-full bg-teal-500"></div>
                                                    <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                                                            <span className="text-sm font-medium text-teal-600">
                                                                {activity.amount.toLocaleString()}đ
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                                                        <div className="flex justify-between items-center text-sm text-gray-500">
                                                            <div className="flex items-center space-x-2">
                                                                <Calendar className="w-4 h-4" />
                                                                <span>{activity.date}</span>
                                                            </div>
                                                            <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-medium">
                                                                {activity.status}
                                                            </span>
                                                        </div>
                                                        {activity.attachments.length > 0 && (
                                                            <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                                                                {activity.attachments.map((attachment, index) => (
                                                                    <a
                                                                        key={index}
                                                                        href={attachment.url}
                                                                        className="flex items-center space-x-2 text-sm text-teal-600 hover:text-teal-700 transition-colors"
                                                                    >
                                                                        <FileText className="w-4 h-4" />
                                                                        <span>{attachment.name}</span>
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </ScrollArea>
    );
};

export default Activity;