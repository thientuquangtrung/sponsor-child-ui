import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LoadingScreen from '@/components/common/LoadingScreen';
import { Calendar, CalendarDays, CircleDollarSign, CircleFadingPlus, Pill, Undo2 } from 'lucide-react';
import {
    useCanCreateDisbursementRequestQuery,
    useGetDisbursementRequestByIdQuery,
} from '@/redux/guarantee/disbursementRequestApi';
import { useCanCreateDisbursementReportQuery } from '@/redux/guarantee/disbursementReportApi';

export default function DisbursementRequestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: disbursementRequests = [], isLoading, error } = useGetDisbursementRequestByIdQuery(id);
    const stageID = disbursementRequests?.disbursementStage?.stageID;
    const { data: canCreateRequest } = useCanCreateDisbursementRequestQuery(stageID);
    const { data: canCreateReport } = useCanCreateDisbursementReportQuery(stageID);
    const hasRequestBeenSent = canCreateRequest?.canCreate === false;
    const hasReportBeenSent = canCreateReport?.canCreate === false;

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">Đã có lỗi khi tải dữ liệu</div>;
    }

    return (
        <div className="w-full mx-auto p-6 space-y-8 border rounded-lg shadow-lg bg-gray-50 flex flex-col">
            <h2 className="text-2xl font-bold text-center text-secondary font-serif">
                Yêu cầu giải ngân cho chiến dịch {disbursementRequests.campaign.title}
            </h2>

            <div className="flex flex-col md:flex-row w-full gap-6 p-6 bg-gray-100 rounded-lg shadow-md">
                <div className="w-full md:w-1/3 space-y-4 p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2">
                        <h3 className="text-xl font-semibold">Đợt giải ngân:</h3>
                        <Badge className="bg-teal-100 text-teal-700 px-3 py-1 rounded-md">
                            {disbursementRequests.disbursementStage.stageNumber}
                        </Badge>
                    </div>
                    <div className="flex items-center">
                        <CircleDollarSign className="mr-2 h-5 w-5 text-teal-500" />
                        <p className="text-gray-700">Số tiền giải ngân:</p>
                        <span className="ml-2 text-teal-600 font-semibold">
                            {disbursementRequests.disbursementStage.disbursementAmount.toLocaleString('vi-VN')} VND
                        </span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5 text-teal-500" />
                        <p className="text-gray-700">Ngày yêu cầu giải ngân:</p>
                        <span className="ml-2 text-teal-600 font-semibold">
                            {new Date(disbursementRequests.disbursementStage.scheduledDate).toLocaleDateString('vi-VN')}
                        </span>
                    </div>
                </div>

                <div className="w-full md:w-1/3 space-y-4 p-4 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">Thông tin hoạt động</h3>
                    {disbursementRequests.activities.map((activity) => (
                        <div key={activity.activityID} className="space-y-2">
                            <div className="flex items-center">
                                <Pill className="mr-2 h-5 w-5 text-teal-500" />
                                <p className="text-gray-700">Mục đích sử dụng:</p>
                                <span className="ml-2 text-teal-600 font-semibold">{activity.description}</span>
                            </div>
                            <div className="flex items-center">
                                <CalendarDays className="mr-2 h-5 w-5 text-teal-500" />
                                <p className="text-gray-700">Ngày hoạt động:</p>
                                <span className="ml-2 text-teal-600 font-semibold">
                                    {new Date(activity.activityDate).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full md:w-1/3 space-y-4 p-4 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-2">Thông tin nhận giải ngân</h3>
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <Label htmlFor="bankName" className="text-gray-600 font-medium">
                                Tên ngân hàng:
                            </Label>
                            <Input
                                type="text"
                                id="bankName"
                                name="bankName"
                                value={disbursementRequests.bankName}
                                className="mt-1 p-2 border rounded-md text-gray-800"
                                disabled
                            />
                        </div>

                        <div className="flex flex-col">
                            <Label htmlFor="bankAccountNumber" className="text-gray-600 font-medium">
                                Số tài khoản ngân hàng:
                            </Label>
                            <Input
                                type="text"
                                id="bankAccountNumber"
                                name="bankAccountNumber"
                                value={disbursementRequests.bankAccountNumber}
                                className="mt-1 p-2 border rounded-md text-gray-800"
                                disabled
                            />
                        </div>

                        <div className="flex flex-col">
                            <Label htmlFor="bankAccountName" className="text-gray-600 font-medium">
                                Tên tài khoản ngân hàng:
                            </Label>
                            <Input
                                type="text"
                                id="bankAccountName"
                                name="bankAccountName"
                                value={disbursementRequests.bankAccountName}
                                className="mt-1 p-2 border rounded-md text-gray-800"
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-row  justify-between items-center">
                <Button
                    variant="outline"
                    onClick={() => navigate(`/guarantee/disbursement-requests`)}
                    className="mt-4 text-teal-600 border-teal-600 hover:bg-normal hover:text-teal-600"
                >
                    <Undo2 className="mr-2 h-4 w-4" />
                    Trở lại
                </Button>
                {disbursementRequests.requestStatus === 0 ? (
                    <p className="text-center text-blue-500 font-semibold mt-4 italic">
                        Yêu cầu giải ngân đang chờ duyệt!
                    </p>
                ) : disbursementRequests.requestStatus === 1 ? (
                    <p className="text-center text-green-500 font-semibold mt-4 italic">
                        Yêu cầu giải ngân đã được duyệt!
                    </p>
                ) : disbursementRequests.requestStatus === 2 ? (
                    <p className="text-center text-red-500 font-semibold mt-4 italic">
                        Yêu cầu giải ngân đã bị từ chối!
                    </p>
                ) : null}
            </div>

            {!hasRequestBeenSent && (
                <div className="flex justify-end pb-4">
                    <div className="h-auto w-[220px] bg-gradient-to-r from-teal-500 via-gray-400 to-rose-300 p-[2px] rounded-md">
                        <Button
                            onClick={() => navigate(`/guarantee/create-disbursement-request?stageID=${stageID}`)}
                            className="bg-white text-black text-md font-semibold rounded-md flex items-center space-x-2 h-full w-full hover:bg-normal"
                        >
                            <CircleFadingPlus className="mr-2 h-4 w-4" />
                            Tạo yêu cầu giải ngân mới
                        </Button>
                    </div>
                </div>
            )}

            {!hasReportBeenSent && (
                <div className="flex justify-end pb-4">
                    <div className="h-auto w-[220px] bg-gradient-to-r from-teal-500 via-gray-400 to-rose-300 p-[2px] rounded-md">
                        <Button
                            onClick={() => navigate(`/guarantee/create-disbursement-report?stageID=${stageID}`)}
                            className="bg-white text-black text-md font-semibold rounded-md flex items-center space-x-2 h-full w-full hover:bg-normal"
                        >
                            <CircleFadingPlus className="mr-2 h-4 w-4" />
                            Tạo báo cáo cho giải ngân
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
