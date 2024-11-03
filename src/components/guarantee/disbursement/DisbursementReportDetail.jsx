import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider, useFieldArray, useFormContext } from 'react-hook-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import {
    useGetDisbursementReportByReportIdQuery,
    useUpdateDisbursementReportMutation,
} from '@/redux/guarantee/disbursementReportApi';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Undo2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const uploadImageToCloudinary = async (file, folder = 'disbursement-report') => {
    if (!file) {
        throw new Error('No file selected for upload');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET_NAME);
    formData.append('folder', folder);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            },
        );

        if (!response.ok) {
            throw new Error(result.error?.message || 'Failed to upload image');
        }

        return result.secure_url;
    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        throw error;
    }
};

const DisbursementReportDetail = () => {
    const navigate = useNavigate();
    const { id: reportId } = useParams();
    const { data: report = {} } = useGetDisbursementReportByReportIdQuery(reportId, {
        skip: !reportId,
    });
    const [updateDisbursementReport] = useUpdateDisbursementReportMutation();
    const [uploadedImages, setUploadedImages] = useState({});

    const methods = useForm({
        defaultValues: {
            disbursementStageID: report?.disbursementStageID || '',
            totalAmountUsed: report?.totalAmountUsed || 0,
            comments: report?.comments || '',
            disbursementReportDetails: report?.disbursementReportDetails || [
                { itemDescription: '', amountSpent: '', receiptUrl: '' },
            ],
        },
    });

    const {
        control,
        register,
        setValue,
        watch,
        handleSubmit,
        formState: { errors },
    } = methods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'disbursementReportDetails',
    });

    const formatAmount = (value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const actualDisbursementAmount = report?.disbursementStage?.actualDisbursementAmount || 0;
    const [isExceeding, setIsExceeding] = useState(false);

    useEffect(() => {
        methods.reset(report);
        setUploadedImages(
            report?.disbursementReportDetails?.reduce((acc, detail, index) => {
                acc[index] = detail.receiptUrl || '';
                return acc;
            }, {}) || {},
        );
    }, [report, methods]);

    useEffect(() => {
        const subscription = watch((values) => {
            const details = values.disbursementReportDetails || [];
            const newTotal = details.reduce((sum, detail) => {
                const amount = parseFloat(detail.amountSpent?.toString().replace(/\./g, '').replace(/,/g, '')) || 0;
                return sum + amount;
            }, 0);

            if (newTotal !== values.totalAmountUsed) {
                setValue('totalAmountUsed', newTotal, { shouldDirty: false, shouldValidate: false });
                setIsExceeding(newTotal > actualDisbursementAmount);
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, setValue, actualDisbursementAmount]);

    const onSubmit = async (data) => {
        if (isExceeding) {
            toast.error('Tổng số tiền đã chi vượt quá số tiền giải ngân thực tế!');
            return;
        }

        try {
            const uploadPromises = data.disbursementReportDetails.map(async (detail, index) => {
                const fileInput = document.querySelector(`input[name="disbursementReportDetails.${index}.receiptUrl"]`);
                let receiptUrl = detail.receiptUrl || '';

                if (fileInput && fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    try {
                        receiptUrl = await uploadImageToCloudinary(file);
                        console.log(`New receiptUrl for detail at index ${index}:`, receiptUrl); // Log URL mới để kiểm tra
                    } catch (error) {
                        console.error('Failed to upload new image:', error);
                        toast.error('Có lỗi xảy ra khi tải lên ảnh mới!');
                        return;
                    }
                }

                return {
                    ...detail,
                    receiptUrl, // Cập nhật URL mới nếu có
                    amountSpent: parseFloat(detail.amountSpent?.toString().replace(/\./g, '').replace(/,/g, '')) || 0,
                };
            });

            const updatedDetails = await Promise.all(uploadPromises);

            const payload = {
                ...data,
                reportStatus: 0,
                disbursementReportDetails: updatedDetails,
            };

            console.log('Payload gửi đến backend:', payload);

            await updateDisbursementReport({ reportId, ...payload }).unwrap();
            toast.success('Báo cáo đã được cập nhật và gửi lại thành công!');
            navigate('/guarantee/disbursement-reports');
        } catch (error) {
            console.error('Failed to update disbursement report:', error);
            toast.error('Có lỗi xảy ra khi cập nhật báo cáo!');
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md p-6 space-y-4">
                <h2 className="text-xl font-semibold text-center">Chi tiết báo cáo giải ngân</h2>
                {report.reportStatus === 2 ? (
                    <>
                        <DisbursementReportTable
                            fields={fields}
                            append={append}
                            remove={remove}
                            uploadedImages={uploadedImages}
                            setUploadedImages={setUploadedImages}
                            formatAmount={formatAmount}
                        />
                        <TotalAmountSection
                            formatAmount={formatAmount}
                            isExceeding={isExceeding}
                            actualDisbursementAmount={actualDisbursementAmount}
                        />
                        <CommentsSection />
                        <div className="flex justify-end">
                            <Button type="submit" className="mt-4">
                                Gửi lại báo cáo
                            </Button>
                        </div>
                    </>
                ) : (
                    <div>
                        <Label className="font-semibold">Tổng số tiền đã chi:</Label>
                        <Input readOnly value={formatAmount(report?.totalAmountUsed?.toString() || '0') + ' VNĐ'} />
                        <Label className="font-semibold">Ghi chú:</Label>
                        <Textarea readOnly value={report?.comments || 'Không có ghi chú'} />
                        <Label className="font-semibold">Ngày tạo:</Label>
                        <Input readOnly value={new Date(report?.createdAt).toLocaleDateString('vi-VN')} />
                        <Label className="font-semibold">Ngày cập nhật:</Label>
                        <Input readOnly value={new Date(report?.updatedAt).toLocaleDateString('vi-VN')} />

                        {/* Thêm bảng chi tiết báo cáo giải ngân */}
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
                                        <TableHead className="border border-slate-300 font-semibold text-center">
                                            Hóa đơn
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {report?.disbursementReportDetails?.length > 0 ? (
                                        report.disbursementReportDetails.map((detail, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="border border-slate-300">
                                                    {detail.itemDescription || 'Không có mô tả'}
                                                </TableCell>
                                                <TableCell className="border border-slate-300">
                                                    {formatAmount(detail.amountSpent?.toString() || '0') + ' VNĐ'}
                                                </TableCell>
                                                <TableCell className="border border-slate-300">
                                                    {detail.receiptUrl ? (
                                                        <a
                                                            href={detail.receiptUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Xem hóa đơn
                                                        </a>
                                                    ) : (
                                                        'Không có hóa đơn'
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center border border-slate-300">
                                                Không có chi tiết báo cáo
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
                        onClick={() => navigate(`/guarantee/disbursement-reports`)}
                        className="mt-4 text-teal-600 border-teal-600 hover:bg-normal hover:text-teal-600"
                    >
                        <Undo2 className="mr-2 h-4 w-4" /> Trở lại
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
            </form>
        </FormProvider>
    );
};

const DisbursementReportTable = ({ fields, append, remove, uploadedImages, setUploadedImages, formatAmount }) => {
    const { register, setValue, watch } = useFormContext();

    const handleAmountChange = (event, index) => {
        const value = event.target.value.replace(/[^\d]/g, '');
        const formattedValue = formatAmount(value);
        setValue(`disbursementReportDetails.${index}.amountSpent`, formattedValue);
    };

    const handleFileChange = (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setUploadedImages((prevImages) => ({
                    ...prevImages,
                    [index]: fileReader.result,
                }));
            };
            fileReader.readAsDataURL(file);

            setValue(`disbursementReportDetails.${index}.receiptUrl`, file);
        }
    };

    return (
        <div className="overflow-x-auto">
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
                        <TableHead className="border border-slate-300 w-[100px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.map((field, index) => (
                        <TableRow key={field.id}>
                            <TableCell>
                                <Input
                                    {...register(`disbursementReportDetails.${index}.itemDescription`)}
                                    placeholder="Nhập mô tả hoạt động"
                                    className="w-full"
                                />
                            </TableCell>
                            <TableCell>
                                <Input
                                    type="text"
                                    {...register(`disbursementReportDetails.${index}.amountSpent`)}
                                    placeholder="Nhập số tiền"
                                    className="w-full"
                                    onChange={(e) => handleAmountChange(e, index)}
                                    value={watch(`disbursementReportDetails.${index}.amountSpent`)}
                                />
                            </TableCell>
                            <TableCell>
                                <div className="relative border-dashed border-2 border-gray-400 rounded-lg p-4">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => handleFileChange(e, index)}
                                    />
                                    <div className="flex items-center justify-center h-full">
                                        {uploadedImages[index] ? (
                                            <img
                                                src={uploadedImages[index]}
                                                alt="Uploaded receipt"
                                                className="max-h-32"
                                            />
                                        ) : (
                                            <img src={field.receiptUrl} alt="Existing receipt" className="max-h-32" />
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Button type="button" onClick={() => remove(index)} variant="destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-end mt-4">
                <Button
                    type="button"
                    className="bg-gradient-to-l from-rose-100 to-teal-100"
                    onClick={() => append({ itemDescription: '', amountSpent: '', receiptUrl: '' })}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm hoạt động
                </Button>
            </div>
        </div>
    );
};

const TotalAmountSection = ({ formatAmount, isExceeding, actualDisbursementAmount }) => {
    const { watch } = useFormContext();
    const totalAmountUsed = watch('totalAmountUsed');

    return (
        <div className="flex flex-col">
            <div className="flex space-x-2 items-center">
                <Label className="flex-shrink-0">Tổng số tiền đã chi:</Label>
                <Input
                    type="text"
                    readOnly
                    value={formatAmount(totalAmountUsed.toString())}
                    className={`w-[300px] ${isExceeding ? 'border-red-500' : ''}`}
                />
                <span className="ml-2">VNĐ</span>
            </div>
            <p className="text-sm italic text-gray-500 mt-2">
                (Tổng số tiền không vượt quá {formatAmount(actualDisbursementAmount.toString())})
            </p>
            {isExceeding && (
                <span className="text-red-500 text-sm">Tổng số tiền đã chi vượt quá số tiền giải ngân thực tế!</span>
            )}
        </div>
    );
};

const CommentsSection = () => {
    const { register } = useFormContext();

    return (
        <div>
            <Label htmlFor="comments">Ghi chú:</Label>
            <Textarea {...register('comments')} rows={3} placeholder="Nhập ghi chú (nếu có)" />
        </div>
    );
};

export default DisbursementReportDetail;
