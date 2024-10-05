import React, { useState, useRef } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import banner2 from '@/assets/images/b_personal.png';
import { ArrowBigUpDash, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox'; 
import { Radio } from '../ui/radio-group'; 

const PersonalRegistrationForm = () => {
    const [startDate, setStartDate] = useState(null);
    const fileInputRef = useRef();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [showCommitmentForm, setShowCommitmentForm] = useState(false);
    const [showSurveyForm, setShowSurveyForm] = useState(false);
    const [targetAmount, setTargetAmount] = useState('');
    const [isOtherChecked, setIsOtherChecked] = useState(false);
    const [otherPurpose, setOtherPurpose] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);

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

    const handleNextStep = () => {
        if (showCommitmentForm) {
            setShowSurveyForm(true);
        } else {
            setShowCommitmentForm(true);
        }
    };

    const handlePreviousStep = () => {
        if (showSurveyForm) {
            setShowSurveyForm(false);
        } else {
            setShowCommitmentForm(false);
        }
    };

    const handleTargetAmountChange = (event) => {
        const input = event.target.value;
        const numericValue = input.replace(/[^0-9]/g, '');

        if (numericValue === '') {
            setTargetAmount('');
            return;
        }

        const formattedValue = new Intl.NumberFormat().format(numericValue);
        setTargetAmount(formattedValue);
    };

    const handleKeyDown = (event) => {
        if (
            !/[0-9]/.test(event.key) &&
            event.key !== 'Backspace' &&
            event.key !== 'ArrowLeft' &&
            event.key !== 'ArrowRight' &&
            event.key !== 'Delete' &&
            event.key !== 'Tab'
        ) {
            event.preventDefault();
        }
    };

    const handleOtherCheckboxChange = (event) => {
        setIsOtherChecked(event.target.checked);
        if (!event.target.checked) {
            setOtherPurpose('');
        }
    };

    const handleOtherInputChange = (event) => {
        setOtherPurpose(event.target.value);
    };

    const handleFinish = () => {
        setShowConfirmation(true);
    };

    const handleCloseModal = () => {
        setShowConfirmation(false);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(imageUrl);
        }
    };

    const handleButtonAddFileImage = () => {
        document.getElementById('imageUploadInput').click();
    };

    return (
        <div className="flex flex-col p-8 rounded-lg mx-auto my-8 bg-[#c3e2da]">
            {!showCommitmentForm && !showSurveyForm ? (
                <>
                    <h2 className="text-2xl font-semibold mb-6 text-center text-teal-700">
                        Đăng ký mở Tài khoản thanh toán minh bạch
                    </h2>

                    <div className="flex items-center justify-between mt-8 mb-4 relative">
                        <div className="absolute left-[5%] right-[5%] top-[30%] border-t border-gray-400"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-600 text-white font-bold">
                                1
                            </div>
                            <span className="mt-2 text-sm text-black">Thông tin chung</span>
                        </div>

                        <div className="border-t-2 border-gray-500"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-400 text-white font-bold">
                                2
                            </div>
                            <span className="mt-2 text-sm text-gray-500">
                                Cam kết mục đích sử dụng TKTT MB và giới thiệu năng lực hoạt động thiện nguyện
                            </span>
                        </div>

                        <div className="border-t-4 border-gray-500"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-400 text-white font-bold">
                                3
                            </div>
                            <span className="mt-2 text-sm text-gray-500">Câu hỏi khảo sát</span>
                        </div>
                    </div>

                    <div>
                        <img src={banner2} className="rounded-sm my-4" />
                    </div>

                    <Card className="my-6">
                        <CardHeader className="bg-teal-600 text-white p-4 rounded-t-sm">
                            <CardTitle className="text-lg font-bold">Phần 1: Thông tin chung của cá nhân</CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white rounded-md p-4 shadow-sm">
                            <Label htmlFor="fullName" className="block text-black font-semibold mb-1">
                                Họ và Tên <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="organizationName"
                                type="text"
                                placeholder="Vd: Nguyễn Văn A"
                                className="w-full border-none"
                            />
                            <hr className="w-[50%] border-black border-b-[1px]" />
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="flex flex-row items-center space-x-4 bg-white rounded-sm p-4 shadow-sm">
                            <Label htmlFor="birthday" className="block text-black font-semibold mb-1">
                                Ngày/tháng/năm sinh <span className="text-red-600">*</span>
                            </Label>
                            <div>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    placeholderText="Vd: 01/01/2001"
                                    className="w-full border-none focus:outline-none"
                                    dateFormat="dd/MM/yyyy"
                                />
                                <hr className="w-full border-black border-b-[1px]" />
                            </div>
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
                                placeholder="Số điện thoại của bạn"
                                className="w-full border-none"
                                pattern="[0-9]*"
                                onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ''))}
                            />
                            <hr className="w-[50%] border-black border-b-[1px]" />
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="bg-white rounded-sm p-4 shadow-sm">
                            <Label htmlFor="email" className="block text-black font-semibold mb-1">
                                Email <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Vd: email@example.com"
                                className="w-full border-none"
                            />
                            <hr className="w-[50%] border-black border-b-[1px]" />
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="bg-white rounded-md p-4 shadow-sm">
                            <Label htmlFor="socialAccount" className="block text-black font-semibold mb-2">
                                Tài khoản mạng xã hội của bạn (vui lòng gửi đường link){' '}
                                <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="socialAccount"
                                type="text"
                                placeholder="Nhập đường dẫn tới tài khoản mạng xã hội của bạn"
                                className="w-full border-none"
                            />
                            <hr className="w-full border-black border-b-[1px]" />
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="bg-white rounded-sm p-4 shadow-sm">
                            <Label htmlFor="address" className="block text-black font-semibold mb-1">
                                Địa chỉ thường trú của bạn (phường/xã, quận huyện, thành phố){' '}
                                <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="address"
                                type="text"
                                placeholder="Địa chỉ của bạn"
                                className="w-full border-none"
                            />
                            <hr className="w-[50%] border-black border-b-[1px]" />
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="bg-white rounded-md p-4 shadow-sm">
                            <Label htmlFor="role" className="block text-black font-semibold mb-2">
                                Vai trò của bạn trong CLB/Đội/Nhóm <span className="text-red-600">*</span>
                            </Label>
                            <div className="flex flex-col space-y-2">
                                <label className="flex items-center">
                                    <Radio name="role" value="Sáng lập" className="mr-2" />
                                    <span>Sáng lập</span>
                                </label>
                                <label className="flex items-center">
                                    <Radio name="role" value="Chủ nhiệm" className="mr-2" />
                                    <span>Chủ nhiệm</span>
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="bg-white rounded-md p-4 shadow-sm">
                            <Label htmlFor="clubName" className="block text-black font-semibold mb-2">
                                Tên CLB/Đội/Nhóm của bạn <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="clubName"
                                type="text"
                                placeholder="Vd: Nhóm Từ Thiện A"
                                className="w-full border-none"
                            />
                            <hr className="w-[50%] border-black border-b-[1px]" />
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="bg-white rounded-md p-4 shadow-sm">
                            <Label htmlFor="clubLogo" className="block text-black font-semibold mb-2">
                                Logo, hình ảnh nhận diện CLB/Đội/Nhóm thiện nguyện/của bạn (Chấp nhận các file ảnh){' '}
                                <span className="text-red-600">*</span>
                            </Label>
                            <div className="flex items-center space-x-4">
                                <Button
                                    className="border border-gray-300 px-4 py-2 rounded-sm shadow-sm bg-white text-teal-600 hover:bg-transparent hover:text-teal-600"
                                    onClick={handleButtonAddFileImage}
                                >
                                    <ArrowBigUpDash fill="teal" className="w-6 h-6 mr-2" />
                                    {uploadedImage ? 'Tải lại' : 'Thêm ảnh'}
                                </Button>
                                <input
                                    type="file"
                                    id="imageUploadInput"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {uploadedImage && (
                                    <div>
                                        <img
                                            src={uploadedImage}
                                            alt="Uploaded"
                                            className="w-[20%] h-auto object-cover border rounded-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="bg-white rounded-md p-4 shadow-sm">
                            <Label htmlFor="sponsorship" className="block text-black font-semibold mb-2">
                                CLB/Đội/Nhóm của bạn đang trực thuộc hoặc được bảo trợ bởi tổ chức nào?{' '}
                                <span className="text-red-600">*</span>
                            </Label>
                            <div className="flex flex-col space-y-2">
                                <label className="flex items-center">
                                    <Radio
                                        name="sponsorship"
                                        value="Tổ chức chính trị xã hội"
                                        className="mr-2"
                                    />
                                    Tổ chức chính trị xã hội (Công đoàn, thanh niên, phụ nữ, nông dân, cựu chiến binh...)
                                </label>
                                <label className="flex items-center">
                                    <Radio name="sponsorship" value="Tổ chức xã hội" className="mr-2" />
                                    Tổ chức xã hội (ví dụ Hội Chữ thập đỏ)
                                </label>
                                <label className="flex items-center">
                                    <Radio
                                        name="sponsorship"
                                        value="Tổ chức xã hội nghề nghiệp"
                                        className="mr-2"
                                    />
                                    Tổ chức xã hội nghề nghiệp
                                </label>
                                <label className="flex items-center">
                                    <Radio name="sponsorship" value="Tổ chức tôn giáo" className="mr-2" />
                                    Tổ chức tôn giáo
                                </label>
                                <label className="flex items-center">
                                    <Radio name="sponsorship" value="Tổ chức kinh tế" className="mr-2" />
                                    Tổ chức kinh tế, Doanh nghiệp
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="bg-white rounded-md p-4 shadow-sm">
                            <Label htmlFor="socialLinks" className="block text-black font-semibold mb-2">
                                Đường dẫn/link facebook, website, youtube, instagram, tiktok . . . mô tả, giới thiệu hoạt động, kinh nghiệm, kế hoạch thiện nguyện, cộng đồng đã triển khai{' '}
                                <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="socialLinks"
                                type="text"
                                placeholder="Nhập đường dẫn tới các hoạt động thiện nguyện của bạn"
                                className="w-full border-none"
                            />
                            <hr className="w-[50%] border-black border-b-[1px]" />
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="bg-white rounded-sm p-4 shadow-sm">
                            <Label htmlFor="achievements" className="block text-black font-semibold mb-2">
                                Thành tích, khen thưởng, được ghi nhận trong hoạt động tình nguyện, cộng đồng, xã hội
                                (Đoạn văn ngắn bao gồm đường dẫn/link hoặc đính kèm hình ảnh minh họa)
                            </Label>
                            <p className="block text-sm text-black mt-1">
                                (Chấp nhận các file ảnh, MS Word, MS Excel. Tối đa 5 file, mỗi file dung lượng tối đa
                                20MB)
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

                    <div className="flex justify-between mt-6">
                        <Button
                            className="bg-gradient-to-b from-teal-400 to-teal-600 text-white px-6 py-2 rounded-lg shadow"
                            onClick={handlePreviousStep}
                        >
                            Quay lại
                        </Button>
                        <Button
                            variant="solid"
                            className="bg-gradient-to-b from-teal-400 to-teal-600 text-white px-6 py-2 rounded-lg shadow"
                            onClick={handleNextStep}
                        >
                            Tiếp tục
                        </Button>
                    </div>
                </>
            ) : showCommitmentForm && !showSurveyForm ? (
                <>
                    <h2 className="text-2xl font-semibold mb-6 text-center text-teal-700">
                        Đăng ký mở Tài khoản thanh toán minh bạch
                    </h2>

                    <div className="flex items-center justify-between mt-8 mb-4 relative">
                        <div className="absolute left-[5%] right-[5%] top-[30%] border-t border-gray-400 z-0"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-600 text-white font-bold">
                                <Check size={16} />
                            </div>
                            <span className="mt-2 text-sm text-black">Thông tin chung</span>
                        </div>

                        <div className="border-t-2 border-gray-400"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-600 text-white font-bold">
                                2
                            </div>
                            <span className="mt-2 text-sm text-black">
                                Cam kết mục đích sử dụng TKTT MB và giới thiệu năng lực hoạt động thiện nguyện
                            </span>
                        </div>

                        <div className="border-t-2 border-gray-400"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-400 text-white font-bold">
                                3
                            </div>
                            <span className="mt-2 text-sm text-gray-500">Câu hỏi khảo sát</span>
                        </div>
                    </div>

                    <Card className="my-6">
                        <CardHeader className="bg-teal-600 text-white p-4 rounded-t-sm">
                            <CardTitle className="text-lg font-bold">
                                Phần 2: Cam kết mục đích sử dụng Tài khoản thanh toán minh bạch
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white rounded-md p-4 shadow-sm">
                            <Label htmlFor="purpose" className="block text-black font-semibold mb-2">
                                Anh chị/tổ chức cam kết sử dụng TKTT MB cho mục đích nào sau đây?{' '}
                                <span className="text-red-600">*</span>
                            </Label>
                            <div className="flex flex-col space-y-2">
                                <label className="flex items-center">
                                    <Checkbox className="mr-2" />
                                    Vận động, tiếp nhận các nguồn đóng góp tự nguyện
                                </label>
                                <label className="flex items-center">
                                    <Checkbox className="mr-2" />
                                    Vận động gây quỹ nhằm phát triển, thực hiện các dự án cộng đồng
                                </label>
                                <label className="flex items-center">
                                    <Checkbox className="mr-2" />
                                    Để công khai minh bạch đối với nhà tài trợ, người ủng hộ, người đóng góp
                                </label>
                                <label className="flex items-center">
                                    <Checkbox className="mr-2" />
                                    Các mục đích phi lợi nhuận khác
                                </label>
                                <label className="flex items-center">
                                    <Checkbox className="mr-2" onChange={handleOtherCheckboxChange} />
                                    Mục khác:
                                </label>
                                {isOtherChecked && (
                                    <div className="mt-2">
                                        <Input
                                            type="text"
                                            value={otherPurpose}
                                            onChange={handleOtherInputChange}
                                            placeholder="Vui lòng nhập mục đích khác"
                                            className="w-full border-none"
                                        />
                                        <hr className="w-full border-black border-b-[1px]" />
                                        {otherPurpose === '' && (
                                            <p className="text-red-600 text-sm">Đây là một câu hỏi bắt buộc</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="bg-white rounded-md p-4 shadow-sm">
                            <Label htmlFor="disclosure" className="block text-black font-semibold mb-2">
                                Anh chị/tổ chức có cam kết công bố công khai việc sử dụng TKTT MB trên kênh thông tin
                                đại chúng các nội dung sau? <span className="text-red-600">*</span>
                            </Label>
                            <div className="flex flex-col space-y-2">
                                <label className="flex items-center">
                                    <Radio value="Đồng ý" name="disclosure" className="mr-2" />
                                    Đồng ý
                                </label>
                                <label className="flex items-center">
                                    <Radio value="Chưa chắc chắn" name="disclosure" className="mr-2" />
                                    Chưa chắc chắn
                                </label>
                                <label className="flex items-center">
                                    <Radio value="Không đồng ý" name="disclosure" className="mr-2" />
                                    Không đồng ý
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="bg-white rounded-md p-4 shadow-sm">
                            <Label htmlFor="planDescription" className="block text-black font-semibold mb-2">
                                Mô tả kế hoạch gây quỹ, vận động ủng hộ thông qua TKTT MB và ứng dụng Sponsor Child
                                trong 3 tháng tới
                            </Label>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="bg-white rounded-md p-4 shadow-sm">
                            <Label htmlFor="objective" className="block text-black font-semibold mb-2">
                                Tên mục tiêu <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="objective"
                                type="text"
                                placeholder="Vd: Trường mới cho em"
                                className="w-full border-none"
                            />
                            <hr className="w-full border-black border-b-[1px]" />
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="bg-white rounded-md p-4 shadow-sm">
                            <Label htmlFor="targetAmount" className="block text-black font-semibold mb-2">
                                Số tiền mục tiêu <span className="text-red-600">*</span>
                            </Label>
                            <Input
                                id="targetAmount"
                                type="text"
                                value={targetAmount}
                                onChange={handleTargetAmountChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Vd: 1,000,000,000"
                                className="w-full border-none"
                            />
                            <hr className="w-full border-black border-b-[1px]" />
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="flex flex-row items-center space-x-4 bg-white rounded-sm p-4 shadow-sm">
                            <Label htmlFor="establishmentDate" className="block text-black font-semibold mb-1">
                                Ngày bắt đầu <span className="text-red-600">*</span>
                            </Label>
                            <div>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    placeholderText="Vd: 01/09/2022"
                                    className="w-full border-none focus:outline-none"
                                    dateFormat="dd/MM/yyyy"
                                />
                                <hr className="w-full border-black border-b-[1px]" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="flex flex-row items-center space-x-4 bg-white rounded-sm p-4 shadow-sm">
                            <Label htmlFor="establishmentDate" className="block text-black font-semibold mb-1">
                                Ngày kết thúc <span className="text-red-600">*</span>
                            </Label>
                            <div>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    placeholderText="Vd: 01/11/2022"
                                    className="w-full border-none focus:outline-none"
                                    dateFormat="dd/MM/yyyy"
                                />
                                <hr className="w-full border-black border-b-[1px]" />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-between mt-6">
                        <Button
                            className="bg-gradient-to-b from-teal-400 to-teal-600 text-white px-6 py-2 rounded-lg shadow"
                            onClick={handlePreviousStep}
                        >
                            Quay lại
                        </Button>
                        <Button
                            variant="solid"
                            className="bg-gradient-to-b from-teal-400 to-teal-600 text-white px-6 py-2 rounded-lg shadow"
                            onClick={handleNextStep}
                        >
                            Tiếp tục
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-semibold mb-6 text-center text-teal-700">
                        Đăng ký mở Tài khoản thanh toán minh bạch
                    </h2>

                    <div className="flex items-center justify-between mt-8 mb-4 relative">
                        <div className="absolute left-[5%] right-[5%] top-[30%] border-t border-gray-400 z-0"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-600 text-white font-bold">
                                <Check size={16} />
                            </div>
                            <span className="mt-2 text-sm text-black">Thông tin chung</span>
                        </div>

                        <div className="border-t-2 border-gray-400"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-600 text-white font-bold">
                                <Check size={16} />
                            </div>
                            <span className="mt-2 text-sm text-black">
                                Cam kết mục đích sử dụng TKTT MB và giới thiệu năng lực hoạt động thiện nguyện
                            </span>
                        </div>

                        <div className="border-t-2 border-gray-400"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-teal-600 text-white font-bold">
                                3
                            </div>
                            <span className="mt-2 text-sm text-black">Câu hỏi khảo sát</span>
                        </div>
                    </div>

                    <Card className="my-6">
                        <CardHeader className="bg-teal-600 text-white p-4 rounded-t-sm">
                            <CardTitle className="text-lg font-bold">Phần 3: Câu hỏi khảo sát</CardTitle>
                        </CardHeader>
                        <CardContent className="bg-white rounded-md p-4 shadow-sm">
                            <Label htmlFor="surveyPlatform" className="block text-black font-semibold mb-2">
                                Anh chị biết đến nền tảng gây quỹ, ủng hộ trực tuyến nào sau đây?
                            </Label>
                            <div className="flex flex-col space-y-2">
                                <label className="flex items-center">
                                    <Checkbox className="mr-2" />
                                    Momo
                                </label>
                                <label className="flex items-center">
                                    <Checkbox className="mr-2" />
                                    VinID
                                </label>
                                <label className="flex items-center">
                                    <Checkbox className="mr-2" />
                                    Grab
                                </label>
                                <label className="flex items-center">
                                    <Checkbox className="mr-2" />
                                    Kickstarter
                                </label>
                                <label className="flex items-center">
                                    <Checkbox className="mr-2" onChange={handleOtherCheckboxChange} />
                                    Mục khác:
                                </label>
                                {isOtherChecked && (
                                    <div className="mt-2">
                                        <Input
                                            type="text"
                                            value={otherPurpose}
                                            onChange={handleOtherInputChange}
                                            placeholder="Vui lòng nhập mục khác"
                                            className="w-full border-none"
                                        />
                                        <hr className="w-full border-black border-b-[1px]" />
                                        {otherPurpose === '' && (
                                            <p className="text-red-600 text-sm">Đây là một câu hỏi bắt buộc</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="bg-white rounded-md p-4 shadow-sm">
                            <Label htmlFor="legalKnowledge" className="block text-black font-semibold mb-2">
                                Anh chị có biết đến các quy định pháp luật nào dưới đây?
                            </Label>
                            <div className="flex flex-col space-y-2">
                                <label className="flex items-center">
                                    <Checkbox className="mr-2" />
                                    Nghị định 93/2021/NĐ-CP về vận động, tiếp nhận, phân phối và sử dụng các nguồn đóng
                                    góp tự nguyện...
                                </label>
                                <label className="flex items-center">
                                    <Checkbox className="mr-2" />
                                    Nghị định 93/2019/NĐ-CP về tổ chức, hoạt động của quỹ xã hội, quỹ từ thiện
                                </label>
                                <label className="flex items-center">
                                    <Checkbox className="mr-2" />
                                    Nghị định 45/2010/NĐ-CP quy định về tổ chức, hoạt động và quản lý hội
                                </label>
                                <label className="flex items-center">
                                    <Checkbox className="mr-2" />
                                    Thông tư 41/2022/TT-BTC hướng dẫn Chế độ kế toán áp dụng cho các hoạt động xã hội,
                                    từ thiện các quy định pháp luật liên quan
                                </label>
                                <label className="flex items-center">
                                    <Checkbox className="mr-2" />
                                    Không biết quy định pháp luật này liên quan
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardContent className="bg-white rounded-md p-4 shadow-sm">
                            <Label htmlFor="awareness" className="block text-black font-semibold mb-2">
                                Anh chị biết đến tài khoản minh bạch và ứng dụng Sponsor Child qua kênh chính nào sau
                                đây
                            </Label>
                            <div className="flex flex-col space-y-2">
                                <label className="flex items-center">
                                    <Radio
                                        name="awareness"
                                        value="Truyền hình, Báo giấy, Báo điện tử"
                                        className="mr-2"
                                    />
                                    Truyền hình, Báo giấy, Báo điện tử
                                </label>
                                <label className="flex items-center">
                                    <Radio name="awareness" value="Công cụ tìm kiếm" className="mr-2" />
                                    Công cụ tìm kiếm
                                </label>
                                <label className="flex items-center">
                                    <Radio name="awareness" value="Nhân viên MB tư vấn" className="mr-2" />
                                    Nhân viên MB tư vấn
                                </label>
                                <label className="flex items-center">
                                    <Radio name="awareness" value="Bạn bè giới thiệu" className="mr-2" />
                                    Bạn bè giới thiệu
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-between mt-6">
                        <Button
                            className="bg-gradient-to-b from-teal-400 to-teal-600 text-white px-6 py-2 rounded-lg shadow"
                            onClick={handlePreviousStep}
                        >
                            Quay lại
                        </Button>
                        <Button
                            variant="solid"
                            className="bg-gradient-to-b from-teal-400 to-teal-600 text-white px-6 py-2 rounded-lg shadow"
                            onClick={handleFinish}
                        >
                            Tiếp tục
                        </Button>
                    </div>

                    {showConfirmation && (
                        <Dialog open={showConfirmation} onOpenChange={handleCloseModal}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Xác nhận đăng ký mở tài khoản thanh toán minh bạch?</DialogTitle>
                                </DialogHeader>
                                <p className="mt-2 text-black">
                                    Bằng việc sử dụng ứng dụng Sponsor Child hay tạo tài khoản tại Sponsor Child, Tài
                                    khoản sponsor child sẽ đồng hành cùng bạn thực hiện sứ mệnh cộng đồng.
                                </p>
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
                                        onClick={() => alert('Đăng ký thành công!')}
                                        className="bg-teal-600 text-white"
                                    >
                                        ĐĂNG KÝ
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </>
            )}
        </div>
    );
};

export default PersonalRegistrationForm;
