import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ClipboardList, AlertCircle, Image } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetVisitTripRegistrationsByUserAndVisitQuery } from '@/redux/visitTripRegistration/visitTripRegistrationApi';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { visitRegistrationStatus2 } from '@/config/combobox';

const getStatusText = (status) => {
    const statusItem = visitRegistrationStatus2.find(item => item.value === status);
    return statusItem?.label || 'Không xác định';
};

const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const RegistrationHistoryCard = ({
    visitId,
    userId,
}) => {
    const { data: registrationData } = useGetVisitTripRegistrationsByUserAndVisitQuery({
        userId,
        visitId
    });

    if (!registrationData || registrationData.length === 0) {
        return (
            <Card className="mt-6">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center space-x-2 text-gray-500">
                        <ClipboardList className="w-5 h-5" />
                        <span>Chưa có lịch sử đăng ký</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const sortedRegistrations = [...registrationData].sort((a, b) =>
        new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    return (
        <Card className="mt-6">
            <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <ClipboardList className="w-5 h-5 text-teal-500" />
                    <h3 className="font-medium text-gray-900">Lịch sử đăng ký của bạn</h3>
                </div>
                <ScrollArea className="h-[240px]">
                    <div className="space-y-4">
                        {sortedRegistrations.map((registration, index) => (
                            <div key={registration.id}>
                                <div className="p-4 rounded-lg bg-gradient-to-r from-teal-50 to-rose-50 hover:from-teal-100 hover:to-rose-100 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-gray-700">
                                                Bạn <span className="font-medium text-sm">{getStatusText(registration.status)}</span> vào ngày{' '}
                                                {formatDateTime(registration.updatedAt)}
                                            </p>

                                            {registration.transferProofImageUrl && (
                                                <a
                                                    href={registration.transferProofImageUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-blue-600 hover:text-blue-800"
                                                >
                                                    <Image className="w-4 h-4 mr-1" />
                                                    <span className="text-sm">Xem minh chứng hoàn tiền</span>
                                                </a>
                                            )}
                                            {registration.cancellationReason && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger className="flex items-center text-yellow-600 text-sm">
                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                            Lý do hủy
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{registration.cancellationReason}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {index < sortedRegistrations.length - 1 && (
                                    <Separator className="my-4" />
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default RegistrationHistoryCard;