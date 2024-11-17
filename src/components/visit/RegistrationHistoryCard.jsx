import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ClipboardList } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetVisitTripRegistrationsByUserAndVisitQuery } from '@/redux/visitTripRegistration/visitTripRegistrationApi';
import { visitRegistrationStatus } from '@/config/combobox';

const getStatusDetails = (status) => {
    const statusItem = visitRegistrationStatus.find(item => item.value === status);

    switch (status) {
        case 0:
            return {
                label: statusItem.label,
                variant: "warning"
            };
        case 1:
            return {
                label: statusItem.label,
                variant: "success"
            };
        case 2:
            return {
                label: statusItem.label,
                variant: "secondary"
            };
        case 3:
            return {
                label: statusItem.label,
                variant: "destructive"
            };
        default:
            return {
                label: 'Không xác định',
                variant: "secondary"
            };
    }
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

    return (
        <Card className="mt-6">
            <CardContent className="p-6 ">
                <div className="bg-gradient-to-r from-teal-50 to-rose-50 rounded-xl" >
                    <div className="flex items-center space-x-2 mb-4 ">
                        <ClipboardList className="w-5 h-5 text-teal-500" />
                        <h3 className="font-medium text-gray-900">Lịch sử đăng ký của bạn</h3>
                    </div>

                    <ScrollArea className="h-[240px] pr-4">
                        <div className="space-y-4">
                            {registrationData.map((registration, index) => {
                                const statusDetails = getStatusDetails(registration.status);

                                return (
                                    <div key={registration.id} className="space-y-3">
                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge variant={statusDetails.variant}>
                                                    {statusDetails.label}
                                                </Badge>
                                                <span className="text-sm text-gray-700">
                                                    {formatDateTime(registration.createdAt)}
                                                </span>
                                            </div>

                                            <div className="text-sm text-gray-600">
                                                {registration.cancellationReason && (
                                                    <div className="mt-2 text-gray-700 italic">
                                                        "Lý do: {registration.cancellationReason}"
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {index < registrationData.length - 1 && (
                                            <Separator className="my-2" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    );
};

export default RegistrationHistoryCard;