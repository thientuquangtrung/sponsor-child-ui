import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Gift, Image } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetPhysicalDonationsByUserAndVisitQuery } from '@/redux/physicalDonations/physicalDonationApi';
import { giftStatus } from '@/config/combobox';

const getStatusText = (status) => {
    const statusItem = giftStatus.find(item => item.value === status);
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

const GiftHistoryCard = ({
    visitId,
    userId,
}) => {
    const { data: giftData } = useGetPhysicalDonationsByUserAndVisitQuery({
        userId,
        visitId
    });

    if (!giftData || giftData.length === 0) {
        return (
            <Card className="mt-6">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center space-x-2 text-gray-500">
                        <Gift className="w-5 h-5" />
                        <span>Chưa có lịch sử tặng quà</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const sortedGifts = [...giftData].sort((a, b) =>
        new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    return (
        <Card className="mt-6">
            <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Gift className="w-5 h-5 text-rose-500" />
                    <h3 className="font-medium text-gray-900">Lịch sử tặng quà của bạn</h3>
                </div>
                <ScrollArea className="h-[240px]">
                    <div className="space-y-4">
                        {sortedGifts.map((gift, index) => (
                            <div key={gift.id}>
                                <div className="p-4 rounded-lg bg-gradient-to-r from-teal-50 to-rose-50 hover:from-teal-100 hover:to-rose-100 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-gray-700 mb-2">
                                                Cảm ơn bạn đã quyên góp <span className="font-medium">{gift.amount} {gift.unit}</span> {gift.giftType}{' '}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">{getStatusText(gift.giftStatus)}  vào ngày: {formatDateTime(gift.updatedAt)}
                                                </span>
                                            </p>

                                            {gift.proofOfDonation && (
                                                <a
                                                    href={gift.proofOfDonation}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-teal-600 hover:text-teal-800 mt-2"
                                                >
                                                    <Image className="w-4 h-4 mr-1" />
                                                    <span className="text-sm">Đã nhận được quà</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {index < sortedGifts.length - 1 && (
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

export default GiftHistoryCard;