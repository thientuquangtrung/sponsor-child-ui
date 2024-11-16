import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LoadingScreen from '@/components/common/LoadingScreen';
import { AlertCircle, Calendar, CircleDollarSign, Plus, Undo2, User } from 'lucide-react';
import { useGetDisbursementRequestByIdSimplifiedQuery } from '@/redux/guarantee/disbursementRequestApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import UpdateDisbursementRequest from './UpdateDisbursementRequest';
import UploadDisbursementReport from './UploadDisbursementReport';
import DisbursementReportDetail from './DisbursementReportDetail';

const getPlanStatus = (status) => {
    const statuses = {
        0: 'Đã lên lịch',
        1: 'Đang xử lý',
        2: 'Đã hoàn thành',
        3: 'Thất bại',
        4: 'Đã hủy',
        5: 'Đã thay thế',
    };
    return statuses[status] || 'Không xác định';
};

export default function DisbursementRequestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: disbursementRequests, isLoading, error, refetch } = useGetDisbursementRequestByIdSimplifiedQuery(id);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">Đã có lỗi khi tải dữ liệu</div>;
    }

    if (!disbursementRequests) {
        return <div className="text-center py-4 text-gray-500">Không có dữ liệu nào để hiển thị</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold text-center text-teal-500 font-serif pb-8">
                Yêu cầu giải ngân cho chiến dịch {disbursementRequests.campaigns.title}
            </h2>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="py-6 text-2xl font-semibold text-center">Lịch trình dự kiến các đợt giải ngân</h3>
                <div className="relative mt-4">
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-gray-300"></div>

                    {disbursementRequests.disbursementPlan.disbursementStages
                        ?.slice()
                        .sort((a, b) => a.stageNumber - b.stageNumber)
                        .map((stage, index) => (
                            <div
                                key={stage.stageID}
                                className={`flex justify-between items-center w-full mb-8 ${
                                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                                }`}
                            >
                                <div className="w-5/12">
                                    <div className="bg-white p-6 rounded shadow-lg">
                                        <h3 className="text-lg font-semibold text-black">
                                            Đợt giải ngân {stage.stageNumber} - Ngày{' '}
                                            {new Date(stage.scheduledDate).toLocaleDateString('vi-VN')}
                                        </h3>
                                        <p className="mt-2 text-gray-600 font-semibold">
                                            Số tiền giải ngân:
                                            <span className="mt-2 ml-2 text-md font-bold text-rose-400">
                                                {stage.disbursementAmount.toLocaleString('vi-VN')} VND
                                            </span>
                                        </p>
                                        <p className="mt-2 text-black">
                                            Trạng thái:{' '}
                                            <span
                                                className={`font-semibold ${
                                                    stage.status === 0
                                                        ? 'text-yellow-500'
                                                        : stage.status === 1
                                                        ? 'text-blue-500'
                                                        : stage.status === 2
                                                        ? 'text-green-600'
                                                        : stage.status === 3
                                                        ? 'text-red-500'
                                                        : stage.status === 4
                                                        ? 'text-gray-500'
                                                        : stage.status === 5
                                                        ? 'text-purple-500'
                                                        : 'text-black'
                                                }`}
                                            >
                                                {getPlanStatus(stage.status)}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute w-8 h-8 bg-yellow-500 rounded-full left-1/2 transform -translate-x-1/2"></div>
                                </div>
                                <div className="w-5/12"></div>
                            </div>
                        ))}
                </div>
            </div>

            {disbursementRequests.isEarlyRequest && (
                <div className="flex items-center gap-2 bg-yellow-50 p-4 border-b">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <p className="text-sm text-yellow-700">Đây là yêu cầu giải ngân sớm hơn so với ngày dự kiến</p>
                </div>
            )}

            <div className="w-full mx-auto p-4 space-y-4 flex flex-col bg-white rounded-lg shadow-lg mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-6">
                    <div className="space-y-4 flex flex-col border rounded-lg shadow-md bg-white">
                        <div className="flex justify-center bg-red-100 p-3 rounded-t-lg">
                            <h3 className="text-lg font-semibold text-gray-800">Đợt giải ngân:</h3>
                            <Badge className="flex items-center ml-2 justify-center w-6 h-6 text-white bg-teal-500 rounded-full shadow-inner">
                                {disbursementRequests.disbursementStage.stageNumber}
                            </Badge>
                        </div>
                        <div className="space-y-4 p-4 rounded-b-lg">
                            <div className="flex items-center">
                                <div className="flex items-center w-1/2">
                                    <User className="mr-2 h-5 w-5 text-teal-500" />
                                    <p className="text-gray-700 font-medium">Nhà Bảo Lãnh:</p>
                                </div>
                                <p className="text-teal-500 font-medium w-1/2">
                                    {disbursementRequests.guarantee?.fullname}
                                </p>
                            </div>
                            {disbursementRequests?.disbursementStage?.actualDisbursementAmount &&
                                disbursementRequests?.disbursementStage?.disbursementAmount &&
                                disbursementRequests.disbursementStage.actualDisbursementAmount -
                                    disbursementRequests.disbursementStage.disbursementAmount >
                                    0 && (
                                    <div className="flex items-center">
                                        <div className="flex items-center w-1/2">
                                            <CircleDollarSign className="mr-2 h-5 w-5 text-teal-500" />
                                            <p className="text-gray-700 font-medium">Số tiền giải ngân đợt trước:</p>
                                        </div>
                                        <p className="text-teal-500 font-medium w-1/2">
                                            {(
                                                disbursementRequests.disbursementStage.actualDisbursementAmount -
                                                disbursementRequests.disbursementStage.disbursementAmount
                                            ).toLocaleString('vi-VN')}{' '}
                                            VNĐ
                                        </p>
                                    </div>
                                )}
                            <div className="flex items-center">
                                <div className="flex items-center w-1/2">
                                    <CircleDollarSign className="mr-2 h-5 w-5 text-teal-500" />
                                    <p className="text-gray-700 font-medium">
                                        Số tiền giải ngân đợt {disbursementRequests?.disbursementStage?.stageNumber}:
                                    </p>
                                </div>
                                <p className="text-teal-500 font-medium w-1/2">
                                    {disbursementRequests?.disbursementStage?.disbursementAmount?.toLocaleString(
                                        'vi-VN',
                                    )}{' '}
                                    VNĐ
                                </p>
                            </div>

                            <div className="flex items-center">
                                <div className="flex items-center w-1/2">
                                    <CircleDollarSign className="mr-2 h-5 w-5 text-teal-500" />
                                    <p className="text-gray-700 font-medium">Số tiền yêu cầu giải ngân:</p>
                                </div>
                                <p className="text-teal-500 font-medium w-1/2">
                                    {disbursementRequests?.disbursementStage?.actualDisbursementAmount?.toLocaleString(
                                        'vi-VN',
                                    )}{' '}
                                    VNĐ
                                </p>
                            </div>

                            <div className="flex items-center">
                                <div className="flex items-center w-1/2">
                                    <Calendar className="mr-2 h-5 w-5 text-teal-500" />
                                    <p className="text-gray-700 font-medium">Ngày dự kiến giải ngân:</p>
                                </div>
                                <p className="text-teal-500 font-medium w-1/2">
                                    {new Date(disbursementRequests.disbursementStage.scheduledDate).toLocaleDateString(
                                        'vi-VN',
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 border rounded-lg shadow-md bg-white">
                        <h3 className="text-lg font-semibold text-gray-800 bg-red-100 p-3 rounded-t-lg text-center">
                            Thông tin nhận giải ngân
                        </h3>
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4 items-center">
                                <Label htmlFor="bankName" className="text-gray-800">
                                    Tên ngân hàng:
                                </Label>
                                <Input
                                    type="text"
                                    id="bankName"
                                    name="bankName"
                                    value={disbursementRequests.bankName}
                                    className="p-2 border rounded-md bg-white"
                                    disabled
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 items-center">
                                <Label htmlFor="bankAccountNumber" className="text-gray-800">
                                    Số tài khoản ngân hàng:
                                </Label>
                                <Input
                                    type="text"
                                    id="bankAccountNumber"
                                    name="bankAccountNumber"
                                    value={disbursementRequests.bankAccountNumber}
                                    className="p-2 border rounded-md bg-white"
                                    disabled
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 items-center">
                                <Label htmlFor="bankAccountName" className="text-gray-800">
                                    Tên tài khoản ngân hàng:
                                </Label>
                                <Input
                                    type="text"
                                    id="bankAccountName"
                                    name="bankAccountName"
                                    value={disbursementRequests.bankAccountName}
                                    className="p-2 border rounded-md bg-white"
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {disbursementRequests.requestStatus === 3 ? (
                    <UpdateDisbursementRequest disbursementRequest={disbursementRequests} />
                ) : disbursementRequests.requestStatus === 4 ? (
                    <UploadDisbursementReport disbursementRequest={disbursementRequests} />
                ) : disbursementRequests.requestStatus === 5 ? (
                    <DisbursementReportDetail disbursementRequest={disbursementRequests} />
                ) : (
                    <div>
                        <h3 className="text-xl text-center font-semibold mb-6">Kế hoạch phân bổ nguồn tiền</h3>
                        <div className="overflow-x-auto">
                            <Table className="border-collapse border-solid-2 border-slate-500 w-full bg-white shadow-lg rounded-lg overflow-hidden">
                                <TableHeader className="bg-gradient-to-l from-rose-100 to-teal-100 border-b border-slate-500">
                                    <TableRow>
                                        <TableHead className="border border-slate-300 text-center py-2 text-black">
                                            Mô tả hoạt động
                                        </TableHead>
                                        <TableHead className="border border-slate-300 text-center py-2 text-black">
                                            Dự kiến số tiền
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {disbursementRequests?.disbursementReports
                                        ?.filter((report) => report.isCurrent)
                                        .flatMap((report) =>
                                            report.disbursementReportDetails.map((detail) => (
                                                <TableRow
                                                    key={detail.id}
                                                    className="hover:bg-gray-50 border-b border-gray-200 text-center"
                                                >
                                                    <TableCell className="p-3 border border-slate-300">
                                                        {detail.itemDescription || 'Không có mô tả'}
                                                    </TableCell>
                                                    <TableCell className="p-3 border border-slate-300 text-teal-500 font-semibold">
                                                        {detail.amountSpent?.toLocaleString('vi-VN') + ' VNĐ'}
                                                    </TableCell>
                                                </TableRow>
                                            )),
                                        )}
                                    {disbursementRequests?.disbursementReports?.every(
                                        (report) => !report.isCurrent,
                                    ) && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={2}
                                                className="px-6 py-4 text-center text-gray-500 border-t border-gray-200"
                                            >
                                                Không có chi tiết báo cáo hiện tại
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}

                <div className="flex flex-row justify-between items-center">
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
                            Yêu cầu giải ngân đang chờ phê duyệt!
                        </p>
                    ) : disbursementRequests.requestStatus === 1 ? (
                        <p className="text-center text-green-500 font-semibold mt-4 italic">
                            Yêu cầu giải ngân đã được duyệt!
                        </p>
                    ) : disbursementRequests.requestStatus === 2 ? (
                        <div className="flex flex-col items-center">
                            <p className="text-center text-red-500 font-semibold mt-4 italic">
                                Yêu cầu giải ngân đã bị từ chối!
                            </p>
                            <p className="text-center text-red-500 mt-2">
                                (Lý do: {disbursementRequests.rejectionReason})
                            </p>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    navigate(
                                        `/guarantee/create-disbursement-request?stageID=${disbursementRequests.disbursementStage.stageID}`,
                                    )
                                }
                                className="mt-4 text-teal-600 border-teal-600 hover:bg-normal hover:text-teal-600"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Tạo yêu cầu giải ngân mới
                            </Button>
                        </div>
                    ) : disbursementRequests.requestStatus === 4 ? (
                        <p className="text-center text-black font-semibold mt-4 italic">
                            Yêu cầu bổ sung minh chứng sử dụng tiền!
                        </p>
                    ) : disbursementRequests.requestStatus === 5 ? (
                        <p className="text-center text-green-500 font-semibold mt-4 italic">
                            Đã hoàn thành giải ngân đợt {disbursementRequests.disbursementStage.stageNumber}!
                        </p>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
