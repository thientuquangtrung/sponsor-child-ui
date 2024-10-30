import * as React from 'react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useGetBankNamesQuery } from '@/redux/guarantee/getEnumApi';
import { useCreateDisbursementRequestMutation } from '@/redux/guarantee/disbursementRequestApi';

export function CreateDisbursementRequest() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [createDisbursementRequest, { isLoading }] = useCreateDisbursementRequestMutation();
    const [formData, setFormData] = useState({
        bankAccountNumber: '',
        bankAccountName: '',
        bankName: '',
        disbursementStageID: '',
    });
    const [errors, setErrors] = useState({
        bankAccountNumber: '',
        bankAccountName: '',
        bankName: '',
    });
    const [touched, setTouched] = useState({
        bankAccountNumber: false,
        bankAccountName: false,
        bankName: false,
    });

    const { data: bankNames, isLoading: isLoadingBanks } = useGetBankNamesQuery();

    const validateFields = () => {
        const newErrors = {
            bankAccountNumber: '',
            bankAccountName: '',
            bankName: '',
        };

        if (
            (touched.bankAccountNumber || formData.bankAccountNumber) &&
            (formData.bankAccountNumber.length < 6 || formData.bankAccountNumber.length > 15)
        ) {
            newErrors.bankAccountNumber = 'Số tài khoản ngân hàng phải có từ 6 đến 15 chữ số.';
        }

        if (touched.bankAccountName && !formData.bankAccountName.trim()) {
            newErrors.bankAccountName = 'Tên tài khoản ngân hàng không được để trống.';
        }

        if (touched.bankName && !formData.bankName) {
            newErrors.bankName = 'Vui lòng chọn tên ngân hàng.';
        }

        if (JSON.stringify(newErrors) !== JSON.stringify(errors)) {
            setErrors(newErrors);
        }

        const isFormValid =
            Object.values(newErrors).every((error) => error === '') &&
            formData.bankAccountNumber.trim() !== '' &&
            formData.bankAccountName.trim() !== '' &&
            formData.bankName !== '';

        return isFormValid;
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const stageID = queryParams.get('stageID');
        if (stageID && formData.disbursementStageID !== stageID) {
            setFormData((prevData) => ({
                ...prevData,
                disbursementStageID: stageID,
            }));
        }
    }, [location.search]);

    useEffect(() => {
        validateFields();
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateFields()) {
            try {
                await createDisbursementRequest(formData).unwrap();
                toast.success('Tạo yêu cầu giải ngân thành công!');
                navigate('/guarantee/disbursement-requests');
            } catch (error) {
                setErrorMessage('Error creating disbursement request: ' + error.message);
                console.error('Error creating disbursement request:', error);
                toast.error('Đã xảy ra lỗi! Vui lòng thử lại.');
            }
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto p-6 space-y-6 border rounded-lg shadow-lg bg-gray-50">
            <h2 className="text-2xl font-bold text-center text-secondary font-serif">Tạo yêu cầu giải ngân</h2>
            {errorMessage && <div className="text-red-500 text-center mb-4">{errorMessage}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardContent className="bg-white rounded-md p-6 shadow-md">
                        <Label htmlFor="bankName" className="block text-gray-800 font-semibold mb-2 text-md">
                            Tên Ngân hàng <span className="text-red-600">*</span>
                        </Label>
                        {isLoadingBanks ? (
                            <p className="text-gray-600">Đang tải danh sách ngân hàng...</p>
                        ) : (
                            <>
                                <Select
                                    onValueChange={(value) => {
                                        setFormData({ ...formData, bankName: Number(value) });
                                        validateFields();
                                    }}
                                    onBlur={() => {
                                        setTouched({ ...touched, bankName: true });
                                        validateFields();
                                    }}
                                >
                                    <SelectTrigger className="w-full border-none focus:ring-2 focus:ring-teal-500 focus:outline-none">
                                        <SelectValue placeholder="Chọn ngân hàng" />
                                    </SelectTrigger>
                                    <hr className="w-full border-gray-300 border-b-[1px]" />
                                    <SelectContent>
                                        {bankNames &&
                                            Object.entries(bankNames).map(([key, bank]) => (
                                                <SelectItem key={key} value={key}>
                                                    {bank}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                {errors.bankName && <p className="text-red-500 mt-1">{errors.bankName}</p>}
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="bg-white rounded-md p-6 shadow-md">
                        <Label htmlFor="bankAccountNumber" className="block text-gray-800 font-semibold mb-2 text-md">
                            Số tài khoản ngân hàng <span className="text-red-600">*</span>
                        </Label>
                        <Input
                            id="bankAccountNumber"
                            type="text"
                            placeholder="Nhập số tài khoản (tối đa 15 chữ số)"
                            className="w-full border-none focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            value={formData.bankAccountNumber}
                            maxLength={15}
                            onChange={(e) => {
                                const inputValue = e.target.value;
                                if (/^[0-9]*$/.test(inputValue)) {
                                    setFormData({ ...formData, bankAccountNumber: inputValue });
                                }
                                validateFields();
                            }}
                            onBlur={() => {
                                setTouched({ ...touched, bankAccountNumber: true });
                                validateFields();
                            }}
                            onKeyDown={(e) => {
                                if (
                                    e.key === 'e' ||
                                    e.key === 'E' ||
                                    e.key === '+' ||
                                    e.key === '-' ||
                                    e.key === '.' ||
                                    e.key === ',' ||
                                    e.key === ' '
                                ) {
                                    e.preventDefault();
                                }
                            }}
                        />

                        <hr className="w-full border-gray-300 border-b-[1px]" />
                        {errors.bankAccountNumber && <p className="text-red-500 mt-1">{errors.bankAccountNumber}</p>}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="bg-white rounded-md p-6 shadow-md">
                        <Label htmlFor="bankAccountName" className="block text-gray-800 font-semibold mb-2 text-md">
                            Tên tài khoản ngân hàng <span className="text-red-600">*</span>
                        </Label>
                        <Input
                            id="bankAccountName"
                            type="text"
                            placeholder="Nhập tên tài khoản ngân hàng"
                            className="w-full border-none focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            value={formData.bankAccountName}
                            onChange={(e) => {
                                setFormData({ ...formData, bankAccountName: e.target.value });
                                validateFields();
                            }}
                            onBlur={() => {
                                setTouched({ ...touched, bankAccountName: true });
                                validateFields();
                            }}
                            required
                        />
                        <hr className="w-full border-gray-300 border-b-[1px]" />
                        {errors.bankAccountName && <p className="text-red-500 mt-1">{errors.bankAccountName}</p>}
                    </CardContent>
                </Card>

                <div className="text-center">
                    <Button
                        type="submit"
                        disabled={!validateFields() || isLoading}
                        className={`px-4 py-2 my-4 gap-2 ${
                            isLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-primary to-secondary'
                        } text-white rounded-md hover:bg-teal-700 transition duration-200`}
                    >
                        {!isLoading && <Send size={18} />}
                        {isLoading ? 'Đang tạo...' : 'Gửi yêu cầu'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default CreateDisbursementRequest;
