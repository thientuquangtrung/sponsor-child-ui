import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Upload } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, FormProvider, useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCreateDisbursementReportMutation } from '@/redux/guarantee/disbursementReportApi';
import { useGetDisbursementStageByStageIdQuery } from '@/redux/guarantee/disbursementStageApi';

const CreateDisbursementReport = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const stageID = queryParams.get('stageID');
    const [uploadedImages, setUploadedImages] = useState({});
    const { data: disbursementStage } = useGetDisbursementStageByStageIdQuery(stageID);
    const [createDisbursementReport] = useCreateDisbursementReportMutation();

    const methods = useForm({
        defaultValues: {
            disbursementStageID: stageID || '',
            totalAmountUsed: 0,
            comments: '',
            disbursementReportDetails: [{ itemDescription: '', amountSpent: '', receiptUrl: '' }],
        },
    });

    const {
        handleSubmit,
        setValue,
        getValues,
        setError,
        watch,
        formState: { errors },
    } = methods;
    const { fields, append, remove } = useFieldArray({
        control: methods.control,
        name: 'disbursementReportDetails',
    });

    const formatAmount = (value) => {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const calculateTotalAmountUsed = () => {
        const details = watch('disbursementReportDetails');
        const total = details.reduce((sum, detail) => {
            const amount = parseFloat(detail.amountSpent.replace(/\./g, '').replace(/,/g, '')) || 0;
            return sum + amount;
        }, 0);
        setValue('totalAmountUsed', total);

        if (
            disbursementStage?.disbursementStage?.actualDisbursementAmount !== undefined &&
            total > disbursementStage.disbursementStage.actualDisbursementAmount
        ) {
            setError('totalAmountUsed', {
                type: 'manual',
                message: `Tổng số tiền không được vượt quá ${formatAmount(
                    disbursementStage.disbursementStage.actualDisbursementAmount.toString(),
                )}.`,
            });
        } else {
            setError('totalAmountUsed', null);
        }
    };

    useEffect(() => {
        calculateTotalAmountUsed();
    }, [watch('disbursementReportDetails')]);

    const uploadToCloudinary = async (file, folder = 'default-folder') => {
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

            const result = await response.json();
            console.log('Cloudinary response:', result);

            if (!response.ok) {
                throw new Error(result.error?.message || 'Failed to upload image');
            }

            return result.secure_url;
        } catch (error) {
            console.error('Error uploading file to Cloudinary:', error);
            throw error;
        }
    };

    const onSubmit = async (data) => {
        const totalAmountUsed = getValues('totalAmountUsed');

        if (
            disbursementStage?.disbursementStage?.actualDisbursementAmount !== undefined &&
            totalAmountUsed > disbursementStage.disbursementStage.actualDisbursementAmount
        ) {
            toast.error(
                `Tổng số tiền không được vượt quá ${formatAmount(
                    disbursementStage.disbursementStage.actualDisbursementAmount.toString(),
                )}.`,
            );
            return;
        }

        try {
            const uploadPromises = data.disbursementReportDetails.map(async (detail, index) => {
                const fileInput = document.querySelector(`input[name="disbursementReportDetails.${index}.receiptUrl"]`);
                let receiptUrl = detail.receiptUrl || ''; 

                if (fileInput && fileInput.files[0]) {
                    const file = fileInput.files[0];
                    receiptUrl = await uploadToCloudinary(file); 
                }

                return { ...detail, receiptUrl, index }; 
            });

            const uploadedDetails = await Promise.all(uploadPromises);

            uploadedDetails.sort((a, b) => a.index - b.index);

            const payload = {
                disbursementStageID: data.disbursementStageID,
                totalAmountUsed,
                comments: data.comments || '',
                disbursementReportDetails: uploadedDetails.map((detail) => ({
                    itemDescription: detail.itemDescription,
                    amountSpent: parseFloat(detail.amountSpent.replace(/\./g, '').replace(/,/g, '')) || 0,
                    receiptUrl: detail.receiptUrl,
                })),
            };

            console.log('Payload being sent:', payload);
            await createDisbursementReport(payload).unwrap();
            toast.success('Tạo báo cáo giải ngân thành công!');
            navigate('/guarantee/disbursement-reports');
        } catch (error) {
            console.error('Failed to create disbursement report:', error);
            toast.error(error.message || 'Có lỗi xảy ra khi tạo báo cáo giải ngân!');
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white shadow-md p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-center">Tạo báo cáo giải ngân</h2>
                    <DisbursementReportTable
                        fields={fields}
                        append={append}
                        remove={remove}
                        uploadedImages={uploadedImages}
                        setUploadedImages={setUploadedImages}
                        formatAmount={formatAmount}
                        uploadToCloudinary={uploadToCloudinary}
                    />
                    <TotalAmountSection formatAmount={formatAmount} disbursementStage={disbursementStage} />
                    <CommentsSection />
                    <div className="flex justify-end">
                        <Button type="submit" className="mt-4">
                            Gửi báo cáo
                        </Button>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
};

const DisbursementReportTable = ({
    fields,
    append,
    remove,
    uploadedImages,
    setUploadedImages,
    formatAmount,
    uploadToCloudinary,
}) => {
    const {
        control,
        register,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext();

    const handleAmountChange = (event, index) => {
        const value = event.target.value.replace(/[^\d]/g, ''); 
        const formattedValue = formatAmount(value);
        setValue(`disbursementReportDetails.${index}.amountSpent`, formattedValue); 

        const details = watch('disbursementReportDetails');
        const total = details.reduce((sum, detail) => {
            const amount = parseFloat(detail.amountSpent.replace(/\./g, '').replace(/,/g, '')) || 0;
            return sum + amount;
        }, 0);
        setValue('totalAmountUsed', total); 
    };

    const handleFileChange = async (event, index) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const receiptUrl = await uploadToCloudinary(file, 'disbursement-report');

            console.log('Receipt URL from Cloudinary:', receiptUrl);

            setValue(`disbursementReportDetails.${index}.receiptUrl`, receiptUrl);

            setUploadedImages((prevImages) => ({
                ...prevImages,
                [index]: receiptUrl,
            }));
        } catch (error) {
            console.error('File upload failed:', error);
            toast.error('Failed to upload the file. Please try again.');
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
                                <span className="text-red-500 text-sm">
                                    {errors.disbursementReportDetails?.[index]?.amountSpent?.message}
                                </span>
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
                                            <div className="flex items-center justify-center space-x-2">
                                                <Upload className="w-6 h-6 text-gray-500" />
                                                <span className="text-gray-500">Tải ảnh lên</span>
                                            </div>
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

const TotalAmountSection = ({ formatAmount, disbursementStage }) => {
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext();
    const totalAmountUsed = watch('totalAmountUsed');
    const actualDisbursementAmount = disbursementStage?.disbursementStage?.actualDisbursementAmount || 0;

    const isExceeding = totalAmountUsed > actualDisbursementAmount;

    return (
        <div className="flex flex-col">
            <div className="flex space-x-2 items-center">
                <Label className="flex-shrink-0">Tổng số tiền đã chi:</Label>
                <Input
                    type="text"
                    readOnly
                    {...register('totalAmountUsed')}
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
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <div>
            <Label htmlFor="comments">Ghi chú:</Label>
            <Textarea {...register('comments')} rows={3} placeholder="Nhập ghi chú (nếu có)" />
            {errors.comments && <span className="text-red-500 text-sm">{errors.comments.message}</span>}
        </div>
    );
};

export default CreateDisbursementReport;
