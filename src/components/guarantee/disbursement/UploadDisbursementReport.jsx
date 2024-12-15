import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Upload, LoaderCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useGetDisbursementRequestByIdSimplifiedQuery } from '@/redux/guarantee/disbursementRequestApi';
import { useUpdateDisbursementReportMutation } from '@/redux/guarantee/disbursementReportApi';
import { uploadFile, UPLOAD_FOLDER, UPLOAD_NAME } from '@/lib/cloudinary';

export default function UploadDisbursementReport() {
    const { id } = useParams();
    const { data: disbursementRequests, isLoading, error, refetch } = useGetDisbursementRequestByIdSimplifiedQuery(id);
    const [updateDisbursementReport] = useUpdateDisbursementReportMutation();
    const [reportDetails, setReportDetails] = useState({});
    const [loadingRows, setLoadingRows] = useState([]);

    const [isModalOpen, setModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState(null);

    const formatCurrency = (value) => {
        if (!value && value !== 0) return '';
        return value.toLocaleString('vi-VN') + ' ₫';
    };

    const isRowUpdated = (detail) => {
        return detail.comments && detail.actualAmountSpent && detail.receiptUrl;
    };

    const openModal = (imageUrl) => {
        setModalImage(imageUrl);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalImage(null);
    };



    if (isLoading) return <LoadingScreen />;
    if (error) return <div className="text-center py-4 text-red-500">Đã có lỗi khi tải dữ liệu</div>;
    if (!disbursementRequests)
        return <div className="text-center py-4 text-gray-500">Không có dữ liệu nào để hiển thị</div>;

    const handleFileChange = (event, detailId) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file hình ảnh');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setReportDetails((prev) => ({
                ...prev,
                [detailId]: {
                    ...prev[detailId],
                    filePreview: reader.result,
                    file: file,
                },
            }));
        };
        reader.readAsDataURL(file);
    };

    const validateAmount = (value) => {
        const numericValue = parseFloat(value.replace(/\./g, '').replace(/,/g, ''));
        return !isNaN(numericValue) && numericValue >= 0;
    };

    const handleChange = (detailId, field, value) => {
        if (field === 'actualAmountSpent') {
            if (value && !validateAmount(value)) {
                toast.error('Vui lòng nhập số tiền hợp lệ và không âm');
                return;
            }
        }

        setReportDetails((prev) => ({
            ...prev,
            [detailId]: {
                ...prev[detailId],
                [field]: value,
            },
        }));
    };

    const updateSingleDisbursementDetail = async (detailId) => {
        const detail = reportDetails[detailId];

        if (!detail?.comments) {
            toast.error('Vui lòng nhập ghi chú');
            return;
        }

        if (!detail?.actualAmountSpent) {
            toast.error('Vui lòng nhập số tiền thực tế');
            return;
        }

        if (!detail?.receiptUrl && !detail?.file) {
            toast.error('Vui lòng tải lên hóa đơn');
            return;
        }

        const numericAmount = parseFloat(detail.actualAmountSpent.replace(/\./g, '').replace(/,/g, ''));
        if (isNaN(numericAmount) || numericAmount < 0) {
            toast.error('Số tiền không hợp lệ');
            return;
        }

        let receiptUrl = detail.receiptUrl;

        if (detail.file) {
            try {
                setLoadingRows((prev) => [...prev, detailId]);

                const uploadResult = await uploadFile({
                    file: detail.file,
                    folder: UPLOAD_FOLDER.getDisbursementFolder(disbursementRequests.campaigns.id),
                    customFilename: `${UPLOAD_NAME.DISBURSEMENT_REPORT}_${disbursementRequests.disbursementStage.stageNumber}_${detailId}`,
                });

                if (!uploadResult) {
                    throw new Error('Không nhận được link tải lên');
                }

                receiptUrl = uploadResult.secure_url;
            } catch (error) {
                console.error('Upload failed:', error);
                toast.error('Không thể tải lên file. Vui lòng thử lại.');
                return;
            } finally {
                setLoadingRows((prev) => prev.filter((id) => id !== detailId));
            }
        }

        const payload = {
            actualAmountSpent: numericAmount,
            receiptUrl: receiptUrl,
            comments: detail.comments,
        };

        try {
            setLoadingRows((prev) => [...prev, detailId]);
            await updateDisbursementReport({
                reportDetailId: detailId,
                data: payload
            }).unwrap();
            await refetch();
            toast.success(`Cập nhật chi tiết báo cáo thành công!`);
        } catch (error) {
            toast.error(`Không cập nhật được`);
        } finally {
            setLoadingRows((prev) => prev.filter((id) => id !== detailId));
        }
    };

    return (
        <div>
            <div className="w-full mx-auto p-2 space-y-4 flex flex-col">
                <div className="flex flex-col items-center space-y-4">
                    <h2 className="text-xl italic text-center">
                        Dưới đây là hình ảnh minh chứng cho giao dịch giải ngân.
                    </h2>
                    <img
                        src={disbursementRequests?.disbursementStage?.transferReceiptUrl}
                        alt="Hình ảnh minh chứng cho giao dịch giải ngân"
                        className="w-32 cursor-pointer"
                        onClick={() => openModal(disbursementRequests?.disbursementStage?.transferReceiptUrl)}
                    />
                </div>
                <h3 className="text-xl text-center font-semibold mb-6 text-teal-500">
                    Minh chứng sử dụng nguồn tiền đã giải ngân
                </h3>
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
                                <TableHead className="border border-slate-300 text-center py-2 text-black">
                                    Số tiền thực tế
                                </TableHead>
                                <TableHead className="border border-slate-300 text-center py-2 text-black">
                                    Hóa đơn
                                </TableHead>
                                <TableHead className="border border-slate-300 text-center text-gray-black">
                                    Ghi chú
                                </TableHead>
                                <TableHead className="border border-slate-300 text-center text-gray-black">
                                    Trạng thái
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {disbursementRequests?.disbursementReports
                                ?.filter((report) => report.isCurrent)
                                .flatMap((report) =>
                                    report.disbursementReportDetails.map((detail) => {
                                        const actualAmountSpent =
                                            reportDetails[detail.id]?.actualAmountSpent ||
                                            (detail.actualAmountSpent ? formatCurrency(detail.actualAmountSpent) : '');
                                        const comments = reportDetails[detail.id]?.comments || detail.comments || '';
                                        const receiptUrl =
                                            reportDetails[detail.id]?.receiptUrl || detail.receiptUrl || '';

                                        const isUpdated = isRowUpdated(detail);
                                        const isLoading = loadingRows.includes(detail.id);

                                        return (
                                            <TableRow
                                                key={detail.id}
                                                className="hover:bg-gray-50 border-b border-gray-200 text-center"
                                            >
                                                <TableCell className="p-3 border border-slate-300">
                                                    {detail.itemDescription || 'Không có mô tả'}
                                                </TableCell>
                                                <TableCell className="p-3 border border-slate-300 text-teal-500 font-semibold">
                                                    {formatCurrency(detail.amountSpent)}
                                                </TableCell>
                                                <TableCell className="p-3 border border-slate-300">
                                                    {isUpdated ? (
                                                        <div className="text-teal-500 font-semibold">
                                                            {formatCurrency(detail.actualAmountSpent)}
                                                        </div>
                                                    ) : (
                                                        <div className="relative">

                                                            <Input
                                                                type="text"
                                                                value={actualAmountSpent}
                                                                placeholder="Số tiền"
                                                                onChange={(e) => {
                                                                    const formattedAmount = e.target.value
                                                                        .replace(/\D/g, '')
                                                                        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                                                                    handleChange(
                                                                        detail.id,
                                                                        'actualAmountSpent',
                                                                        formattedAmount,
                                                                    );
                                                                }}
                                                                disabled={isUpdated}
                                                            />
                                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">₫</span>
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="p-3 border border-slate-300">
                                                    <div className="border-dashed border-2 border-gray-400 p-2 rounded-lg flex flex-col items-center justify-center relative">
                                                        {(receiptUrl || reportDetails[detail.id]?.filePreview) ? (
                                                            <div className="relative group">
                                                                <img
                                                                    src={receiptUrl || reportDetails[detail.id].filePreview}
                                                                    alt="Uploaded receipt"
                                                                    className="max-w-full max-h-32 cursor-pointer"
                                                                    onClick={() => openModal(receiptUrl || reportDetails[detail.id].filePreview)}
                                                                />
                                                                {!isUpdated && (
                                                                    <button
                                                                        type="button"
                                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-20"
                                                                        onClick={() => {
                                                                            setReportDetails((prev) => ({
                                                                                ...prev,
                                                                                [detail.id]: {
                                                                                    ...prev[detail.id],
                                                                                    filePreview: null,
                                                                                    file: null
                                                                                }
                                                                            }));
                                                                        }}
                                                                    >
                                                                        <X size={20} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <Upload size={24} className="text-gray-500 mb-2" />
                                                                <span className="text-sm text-gray-500">
                                                                    Click để tải lên hóa đơn
                                                                </span>
                                                            </>
                                                        )}
                                                        {!isUpdated && (
                                                            <Input
                                                                id={`fileInput-${detail.id}`}
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => handleFileChange(e, detail.id)}
                                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                                disabled={isUpdated || isLoading}
                                                            />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="p-3 border border-slate-300">
                                                    <textarea
                                                        className="w-full border rounded p-2"
                                                        value={comments}
                                                        onChange={(e) =>
                                                            handleChange(detail.id, 'comments', e.target.value)
                                                        }
                                                        disabled={isUpdated}
                                                    />
                                                </TableCell>
                                                <TableCell className="p-3 border border-slate-300">
                                                    {isUpdated ? (
                                                        <span className="text-green-500 font-semibold">
                                                            Đã cập nhật
                                                        </span>
                                                    ) : (
                                                        <Button
                                                            className="bg-rose-50 text-teal-500 font-semibold py-1 px-3 rounded hover:bg-normal"
                                                            onClick={() => updateSingleDisbursementDetail(detail.id)}
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? (
                                                                <LoaderCircle className="animate-spin -ml-1 mr-3 h-5 w-5 inline" />
                                                            ) : (
                                                                'Cập nhật'
                                                            )}
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }),
                                )}
                            {disbursementRequests?.disbursementReports?.every((report) => !report.isCurrent) && (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
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