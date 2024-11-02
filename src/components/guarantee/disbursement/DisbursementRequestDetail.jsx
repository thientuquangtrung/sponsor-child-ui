import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'; 
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LoadingScreen from '@/components/common/LoadingScreen';
import { Calendar, CalendarDays, CircleDollarSign, Pill, Undo2 } from 'lucide-react';
import { useGetDisbursementRequestByGuaranteeIdQuery } from '@/redux/guarantee/disbursementRequestApi';

export default function DisbursementRequestDetail({ hasRequestBeenSent }) {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const guaranteeID = user?.userID;
    const {
        data: disbursementRequests = [],
        isLoading,
        error,
    } = useGetDisbursementRequestByGuaranteeIdQuery(guaranteeID);

    const [searchParams] = useSearchParams();
    const stageID = searchParams.get('stageID');

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">Đã có lỗi khi tải dữ liệu</div>;
    }

    const disbursementRequest = disbursementRequests.find(request => request.disbursementStage.stageID === stageID);

    if (!disbursementRequest) {
        return <div className="text-center py-4 text-red-500">Không tìm thấy yêu cầu giải ngân cho giai đoạn này.</div>;
    }

    return (
        <div className="w-full mx-auto p-6 space-y-8 border rounded-lg shadow-lg bg-gray-50 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-center text-secondary font-serif">
                Tạo yêu cầu giải ngân cho chiến dịch {disbursementRequest.campaign.title}
            </h2>

            <div className="flex flex-wrap justify-center w-full">
                <div className="space-y-4 w-full md:w-1/2 my-8 flex flex-col items-center">
                    <div className="flex space-x-2 items-center">
                        <h3 className="text-xl font-semibold">Đợt giải ngân:</h3>
                        <Badge className="w-6 h-6 p-2">{disbursementRequest.disbursementStage.stageNumber}</Badge>
                    </div>
                    <div className="flex items-center">
                        <CircleDollarSign className="mr-2 h-5 w-5 text-teal-500" />
                        <p>Số tiền giải ngân:</p>
                        <span className="ml-2 text-teal-500 font-semibold">
                            {disbursementRequest.disbursementStage.disbursementAmount.toLocaleString('vi-VN')} VND
                        </span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5 text-teal-500" />
                        <p>Ngày yêu cầu giải ngân:</p>
                        <span className="ml-2 text-teal-500 font-semibold">
                            {new Date(disbursementRequest.disbursementStage.scheduledDate).toLocaleDateString('vi-VN')}
                        </span>
                    </div>
                </div>

                <div className="w-full md:w-1/2 flex flex-col items-center my-8">
                    <h3 className="text-xl font-semibold mb-4">Thông tin hoạt động</h3>
                    {disbursementRequest.activities.map((activity) => (
                        <div key={activity.activityID} className="space-y-4">
                            <div className="flex items-center">
                                <Pill className="mr-2 h-5 w-5 text-teal-500" />
                                <p>Mục đích sử dụng:</p>
                                <span className="ml-2 text-teal-500 font-semibold">{activity.description}</span>
                            </div>
                            <div className="flex items-center">
                                <CalendarDays className="mr-2 h-5 w-5 text-teal-500" />
                                <p>Ngày hoạt động:</p>
                                <span className="ml-2 text-teal-500 font-semibold">
                                    {new Date(activity.activityDate).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-[70%] space-y-4 border rounded-lg p-6 bg-white shadow-md flex flex-col items-center justify-center mx-auto">
                <h3 className="text-xl font-semibold mb-4">Thông tin nhận giải ngân</h3>
                <div className="space-y-4 w-full px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Label className="text-md font-medium" htmlFor="bankName">
                            Tên ngân hàng:
                        </Label>
                        <Input
                            type="text"
                            id="bankName"
                            name="bankName"
                            value={disbursementRequest.bankName}
                            className="w-full p-2 border rounded-md"
                            disabled={hasRequestBeenSent}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Label className="text-md font-medium" htmlFor="bankAccountNumber">
                            Số tài khoản ngân hàng:
                        </Label>
                        <Input
                            type="text"
                            id="bankAccountNumber"
                            name="bankAccountNumber"
                            value={disbursementRequest.bankAccountNumber}
                            className="w-full p-2 border rounded-md"
                            disabled={hasRequestBeenSent}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Label className="text-md font-medium" htmlFor="fullname">
                            Tên tài khoản ngân hàng:
                        </Label>
                        <Input
                            type="text"
                            id="bankAccountName"
                            name="bankAccountName"
                            value={disbursementRequest.bankAccountName}
                            className="w-full p-2 border rounded-md"
                            disabled={hasRequestBeenSent}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center">
                <p className="text-center text-green-500 font-semibold mt-4">
                    Yêu cầu giải ngân đã được gửi thành công!
                </p>
                <Button
                    variant="outline"
                    onClick={() => navigate(`/guarantee/disbursement-requests`)}
                    className="mt-4 text-teal-600 border-teal-600 hover:bg-normal hover:text-teal-600"
                >
                    <Undo2 className="mr-2 h-4 w-4" />
                    Trở lại
                </Button>
            </div>
            
        </div>
    );
}
