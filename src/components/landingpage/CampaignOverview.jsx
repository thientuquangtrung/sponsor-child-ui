import React, { useEffect, useState } from 'react';
import { Ellipsis } from 'lucide-react';
import { useParams } from 'react-router-dom';
import bg from '@/assets/images/c.jpg';
import { toast } from 'sonner';
import { useGetCampaignByIdQuery } from '@/redux/campaign/campaignApi';
import { getAssetsList } from '@/lib/cloudinary';
import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogTitle, DialogFooter, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Carousel, CarouselPrevious, CarouselNext, CarouselContent, CarouselItem } from '@/components/ui/carousel';

const CampaignOverview = () => {
    const { id } = useParams();
    const [images, setImages] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { data: campaign, isLoading, error } = useGetCampaignByIdQuery(id);

    const handleSendRequest = () => {
        console.log(`Yêu cầu bảo lãnh cho chiến dịch: ${id}`);
        toast.success('Đã gửi yêu cầu bảo lãnh thành công!');
        setIsDialogOpen(false);
    };

    useEffect(() => {
        // Fetch images by tag from Cloudinary
        const fetchImages = async () => {
            try {
                const resources = await getAssetsList('campaign_1');

                // Generate URLs
                const imageUrls = resources.map((resource) => {
                    return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUD_NAME}/image/${resource.type}/${
                        resource.public_id
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

    if (error) {
        return <p>Lỗi khi tải dữ liệu: {error.message}</p>;
    }

    return (
        <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-500 text-center py-8 font-serif">
                {campaign?.title}
            </h1>

            <div
                className="container mx-auto py-4 relative"
                style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="relative z-10 flex flex-col lg:flex-row gap-10 p-6 lg:px-0 items-center">
                    <div className="lg:w-1/2">
                        <img
                            src={campaign?.thumbnailUrl}
                            alt={campaign.title}
                            className="w-full object-cover mb-4 rounded-lg"
                        />
                        <Carousel className="my-6" opts={{ loop: true }}>
                            <CarouselPrevious />
                            <CarouselContent>
                                {images.map((image, index) => (
                                    <CarouselItem key={index} itemsPerView={6}>
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
                    <div className="lg:w-1/2 p-6 relative">
                        <div className="absolute inset-0 w-full bg-white bg-opacity-70 rounded-lg z-0" />

                        <div className="relative z-10 h-[450px] py-2 flex flex-col justify-center items-center">
                            <h2 className="text-4xl font-serif font-bold italic text-rose-400 text-center mb-4">
                                “Câu chuyện”
                            </h2>

                            <div className="overflow-y-auto flex-1 mb-2 px-4">
                                <div className="w-[550px] mt-6 p-4 bg-white rounded-lg shadow-md">
                                    <h3 className="text-xl font-bold text-gray-800">Thông tin của trẻ</h3>
                                    <p className="text-lg text-gray-700 mt-2">
                                        <strong>Tên:</strong> {campaign?.childProfile.name}
                                    </p>
                                    <div className="flex space-x-24">
                                        <p className="text-lg text-gray-700 mt-2">
                                            <strong>Tuổi:</strong> {campaign?.childProfile.age}
                                        </p>
                                        <p className="text-lg text-gray-700 mt-2">
                                            <strong>Giới tính:</strong>{' '}
                                            {campaign?.childProfile.gender === 1 ? 'Nam' : 'Nữ'}
                                        </p>
                                    </div>
                                    <p className="text-lg text-gray-700 mt-2">
                                        <strong>Địa chỉ:</strong>{' '}
                                        {`${campaign?.childProfile.location}, ${campaign?.childProfile.ward}, ${campaign?.childProfile.district}, ${campaign?.childProfile.province}`}
                                    </p>
                                    <p className="text-lg text-gray-700 mt-2">
                                        <strong>Tình trạng:</strong>{' '}
                                        {campaign?.childProfile.status === 0 ? 'Chưa bảo trợ' : 'Đã bảo trợ'}
                                    </p>
                                    <a
                                        href={campaign?.childProfile.identificationInformationFile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-teal-500 underline mt-2 block italic"
                                    >
                                        Xem thông tin nhận diện
                                    </a>
                                </div>
                                <p className="text-lg text-gray-600 leading-relaxed mt-4">{campaign?.story}</p>
                            </div>

                            <Ellipsis className="w-12 h-12 text-rose-400 self-end" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-8">
                <h2 className="text-4xl text-center text-gray-800 mb-8">KẾ HOẠCH GIẢI NGÂN CHIẾN DỊCH</h2>

                <div className="bg-white p-8 rounded-lg shadow-lg mb-8 space-y-6">
                    <p className="text-lg leading-relaxed">
                        Trong quá trình chiến dịch, hệ thống sẽ tiến hành giải ngân cho người bảo lãnh theo{' '}
                        <span className="text-rose-400 font-semibold">BA ĐỢT</span> đã định trước. Mỗi đợt giải ngân
                        nhằm mục đích đảm bảo người bảo lãnh có đủ nguồn lực tài chính để hỗ trợ trực tiếp cho các trẻ
                        em có hoàn cảnh khó khăn.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mt-4">
                        - Đợt 1: Giải ngân tối đa <span className="text-rose-400 font-semibold">50%</span> tổng số tiền
                        quyên góp.
                        <br />- Đợt 2: Giải ngân tối đa <span className="text-rose-400 font-semibold">30%</span> số tiền
                        quyên góp còn lại.
                        <br />- Đợt 3: Giải ngân phần còn lại <span className="text-rose-400 font-semibold">
                            20%
                        </span>{' '}
                        tổng số tiền quyên góp.
                    </p>
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

                <h2 class="text-4xl text-center text-gray-800 mb-8">CHI TIẾT CÁC ĐỢT GIẢI NGÂN</h2>

                <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-gray-300"></div>

                    {/* Đợt giải ngân 1 */}
                    <div className="flex justify-between items-center w-full mb-16">
                        <div className="w-5/12">
                            <div className="bg-white p-6 rounded shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-700">
                                    Đợt giải ngân 1 - Ngày 15/11/2024
                                </h3>
                                <p className="mt-2 text-gray-600 font-semibold">Số tiền giải ngân:</p>
                                <p className="mt-2 text-md font-bold text-teal-500">
                                    Tối đa 50% tổng số tiền quyên góp
                                </p>
                                <p className="mt-4 text-gray-500">
                                    Trạng thái: <span className="font-semibold text-rose-400">Chưa bắt đầu</span>
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute w-8 h-8 bg-yellow-500 rounded-full left-1/2 transform -translate-x-1/2"></div>
                        </div>
                        <div className="w-5/12"></div>
                    </div>

                    {/* Đợt giải ngân 2 */}
                    <div className="flex justify-between items-center w-full mb-16">
                        <div className="w-5/12"></div>
                        <div className="relative">
                            <div className="absolute w-8 h-8 bg-teal-500 rounded-full left-1/2 transform -translate-x-1/2"></div>
                        </div>
                        <div className="w-5/12">
                            <div className="bg-white p-6 rounded shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-700">
                                    Đợt giải ngân 2 - Ngày 29/11/2024
                                </h3>
                                <p className="mt-2 text-gray-600 font-semibold">Số tiền giải ngân:</p>
                                <p className="mt-2 text-md font-bold text-teal-500">
                                    Tối đa 30% tổng số tiền còn lại (hoặc bao gồm tiền từ đợt 1 nếu không nhận giải ngân
                                    trước đó)
                                </p>
                                <p className="mt-4 text-gray-500">
                                    Trạng thái: <span className="font-semibold text-rose-400">Chưa bắt đầu</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Đợt giải ngân 3 */}
                    <div className="flex justify-between items-center w-full mb-16">
                        <div className="w-5/12">
                            <div className="bg-white p-6 rounded shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-700">
                                    Đợt giải ngân 3 - Ngày 13/12/2024
                                </h3>
                                <p className="mt-2 text-gray-600 font-semibold">Số tiền giải ngân:</p>
                                <p className="mt-2 text-md font-bold text-teal-500">Tối đa 20% tổng số tiền còn lại</p>
                                <p className="mt-4 text-gray-500">
                                    Trạng thái: <span className="font-semibold text-rose-400">Chưa bắt đầu</span>
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute w-8 h-8 bg-yellow-500 rounded-full left-1/2 transform -translate-x-1/2"></div>
                        </div>
                        <div className="w-5/12"></div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-8 text-center">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            className="shadow-custom animate-zoomWithShadow bg-gradient-to-r from-teal-400 to-secondary text-white text-xl px-6 py-4 rounded-lg font-semibold"
                        >
                            Tôi muốn trở thành Nhà bảo lãnh cho chiến dịch này
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Xác nhận gửi yêu cầu bảo lãnh</DialogTitle>
                        </DialogHeader>
                        <p className="text-lg text-gray-700">
                            Bạn có chắc chắn muốn gửi yêu cầu bảo lãnh cho chiến dịch này?
                        </p>
                        <DialogFooter>
                            <Button
                                onClick={() => setIsDialogOpen(false)}
                                className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-normal"
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={handleSendRequest}
                                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-normal"
                            >
                                Xác nhận
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default CampaignOverview;
