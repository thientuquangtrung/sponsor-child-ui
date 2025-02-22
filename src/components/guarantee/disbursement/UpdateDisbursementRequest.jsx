import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, LoaderCircle } from 'lucide-react';

import { useCreateDisbursementReportMutation } from '@/redux/guarantee/disbursementReportApi';

export default function UpdateDisbursementRequest({ disbursementRequest }) {
    const navigate = useNavigate();
    const [updateDisbursementReport] = useCreateDisbursementReportMutation();

    const [formData, setFormData] = useState({
        disbursementReports: [],
        totalAmountUsed: 0,
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (disbursementRequest) {
            setFormData({
                disbursementReports:
                    disbursementRequest.disbursementReports.find(drp => drp.isCurrent)?.disbursementReportDetails.map((detail) => ({
                        ...detail,
                        amountSpent: formatAmount(detail.amountSpent.toString()),
                    })) || [],
                totalAmountUsed: calculateTotalAmountUsed(
                    disbursementRequest.disbursementReports.find(drp => drp.isCurrent)?.disbursementReportDetails || [],
                ),
            });
        }
    }, [disbursementRequest]);

    const calculateTotalAmountUsed = (details) => {
        const total = details.reduce((sum, detail) => {
            const amount = parseFloat((detail.amountSpent || '').toString().replace(/\./g, '')) || 0;
            return sum + amount;
        }, 0);

        if (
            disbursementRequest?.disbursementStage.actualDisbursementAmount &&
            total > parseFloat(disbursementRequest.disbursementStage.actualDisbursementAmount)
        ) {
            setError(
                `Tổng số tiền không được vượt quá ${disbursementRequest.disbursementStage.actualDisbursementAmount.toLocaleString(
                    'vi-VN',
                )} VND.`,
            );
        } else {
            setError('');
        }

        return total;
    };

    const formatAmount = (value) => {
        return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handleReportDetailChange = (index, field, value) => {
        const formattedValue = field === 'amountSpent' ? formatAmount(value) : value;

        const updatedDetails = formData.disbursementReports.map((detail, i) =>
            i === index ? { ...detail, [field]: formattedValue } : detail,
        );

        setFormData((prev) => ({
            ...prev,
            disbursementReports: updatedDetails,
            totalAmountUsed: calculateTotalAmountUsed(updatedDetails),
        }));
    };

    const addReportDetail = () => {
        setFormData((prev) => ({
            ...prev,
            disbursementReports: [...prev.disbursementReports, { itemDescription: '', amountSpent: '' }],
        }));
    };

    const removeReportDetail = (index) => {
        if (formData.disbursementReports.length > 1) {
            const updatedDetails = formData.disbursementReports.filter((_, i) => i !== index);
            setFormData((prev) => ({
                ...prev,
                disbursementReports: updatedDetails,
            }));
            calculateTotalAmountUsed(updatedDetails);
        }
    };

    const isFillFullInfo = () => {
        return formData.disbursementReports.every((detail) => detail.itemDescription && detail.amountSpent);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFillFullInfo()) {
            toast.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        if (error) {
            toast.error(error);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = {
                disbursementRequestID: disbursementRequest.id,
                reportDetails: formData.disbursementReports.map((detail) => ({
                    itemDescription: detail.itemDescription,
                    amountSpent: parseFloat(detail.amountSpent.replace(/\./g, '')) || 0,
                })),
            };

            await updateDisbursementReport(response).unwrap();
            console.log('Yêu cầu giải ngân và báo cáo được cập nhật:', response);
            toast.success('Yêu cầu giải ngân đã được cập nhật!');
            navigate('/guarantee/disbursement-requests');
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật yêu cầu giải ngân!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 mt-6">
            <h2 className="text-xl font-bold text-center text-teal-500 italic">
                Vui lòng cập nhật kế hoạch phân bổ nguồn tiền!
            </h2>
            <p className="text-red-500 text-center">(Lý do: {disbursementRequest?.rejectionReason})</p>

            <div className="p-4">
                <Table className="border-collapse border-solid-2 border-slate-500 w-full overflow-hidden">
                    <TableHeader className="bg-gradient-to-l from-rose-100 to-teal-100 border-b border-slate-500">
                        <TableRow>
                            <TableHead className="border border-slate-300 text-center py-2 text-black">
                                Mô tả hoạt động
                            </TableHead>
                            <TableHead className="border border-slate-300 text-center py-2 text-black">
                                Dự kiến số tiền
                            </TableHead>
                            <TableHead className="border border-slate-300 py-2"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {formData.disbursementReports.map((detail, index) => (
                            <TableRow key={index}>
                                <TableCell className="p-3 border border-slate-300">
                                    <Input
                                        type="text"
                                        value={detail.itemDescription}
                                        onChange={(e) =>
                                            handleReportDetailChange(index, 'itemDescription', e.target.value)
                                        }
                                    />
                                </TableCell>
                                <TableCell className="p-3 border border-slate-300">
                                    <div className="relative">

                                        <Input
                                            type="text"
                                            value={detail.amountSpent}
                                            onChange={(e) => handleReportDetailChange(index, 'amountSpent', e.target.value)}
                                        />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">₫</span>
                                    </div>
                                </TableCell>
                                <TableCell className="p-3 border border-slate-300">
                                    {formData.disbursementReports.length > 1 && (
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
                                {formData.totalAmountUsed.toLocaleString('vi-VN')} ₫
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
                    className="mt-2 bg-gradient-to-t from-teal-200 to-zinc-200"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <div className="flex items-center">
                            <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                            Đang gửi
                        </div>
                    ) : (
                        'Gửi yêu cầu cập nhật'
                    )}
                </Button>
            </div>
        </form>
    );
}
