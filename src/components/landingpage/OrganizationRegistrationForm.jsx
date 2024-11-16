import React, { useState, useRef } from 'react';
import banner from '@/assets/images/b_organization.png';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { ArrowBigUpDash, CheckCircle, Circle } from 'lucide-react';
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
import { useCreateOrganizationGuaranteeMutation } from '@/redux/guarantee/guaranteeApi';
import { useGetBankNamesQuery } from '@/redux/guarantee/getEnumApi';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { organizationTypes } from '@/config/combobox';
import { UPLOAD_FOLDER, uploadMultipleFiles } from '@/lib/cloudinary';

const OrganizationRegistrationForm = ({ onSubmit }) => {
    const { user } = useSelector((state) => state.auth);
    const fileInputRef = useRef();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const steps = [
        { name: 'Điền đơn đăng ký', status: 'active' },
        { name: 'Chờ Admin duyệt', status: 'pending' },
        { name: 'Ký hợp đồng', status: 'pending' },
        { name: 'Hoàn tất đăng ký', status: 'pending' },
    ];

    const [organizationData, setOrganizationData] = useState({
        organizationName: '', //tên tổ chức
        licenseToOperate: '', //giấy phép hoạt động
        organizationType: '', //lĩnh vực hoạt động chính
        organizationAddress: '', //địa chỉ trụ sở chính
        socialMediaLinks: '', //thông tin giới thiệu hoạt động
        volunteerExperienceFiles: '', //thành tích, khen thưởng
        representativeName: '', //họ tên
        organizationPhoneNumber: '', //số điện thoại
        bankName: '', // tên ngân hàng
        bankAccountNumber: '', // số tài khoản ngân hàng
    });

    const [createOrganizationGuarantee, { isLoading, isSuccess, isError }] = useCreateOrganizationGuaranteeMutation();
    const { data: bankNames, isLoading: isLoadingBanks } = useGetBankNamesQuery();

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

    const handleButtonAddFile = () => {
        fileInputRef.current.click();
    };

    const handleSaveImages = async () => {
        try {
            let experienceUrls = '';

            if (uploadedFiles.length > 0) {
                const res = await uploadMultipleFiles({
                    files: uploadedFiles,
                    folder: UPLOAD_FOLDER.getUserExperienceFolder(user?.userID),
                });
                experienceUrls = res.map((file) => file.secure_url).join(',');
            }

            return experienceUrls;
        } catch (error) {
            console.error('Lỗi khi lưu ảnh:', error);
            throw error;
        }
    };
    const handleSubmitForm = async () => {
        try {
            const uploadedUrls = await handleSaveImages();

            const updatedData = {
                ...organizationData,
                volunteerExperienceFiles: uploadedUrls || '',
            };

            const payload = {
                userID: user?.userID,
                organizationName: updatedData.organizationName,
                licenseToOperate: updatedData.licenseToOperate,
                organizationType: updatedData.organizationType,
                organizationAddress: updatedData.organizationAddress,
                socialMediaLinks: updatedData.socialMediaLinks,
                volunteerExperienceFiles: updatedData.volunteerExperienceFiles,
                representativeName: updatedData.representativeName,
                organizationPhoneNumber: updatedData.organizationPhoneNumber,
                bankName: updatedData.bankName,
                bankAccountNumber: updatedData.bankAccountNumber,
            };

            await createOrganizationGuarantee(payload).unwrap();

            setShowConfirmation(false);
            toast.success('Đăng ký thành công!');
            if (onSubmit) {
                onSubmit();
            }
        } catch (error) {
            toast.error('Đã có lỗi xảy ra khi đăng ký!');
            console.error('Error while registering:', error);
            if (error.data && error.data.errors) {
                console.error('Validation errors:', error.data.errors);
            }
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

            {/* Phần thông tin chung của tổ chức */}
            <Card className="my-6">
                <CardHeader className="bg-teal-600 text-white p-4 rounded-t-sm">
                    <CardTitle className="text-lg font-bold">Phần 1: Thông tin chung của tổ chức</CardTitle>
                </CardHeader>
                <CardContent className="bg-white rounded-md p-4 shadow-sm">
                    <Label htmlFor="organizationName" className="block text-black font-semibold mb-1">
                        Tên tổ chức <span className="text-red-600">*</span>
                    </Label>
                    <Input
                        id="organizationName"
                        type="text"
                        placeholder="Nhập đầy đủ tên của tổ chức"
                        className="w-full border-none"
                        value={organizationData.organizationName}
                        onChange={(e) => setOrganizationData({ ...organizationData, organizationName: e.target.value })}
                    />
                    <hr className="w-[50%] border-black border-b-[1px]" />
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardContent className="bg-white rounded-sm p-4 shadow-sm">
                    <Label htmlFor="website" className="block text-black font-semibold mb-1">
                        Giấy phép hoạt động <span className="text-red-600">*</span>
                    </Label>
                    <Input
                        id="website"
                        type="text"
                        placeholder="Nhập đường dẫn"
                        className="w-full border-none"
                        value={organizationData.licenseToOperate}
                        onChange={(e) => setOrganizationData({ ...organizationData, licenseToOperate: e.target.value })}
                    />
                    <hr className="w-[50%] border-black border-b-[1px]" />
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardContent className="bg-white rounded-sm p-4 shadow-sm">
                    <Label htmlFor="organizationType" className="block text-black font-semibold mb-1">
                        Lĩnh vực hoạt động chính <span className="text-red-600">*</span>
                    </Label>

                    <Select
                        onValueChange={(value) =>
                            setOrganizationData({ ...organizationData, organizationType: Number(value) })
                        }
                    >
                        <SelectTrigger className="w-full border-none">
                            <SelectValue placeholder="Chọn lĩnh vực hoạt động" />
                        </SelectTrigger>
                        <hr className="w-[50%] border-black border-b-[1px]" />
                        <SelectContent>
                            {organizationTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardContent className="bg-white rounded-sm p-4 shadow-sm">
                    <Label htmlFor="address" className="block text-black font-semibold mb-1">
                        Địa chỉ trụ sở chính <span className="text-red-600">*</span>
                    </Label>
                    <Input
                        id="address"
                        type="text"
                        placeholder="Địa chỉ của tổ chức"
                        className="w-full border-none"
                        value={organizationData.organizationAddress}
                        onChange={(e) =>
                            setOrganizationData({ ...organizationData, organizationAddress: e.target.value })
                        }
                    />
                    <hr className="w-[50%] border-black border-b-[1px]" />
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
                        value={organizationData.socialMediaLinks}
                        onChange={(e) => setOrganizationData({ ...organizationData, socialMediaLinks: e.target.value })}
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
                    <Label htmlFor="contactPerson" className="block text-black font-semibold mb-1">
                        Thông tin người đại diện liên hệ
                    </Label>
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardContent className="bg-white rounded-sm p-4 shadow-sm">
                    <Label htmlFor="name" className="block text-black font-semibold mb-1">
                        Họ tên <span className="text-red-600">*</span>
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Vd: Nguyễn Văn A"
                        className="w-full border-none"
                        value={organizationData.representativeName}
                        onChange={(e) =>
                            setOrganizationData({ ...organizationData, representativeName: e.target.value })
                        }
                    />
                    <hr className="w-[50%] border-black border-b-[1px]" />
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardContent className="bg-white rounded-sm p-4 shadow-sm">
                    <Label htmlFor="phone" className="block text-black font-semibold mb-1">
                        Điện thoại <span className="text-red-600">*</span>
                    </Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="Số điện thoại"
                        className="w-full border-none"
                        pattern="[0-9]*"
                        value={organizationData.organizationPhoneNumber}
                        onChange={(e) =>
                            setOrganizationData({ ...organizationData, organizationPhoneNumber: e.target.value })
                        }
                        onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ''))}
                    />
                    <hr className="w-[50%] border-black border-b-[1px]" />
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
                            onValueChange={(value) =>
                                setOrganizationData({ ...organizationData, bankName: Number(value) })
                            }
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
                        value={organizationData.bankAccountNumber}
                        maxLength={15}
                        onChange={(e) =>
                            setOrganizationData({ ...organizationData, bankAccountNumber: e.target.value })
                        }
                    />
                    <hr className="w-[50%] border-black border-b-[1px]" />
                </CardContent>
            </Card>

            <div className="flex justify-end mt-6">
                <Button
                    variant="solid"
                    className="bg-gradient-to-b from-teal-400 to-teal-600 text-white px-6 py-2 rounded-lg shadow"
                    onClick={handleFinish}
                    disabled={isLoading}
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
                                onClick={handleSubmitForm}
                                className="bg-teal-600 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang đăng ký...' : 'ĐĂNG KÝ'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default OrganizationRegistrationForm;
