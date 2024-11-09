import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Upload, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useGetDisbursementRequestByIdSimplifiedQuery } from '@/redux/guarantee/disbursementRequestApi';
import { useUpdateDisbursementReportMutation } from '@/redux/guarantee/disbursementReportApi';

export default function UploadDisbursementReport() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: disbursementRequests, isLoading, error } = useGetDisbursementRequestByIdSimplifiedQuery(id);
    const [updateDisbursementReport] = useUpdateDisbursementReportMutation();

    const [reportDetails, setReportDetails] = useState({});
    const [uploadedImages, setUploadedImages] = useState({});
    const [updatedRows, setUpdatedRows] = useState([]);
    const [loadingRows, setLoadingRows] = useState([]);

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

    if (isLoading) return <LoadingScreen />;
    if (error) return <div className="text-center py-4 text-red-500">Đã có lỗi khi tải dữ liệu</div>;
    if (!disbursementRequests)
        return <div className="text-center py-4 text-gray-500">Không có dữ liệu nào để hiển thị</div>;

    const uploadToCloudinary = async (file, folder = 'default-folder') => {
        if (!file) {
            throw new Error('No file selected for upload');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'sponsor_child_uploads');
        formData.append('folder', folder);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                },
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error?.message || 'Failed to upload image');
            }

            return result.secure_url;
        } catch (error) {
            console.error('Error uploading file to Cloudinary:', error);
            throw error;
        }
    };

    const handleFileChange = async (event, detailId) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const receiptUrl = await uploadToCloudinary(file);

            setReportDetails((prev) => ({
                ...prev,
                [detailId]: {
                    ...prev[detailId],
                    receiptUrl,
                },
            }));

            setUploadedImages((prevImages) => ({
                ...prevImages,
                [detailId]: receiptUrl,
            }));
        } catch (error) {
            toast.error('Failed to upload the file. Please try again.');
        }
    };

    const handleChange = (detailId, field, value) => {
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
        if (!detail || !detail.comments || !detail.receiptUrl) {
            toast.error(`Detail ID ${detailId}: Comments and Receipt URL are required.`);
            return;
        }

        const payload = {
            actualAmountSpent: parseFloat(detail.actualAmountSpent.replace(/\./g, '').replace(/,/g, '')) || 0,
            receiptUrl: detail.receiptUrl,
            comments: detail.comments,
        };

        setLoadingRows((prev) => [...prev, detailId]);

        try {
            await updateDisbursementReport({ reportDetailId: detailId, data: payload }).unwrap();
            toast.success(`Cập nhật chi tiết báo cáo ID ${detailId} thành công!`);
            setUpdatedRows((prev) => [...prev, detailId]);
        } catch (error) {
            console.error(`Không cập nhật được ID ${detailId}:`, error);
            toast.error(`Không cập nhật được: ${error.message}`);
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
                                            detail.actualAmountSpent ||
                                            '';
                                        const comments = reportDetails[detail.id]?.comments || detail.comments || '';
                                        const receiptPreview = uploadedImages[detail.id];
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
                                                    {detail.amountSpent?.toLocaleString('vi-VN') + ' VNĐ'}
                                                </TableCell>
                                                <TableCell className="p-3 border border-slate-300">
                                                    <Input
                                                        type="text"
                                                        value={actualAmountSpent}
                                                        placeholder="Số tiền"
                                                        onChange={(e) => {
                                                            const formattedAmount = e.target.value
                                                                .replace(/\./g, '')
                                                                .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                                                            handleChange(
                                                                detail.id,
                                                                'actualAmountSpent',
                                                                formattedAmount,
                                                            );
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell className="p-3 border border-slate-300">
                                                    <div
                                                        className="border-dashed border-2 border-gray-400 p-2 rounded-lg flex flex-col items-center justify-center relative"
                                                        onClick={() =>
                                                            document.getElementById(`fileInput-${detail.id}`).click()
                                                        }
                                                    >
                                                        {receiptPreview ? (
                                                            <img
                                                                src={receiptPreview}
                                                                alt="Uploaded receipt"
                                                                className="max-w-full max-h-32"
                                                            />
                                                        ) : (
                                                            <Upload size={24} className="text-gray-500 mb-2" />
                                                        )}
                                                        <Input
                                                            id={`fileInput-${detail.id}`}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleFileChange(e, detail.id)}
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                            style={{ zIndex: 100 }}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="p-3 border border-slate-300">
                                                    <textarea
                                                        className="w-full border rounded p-2"
                                                        value={comments}
                                                        onChange={(e) =>
                                                            handleChange(detail.id, 'comments', e.target.value)
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell className="p-3 border border-slate-300">
                                                    {updatedRows.includes(detail.id) ? (
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
