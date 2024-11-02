import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { bankNames } from '@/config/combobox';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useGetDisbursementStageByStageIdQuery } from '@/redux/guarantee/disbursementStageApi';
import { useCreateDisbursementRequestMutation } from '@/redux/guarantee/disbursementRequestApi';
import { useCanCreateDisbursementRequestQuery } from '@/redux/guarantee/disbursementRequestApi';
import { Calendar, CalendarDays, CircleDollarSign, Pill } from 'lucide-react';
import DisbursementRequestDetail from './DisbursementRequestDetail';

export default function CreateDisbursementRequest() {
    const queryParams = new URLSearchParams(location.search);
    const stageID = queryParams.get('stageID');
    const { data: disbursementStage, isLoading, isError } = useGetDisbursementStageByStageIdQuery(stageID);
    const { data: canCreateRequest, refetch: refetchCanCreateRequest } = useCanCreateDisbursementRequestQuery(stageID);
    const [createDisbursementRequest] = useCreateDisbursementRequestMutation();
    const hasRequestBeenSent = canCreateRequest?.canCreate === false;

    const [guaranteeInfo, setGuaranteeInfo] = useState({
        fullname: '',
        bankAccountNumber: '',
        bankName: 0,
    });

    useEffect(() => {
        if (disbursementStage && !guaranteeInfo.bankAccountNumber && !guaranteeInfo.fullname) {
            const bank = bankNames.find((b) => b.label === disbursementStage.guarantee.bankNameString);
            setGuaranteeInfo({
                fullname: disbursementStage.guarantee.fullname || '',
                bankAccountNumber: disbursementStage.guarantee.bankAccountNumber || '',
                bankName: bank ? bank.value : 0,
            });
        }
    }, [disbursementStage]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                bankAccountNumber: guaranteeInfo.bankAccountNumber,
                bankAccountName: guaranteeInfo.fullname,
                bankName: guaranteeInfo.bankName,
                disbursementStageID: stageID,
            };

            console.log('Submitting Disbursement Request:', dataToSubmit);

            await createDisbursementRequest(dataToSubmit).unwrap();
            toast.success('Yêu cầu giải ngân đã được gửi!');
            await refetchCanCreateRequest();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi gửi yêu cầu!');
        }
    };

    if (isLoading) return <div className="text-center">Loading...</div>;
    if (isError) return <div className="text-center text-red-500">Error loading disbursement stage!</div>;

    return (
        <>
            {!hasRequestBeenSent ? (
                <form
                    onSubmit={handleSubmit}
                    className="w-full mx-auto p-6 space-y-8 border rounded-lg shadow-lg bg-gray-50 flex flex-col items-center"
                >
                    <h2 className="text-2xl font-bold text-center text-secondary font-serif">
                        Tạo yêu cầu giải ngân cho chiến dịch {disbursementStage?.campaign.title}
                    </h2>

                    <div className="flex flex-wrap justify-center w-full">
                        <div className="space-y-4 w-full md:w-1/2 my-8 flex flex-col items-center">
                            <div className="flex space-x-2 items-center">
                                <h3 className="text-xl font-semibold">Đợt giải ngân:</h3>
                                <Badge className="w-6 h-6 p-2">
                                    {disbursementStage?.disbursementStage.stageNumber}
                                </Badge>
                            </div>
                            <div className="flex items-center">
                                <CircleDollarSign className="mr-2 h-5 w-5 text-teal-500" />
                                <p>Số tiền giải ngân:</p>
                                <span className="ml-2 text-teal-500 font-semibold">
                                    {disbursementStage?.disbursementStage?.disbursementAmount?.toLocaleString('vi-VN')}{' '}
                                    VND
                                </span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="mr-2 h-5 w-5 text-teal-500" />
                                <p>Ngày yêu cầu giải ngân:</p>
                                <span className="ml-2 text-teal-500 font-semibold">
                                    {new Date(disbursementStage?.disbursementStage?.scheduledDate).toLocaleDateString(
                                        'vi-VN',
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 flex flex-col items-center my-8">
                            <h3 className="text-xl font-semibold mb-4">Thông tin hoạt động</h3>
                            {disbursementStage?.activities.map((activity) => (
                                <div key={activity.activityID} className="space-y-4">
                                    <div className="flex items-center">
                                        <Pill className="mr-2 h-5 w-5 text-teal-500" />
                                        <p>Mục đích sử dụng:</p>
                                        <span className="ml-2 text-teal-500 font-semibold">{activity.description}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <CalendarDays className="mr-2 h-5 w-5 text-teal-500" />
                                        <p>Ngày hoạt động:</p>
                                        <span className="ml-2 text-teal-500 font-semibold">
                                            {new Date(activity.activityDate).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-[70%] space-y-4 border rounded-lg p-6 bg-white shadow-md flex flex-col items-center justify-center mx-auto">
                        <h3 className="text-xl font-semibold mb-4">Thông tin nhận giải ngân</h3>
                        <div className="space-y-4 w-full px-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <Label className="text-md font-medium" htmlFor="bankNameSelect">
                                    Tên ngân hàng:
                                </Label>
                                <Select
                                    onValueChange={handleBankSelect}
                                    value={guaranteeInfo.bankName}
                                    disabled={hasRequestBeenSent}
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <Label className="text-md font-medium" htmlFor="bankAccountNumber">
                                    Số tài khoản ngân hàng:
                                </Label>
                                <Input
                                    type="text"
                                    id="bankAccountNumber"
                                    name="bankAccountNumber"
                                    value={guaranteeInfo.bankAccountNumber}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                    disabled={hasRequestBeenSent}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <Label className="text-md font-medium" htmlFor="fullname">
                                    Tên tài khoản ngân hàng:
                                </Label>
                                <Input
                                    type="text"
                                    id="fullname"
                                    name="fullname"
                                    value={guaranteeInfo.fullname}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                    disabled={hasRequestBeenSent}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Button type="submit" className="mt-4">
                            Gửi yêu cầu giải ngân
                        </Button>
                    </div>
                </form>
            ) : (
                <DisbursementRequestDetail hasRequestBeenSent={hasRequestBeenSent} />
            )}
        </>
    );
}
