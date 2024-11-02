import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Copy } from 'lucide-react';
import { usePayOS } from 'payos-checkout';
import { toast } from 'sonner';

import { cn, formatNumber } from '@/lib/utils';
import qrcode from '@/assets/images/qrcode.jpg';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useGetCampaignByIdQuery } from '@/redux/campaign/campaignApi';
import {
    useCancelDonationByOrderCodeMutation,
    useCreateDonationMutation,
    useGetDonationsByCampaignIdQuery,
} from '@/redux/donation/donationApi';

const formSchema = z.object({
    amount: z.string().refine((val) => parseInt(val.replace(/\./g, ''), 10) >= 1, {
        message: 'Số tiền ủng hộ tối thiểu là 1 VND',
    }),
    message: z.string().optional(),
    name: z.string().min(1, 'Vui lòng nhập họ và tên'),
    email: z.string().email('Email không hợp lệ'),
    anonymous: z.boolean().optional(),
});

const DonationInformation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const { data: campaign, isLoading, error } = useGetCampaignByIdQuery(id, { skip: !id || !user });
    const { data: donation } = useGetDonationsByCampaignIdQuery(id, { skip: !id || !user });
    const [createDonation, { isLoading: isCreatingDonation }] = useCreateDonationMutation();
    const [cancelDonation, { isLoading: isCancellingDonation }] = useCancelDonationByOrderCodeMutation();
    const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);

    const [payOSConfig, setPayOSConfig] = useState({
        RETURN_URL: window.location.origin, // required
        ELEMENT_ID: 'payment-container', // required
        CHECKOUT_URL: null, // required
        embedded: false, // Nếu dùng giao diện nhúng
        onSuccess: (event) => {
            //TODO: Hành động sau khi người dùng thanh toán đơn hàng thành công
            toast.success('Thanh toán thành công');
            navigate(-1);
        },
        onCancel: async (event) => {
            //TODO: Hành động fail
            try {
                const orderCode = event.orderCode;
                await cancelDonation(orderCode).unwrap();
                toast.error('Thanh toán thất bại');
            } catch (error) {
                console.error('Lỗi khi hủy quyên góp:', error);
            }
        },
    });

    const { open, exit } = usePayOS(payOSConfig);
    useEffect(() => {
        if (payOSConfig.CHECKOUT_URL != null) {
            open();
        }
    }, [payOSConfig]);

    const [amount, setAmount] = useState('0');
    const [openDialog, setOpenDialog] = useState(false);
    const presetAmounts = [50000, 100000, 200000, 500000];
    const [copied, setCopied] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: '0',
            message: '',
            name: user?.fullname || '',
            email: user?.email || '',
            anonymous: false,
        },
    });

    const handleAmountChange = async (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (!value) {
            value = '0';
        }
        if (value.startsWith('0') && value.length > 1) {
            value = value.replace(/^0+/, '');
        }

        const amountValue = parseInt(value, 10);

        const formattedValue = formatNumber(value);
        form.setValue('amount', formattedValue);
        setAmount(formattedValue);

        if (amountValue > 0) {
            await form.trigger('amount');
        }
    };

    const handlePresetAmount = (preset) => {
        const formattedPreset = formatNumber(preset.toString());
        setAmount(formattedPreset);
        form.setValue('amount', formattedPreset);
    };

    const handleCopy = () => {
        const copyContent = document.getElementById('copyContent').textContent;
        navigator.clipboard.writeText(copyContent).then(() => setCopied(true));
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCopied(false);
    };

    const onSubmit = async (data) => {
        const amountValue = parseInt(amount.replace(/\./g, ''), 10);

        const donationData = {
            donorID: user?.userID,
            campaignID: id,
            amount: amountValue,
            isAnonymous: data.anonymous,
            cancelUrl: window.location.origin,
            returnUrl: window.location.origin,
        };

        try {
            const response = await createDonation(donationData).unwrap();

            setPayOSConfig((oldConfig) => ({
                ...oldConfig,
                CHECKOUT_URL: response.paymentLink.checkoutUrl,
            }));

            // setOpenDialog(true);
        } catch (error) {
            console.error('Error creating donation:', error);
            console.log('Sending donation data:', donationData);
        }
    };

    if (isLoading) {
        return <p>Đang tải thông tin chiến dịch...</p>;
    }

    if (error) {
        return <p>Lỗi khi tải thông tin chiến dịch: {error.message}</p>;
    }

    return (
        <div className="container mx-auto py-10 px-4 bg-[#89d5d342]">
            <div className="flex flex-col lg:flex-row lg:space-x-8">
                {/* Left Section */}
                <div className="w-full lg:w-2/5 bg-white p-6 rounded-lg mb-8 lg:mb-0">
                    <div className="flex items-center space-x-4 mb-4">
                        <img
                            className="w-12 h-12 rounded-full border-[#69A6B8] border-[3px]"
                            src={campaign?.guaranteeAvatar || 'https://via.placeholder.com/100'}
                            alt="Profile"
                        />
                        <div>
                            <span className="text-gray-500">Tiền ủng hộ được chuyển đến</span>
                            <div className="flex items-center">
                                <h1 className="text-lg font-bold text-[#69A6B8] truncate max-w-xs mr-2">
                                    {campaign?.guaranteeName || 'Quỹ thiện nguyện'}
                                </h1>
                                <div className="bg-[#69A6B8] p-1 rounded-full">
                                    <Check className="text-white" size={10} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="my-4 border-2 border-gray-100" />

                    <div className="relative mb-6">
                        <p className="absolute top-[10px] left-[10px] text-sm text-gray-700 bg-white px-2 py-1 rounded-full">
                            {Math.ceil((new Date(campaign?.endDate) - new Date()) / (1000 * 60 * 60 * 24)) > 0
                                ? `Còn ${Math.ceil(
                                      (new Date(campaign?.endDate) - new Date()) / (1000 * 60 * 60 * 24),
                                  )} ngày`
                                : 'Hết hạn'}
                        </p>
                        <img
                            src={campaign?.thumbnailUrl || 'https://via.placeholder.com/400x300'}
                            className="w-full h-auto rounded-lg shadow-xl mt-6"
                            alt="Campaign"
                        />
                    </div>

                    <div className="mb-4">
                        <h2 className="text-xl font-bold">{campaign?.title || 'Tên chiến dịch'}</h2>
                    </div>

                    <div className="mt-4">
                        <div className="flex justify-between">
                            <p className="text-sm mt-1">
                                Đã đạt được:{' '}
                                <span className="font-bold text-[#69A6B8] text-lg">
                                    {campaign?.raisedAmount.toLocaleString('vi-VN')} VND
                                </span>
                            </p>
                            <p className="font-bold text-lg">
                                {Math.round((campaign?.raisedAmount / campaign?.targetAmount) * 100) || 0}%
                            </p>
                        </div>
                        <div className="h-2 w-full bg-gray-300 rounded">
                            <div
                                className="h-2 bg-green-500 rounded"
                                style={{
                                    width: `${(campaign?.raisedAmount / campaign?.targetAmount) * 100 || 0}%`,
                                    background: 'linear-gradient(to right, #7EDAD7, #69A6B8)',
                                }}
                            ></div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-black mt-2">
                            <p className="text-gray-500 font font-semibold">
                                Của mục tiêu{' '}
                                <span className="font-bold text-black">
                                    {campaign?.targetAmount?.toLocaleString('vi-VN') || '0'} VND
                                </span>
                            </p>
                            <p className="font-bold">
                                {donation?.length || 0}{' '}
                                <span className="text-gray-500 font font-semibold">người đã ủng hộ</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-full lg:w-3/5 bg-none p-6">
                    <h2 className="text-xl font-semibold mb-4">Thông tin ủng hộ</h2>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-normal text-md text-black">
                                            Nhập số tiền ủng hộ <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    value={amount}
                                                    placeholder="0"
                                                    {...field}
                                                    onChange={handleAmountChange}
                                                    className="w-full h-full text-xl font-bold text-secondary py-3 px-4 rounded-lg"
                                                />
                                            </FormControl>
                                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-secondary font-bold">
                                                VND
                                            </span>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-between mb-4 space-x-2">
                                {presetAmounts.map((preset) => (
                                    <Button
                                        key={preset}
                                        type="button"
                                        onClick={() => handlePresetAmount(preset)}
                                        className={cn(
                                            'py-2 px-12 w-full sm:w-auto rounded-full text-lg shadow-xl transition-all hover:bg-rose-50',
                                            amount === formatNumber(preset.toString())
                                                ? 'bg-secondary text-white shadow-lg hover:text-white hover:bg-secondary'
                                                : 'bg-gray-100 text-gray-800',
                                        )}
                                    >
                                        {preset.toLocaleString('vi-VN')}
                                    </Button>
                                ))}
                            </div>

                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-normal text-md">Lời chúc</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Nhập lời chúc trao gửi yêu thương"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-normal text-md text-black">Họ và tên</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Nhập họ và tên" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-normal text-md text-black">
                                            Nhập email <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Nhập địa chỉ email" {...field} disabled />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="anonymous"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center my-4">
                                            <FormControl>
                                                <Checkbox {...field} className="border-2" />
                                            </FormControl>
                                            <FormLabel className="ml-2 font-normal text-md">Ủng hộ ẩn danh</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full text-xl py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg"
                            >
                                Ủng hộ
                            </Button>

                            <p className="text-center mt-4 font-normal text-md">
                                Bằng việc ủng hộ, bạn đã đồng ý với{' '}
                                <span
                                    className="font-semibold text-secondary cursor-pointer"
                                    onClick={() => setIsTermsDialogOpen(true)}
                                >
                                    Điều khoản sử dụng
                                </span>
                            </p>
                        </form>
                    </Form>
                </div>
            </div>

            <Dialog open={isTermsDialogOpen} onOpenChange={setIsTermsDialogOpen}>
                <DialogContent className="max-w-3xl rounded-lg p-0">
                    <DialogTitle className="bg-gradient-to-r from-secondary to-teal-500 text-white py-4 rounded-t-lg text-center font-bold text-xl">
                        Điều khoản sử dụng
                    </DialogTitle>

                    <DialogDescription className="p-6">
                        <div className="mb-4">
                            <h2 className="font-bold text-[16px]">1. Giới thiệu về Hệ thống</h2>
                            <p>
                                - Sponsor Child là một nền tảng công nghệ cung cấp cho người dùng các chiến dịch, hoạt
                                động thiện nguyện do các tổ chức, cá nhân uy tín thực hiện. Người ủng hộ có thể tự đánh
                                giá và lựa chọn các chiến dịch phù hợp với mong muốn và khả năng thiện nguyện của mình.
                            </p>
                            <p>
                                - Mục tiêu của Hệ thống là tạo ra một kênh kết nối an toàn, minh bạch giữa Người ủng hộ
                                và các hoạt động từ thiện, giúp họ đóng góp một cách hiệu quả.
                            </p>
                        </div>
                        <div className="mb-4">
                            <h2 className="font-bold text-[16px]">2. Sự tự nguyện và trách nhiệm của Người ủng hộ</h2>
                            <p>
                                - Người ủng hộ khi tham gia các chiến dịch kêu gọi trên Hệ thống cần đánh giá kỹ lưỡng
                                trước khi đưa ra quyết định đóng góp. Việc ủng hộ hoàn toàn tự nguyện và không có sự ép
                                buộc từ phía Hệ thống hay bất kỳ bên thứ ba nào.
                            </p>
                            <p>
                                - Người ủng hộ hoàn toàn chịu trách nhiệm đối với các quyết định và hành động đóng góp
                                của mình. Hệ thống không chịu trách nhiệm pháp lý cho các quyết định ủng hộ của người
                                dùng.
                            </p>
                        </div>
                        <div className="mb-4">
                            <h2 className="font-bold text-[16px]">3. Quản lý và sử dụng số tiền ủng hộ</h2>
                            <p>
                                - Toàn bộ số tiền ủng hộ sẽ được chuyển tới chiến dịch, dự án mà Người ủng hộ đã lựa
                                chọn. Trong trường hợp số tiền thu về vượt quá mục tiêu của chiến dịch hoặc dự án, phần
                                dư sẽ được chuyển vào Quỹ chung của Hệ thống để sử dụng cho các hoạt động thiện nguyện
                                khác.
                            </p>
                            <p>
                                - Hệ thống cam kết quản lý và sử dụng Quỹ chung một cách minh bạch. Báo cáo tài chính về
                                việc sử dụng quỹ sẽ được công khai định kỳ để đảm bảo sự minh bạch cho Người ủng hộ.
                            </p>
                        </div>
                        <div className="mb-4">
                            <h2 className="font-bold text-[16px]">4. Chính sách hoàn tiền</h2>
                            <p>
                                - Người ủng hộ có thể yêu cầu hoàn lại tiền trong trường hợp chiến dịch chưa bắt đầu
                                thực hiện và các điều kiện pháp lý cho phép. Sau khi chiến dịch đã bắt đầu, số tiền ủng
                                hộ sẽ không được hoàn lại.
                            </p>
                        </div>
                        <div className="mb-4">
                            <h2 className="font-bold text-[16px]">5. Quyền và trách nhiệm của Hệ thống</h2>
                            <p>
                                - Hệ thống có quyền từ chối hoặc hủy bỏ các khoản đóng góp nếu phát hiện hành vi gian
                                lận, vi phạm pháp luật hoặc các hành động không phù hợp với chính sách của Hệ thống.
                            </p>
                            <p>
                                - Hệ thống đảm bảo cung cấp thông tin rõ ràng và chính xác về các chiến dịch. Tuy nhiên,
                                Hệ thống không chịu trách nhiệm về kết quả hoặc tiến độ của các chiến dịch mà Người ủng
                                hộ đã chọn tham gia.
                            </p>
                        </div>
                        <div className="mb-4">
                            <h2 className="font-bold text-[16px]">6. Bảo mật thông tin cá nhân</h2>
                            <p>
                                - Hệ thống cam kết bảo vệ quyền riêng tư và bảo mật thông tin cá nhân của Người ủng hộ.
                                Thông tin cá nhân sẽ không được chia sẻ cho bên thứ ba, ngoại trừ trường hợp có yêu cầu
                                từ cơ quan chức năng hoặc theo quy định pháp luật.
                            </p>
                        </div>
                        <div className="mb-4">
                            <h2 className="font-bold text-[16px]">7. Thay đổi điều khoản</h2>
                            <p>
                                - Hệ thống có quyền thay đổi các điều khoản sử dụng này bất kỳ lúc nào và sẽ thông báo
                                đến Người ủng hộ qua website. Việc tiếp tục sử dụng hệ thống sau khi có sự thay đổi đồng
                                nghĩa với việc Người ủng hộ chấp nhận các điều khoản mới.
                            </p>
                        </div>
                    </DialogDescription>
                </DialogContent>
            </Dialog>

            <Dialog open={openDialog} onOpenChange={handleCloseDialog}>
                <DialogContent className="max-w-3xl rounded-lg p-0">
                    <DialogTitle className="bg-gradient-to-r from-secondary to-teal-500 text-white py-4 rounded-t-lg text-center font-bold text-xl">
                        Thanh toán
                    </DialogTitle>

                    <DialogDescription className="p-6 flex flex-col md:flex-row">
                        <div className="w-full md:w-2/3 pr-4">
                            <div className="mb-4 text-sm">
                                <div className="flex mb-2">
                                    <span className="w-[39%] text-gray-600">Ngân hàng:</span>
                                    <span className="font-semibold">Ngân hàng TMCP Quân Đội (MB Bank)</span>
                                </div>
                                <div className="flex mb-2">
                                    <span className="w-[39%] text-gray-600">Số tài khoản thiện nguyện:</span>
                                    <span className="font-semibold text-teal-500">2022</span>
                                </div>
                                <div className="flex mb-2">
                                    <span className="w-[39%] text-gray-600">Chủ tài khoản:</span>
                                    <span className="font-semibold text-teal-500">TRAN VO HONG NGAN</span>
                                </div>
                                <div className="flex mb-2">
                                    <span className="w-[39%] text-gray-600">Số tiền:</span>
                                    <span className="font-semibold text-teal-500">50.000 VND</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-[39%] text-gray-600">Nội dung chuyển khoản:</span>
                                    <span id="copyContent" className="font-semibold text-black">
                                        UH2P1H9ZPYM4ZP BAOSO3
                                    </span>
                                    <Button
                                        onClick={handleCopy}
                                        className="bg-transparent text-teal-500 hover:bg-transparent"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                {copied && (
                                    <div className="flex justify-center items-center text-sm text-gray-600">
                                        <Check className="w-4 h-4 text-white mr-2 rounded-full bg-secondary" />
                                        Đã sao chép vào bộ nhớ đệm
                                    </div>
                                )}
                                <span className="text-sm text-gray-500 mt-2 italic">
                                    Vui lòng sao chép mã này vào nội dung chuyển khoản để chúng tôi nhận ra ủng hộ của
                                    bạn
                                </span>
                            </div>
                        </div>

                        <div className="w-full md:w-1/3 flex flex-col items-center justify-center">
                            <img src={qrcode} alt="QR Code" className="w-32 h-32 mb-2" />
                            <div className="flex items-center justify-center mt-2 space-x-2">
                                <img
                                    src="https://thiennguyen.app/_next/static/media/logo_vietqr.612cced1.png"
                                    alt="VietQR"
                                    className="w-14"
                                />
                                <img
                                    src="https://thiennguyen.app/_next/static/media/logo_napas.c3e6f5da.png"
                                    alt="NAPAS"
                                    className="w-14"
                                />
                            </div>
                            <span className="text-gray-500 text-center pb-4 text-xs italic">
                                Sử dụng ứng dụng ngân hàng MB Bank hoặc ứng dụng thanh toán hỗ trợ QR code để quét mã
                            </span>
                        </div>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DonationInformation;
