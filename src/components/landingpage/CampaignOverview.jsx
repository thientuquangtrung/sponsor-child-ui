import React, { useEffect, useState } from 'react';
import { Calendar, Clock, DollarSign, Ellipsis } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import bg from '@/assets/images/c.jpg';
import { toast } from 'sonner';
import { useGetCampaignByIdQuery, useUpdateCampaignMutation } from '@/redux/campaign/campaignApi';
import { getAssetsList } from '@/lib/cloudinary';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogContent,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Carousel, CarouselPrevious, CarouselNext, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useSelector } from 'react-redux';
import { formatNumber } from '@/lib/utils';
import { ScrollArea } from '@radix-ui/react-scroll-area';

const CampaignOverview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [images, setImages] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { data: campaign, isLoading, error } = useGetCampaignByIdQuery(id);
    const [updateCampaign, { isLoading: isUpdating }] = useUpdateCampaignMutation();

    // const handleSendRequest = () => {
    //     console.log(`Yêu cầu bảo lãnh cho chiến dịch: ${id}`);
    //     toast.success('Đã gửi yêu cầu bảo lãnh thành công!');
    //     setIsDialogOpen(false);
    // };
    console.log(campaign);


    const handleSendRequest = async () => {
        try {
            const dataToUpdate = {
                guaranteeID: user?.userID || '',
                status: 1,
                title: campaign?.title || '',
                story: campaign?.story || '',
                raiseAmount: campaign?.raiseAmount || 0,
                thumbnailUrl: campaign?.thumbnailUrl || '',
                imagesFolderUrl: campaign?.imagesFolderUrl || '',
                userID: user?.userID || '',
            };

            console.log('Data to send to backend:', JSON.stringify(dataToUpdate, null, 2));

            await updateCampaign({ id, ...dataToUpdate }).unwrap();
            toast.success('Đã gửi yêu cầu bảo lãnh thành công!');
            navigate('/guarantee/campaigns');
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error sending request:', error);

            if (error.status === 400) {
                console.error('API error details:', error.data);
                toast.error(`Lỗi khi gửi yêu cầu: ${error.data?.message || 'Có lỗi xảy ra.'}`);
            } else {
                toast.error(`Lỗi khi gửi yêu cầu: ${error.message}`);
            }
        }
    };

    const handleButtonClick = () => {
        if (user?.role === 'Guarantee') {
            setIsDialogOpen(true);
        } else {
            toast.warning('Vai trò khác với một người dùng');
            navigate('/register');
        }
    };

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const resources = await getAssetsList('campaign_1');
                const imageUrls = resources.map((resource) => {
                    return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUD_NAME}/image/${resource.type}/${resource.public_id
                        }.${resource.format}`;
                });
                setImages(imageUrls);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []);

    if (isLoading) {
        return <p>Đang tải chi tiết chiến dịch...</p>;
    }

    if (isUpdating) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <p>Lỗi khi tải dữ liệu: {error.message}</p>;
    }

    return (
        <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-500 text-center py-8 font-serif">
                {campaign?.title}
            </h1>
            <div
                className="container mx-auto py-2 relative"
                style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="relative z-10 flex flex-row items-center space-x-2">
                    <div className="lg:w-1/3">
                        <img
                            src={campaign?.thumbnailUrl}
                            alt={campaign.title}
                            className="w-full h-[500px] object-cover mb-4 rounded-lg"
                        />
                        <Carousel className="my-6" opts={{ loop: true }}>
                            <CarouselPrevious />
                            <CarouselContent>
                                {images.map((image, index) => (
                                    <CarouselItem key={index} itemsPerView={5}>
                                        <img
                                            src={image}
                                            alt={`Slide ${index + 1}`}
                                            className="rounded-lg shadow-md w-[100px] h-[100px] cursor-pointer object-cover"
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselNext />
                        </Carousel>
                    </div>
                    <div className="lg:w-2/3 p-4 relative flex flex-col justify-between">
                        <div className="flex flex-col lg:flex-row justify-between space-x-4">
                            <div className="mt-6 bg-white bg-opacity-80 rounded-lg shadow-md flex-2/3">
                                <h3 className="text-xl text-center font-bold text-gray-800 bg-rose-100 p-2 rounded-tl-lg rounded-tr-lg">
                                    Thông tin của trẻ
                                </h3>
                                <div className="p-4">
                                    <p className="text-lg text-gray-700 mt-2">
                                        <strong>Tên:</strong> {campaign?.childName}
                                    </p>
                                    <div className="flex space-x-24">
                                        <p className="text-lg text-gray-700 mt-2">
                                            <strong>Năm sinh:</strong> {campaign?.childBirthYear}
                                        </p>
                                        <p className="text-lg text-gray-700 mt-2">
                                            <strong>Giới tính:</strong>{' '}
                                            {campaign?.childGender === 1 ? 'Nam' : 'Nữ'}
                                        </p>
                                    </div>
                                    <p className="text-lg text-gray-700 mt-2">
                                        <strong>Địa chỉ:</strong>{' '}
                                        {`${campaign?.childLocation}, ${campaign?.childWard}, ${campaign?.childDistrict}, ${campaign?.childProvince}`}
                                    </p>
                                    <p className="text-lg text-gray-700 mt-2">
                                        <strong>Tình trạng:</strong>{' '}
                                        {campaign?.childStatus === 0 ? 'Chưa bảo trợ' : 'Đã bảo trợ'}
                                    </p>
                                    <a
                                        href={campaign?.childIdentificationInformationFile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-teal-500 underline mt-2 block italic"
                                    >
                                        Xem thông tin nhận diện
                                    </a>
                                </div>
                            </div>

                            <div className="mt-6 bg-white bg-opacity-80 rounded-lg shadow-md flex-1">
                                <h3 className="text-xl text-center font-bold text-gray-800 bg-rose-100 p-2 rounded-tl-lg rounded-tr-lg">
                                    Thông tin chiến dịch
                                </h3>
                                <div className="flex flex-col mt-2 p-4">
                                    <div className="flex items-center">
                                        <Calendar className="w-5 h-5 mr-2 text-teal-500" />
                                        <p className="text-lg text-gray-700">
                                            <strong>Ngày bắt đầu:</strong>{' '}
                                            {new Date(campaign?.startDate).toLocaleDateString('en-GB')}
                                        </p>
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <Calendar className="w-5 h-5 mr-2 text-teal-500" />
                                        <p className="text-lg text-gray-700">
                                            <strong>Ngày kết thúc:</strong>{' '}
                                            {new Date(campaign?.endDate).toLocaleDateString('en-GB')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 bg-white bg-opacity-80 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-center mb-4 p-4 text-gray-800 bg-rose-100 rounded-tl-lg rounded-tr-lg">
                                Câu chuyện
                            </h2>
                            <div className="h-[400px] overflow-y-auto rounded-lg">
                                <div
                                    className="prose max-w-none text-lg p-6"
                                    dangerouslySetInnerHTML={{ __html: campaign?.story?.replace(/<\/?p[^>]*>/g, '') }}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Phần kế hoạch chung */}
            <div className="container mx-auto py-8">
                <h2 className="text-4xl text-center text-gray-800 mb-8">KẾ HOẠCH GIẢI NGÂN CHIẾN DỊCH</h2>

                <div className="bg-white p-8 rounded-lg shadow-lg mb-8 space-y-6">
                    <p className="text-lg leading-relaxed">
                        Trong quá trình chiến dịch, hệ thống sẽ tiến hành giải ngân cho người bảo lãnh theo{' '}
                        <span className="text-rose-400 font-semibold">
                            {campaign?.disbursementPlans[0]?.stages.length} ĐỢT
                        </span>{' '}
                        đã định trước. Mỗi đợt giải ngân nhằm mục đích đảm bảo người bảo lãnh có đủ nguồn lực tài chính
                        để hỗ trợ trực tiếp cho các trẻ em có hoàn cảnh khó khăn.
                    </p>
                    <div className="text-lg text-gray-700 leading-relaxed mt-4">
                        <div className="flex items-center">
                            <Clock className="text-teal-500 mr-2" />
                            <span className="font-semibold">Thời gian bắt đầu: </span>
                            <span className="font-semibold text-teal-500 ml-2">
                                {new Date(campaign?.disbursementPlans[0]?.plannedStartDate).toLocaleDateString('en-GB')}
                            </span>
                        </div>
                        <div className="flex items-center mt-2">
                            <Calendar className="text-teal-500 mr-2" />
                            <span className="font-semibold">Thời gian kết thúc: </span>
                            <span className="font-semibold text-teal-500 ml-2">
                                {new Date(campaign?.disbursementPlans[0]?.plannedEndDate).toLocaleDateString('en-GB')}
                            </span>
                        </div>
                        <div className="flex items-center mt-2">
                            <DollarSign className="text-teal-500 mr-2" />
                            <span className="font-semibold">Tổng số tiền quyên góp: </span>
                            <span className="font-semibold text-teal-500 ml-2">
                                {campaign?.disbursementPlans[0]?.totalPlannedAmount
                                    ? formatNumber(campaign.disbursementPlans[0].totalPlannedAmount.toString()) + ' VND'
                                    : '0 VND'}
                            </span>
                        </div>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed mt-4">
                        Nếu nhà bảo lãnh không nhận tiền trong đợt giải ngân đầu tiên, phần tiền đó sẽ được dồn vào đợt
                        giải ngân thứ hai. Nếu nhà bảo lãnh tiếp tục không nhận tiền trong đợt hai, toàn bộ phần tiền
                        còn lại sẽ bị hủy và hệ thống sẽ tìm nhà bảo lãnh khác cho bé.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mt-4">
                        Để nhận giải ngân, người bảo lãnh cần cung cấp các bằng chứng xác thực về việc sử dụng tiền hỗ
                        trợ, như hình ảnh, video, hoặc báo cáo chi tiết. Điều này giúp đảm bảo tính minh bạch và hợp lý
                        trong việc phân phối nguồn lực.
                    </p>
                    <div className="bg-gradient-to-r from-teal-100 to-rose-100 p-4 rounded-md text-center text-[18px] font-semibold">
                        Hệ thống sẽ tự động hủy giải ngân nếu quá trình giải ngân không hoàn thành sau hai đợt. Sau đó,
                        hệ thống sẽ liên hệ với nhà bảo lãnh mới để đảm bảo chiến dịch tiếp tục.
                    </div>
                </div>

                {/* Chi tiết các đợt giải ngân */}
                <h2 className="text-4xl text-center text-gray-800 mb-8">CHI TIẾT CÁC ĐỢT GIẢI NGÂN</h2>

                <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-gray-300"></div>

                    {campaign?.disbursementPlans[0]?.stages.map((stage, index) => (
                        <div
                            key={stage.stageNumber}
                            className={`flex justify-between items-center w-full mb-16 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                                }`}
                        >
                            <div className="w-5/12">
                                <div className="bg-white p-6 rounded shadow-lg">
                                    <h3 className="text-lg font-semibold text-gray-700">
                                        Đợt giải ngân {stage.stageNumber} - Ngày{' '}
                                        {new Date(stage.scheduledDate).toLocaleDateString('en-GB')}
                                    </h3>
                                    <p className="mt-2 text-gray-600 font-semibold">Số tiền giải ngân:</p>
                                    <p className="mt-2 text-md font-bold text-teal-500">
                                        {formatNumber(stage.disbursementAmount.toString())} VND
                                    </p>
                                    <p className="mt-4 text-gray-500">
                                        Trạng thái:{' '}
                                        <span className="font-semibold text-rose-400">
                                            {stage.status === 0 ? 'Chưa bắt đầu' : 'Đã bắt đầu'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute w-8 h-8 bg-yellow-500 rounded-full left-1/2 transform -translate-x-1/2"></div>
                            </div>
                            <div className="w-5/12"></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="container mx-auto py-8 text-center">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={handleButtonClick}
                            className="shadow-custom animate-zoomWithShadow bg-gradient-to-r from-teal-400 to-secondary text-white text-xl px-6 py-4 rounded-lg font-semibold"
                        >
                            Tôi muốn trở thành Nhà bảo lãnh cho chiến dịch này
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Xác nhận gửi yêu cầu bảo lãnh</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            Bạn có chắc chắn muốn gửi yêu cầu bảo lãnh cho chiến dịch này?
                        </DialogDescription>
                        <div className="flex justify-end">
                            <Button
                                onClick={() => {
                                    handleSendRequest();
                                }}
                                className="mt-4 bg-teal-500 text-white hover:bg-teal-600"
                            >
                                Gửi yêu cầu
                            </Button>
                            <Button
                                onClick={() => setIsDialogOpen(false)}
                                className="mt-4 ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800"
                            >
                                Hủy
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default CampaignOverview;
