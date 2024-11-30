import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCreatePhysicalDonationMutation } from '@/redux/physicalDonations/physicalDonationApi';
import { donationType } from '@/config/combobox';
import MonetaryDonationForm from './MonetaryDonationForm';
import PhysicalDonationForm from './PhysicalDonationForm';
import { Gift, CreditCard } from 'lucide-react';

const GiftRegistration = ({
    isOpen,
    onClose,
    visitId,
    userId,
    giftRequestDetails
}) => {
    const [selectedDonationType, setSelectedDonationType] = useState(null);
    const [createPhysicalDonation, { isLoading }] = useCreatePhysicalDonationMutation();

    const handleDonationTypeSelect = (type) => {
        setSelectedDonationType(type);
    };

    const handleClose = () => {
        setSelectedDonationType(null);
        onClose();
    };

    const renderDonationTypeSelection = () => {
        const iconMap = {
            0: Gift,
            1: CreditCard
        };

        return (
            <div className="space-y-4">

                <div className="bg-teal-50 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-rose-400 mb-3">
                        Chính Sách
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                            <span>
                                Người dùng <strong>không thể tự hủy</strong> khi đã
                                <strong> "tặng quà".</strong>
                            </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span>
                                Trong trường hợp chuyến thăm bị hủy, bạn có thể lựa chọn:
                                <ul className="pl-5 list-disc space-y-1 mt-1">
                                    <li>Bạn được quyền hoàn lại toàn bộ số tiền đã đóng góp.</li>
                                    <li>Bạn có thể đóng góp số tiền này vào quỹ chung để tiếp tục hỗ trợ các hoạt động khác.</li>
                                </ul>
                            </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span>
                                Đối với phương thức "Đăng ký tặng vật phẩm", bạn vui lòng xác nhận kỹ thông tin trước khi đăng ký.
                                Quá trình này không thể chỉnh sửa sau khi đã xác nhận.
                            </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span>
                                Đối với phương thức "Mua quà hộ", bạn đóng góp bằng cách thanh toán và chúng tôi
                                sẽ sử dụng số tiền này để mua quà phù hợp với giá trị đóng góp của bạn.
                            </span>
                        </li>
                    </ul>
                </div>
                <h2 className="text-xl font-bold text-center"> Chọn phương thức hỗ trợ phù hợp với bạn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {donationType.map((type) => {
                        const Icon = iconMap[type.value];
                        return (
                            <Button
                                key={type.value}
                                variant="outline"
                                className="h-24 flex flex-col items-center justify-center space-y-2 hover:bg-rose-400 hover:text-white border-2 border-rose-200 transition-colors"
                                onClick={() => handleDonationTypeSelect(type.value)}
                            >
                                {Icon && <Icon className="w-8 h-8 text-rose-600" />}
                                <div className="text-center">
                                    <h3 className="font-semibold">{type.label}</h3>
                                    <p className="text-sm">
                                        {type.value === 0
                                            ? "Bạn có thể đăng ký tặng các vật phẩm cần thiết"
                                            : "Bạn có thể đóng góp bằng cách thanh toán"
                                        }
                                    </p>
                                </div>
                            </Button>
                        );
                    })}
                </div>
                <div className="flex justify-end">
                    <Button
                        variant="ghost"
                        className="mt-4 bg-rose-400 text-white hover:bg-rose-500 hover:text-white"
                        onClick={handleClose}
                    >
                        Quay lại sau
                    </Button>

                </div>

            </div >
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg">
                <DialogHeader className="bg-rose-400 text-white p-6 sticky top-0 z-10">
                    <DialogTitle className="text-2xl font-bold text-center">
                        Đăng ký tặng quà
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6">
                    {selectedDonationType === null ? (
                        renderDonationTypeSelection()
                    ) : selectedDonationType === 0 ? (
                        <PhysicalDonationForm
                            giftRequestDetails={giftRequestDetails}
                            userId={userId}
                            visitId={visitId}
                            onClose={handleClose}
                            isLoading={isLoading}
                            createPhysicalDonation={createPhysicalDonation}
                            onBack={() => setSelectedDonationType(null)}
                        />
                    ) : (
                        <MonetaryDonationForm
                            giftRequestDetails={giftRequestDetails}
                            userId={userId}
                            visitId={visitId}
                            onClose={handleClose}
                            isLoading={isLoading}
                            createPhysicalDonation={createPhysicalDonation}
                            onBack={() => setSelectedDonationType(null)}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GiftRegistration;