import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { useGetDisbursementReportByReportIdQuery } from '@/redux/guarantee/disbursementReportApi';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DisbursementReportDetail = () => {
    const navigate = useNavigate();
    const { id: reportId } = useParams();

    const {
        data: report = {},
        error,
        isLoading,
    } = useGetDisbursementReportByReportIdQuery(reportId, {
        skip: !reportId,
    });

    const formatAmount = (value) => {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading report: {error?.message}</p>;
    }

    if (!reportId) {
        return <p>No report found for the given guarantee ID.</p>;
    }

    return (
        <div className="bg-white shadow-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-center">Chi tiết báo cáo giải ngân</h2>
            <div className="space-y-4">
                <Label className="font-semibold">Tổng số tiền đã chi:</Label>
                <Input readOnly value={formatAmount(report?.totalAmountUsed?.toString() || '0') + ' VNĐ'} />

                <Label className="font-semibold">Ghi chú:</Label>
                <Textarea readOnly value={report?.comments || 'Không có ghi chú'} />

                <Label className="font-semibold">Ngày tạo:</Label>
                <Input readOnly value={new Date(report?.createdAt).toLocaleDateString('vi-VN')} />

                <Label className="font-semibold">Ngày cập nhật:</Label>
                <Input readOnly value={new Date(report?.updatedAt).toLocaleDateString('vi-VN')} />
            </div>

            <div className="overflow-x-auto mt-4">
                <Table className="border-collapse border border-slate-400">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="border border-slate-300 font-semibold text-center">
                                Mô tả hoạt động
                            </TableHead>
                            <TableHead className="border border-slate-300 font-semibold text-center">
                                Số tiền đã chi
                            </TableHead>
                            <TableHead className="border border-slate-300 font-semibold text-center">Hóa đơn</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {report?.disbursementReportDetails?.map((detail) => (
                            <TableRow key={detail.id}>
                                <TableCell className="border border-slate-300">{detail.itemDescription}</TableCell>
                                <TableCell className="border border-slate-300">
                                    {formatAmount(detail.amountSpent.toString())} VNĐ
                                </TableCell>
                                <TableCell className="border border-slate-300">
                                    {detail.receiptUrl ? (
                                        <a href={detail.receiptUrl} target="_blank" rel="noopener noreferrer">
                                            Xem hóa đơn
                                        </a>
                                    ) : (
                                        'Không có hóa đơn'
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-row  justify-between items-center">
                <Button
                    variant="outline"
                    onClick={() => navigate(`/guarantee/disbursement-reports`)}
                    className="mt-4 text-teal-600 border-teal-600 hover:bg-normal hover:text-teal-600"
                >
                    <Undo2 className="mr-2 h-4 w-4" />
                    Trở lại
                </Button>
                {report.reportStatus === 0 ? (
                    <p className="text-center text-blue-500 font-semibold mt-4 italic">Báo cáo đang chờ duyệt!</p>
                ) : report.reportStatus === 1 ? (
                    <p className="text-center text-green-500 font-semibold mt-4 italic">Báo cáo đã được duyệt!</p>
                ) : report.reportStatus === 2 ? (
                    <p className="text-center text-red-500 font-semibold mt-4 italic">
                        Báo cáo chưa hợp lý. Vui lòng chỉnh sửa và bổ sung!
                    </p>
                ) : null}
            </div>
        </div>
    );
};

export default DisbursementReportDetail;
