import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { activityStatus, bankNames, disbursementStageStatus } from '@/config/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    useCanCreateDisbursementRequestQuery,
    useCreateDisbursementRequestMutation,
} from '@/redux/guarantee/disbursementRequestApi';
import { useGetDisbursementStageByStageIdQuery } from '@/redux/guarantee/disbursementStageApi';
import {
    AlertCircle,
    Calendar,
    CircleDollarSign,
    LoaderCircle,
    PieChart,
    Pill,
    Plus,
    Trash2,
    User,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useSelector } from 'react-redux';

export default function CreateDisbursementRequest() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [searchParams] = useSearchParams();
    const stageID = searchParams.get('stageID');
    const [isEarlyDisbursement, setIsEarlyDisbursement] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const { data: disbursementStage } = useGetDisbursementStageByStageIdQuery(stageID);
    const [createDisbursementRequest] = useCreateDisbursementRequestMutation();
    const { data: canCreateData } = useCanCreateDisbursementRequestQuery(disbursementStage?.stageID, {
        skip: !disbursementStage?.stageID,
    });
    const [guaranteeInfo, setGuaranteeInfo] = useState({
        fullname: '',
        bankAccountNumber: '',
        bankName: 0,
        reportDetails: [{ itemDescription: '', amountSpent: '' }],
        totalAmountUsed: 0,
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (disbursementStage && !guaranteeInfo.bankAccountNumber && !guaranteeInfo.fullname) {
            const bank = bankNames.find((b) => b.label === disbursementStage.guarantee.bankNameString);
            setGuaranteeInfo({
                ...guaranteeInfo,
                fullname: disbursementStage.guarantee.fullname || '',
                bankAccountNumber: disbursementStage.guarantee.bankAccountNumber || '',
                bankName: bank ? bank.value : 0,
            });
        }

        if (disbursementStage?.scheduledDate) {
            const currentDate = new Date();
            const scheduledDate = new Date(disbursementStage.scheduledDate);
            setIsEarlyDisbursement(currentDate < scheduledDate);
        }
    }, [disbursementStage]);

    if (disbursementStage && user.userID !== disbursementStage?.guarantee.userID) {
        toast.error('Bạn không có quyền tạo yêu cầu giải ngân cho chiến dịch này!');
        navigate('/guarantee/disbursement-requests');
    }
    if (canCreateData && !canCreateData.canCreate) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <p className="text-lg text-center text-red-600">
                    Bạn không được phép tạo yêu cầu giải ngân mới. Yêu cầu hiện tại đã phê duyệt hoặc đã yêu cầu.
                </p>
            </div>
        );
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGuaranteeInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handleBankSelect = (value) => {
        setGuaranteeInfo((prevInfo) => ({
            ...prevInfo,
            bankName: parseInt(value, 10),
        }));
    };

    const addReportDetail = () => {
        setGuaranteeInfo((prevInfo) => ({
            ...prevInfo,
            reportDetails: [...prevInfo.reportDetails, { itemDescription: '', amountSpent: '' }],
        }));
    };

    const removeReportDetail = (index) => {
        if (guaranteeInfo.reportDetails.length > 1) {
            const updatedDetails = guaranteeInfo.reportDetails.filter((_, i) => i !== index);
            setGuaranteeInfo((prevInfo) => ({
                ...prevInfo,
                reportDetails: updatedDetails,
            }));
            calculateTotalAmountUsed(updatedDetails);
        }
    };

    const handleReportDetailChange = (index, field, value) => {
        const updatedDetails = guaranteeInfo.reportDetails.map((detail, i) =>
            i === index ? { ...detail, [field]: value } : detail,
        );
        setGuaranteeInfo((prevInfo) => ({
            ...prevInfo,
            reportDetails: updatedDetails,
        }));
        calculateTotalAmountUsed(updatedDetails);
    };

    const formatAmount = (value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    const calculateTotalAmountUsed = (details) => {
        const total = details.reduce((sum, detail) => {
            const amount = parseFloat(detail.amountSpent.replace(/\./g, '')) || 0;
            return sum + amount;
        }, 0);

        setGuaranteeInfo((prevInfo) => ({
            ...prevInfo,
            totalAmountUsed: total,
        }));

        if (
            disbursementStage?.actualDisbursementAmount !== undefined &&
            total > parseFloat(disbursementStage.actualDisbursementAmount)
        ) {
            setError(
                `Tổng số tiền không được vượt quá ${formatAmount(
                    disbursementStage.actualDisbursementAmount.toString(),
                )} ₫.`,
            );
        } else {
            setError('');
        }
    };

    const isFillFullInfo = () => {
        return (
            guaranteeInfo.reportDetails.every((detail) => detail.itemDescription && detail.amountSpent) &&
            guaranteeInfo.bankAccountNumber &&
            guaranteeInfo.fullname
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isFillFullInfo()) {
            toast.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        if (error) {
            toast.error(error);
            return;
        }

        if (isEarlyDisbursement) {
            setShowConfirmDialog(true);
            return;
        }

        await submitRequest();
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
    const submitRequest = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                disbursementStageID: stageID,
                bankAccountNumber: guaranteeInfo.bankAccountNumber,
                bankAccountName: guaranteeInfo.fullname,
                bankName: guaranteeInfo.bankName,
                isEarlyRequest: isEarlyDisbursement,
                reportDetails: guaranteeInfo.reportDetails.map((detail) => ({
                    itemDescription: detail.itemDescription,
                    amountSpent: parseFloat(detail.amountSpent.replace(/\./g, '')) || 0,
                })),
            };

            await createDisbursementRequest(payload).unwrap();
            toast.success(
                isEarlyDisbursement ? 'Yêu cầu giải ngân sớm đã được gửi!' : 'Yêu cầu giải ngân đã được gửi!',
            );
            navigate('/guarantee/disbursement-requests');
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Có lỗi xảy ra khi gửi yêu cầu và báo cáo!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-8">
                <h2 className="text-2xl font-bold text-center text-teal-600 font-serif">
                    Tạo yêu cầu giải ngân cho chiến dịch {disbursementStage?.campaignResponseDTO?.title}
                </h2>

                {isEarlyDisbursement && (
                    <div className="flex items-center gap-2 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        <p className="text-sm text-yellow-700">
                            Bạn đang tạo yêu cầu giải ngân sớm hơn ngày dự kiến (
                            {new Date(disbursementStage?.scheduledDate).toLocaleDateString('vi-VN')})
                        </p>
                    </div>
                )}
                {disbursementStage?.undisbursedStagesInfo && disbursementStage.undisbursedStagesInfo.length > 0 && (
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
                                                Ngày dự kiến giải ngân
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                ST giải ngân thực tế
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                Ngày giải ngân thực tế
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                                                Trạng thái
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {[...disbursementStage.undisbursedStagesInfo]
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
                                                            : '--'}
                                                    </td>

                                                    {/* <td className="px-4 py-3 text-sm font-medium text-teal-600">
                                                        {stage.totalUndisbursedAmount?.toLocaleString('vi-VN')} ₫
                                                    </td> */}

                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        <div className="flex items-center">
                                                            <Calendar className="mr-2 h-4 w-4 text-teal-400" />
                                                            {stage.actualDisbursementDate
                                                                ? new Date(
                                                                      stage.actualDisbursementDate,
                                                                  ).toLocaleDateString('vi-VN')
                                                                : '--'}
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

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="col-span-5 space-y-4 flex flex-col border rounded-lg shadow-lg">
                        <div className="flex space-x-2 justify-center items-center bg-gradient-to-r from-gray-200 to-rose-100 p-2 rounded-t-lg">
                            <h3 className="text-xl font-semibold text-gray-700">Đợt giải ngân:</h3>
                            <Badge className="w-6 h-6 p-2 text-white bg-teal-500 rounded-full shadow-inner">
                                {disbursementStage?.stageNumber}
                            </Badge>
                        </div>
                        <div className="flex flex-col gap-6 rounded-b-lg">
                            {/* <div className="space-y-4">
                                <div className="flex flex-col items-end relative">
                                    <div className="flex items-center justify-between w-full">
                                        <p className="text-gray-700 font-medium">ST chưa giải ngân:</p>
                                        <span className="text-teal-600 font-semibold">
                                            {disbursementStage?.totalUndisbursedAmount?.toLocaleString('vi-VN')} ₫
                                        </span>
                                    </div>
                                    <span className="text-teal-600 font-semibold text-xl absolute right-36 top-2 py-1">+</span>
                                    <div className="flex items-center justify-between w-full py-3">
                                        <p className="text-gray-700 font-medium">ST giải ngân đợt {disbursementStage?.stageNumber}:</p>
                                        <div className="flex flex-col items-end">
                                            <span className="text-teal-600 font-semibold border-b border-gray-400">
                                                {disbursementStage?.disbursementAmount?.toLocaleString('vi-VN')} ₫
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between w-full">
                                        <p className="text-gray-700 font-medium">ST giải ngân mong đợi:</p>
                                        <span className="text-teal-600 font-semibold">
                                            {disbursementStage?.expectedDisbursementAmount?.toLocaleString('vi-VN')} ₫
                                        </span>
                                    </div>
                                </div>
                            </div> */}
                            <div className="space-y-4 p-4">
                                <div className="flex flex-col relative">
                                    <div className="flex items-center justify-between w-full">
                                        <p className="text-gray-700 font-medium">ST đã gây quỹ:</p>
                                        <span className="text-teal-600 font-semibold">
                                            {disbursementStage?.presentRaisedAmount?.toLocaleString('vi-VN')} ₫
                                        </span>
                                    </div>
                                    {/* <span className="text-teal-600 font-semibold text-xl absolute right-32 top-2 py-1">-</span> */}
                                    <div className="flex items-center justify-between w-full py-3">
                                        <p className="text-gray-700 font-medium">Tổng ST đã giải ngân đợt trước:</p>
                                        <div className="flex flex-col items-end">
                                            <span className="text-teal-600 font-semibold">
                                                {disbursementStage?.totalActualDisbursementAmount?.toLocaleString(
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
                                        <p className="text-blue-500 font-medium">ST giải ngân mong đợi đợt này:</p>
                                        <span className="text-blue-500 font-semibold">
                                            {disbursementStage?.expectedDisbursementAmount?.toLocaleString('vi-VN')} ₫
                                        </span>
                                    </div>
                                    {/* <div className="flex items-center justify-between w-full">
                                        <p className="text-gray-700 font-medium">ST còn lại của chiến dịch:</p>
                                        <span className="text-teal-600 font-semibold">
                                            {disbursementStage?.remainingAmount?.toLocaleString('vi-VN')} ₫
                                        </span>
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between w-full px-4">
                            <p className="text-orange-700 font-medium">ST thực tế có thể giải ngân:</p>
                            <span className="text-orange-600 font-semibold">
                                {disbursementStage?.actualDisbursementAmount?.toLocaleString('vi-VN')} ₫
                            </span>
                        </div>
                        <div className="flex items-center justify-between w-full px-4">
                            <p className="text-gray-700 font-medium">Ngày giải ngân dự kiến:</p>
                            <span className="text-teal-600  font-semibold">
                                {new Date(disbursementStage?.scheduledDate).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                    </div>

                    <div className="col-span-7 border rounded-lg shadow-md">
                        <h2 className="text-xl text-center font-semibold mb-4 bg-gradient-to-l from-gray-200 to-rose-100 px-3 py-2 rounded-tl-lg rounded-tr-lg">
                            Thông tin nhận giải ngân
                        </h2>
                        <div className="grid grid-cols-3 gap-4 px-6">
                            <p className="text-gray-700 font-medium col-span-1">Nhà Bảo Lãnh:</p>
                            <span className="ml-2 text-teal-600 font-semibold w-1/2 col-span-2">
                                {disbursementStage?.guarantee?.fullname}
                            </span>
                        </div>
                        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                            <Label className="text-base">Tên ngân hàng:</Label>
                            <Select value={guaranteeInfo.bankName} onValueChange={handleBankSelect}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn ngân hàng" />
                                </SelectTrigger>
                                <SelectContent>
                                    {bankNames.map((bank) => (
                                        <SelectItem key={bank.value} value={bank.value}>
                                            {bank.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Label className="text-base">Số tài khoản ngân hàng:</Label>
                            <Input
                                type="text"
                                name="bankAccountNumber"
                                value={guaranteeInfo.bankAccountNumber}
                                onChange={handleInputChange}
                            />
                            <Label className="text-base">Tên tài khoản ngân hàng:</Label>
                            <Input
                                type="text"
                                name="fullname"
                                value={guaranteeInfo.fullname}
                                onChange={handleInputChange}
                            />
                        </div> */}
                        <div className="px-6 py-2 space-y-2">
                            <div className="grid grid-cols-3">
                                <Label className="text-gray-700 font-medium text-md col-span-1">Tên ngân hàng:</Label>
                                <Select
                                    value={guaranteeInfo.bankName}
                                    onValueChange={handleBankSelect}
                                    className="col-span-2"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn ngân hàng" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bankNames.map((bank) => (
                                            <SelectItem key={bank.value} value={bank.value}>
                                                {bank.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-3">
                                <Label className="text-gray-700 font-medium text-md col-span-1">
                                    Số tài khoản ngân hàng:
                                </Label>
                                <Input
                                    type="text"
                                    name="bankAccountNumber"
                                    value={guaranteeInfo.bankAccountNumber}
                                    onChange={handleInputChange}
                                    className="p-2 border rounded-md bg-white text-gray-700 col-span-2 w-1/2"
                                />
                            </div>

                            <div className="grid grid-cols-3">
                                <Label className="text-gray-700 font-medium text-md col-span-1">
                                    Tên tài khoản ngân hàng:
                                </Label>
                                <Input
                                    type="text"
                                    name="fullname"
                                    value={guaranteeInfo.fullname}
                                    onChange={handleInputChange}
                                    className="p-2 border rounded-md bg-white text-gray-700 col-span-2 w-1/2"
                                />
                            </div>
                        </div>

                        {disbursementStage?.stageActivity ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4 px-6 items-center">
                                    <p className="text-gray-700 font-medium col-span-1">Mục đích sử dụng:</p>
                                    <p className="text-teal-500 font-semibold col-span-2">
                                        {disbursementStage?.stageActivity.description}
                                    </p>
                                </div>
                                <div className="grid grid-cols-3 gap-4 px-6 items-center pb-2">
                                    <p className="text-gray-700 font-medium col-span-1">Trạng thái:</p>
                                    <p
                                        className={`col-span-2 font-semibold ${getStatusColorClass(
                                            disbursementStage?.stageActivity.status,
                                            'activity',
                                        )}`}
                                    >
                                        {getStatusLabel(disbursementStage?.stageActivity.status, activityStatus)}
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

                <div className="p-6 border rounded-lg shadow-md bg-white">
                    <h2 className="text-2xl text-center font-semibold mb-4">Kế hoạch phân bổ nguồn tiền</h2>
                    <Table className="border-collapse border-solid-2 border-slate-500 w-full bg-white shadow-lg rounded-lg overflow-hidden">
                        <TableHeader className="bg-gradient-to-l from-rose-100 to-teal-100 border-b border-slate-500">
                            <TableRow>
                                <TableHead className="border border-slate-300 text-center py-2 text-gray-700">
                                    Mô tả hoạt động
                                </TableHead>
                                <TableHead className="border border-slate-300 text-center py-2 text-gray-700">
                                    Dự kiến số tiền
                                </TableHead>
                                <TableHead className="border border-slate-300 py-2"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {guaranteeInfo.reportDetails.map((detail, index) => (
                                <TableRow key={index}>
                                    <TableCell className="p-3 border border-slate-300">
                                        <Input
                                            value={detail.itemDescription}
                                            onChange={(e) =>
                                                handleReportDetailChange(index, 'itemDescription', e.target.value)
                                            }
                                            placeholder="Mô tả"
                                        />
                                    </TableCell>
                                    <TableCell className="p-3 border border-slate-300">
                                        <div className="relative">
                                            <Input
                                                type="text"
                                                value={detail.amountSpent}
                                                onChange={(e) => {
                                                    const rawValue = e.target.value.replace(/\D/g, '');
                                                    const formattedValue = formatAmount(rawValue);
                                                    handleReportDetailChange(index, 'amountSpent', formattedValue);
                                                }}
                                                placeholder="Nhập số tiền"
                                                className="pr-6"
                                            />
                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                                                ₫
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-3 border border-slate-300">
                                        {guaranteeInfo.reportDetails.length > 1 && (
                                            <Button
                                                type="button"
                                                onClick={() => removeReportDetail(index)}
                                                className="text-red-500 bg-normal hover:bg-normal"
                                            >
                                                <Trash2 />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell className="p-3 border border-slate-300 font-semibold text-right" colSpan={1}>
                                    Tổng số tiền:
                                </TableCell>
                                <TableCell className="p-3 border border-slate-300 font-semibold text-teal-600">
                                    {guaranteeInfo.totalAmountUsed.toLocaleString('vi-VN')} ₫
                                </TableCell>
                            </TableRow>
                            {error && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-red-500 text-center">
                                        {error}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <div className="flex justify-end mt-4">
                        <Button
                            type="button"
                            onClick={addReportDetail}
                            className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm hoạt động
                        </Button>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Button
                        type="submit"
                        className="mt-4 bg-gradient-to-t from-teal-200 to-zinc-200"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center">
                                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                                Đang gửi
                            </div>
                        ) : (
                            'Gửi yêu cầu giải ngân'
                        )}
                    </Button>
                </div>
            </form>
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận giải ngân sớm</DialogTitle>
                        <DialogDescription>
                            Bạn đang tạo yêu cầu giải ngân sớm hơn ngày dự kiến (
                            {new Date(disbursementStage?.scheduledDate).toLocaleDateString('vi-VN')}). Bạn có chắc chắn
                            muốn tiếp tục?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                            Hủy
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => {
                                setShowConfirmDialog(false);
                                submitRequest();
                            }}
                            className="bg-teal-600 hover:bg-teal-700"
                        >
                            Xác nhận
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
