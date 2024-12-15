import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { X } from 'lucide-react';

export default function DisbursementReportDetail({ disbursementRequest }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    const openModal = (imageUrl) => {
        setModalImage(imageUrl);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalImage(null);
    };

    return (
        <div>
            <h3 className="text-xl text-center font-semibold mb-6 text-teal-500">
                Chi tiết sử dụng nguồn tiền đã giải ngân
            </h3>
            <div className="overflow-x-auto px-8">
                <Table className="border-collapse border-solid-2 border-slate-500 w-full bg-white shadow-lg rounded-lg overflow-hidden">
                    <TableHeader className="bg-gradient-to-l from-rose-100 to-teal-100 border-b border-slate-500">
                        <TableRow>
                            <TableHead className="border border-slate-300 text-center py-2 text-black">
                                Mô tả hoạt động
                            </TableHead>
                            <TableHead className="border border-slate-300 text-center py-2 text-black">
                                Dự kiến số tiền
                            </TableHead>
                            <TableHead className="border border-slate-300 text-center py-2 text-black">
                                Số tiền thực tế
                            </TableHead>
                            <TableHead className="border border-slate-300 text-center py-2 text-black">
                                Hóa đơn
                            </TableHead>
                            <TableHead className="border border-slate-300 text-center py-2 text-black">
                                Ghi chú
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {disbursementRequest?.disbursementReports
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
                                        <TableCell className="p-3 border border-slate-300 text-teal-500 font-semibold">
                                            {detail.actualAmountSpent?.toLocaleString('vi-VN') + ' ₫'}
                                        </TableCell>
                                        <TableCell className="p-3 border border-slate-300">
                                            {detail.receiptUrl ? (
                                                <img
                                                    src={detail.receiptUrl}
                                                    alt="Hóa đơn"
                                                    className="w-20 h-20 object-cover cursor-pointer"
                                                    onClick={() => openModal(detail.receiptUrl)}
                                                />
                                            ) : (
                                                'Không có hóa đơn'
                                            )}
                                        </TableCell>
                                        <TableCell className="p-3 border border-slate-300">
                                            {detail.comments || 'Không có ghi chú'}
                                        </TableCell>
                                    </TableRow>
                                )),
                            )}
                        {disbursementRequest?.disbursementReports?.every((report) => !report.isCurrent) && (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="px-6 py-4 text-center text-gray-500 border-t border-gray-200"
                                >
                                    Không có chi tiết báo cáo hiện tại
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        className="bg-white p-4 rounded-lg shadow-lg max-w-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <X
                            className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
                            onClick={closeModal}
                            size={24}
                        />
                        <img src={modalImage} alt="Biên lai lớn" className="max-w-full h-full" />
                    </div>
                </div>
            )}
        </div>
    );
}
