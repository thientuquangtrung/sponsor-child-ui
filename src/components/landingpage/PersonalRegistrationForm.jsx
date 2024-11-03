import React, { useState, useRef } from 'react';
import banner from '@/assets/images/b_personal.png';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { ArrowBigUpDash, CheckCircle, Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useCreateIndividualGuaranteeMutation } from '@/redux/guarantee/guaranteeApi';
import { useGetBankNamesQuery } from '@/redux/guarantee/getEnumApi';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { parse, format } from 'date-fns';

const PersonalRegistrationForm = ({ onSubmit }) => {
    const { user } = useSelector((state) => state.auth);
    const fileInputRef = useRef();
    const form = useForm();
    const frontCIInputRef = useRef(null);
    const backCIInputRef = useRef(null);
    const [frontCI, setFrontCI] = useState(null);
    const [backCI, setBackCI] = useState(null);
    const [cccdData, setCccdData] = useState({
        id: '',
        name: '',
        dob: '',
        address: '',
        issue_date: '',
        issue_location: '',
    });

    const convertToISOString = (dateString) => {
        if (!dateString) return null;

        try {
            const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
            return format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        } catch (error) {
            console.error('Error converting date:', error);
            return null;
        }
    };
    const [isScanned, setIsScanned] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const steps = [
        { name: 'Điền đơn đăng ký', status: 'active' },
        { name: 'Chờ Admin duyệt', status: 'pending' },
        { name: 'Ký hợp đồng', status: 'pending' },
        { name: 'Hoàn tất đăng ký', status: 'pending' },
    ];

    const [personalData, setPersonalData] = useState({
        bankAccountNumber: '', // số tài khoản ngân hàng
        bankName: '', // tên ngân hàng
        citizenIdentification: '', // số cccd
        frontCIImageUrl: '', // hình ảnh mặt trước cccd
        backCIImageUrl: '', // hình ảnh mặt sau cccd
        householdRegistrationAddress: '', //địa chỉ đăng ký hộ khẩu
        permanentAddress: '', //địa chỉ thường trú
        socialMediaLinks: '', //thông tin giới thiệu hoạt động
        volunteerExperienceFiles: '', //thành tích, khen thưởng
    });

    const [createIndividualGuarantee, { isLoading, isSuccess, isError }] = useCreateIndividualGuaranteeMutation();
    const { data: bankNames, isLoading: isLoadingBanks } = useGetBankNamesQuery();

    const uploadToCloudinary = async (file, folder) => {
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
            if (!response.ok) {
                throw new Error(result.error.message);
            }
            return result.secure_url;
        } catch (error) {
            console.error('Upload failed:', error);
            throw error;
        }
    };

    const handleButtonAddFile = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const maxFileSize = 20 * 1024 * 1024;

        if (files.length > 5) {
            alert('Bạn chỉ được tải lên tối đa 5 file.');
            return;
        }

        for (let file of files) {
            if (file.size > maxFileSize) {
                alert('Mỗi file không được vượt quá 20MB.');
                return;
            }
        }
        setUploadedFiles(files);
    };

    const handleFrontCCCDChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setFrontCI({ file, preview });
        }
    };

    const handleBackCCCDChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setBackCI({ file, preview });
        }
    };

    const handleUploadAllImages = async () => {
        try {
            let uploadedUrls = [];

            const experienceFolder = `user_001/guarantee/experiences`;
            const cccdFolder = `user_001/guarantee/cccd`;

            if (uploadedFiles.length > 0) {
                for (const file of uploadedFiles) {
                    const url = await uploadToCloudinary(file, experienceFolder);
                    uploadedUrls.push(url);
                }
            }

            let frontCIUrl = '';
            if (frontCI?.file) {
                frontCIUrl = await uploadToCloudinary(frontCI.file, `${cccdFolder}/front`);
                setPersonalData((prev) => ({ ...prev, frontCIImageUrl: frontCIUrl }));
            }

            let backCIUrl = '';
            if (backCI?.file) {
                backCIUrl = await uploadToCloudinary(backCI.file, `${cccdFolder}/back`);
                setPersonalData((prev) => ({ ...prev, backCIImageUrl: backCIUrl }));
            }

            return { uploadedUrls, frontCIUrl, backCIUrl };
        } catch (error) {
            console.error('Lỗi khi lưu ảnh:', error);
            throw error;
        }
    };

    const uploadCCCDAndRecognize = async (file, type) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('https://api.fpt.ai/vision/idr/vnm', {
                method: 'POST',
                headers: {
                    'api-key': 'CXOOmOxGb7Y8jLIbVFhACpvWoi4tOfEI',
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            if (type === 'front') {
                setCccdData((prevData) => ({
                    ...prevData,
                    id: data?.data[0]?.id || '',
                    name: data?.data[0]?.name || '',
                    dob: data?.data[0]?.dob || '',
                    address: data?.data[0]?.address || '',
                }));
            } else if (type === 'back') {
                setCccdData((prevData) => ({
                    ...prevData,
                    issue_date: data?.data[0]?.issue_date || '',
                    issue_location: data?.data[0]?.issue_loc || '',
                }));
            }
        } catch (error) {
            console.error('Failed to recognize CCCD:', error);
        }
    };

    const handleScanCCCD = async () => {
        if (frontCI?.file) {
            await uploadCCCDAndRecognize(frontCI.file, 'front');
        }
        if (backCI?.file) {
            await uploadCCCDAndRecognize(backCI.file, 'back');
        }
        setIsScanned(true);
    };

    const removeImage = (setImage, image, inputRef, type) => {
        if (image) {
            URL.revokeObjectURL(image.preview);
            setImage(null);
            if (type === 'front') {
                setCccdData((prevData) => ({ ...prevData, id: '', name: '', dob: '', address: '' }));
            } else if (type === 'back') {
                setCccdData((prevData) => ({ ...prevData, issue_date: '', issue_location: '' }));
            }
            inputRef.current.value = '';
        }
    };

    const isFormComplete = () => {
        return (
            frontCI &&
            backCI &&
            cccdData.id &&
            cccdData.name &&
            cccdData.dob &&
            cccdData.address &&
            cccdData.issue_date &&
            cccdData.issue_location &&
            personalData.householdRegistrationAddress &&
            personalData.permanentAddress &&
            personalData.bankAccountNumber &&
            personalData.bankName &&
            personalData.socialMediaLinks
        );
    };

    const handleSubmitForm = async () => {
        try {
            const { uploadedUrls, frontCIUrl, backCIUrl } = await handleUploadAllImages();

            const updatedData = {
                ...personalData,
                frontCIImageUrl: frontCIUrl,
                backCIImageUrl: backCIUrl,
                volunteerExperienceFiles: uploadedUrls.join(','),
                citizenIdentification: cccdData.id,
                issue_date: cccdData.issue_date,
                issue_location: cccdData.issue_location,
            };

            const payload = {
                userID: user?.userID,
                bankName: updatedData.bankName,
                bankAccountNumber: updatedData.bankAccountNumber,
                citizenIdentification: updatedData.citizenIdentification,
                frontCIImageUrl: updatedData.frontCIImageUrl,
                backCIImageUrl: updatedData.backCIImageUrl,
                householdRegistrationAddress: updatedData.householdRegistrationAddress,
                permanentAddress: updatedData.permanentAddress,
                socialMediaLinks: updatedData.socialMediaLinks,
                issueDate: convertToISOString(updatedData.issue_date),
                issueLocation: updatedData.issue_location,
                volunteerExperienceFiles: updatedData.volunteerExperienceFiles,
            };

            console.log('Payload being sent:', payload);

            const response = await createIndividualGuarantee(payload).unwrap();
            console.log('Response from server:', response);

            setShowConfirmation(false);
            toast.success('Đăng ký thành công!');

            if (onSubmit) {
                onSubmit();
            }
        } catch (error) {
            console.error('Error while registering:', error);
            if (error.data) {
                console.error('Error details from server:', error.data);
                if (error.data.errors) {
                    console.error('Validation errors:', error.data.errors);
                }
            }
            toast.error('Đã có lỗi xảy ra khi đăng ký!');
        }
    };

    const handleFinish = () => {
        setShowConfirmation(true);
    };

    const handleCloseModal = () => {
        setShowConfirmation(false);
    };

    return (
        <div className="flex flex-col p-8 rounded-lg mx-auto my-8 bg-[#c3e2da]">
            <h2 className="text-2xl font-semibold text-center text-teal-700">
                Đăng ký mở Tài khoản trở thành Người Bảo Lãnh
            </h2>

            <div className="flex justify-between items-center my-10">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        {step.status === 'active' ? (
                            <CheckCircle className="text-teal-600" />
                        ) : (
                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-400 text-white">
                                <span>{index + 1}</span>
                            </div>
                        )}
                        <span className={`${step.status === 'active' ? 'text-teal-600 font-bold' : 'text-gray-400'}`}>
                            {step.name}
                        </span>
                        {index < steps.length - 1 && <div className="w-[200px] border-t border-gray-400"></div>}
                    </div>
                ))}
            </div>

            <img src={banner} alt="Banner" className="mx-auto mb-4 rounded-sm" />

            {/* Phần thông tin cá nhân */}
            <Card className="my-6">
                <CardHeader className="bg-teal-600 text-white p-4 rounded-t-sm">
                    <CardTitle className="text-lg font-bold">Phần 1: Thông tin cá nhân</CardTitle>
                </CardHeader>
                <CardContent className="bg-white rounded-md p-4 shadow-sm">
                    <Label htmlFor="organizationName" className="block text-black font-semibold mb-1">
                        Địa chỉ đăng ký hộ khẩu <span className="text-red-600">*</span>
                    </Label>
                    <Input
                        id="householdRegistrationAddress"
                        type="text"
                        placeholder="Nhập địa chỉ"
                        className="w-full border-none"
                        value={personalData.householdRegistrationAddress}
                        onChange={(e) =>
                            setPersonalData({ ...personalData, householdRegistrationAddress: e.target.value })
                        }
                    />
                    <hr className="w-[50%] border-black border-b-[1px]" />
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardContent className="bg-white rounded-sm p-4 shadow-sm">
                    <Label htmlFor="website" className="block text-black font-semibold mb-1">
                        Địa chỉ thường trú <span className="text-red-600">*</span>
                    </Label>
                    <Input
                        id="website"
                        type="text"
                        placeholder="Nhập địa chỉ"
                        className="w-full border-none"
                        value={personalData.permanentAddress}
                        onChange={(e) => setPersonalData({ ...personalData, permanentAddress: e.target.value })}
                    />
                    <hr className="w-[50%] border-black border-b-[1px]" />
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardContent className="bg-white rounded-md p-4 shadow-sm">
                    <p className="text-gray-500 my-4 italic">
                        * Cam kết ảnh CCCD chỉ được sử dụng cho mục đích xác minh danh tính và không chia sẻ với bên thứ
                        ba.
                    </p>
                    <div className="flex flex-col md:flex-row space-x-4">
                        {/* Mặt trước CCCD */}
                        <div className="w-full md:w-1/2">
                            <Label htmlFor="frontCCCD" className="block text-black font-semibold mb-2">
                                Mặt trước CCCD <span className="text-red-600">*</span>
                            </Label>
                            <div className="w-full h-[200px] md:w-[300px] border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                                {frontCI ? (
                                    <div className="relative">
                                        <img
                                            src={frontCI.preview}
                                            alt="Mặt trước CCCD"
                                            className="object-cover w-full h-full rounded-md"
                                        />
                                        <Button
                                            onClick={() => removeImage(setFrontCI, frontCI, frontCIInputRef, 'front')}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-8 h-8 hover:bg-red-600"
                                        >
                                            <X />
                                        </Button>
                                    </div>
                                ) : (
                                    <Label
                                        htmlFor="frontCCCDUpload"
                                        className="flex flex-col items-center cursor-pointer"
                                    >
                                        <Upload className="text-gray-400" />
                                        <span className="mt-2 text-gray-500">Thêm mặt trước CCCD</span>
                                    </Label>
                                )}
                                <Input
                                    id="frontCCCDUpload"
                                    type="file"
                                    ref={frontCIInputRef}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFrontCCCDChange}
                                />
                            </div>
                        </div>

                        {/* Mặt sau CCCD */}
                        <div className="w-full md:w-1/2">
                            <Label htmlFor="frontCCCD" className="block text-black font-semibold mb-2">
                                Mặt sau CCCD <span className="text-red-600">*</span>
                            </Label>
                            <div className="w-full h-[200px] md:w-[300px] border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                                {backCI ? (
                                    <div className="relative">
                                        <img
                                            src={backCI.preview}
                                            alt="Mặt sau CCCD"
                                            className="object-cover w-full h-full rounded-md"
                                        />
                                        <Button
                                            onClick={() => removeImage(setBackCI, backCI, backCIInputRef, 'back')}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-8 h-8 hover:bg-red-600"
                                        >
                                            <X />
                                        </Button>
                                    </div>
                                ) : (
                                    <Label
                                        htmlFor="backCCCDUpload"
                                        className="flex flex-col items-center cursor-pointer"
                                    >
                                        <Upload className="text-gray-400" />
                                        <span className="mt-2 text-gray-500">Thêm mặt sau CCCD</span>
                                    </Label>
                                )}
                                <Input
                                    id="backCCCDUpload"
                                    type="file"
                                    ref={backCIInputRef}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleBackCCCDChange}
                                />
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={handleScanCCCD}
                        className="mt-4 bg-secondary text-white hover:bg-normal"
                        disabled={!frontCI || !backCI}
                    >
                        Scan CCCD
                    </Button>

                    {isScanned && (
                        <Form {...form}>
                            <form className="mt-4 space-y-4">
                                <h3 className="font-semibold">Thông tin CCCD:</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormItem>
                                        <FormLabel>Số CCCD</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...form.register('id')}
                                                value={cccdData.id}
                                                onChange={(e) =>
                                                    setCccdData((prevData) => ({ ...prevData, id: e.target.value }))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>

                                    <FormItem>
                                        <FormLabel>Họ tên</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...form.register('name')}
                                                value={cccdData.name}
                                                onChange={(e) =>
                                                    setCccdData((prevData) => ({
                                                        ...prevData,
                                                        name: e.target.value,
                                                    }))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>

                                    <FormItem>
                                        <FormLabel>Ngày sinh</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...form.register('dob')}
                                                value={cccdData.dob}
                                                onChange={(e) =>
                                                    setCccdData((prevData) => ({
                                                        ...prevData,
                                                        dob: e.target.value,
                                                    }))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>

                                    <FormItem>
                                        <FormLabel>Địa chỉ</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...form.register('address')}
                                                value={cccdData.address}
                                                onChange={(e) =>
                                                    setCccdData((prevData) => ({
                                                        ...prevData,
                                                        address: e.target.value,
                                                    }))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>

                                    <FormItem>
                                        <FormLabel>Ngày cấp</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...form.register('issue_date')}
                                                value={cccdData.issue_date}
                                                onChange={(e) =>
                                                    setCccdData((prevData) => ({
                                                        ...prevData,
                                                        issue_date: e.target.value,
                                                    }))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>

                                    <FormItem>
                                        <FormLabel>Nơi cấp</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...form.register('issue_location')}
                                                value={cccdData.issue_location}
                                                onChange={(e) =>
                                                    setCccdData((prevData) => ({
                                                        ...prevData,
                                                        issue_location: e.target.value,
                                                    }))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                </div>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardContent className="bg-white rounded-sm p-4 shadow-sm">
                    <Label htmlFor="activityIntroduction" className="block text-black font-semibold mb-1">
                        Thông tin giới thiệu hoạt động, kinh nghiệm, kế hoạch thiện nguyện của tổ chức (Đường dẫn
                        Facebook, website, youtube, instagram, tiktok . . .) <span className="text-red-600">*</span>
                    </Label>
                    <Input
                        id="activityIntroduction"
                        type="text"
                        placeholder="Nhập đường dẫn"
                        className="w-full border-none"
                        value={personalData.socialMediaLinks}
                        onChange={(e) => setPersonalData({ ...personalData, socialMediaLinks: e.target.value })}
                    />
                    <hr className="w-full border-black border-b-[1px]" />
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardContent className="bg-white rounded-sm p-4 shadow-sm">
                    <Label htmlFor="achievements" className="block text-black font-semibold mb-2">
                        Thành tích, khen thưởng, được ghi nhận trong hoạt động tình nguyện, cộng đồng, xã hội (đính kèm
                        hình ảnh minh họa)
                    </Label>
                    <p className="block text-black mt-1">
                        (Chấp nhận các file ảnh. Tối đa 5 file, mỗi file dung lượng tối đa 20MB)
                    </p>
                    <div className="flex items-center mt-4">
                        <Button
                            className="hover:bg-transparent flex items-center justify-center border border-gray-300 text-teal-600 px-4 py-2 rounded-sm shadow-sm bg-white"
                            onClick={handleButtonAddFile}
                        >
                            <ArrowBigUpDash fill="teal" className="mr-2" />{' '}
                            {uploadedFiles.length > 0 ? 'Tải lại' : 'Thêm tệp'}
                        </Button>
                        <Input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                            multiple
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="mt-4">
                        {uploadedFiles.length > 0 && (
                            <ul className="list-disc list-inside text-black">
                                {uploadedFiles.map((file, index) => (
                                    <li key={index} className="mt-1">
                                        {file.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardContent className="bg-white rounded-sm p-4 shadow-sm">
                    <Label htmlFor="bankName" className="block text-black font-semibold mb-1">
                        Tên Ngân hàng <span className="text-red-600">*</span>
                    </Label>
                    {isLoadingBanks ? (
                        <p>Đang tải danh sách ngân hàng...</p>
                    ) : (
                        <Select
                            onValueChange={(value) => setPersonalData({ ...personalData, bankName: Number(value) })}
                        >
                            <SelectTrigger className="w-full border-none">
                                <SelectValue placeholder="Chọn ngân hàng" />
                            </SelectTrigger>
                            <hr className="w-full border-black border-b-[1px]" />
                            <SelectContent>
                                {bankNames &&
                                    Object.entries(bankNames).map(([key, bank]) => (
                                        <SelectItem key={key} value={key}>
                                            {bank}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    )}
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardContent className="bg-white rounded-sm p-4 shadow-sm">
                    <Label htmlFor="bankAccountNumber" className="block text-black font-semibold mb-1">
                        Số tài khoản ngân hàng <span className="text-red-600">*</span>
                    </Label>
                    <Input
                        id="bankAccountNumber"
                        type="number"
                        placeholder="Nhập số tài khoản (tối đa 15 chữ số)"
                        className="w-full border-none"
                        value={personalData.bankAccountNumber}
                        maxLength={15}
                        onChange={(e) => setPersonalData({ ...personalData, bankAccountNumber: e.target.value })}
                    />
                    <hr className="w-[50%] border-black border-b-[1px]" />
                </CardContent>
            </Card>

            <div className="flex justify-end mt-6">
                <Button
                    variant="solid"
                    className="bg-gradient-to-b from-teal-400 to-teal-600 text-white px-6 py-2 rounded-lg shadow"
                    onClick={handleFinish}
                    disabled={isLoading || !isFormComplete()}
                >
                    {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                </Button>
            </div>

            {showConfirmation && (
                <Dialog open={showConfirmation} onOpenChange={handleCloseModal}>
                    <DialogContent className="max-w-xl">
                        <DialogHeader>
                            <DialogTitle>Xác nhận đăng ký mở tài khoản trở thành Người Bảo Lãnh?</DialogTitle>
                        </DialogHeader>
                        <DialogDescription className="mt-2 text-black">
                            Bằng việc sử dụng web Sponsor Child hay tạo tài khoản tại Sponsor Child, Tài khoản sponsor
                            child sẽ đồng hành cùng bạn thực hiện sứ mệnh cộng đồng.
                        </DialogDescription>
                        <DialogFooter>
                            <Button
                                variant="solid"
                                onClick={handleCloseModal}
                                className="text-teal-600 hover:bg-[#e6f7f3]"
                            >
                                HỦY BỎ
                            </Button>
                            <Button
                                variant="solid"
                                className="bg-gradient-to-b from-teal-400 to-teal-600 text-white px-6 py-2 rounded-lg shadow"
                                onClick={handleSubmitForm}
                                disabled={isLoading || !isScanned}
                            >
                                {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default PersonalRegistrationForm;
