import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import LoadingScreen from '@/components/common/LoadingScreen';
import { AlertCircle, Calendar, CircleDollarSign, Home, Plus, Undo2, User } from 'lucide-react';
import {
    useCanCreateDisbursementRequestQuery,
    useGetDisbursementRequestByIdSimplifiedQuery,
} from '@/redux/guarantee/disbursementRequestApi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import UpdateDisbursementRequest from './UpdateDisbursementRequest';
import UploadDisbursementReport from './UploadDisbursementReport';
import DisbursementReportDetail from './DisbursementReportDetail';
import { useGetDisbursementStageByStageIdQuery } from '@/redux/guarantee/disbursementStageApi';
import { activityStatus, disbursementRequestStatus, disbursementStageStatus } from '@/config/combobox';
import { useSelector } from 'react-redux';
import icon from '@/assets/images/no-access.png';

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
const getStatusLabel = (status, options) => {
    const option = options.find((o) => o.value === status);
    return option ? option.label : 'Không xác định';
};

const getStatusColorClass = (status, type) => {
    switch (type) {
        case 'stage':
            switch (status) {
                case 0:
                    return 'text-yellow-600';
                case 1:
                    return 'text-blue-600';
                case 2:
                    return 'text-green-600';
                case 3:
                    return 'text-red-600';
                case 4:
                    return 'text-gray-600';
                case 5:
                    return 'text-purple-600';
                default:
                    return 'text-gray-600';
            }
        case 'request':
            switch (status) {
                case 0:
                    return 'text-yellow-600';
                case 1:
                    return 'text-green-600';
                case 2:
                    return 'text-red-600';
                case 3:
                    return 'text-orange-600';
                case 4:
                    return 'text-blue-600';
                case 5:
                    return 'text-teal-600';
                default:
                    return 'text-gray-600';
            }
        case 'activity':
            switch (status) {
                case 0:
                    return 'text-yellow-600';
                case 1:
                    return 'text-blue-600';
                case 2:
                    return 'text-green-600';
                case 3:
                    return 'text-red-600';
                default:
                    return 'text-gray-600';
            }
        default:
            return 'text-gray-600';
    }
};
export default function DisbursementRequestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        data: disbursementRequests,
        isLoading: isRequestLoading,
        error,
        refetch,
    } = useGetDisbursementRequestByIdSimplifiedQuery(id);
    const { data: createRequestStatus } = useCanCreateDisbursementRequestQuery(
        disbursementRequests?.disbursementStage?.stageID,
        {
            skip: !disbursementRequests?.disbursementStage?.stageID,
        },
    );
    const { user } = useSelector((state) => state.auth);
    const redirectToHome = () => {
        navigate('/');
    };
    if (isRequestLoading) {
        return <LoadingScreen />;
    }
    if (error) {
        return <div className="text-center py-4 text-red-500">Đã có lỗi khi tải dữ liệu</div>;
    }

    if (!disbursementRequests) {
        return <div className="text-center py-4 text-gray-500">Không có dữ liệu nào để hiển thị</div>;
    }
    if (disbursementRequests?.guarantee?.userID !== user?.userID) {
        return (
            <div className="text-center my-auto text-[36px] text-gray-500 flex flex-col items-center space-y-4">
                <img src={icon} className="w-[500px] h-[300px]" alt="No Access" />
                <p>Bạn không có quyền truy cập vào trang này.</p>
                <Button
                    onClick={redirectToHome}
                    className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 flex items-center space-x-2"
                >
                    <Home className="w-5 h-5" />
                    <span className="text-md">Quay về Trang Chủ</span>
                </Button>
            </div>
        );
    }
    return (
        <div className="p-4 flex flex-col space-y-8">
            <h2 className="text-3xl font-bold text-center text-teal-500 font-serif">
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
                                                        ? 'text-green-500'
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
            {disbursementRequests?.disbursementStage?.undisbursedStagesInfo &&
                disbursementRequests?.disbursementStage?.undisbursedStagesInfo.length > 0 && (
                    <div className="space-y-4 flex flex-col border rounded-lg shadow-lg">
                        <div className="flex space-x-2 justify-center items-center bg-gradient-to-r from-rose-100 to-gray-100 p-2 rounded-t-lg">
                            <h4 className="text-xl font-semibold text-gray-700">Thông tin các đợt giải ngân</h4>
                        </div>
                        <div className="space-y-6 p-6 rounded-b-lg">
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white rounded-lg">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                Đợt
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                ST giải ngân dự kiến
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                Ngày giải ngân dự kiến
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                ST giải ngân thực tế
                                            </th>
                                            {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                ST chưa giải ngân
                                            </th> */}
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                Ngày giải ngân thực tế
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                Trạng thái
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {[...disbursementRequests?.disbursementStage.undisbursedStagesInfo]
                                            .sort((a, b) => a.stageNumber - b.stageNumber)
                                            .map((stage) => (
                                                <tr key={stage.stageID} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center">
                                                            <Badge className="w-6 h-6 p-2 text-white bg-teal-500 rounded-full shadow-inner">
                                                                {stage.stageNumber}
                                                            </Badge>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        {stage.disbursementAmount?.toLocaleString('vi-VN')} ₫
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        <div className="flex items-center">
                                                            <Calendar className="mr-2 h-4 w-4 text-teal-400" />
                                                            {new Date(stage.scheduledDate).toLocaleDateString('vi-VN')}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        {stage.actualDisbursementAmount
                                                            ? `${stage.actualDisbursementAmount.toLocaleString(
                                                                  'vi-VN',
                                                              )} ₫`
                                                            : '0 ₫'}
                                                    </td>

                                                    {/* <td className="px-4 py-3 text-sm font-medium text-teal-600">
                                                        {stage.totalUndisbursedAmount?.toLocaleString('vi-VN')} ₫
                                                    </td> */}

                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        <div className="flex items-center">
                                                            <Calendar className="mr-2 h-4 w-4 text-teal-400" />
                                                            {new Date(stage.actualDisbursementDate).toLocaleDateString(
                                                                'vi-VN',
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={`text-sm font-medium ${getStatusColorClass(
                                                                stage.status,
                                                                'stage',
                                                            )}`}
                                                        >
                                                            {getStatusLabel(stage.status, disbursementStageStatus)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            <div className="space-y-4 flex flex-col bg-white rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-8">
                    <div className="col-span-5 space-y-4 flex flex-col border rounded-lg shadow-md bg-white">
                        <div className="flex justify-center bg-red-100 p-3 rounded-t-lg">
                            <h3 className="text-lg font-semibold text-gray-800">Đợt giải ngân:</h3>
                            <Badge className="flex items-center ml-2 justify-center w-6 h-6 text-white bg-teal-500 rounded-full shadow-inner">
                                {disbursementRequests?.disbursementStage?.stageNumber}
                            </Badge>
                        </div>
                        <div className="space-y-4">
                            <div className="flex flex-col gap-4 p-6">
                                <div className="flex items-center">
                                    <div className="flex items-center w-full">
                                        <p className="text-gray-700 font-medium">Ngày yêu cầu:</p>
                                    </div>
                                    <p className="text-teal-500 font-semibold">
                                        {new Date(disbursementRequests?.requestDate).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-6 rounded-b-lg">
                                    {/* <div className="space-y-4">
                                        <div className="flex flex-col items-end relative">
                                            <div className="flex items-center justify-between w-full">
                                                <p className="text-gray-700 font-medium">ST chưa giải ngân:</p>
                                                <span className="text-teal-600 font-semibold">
                                                    {disbursementRequests?.disbursementStage?.totalUndisbursedAmount?.toLocaleString('vi-VN')} ₫
                                                </span>
                                            </div>
                                            <span className="text-teal-600 font-semibold text-xl absolute right-36 top-2 py-1">+</span>
                                            <div className="flex items-center justify-between w-full">
                                                <p className="text-gray-700 font-medium py-3">ST giải ngân đợt {disbursementRequests?.disbursementStage?.stageNumber}:</p>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-teal-600 font-semibold border-b border-gray-400">
                                                        {disbursementRequests?.disbursementStage?.disbursementAmount?.toLocaleString('vi-VN')} ₫
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between w-full">
                                                <p className="text-gray-700 font-medium">ST giải ngân mong đợi:</p>
                                                <span className="text-teal-600 font-semibold">
                                                    {disbursementRequests?.disbursementStage?.expectedDisbursementAmount?.toLocaleString('vi-VN')} ₫
                                                </span>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="space-y-4">
                                        <div className="flex flex-col relative">
                                            <div className="flex items-center justify-between w-full">
                                                <p className="text-gray-700 font-medium">ST đã gây quỹ :</p>
                                                <span className="text-teal-600 font-semibold">
                                                    {disbursementRequests?.disbursementStage?.presentRaisedAmount?.toLocaleString(
                                                        'vi-VN',
                                                    )}{' '}
                                                    ₫
                                                </span>
                                            </div>
                                            {/* <span className="text-teal-600 font-semibold text-xl absolute right-32 top-2 py-1">-</span> */}
                                            <div className="flex items-center justify-between w-full py-3">
                                                <p className="text-gray-700 font-medium">
                                                    Tổng ST đã giải ngân đợt trước:
                                                </p>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-teal-600 font-semibold">
                                                        {disbursementRequests?.disbursementStage?.totalActualDisbursementAmount?.toLocaleString(
                                                            'vi-VN',
                                                        )}{' '}
                                                        ₫
                                                    </span>
                                                </div>
                                            </div>
                                            {/* <div className="flex justify-end -mt-2 mb-2">
                                                <div className="border-t border-gray-500 w-1/4"></div>
                                            </div> */}
                                            <div className="flex items-center justify-between w-full">
                                                <p className="text-blue-500 font-medium">
                                                    ST giải ngân mong đợi đợt này:
                                                </p>
                                                <span className="text-blue-500 font-semibold">
                                                    {disbursementRequests?.disbursementStage?.expectedDisbursementAmount?.toLocaleString(
                                                        'vi-VN',
                                                    )}{' '}
                                                    ₫
                                                </span>
                                            </div>
                                            {/* <div className="flex items-center justify-between w-full">
                                                <p className="text-gray-700 font-medium">ST còn lại của chiến dịch:</p>
                                                <span className="text-teal-600 font-semibold">
                                                    {disbursementRequests?.disbursementStage?.remainingAmount?.toLocaleString('vi-VN')} ₫
                                                </span>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                                {disbursementRequests?.disbursementStage?.commonFundAmount && (
                                    <div className="flex items-center justify-between w-full">
                                        <p className="text-teal-700 font-medium">ST được trích thêm từ quỹ chung:</p>
                                        <span className="text-teal-600 font-semibold">
                                            {disbursementRequests.disbursementStage.commonFundAmount.toLocaleString(
                                                'vi-VN',
                                            )}{' '}
                                            ₫
                                        </span>
                                    </div>
                                )}
                                {disbursementRequests.requestStatus === 4 ||
                                disbursementRequests.requestStatus === 5 ? (
                                    <div className="flex items-center justify-between w-full">
                                        <p className="text-orange-700 font-medium">ST thực tế đã giải ngân đợt này:</p>
                                        <span className="text-orange-600 font-semibold">
                                            {disbursementRequests?.disbursementStage?.actualDisbursementAmount?.toLocaleString(
                                                'vi-VN',
                                            )}{' '}
                                            ₫
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between w-full">
                                        <p className="text-orange-700 font-medium">ST thực tế có thể giải ngân:</p>
                                        <span className="text-orange-600 font-semibold">
                                            {disbursementRequests?.disbursementStage?.actualDisbursementAmount?.toLocaleString(
                                                'vi-VN',
                                            )}{' '}
                                            ₫
                                        </span>
                                    </div>
                                )}
                                {/* <div className="flex gap-4 items-center">
                                    <div className="flex items-center  w-1/2">
                                        <p className="text-blue-700 font-medium">ST Nhà Bảo Lãnh yêu cầu giải ngân:</p>
                                    </div>
                                    <span className="ml-2 text-blue-600 font-semibold w-1/2">
                                        {disbursementRequests?.offeredAmount?.toLocaleString('vi-VN')} ₫
                                    </span>
                                </div> */}
                                <div className="flex items-center justify-between w-full">
                                    <p className="text-gray-700 font-medium flex items-center">Trạng thái:</p>
                                    <p
                                        className={`font-semibold ${getStatusColorClass(
                                            disbursementRequests.requestStatus,
                                            'request',
                                        )}`}
                                    >
                                        {getStatusLabel(disbursementRequests.requestStatus, disbursementRequestStatus)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-7 space-y-4 border rounded-lg shadow-md bg-white">
                        <h3 className="text-lg font-semibold text-gray-800 bg-red-100 p-3 rounded-t-lg text-center">
                            Thông tin nhận giải ngân
                        </h3>
                        <div className="grid grid-cols-3 gap-4 px-4">
                            <p className="text-gray-700 font-medium col-span-1">Nhà Bảo Lãnh:</p>
                            <span className="text-teal-600 font-semibold w-1/2 col-span-2">
                                {disbursementRequests?.guarantee?.fullname}
                            </span>
                        </div>
                        <div className="px-4 pb-4 space-y-6">
                            <div className="grid grid-cols-3 gap-4 items-center">
                                <Label htmlFor="bankName" className="text-gray-700 font-medium col-span-1 text-md">
                                    Tên ngân hàng:
                                </Label>
                                <Input
                                    type="text"
                                    id="bankName"
                                    name="bankName"
                                    value={disbursementRequests.bankName}
                                    className="p-2 border rounded-md bg-white text-gray-700 col-span-2 w-1/2"
                                    disabled
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4 items-center">
                                <Label
                                    htmlFor="bankAccountNumber"
                                    className="text-gray-700 font-medium col-span-1 text-md"
                                >
                                    Số tài khoản ngân hàng:
                                </Label>
                                <Input
                                    type="text"
                                    id="bankAccountNumber"
                                    name="bankAccountNumber"
                                    value={disbursementRequests.bankAccountNumber}
                                    className="p-2 border rounded-md bg-white text-gray-600 col-span-2 w-1/2"
                                    disabled
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4 items-center">
                                <Label
                                    htmlFor="bankAccountName"
                                    className="text-gray-700 font-medium col-span-1 text-md"
                                >
                                    Tên tài khoản ngân hàng:
                                </Label>
                                <Input
                                    type="text"
                                    id="bankAccountName"
                                    name="bankAccountName"
                                    value={disbursementRequests.bankAccountName}
                                    className="p-2 border rounded-md bg-white text-gray-600 col-span-2 w-1/2"
                                    disabled
                                />
                            </div>

                            {disbursementRequests?.disbursementStage?.stageActivity ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4 items-center">
                                        <p className="text-gray-700 font-medium col-span-1">Mục đích sử dụng:</p>
                                        <p className="text-teal-500 font-semibold col-span-2">
                                            {disbursementRequests?.disbursementStage?.stageActivity.description}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 items-center">
                                        <p className="text-gray-700 font-medium col-span-1">Trạng thái:</p>
                                        <p
                                            className={`col-span-2 font-semibold ${getStatusColorClass(
                                                disbursementRequests?.disbursementStage?.stageActivity.status,
                                                'activity',
                                            )}`}
                                        >
                                            {getStatusLabel(
                                                disbursementRequests?.disbursementStage?.stageActivity.status,
                                                activityStatus,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    Không có hoạt động nào được định nghĩa cho đợt này.
                                </div>
                            )}
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
                                                        {detail.amountSpent?.toLocaleString('vi-VN') + ' ₫'}
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

                <div className="flex flex-row p-4 justify-between items-center">
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
                            {disbursementRequests.disbursementStage?.stageID && createRequestStatus?.canCreate && (
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
                            )}
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
