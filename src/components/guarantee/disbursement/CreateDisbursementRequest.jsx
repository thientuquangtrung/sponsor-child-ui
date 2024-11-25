import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { bankNames } from '@/config/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCanCreateDisbursementRequestQuery, useCreateDisbursementRequestMutation } from '@/redux/guarantee/disbursementRequestApi';
import { useGetDisbursementStageByStageIdQuery } from '@/redux/guarantee/disbursementStageApi';
import { AlertCircle, Calendar, CircleDollarSign, LoaderCircle, Plus, Trash2, User } from 'lucide-react';
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
    const { data: canCreateData } = useCanCreateDisbursementRequestQuery(
        disbursementStage?.stageID,
        {
            skip: !disbursementStage?.stageID,
        }
    );
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
                )} VNĐ.`,
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
                    Tạo yêu cầu giải ngân cho chiến dịch {disbursementStage?.campaignResponseDTO.title}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4 flex flex-col border rounded-lg shadow-lg">
                        <div className="flex space-x-2 justify-center items-center bg-gradient-to-r from-gray-200 to-rose-100 p-2 rounded-t-lg">
                            <h3 className="text-xl font-semibold text-gray-700">Đợt giải ngân:</h3>
                            <Badge className="w-6 h-6 p-2 text-white bg-teal-500 rounded-full shadow-inner">
                                {disbursementStage?.stageNumber}
                            </Badge>
                        </div>
                        <div className="space-y-6 p-6 rounded-b-lg">
                            <div className="flex items-center">
                                <div className="flex items-center w-1/2">
                                    <User className="mr-2 h-5 w-5 text-teal-500" />
                                    <p className="text-gray-700 font-medium">Nhà Bảo Lãnh:</p>
                                </div>
                                <span className="ml-2 text-teal-600 font-semibold">
                                    {disbursementStage?.guarantee?.fullname}
                                </span>
                            </div>
                            {disbursementStage?.actualDisbursementAmount &&
                                disbursementStage?.disbursementAmount &&
                                disbursementStage.actualDisbursementAmount - disbursementStage.disbursementAmount >
                                0 && (
                                    <div className="flex items-center">
                                        <div className="flex items-center w-1/2">
                                            <CircleDollarSign className="mr-2 h-5 w-5 text-teal-500" />
                                            <p className="text-gray-700 font-medium">Số tiền giải ngân đợt trước:</p>
                                        </div>
                                        <p className="ml-2 text-teal-600 font-semibold">
                                            {(
                                                disbursementStage.actualDisbursementAmount -
                                                disbursementStage.disbursementAmount
                                            ).toLocaleString('vi-VN')}{' '}
                                            VNĐ
                                        </p>
                                    </div>
                                )}
                            <div className="flex items-center">
                                <div className="flex items-center w-1/2">
                                    <CircleDollarSign className="mr-2 h-5 w-5 text-teal-500" />
                                    <p className="text-gray-700 font-medium">
                                        Số tiền giải ngân đợt {disbursementStage?.stageNumber}:
                                    </p>
                                </div>
                                <span className="ml-2 text-teal-600 font-semibold">
                                    {disbursementStage?.disbursementAmount?.toLocaleString('vi-VN')} VNĐ
                                </span>
                            </div>

                            <div className="flex items-center">
                                <div className="flex items-center w-1/2">
                                    <CircleDollarSign className="mr-2 h-5 w-5 text-teal-500" />
                                    <p className="text-gray-700 font-medium">Số tiền yêu cầu giải ngân:</p>
                                </div>
                                <span className="ml-2 text-teal-600 font-semibold">
                                    {disbursementStage?.actualDisbursementAmount?.toLocaleString('vi-VN')} VNĐ
                                </span>
                            </div>
                            <div className="flex items-center">
                                <div className="flex items-center w-1/2">
                                    <Calendar className="mr-2 h-5 w-5 text-teal-500" />
                                    <p className="text-gray-700 font-medium">Ngày dự kiến giải ngân:</p>
                                </div>
                                <span className="ml-2 text-teal-600 font-semibold">
                                    {new Date(disbursementStage?.scheduledDate).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="border rounded-lg shadow-md">
                        <h2 className="text-xl text-center font-semibold mb-4 bg-gradient-to-l from-gray-200 to-rose-100 px-3 py-2 rounded-tl-lg rounded-tr-lg">
                            Thông tin nhận giải ngân
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                            <Label>Tên ngân hàng:</Label>
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
                            <Label>Số tài khoản ngân hàng:</Label>
                            <Input
                                type="text"
                                name="bankAccountNumber"
                                value={guaranteeInfo.bankAccountNumber}
                                onChange={handleInputChange}
                            />
                            <Label>Tên tài khoản ngân hàng:</Label>
                            <Input
                                type="text"
                                name="fullname"
                                value={guaranteeInfo.fullname}
                                onChange={handleInputChange}
                            />
                        </div>
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
                                        <Input
                                            type="text"
                                            value={detail.amountSpent}
                                            onChange={(e) => {
                                                const rawValue = e.target.value.replace(/\D/g, '');
                                                const formattedValue = formatAmount(rawValue);
                                                handleReportDetailChange(index, 'amountSpent', formattedValue);
                                            }}
                                            placeholder="Nhập số tiền"
                                        />
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
                                    {guaranteeInfo.totalAmountUsed.toLocaleString('vi-VN')} VND
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
