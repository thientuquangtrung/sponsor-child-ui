import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, MapPin, Check, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Carousel, CarouselPrevious, CarouselNext, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import CampaignList from './CampaignList';
import logo from '@/assets/images/logo-short.png';
import DonationList from './DonationList';
import { useGetCampaignByIdQuery } from '@/redux/campaign/campaignApi';
import { useGetDonationsByCampaignIdQuery, useGetTotalDonationsByCampaignIdQuery } from '@/redux/donation/donationApi';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { getAssetsList } from '@/lib/cloudinary';
import Activity from '@/components/landingpage/Activity';
import Comment from './Comment';
import { toast } from 'sonner';
import LoadingScreen from '@/components/common/LoadingScreen';
import CampaignActivities from '@/components/landingpage/CampaignActivities';
import { campaignStatus } from '@/config/combobox';
import ImageGallery from '@/components/landingpage/ImageGallery';

const partners = [
    {
        name: 'Nguyễn Văn Ngọc',
        raised: '1.000.000 VND',
        startDate: '24/08/2024',
        avatar: 'https://via.placeholder.com/50',
    },
    {
        name: 'phunghiep17042000',
        raised: '2.000 VND',
        startDate: '09/08/2024',
        avatar: 'https://via.placeholder.com/50',
    },
    {
        name: 'Ông chủ Kim 2k',
        raised: '0 VND',
        startDate: '10/08/2024',
        avatar: 'https://via.placeholder.com/50',
    },
    {
        name: 'ZENOR BENEVOLENT SOCIAL ENTERPRISE JSC',
        raised: '0 VND',
        startDate: '12/08/2024',
        avatar: 'https://via.placeholder.com/50',
    },
    {
        name: 'Luce',
        raised: '0 VND',
        startDate: '17/08/2024',
        avatar: 'https://via.placeholder.com/50',
    },
    {
        name: 'Tuan Tranvan',
        raised: '0 VND',
        startDate: '17/08/2024',
        avatar: 'https://via.placeholder.com/50',
    },
];

const CampaignDetail = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('story');
    const [subTab, setSubTab] = useState('disbursement activities');
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [images, setImages] = useState([]);

    const handleImageClick = (imageSrc) => {
        setSelectedImage(imageSrc);
        setIsDialogOpen(true);
    };

    const { data: campaign, isLoading, error } = useGetCampaignByIdQuery(id);
    const {
        data: donations = { data: [] },
        isLoading: donationsLoading,
        error: donationsError,
    } = useGetDonationsByCampaignIdQuery({ campaignId: id, page: currentPage, rowsPerPage });

    const {
        data: donationsTotal,
        isLoading: donationsTotalLoading,
        error: donationsTotalError,
    } = useGetTotalDonationsByCampaignIdQuery(id);

    useEffect(() => {
        setCurrentPage(1);
    }, [id]);

    // get resource from cloudinary by tag

    useEffect(() => {
        // Fetch images by tag from Cloudinary
        const fetchImages = async () => {
            try {
                const resources = await getAssetsList('campaign_1');

                //gen urls
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

    const navigateToInfoDonate = () => {
        navigate(`/donate-target/info-donate/${campaign?.campaignID}`);
    };

    if (isLoading) {
        return (
            <div>
                <LoadingScreen />
            </div>
        );
    }

    if (error) {
        return <p>Lỗi khi tải thông tin chiến dịch: {error.message}</p>;
    }
    const getStatusStyle = (status) => {
        switch (status) {
            case 0: return 'bg-gray-200 text-gray-800';
            case 1: return 'bg-yellow-200 text-yellow-800';
            case 2: return 'bg-green-200 text-green-800';
            case 3: return 'bg-red-200 text-red-800';
            case 4: return 'bg-blue-200 text-blue-800';
            case 5: return 'bg-teal-200 text-teal-800';
            case 6: return 'bg-pink-200 text-pink-800';
            case 7: return 'bg-orange-200 text-orange-800';
            case 8: return 'bg-indigo-200 text-indigo-800';
            case 9: return 'bg-purple-200 text-purple-800';
            default: return 'bg-gray-200 text-gray-800';
        }
    };
    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: campaign.title,
                    text: campaign.description,
                    url: window.location.href,
                });
            } else {
                const url = window.location.href;
                await navigator.clipboard.writeText(url);
                toast.success('Đã sao chép liên kết vào clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row md:space-x-8">
                <div className="w-full md:w-3/5 bg-white">
                    <h1 className="text-2xl font-semibold">{campaign?.title}</h1>
                    {/* <div className="campaign-image-container relative mb-6">
                        <img
                            src={campaign?.thumbnailUrl || 'https://via.placeholder.com/400x300'}
                            alt={campaign?.title}
                            className="w-full h-auto rounded-lg shadow-xl mt-6"
                        />
                        <img src={logo} alt="Logo" className="absolute top-0 right-0 m-2 w-20 h-20" />
                    </div>

                    <Carousel className="my-6" opts={{ loop: true }}>
                        <CarouselPrevious />
                        <CarouselContent>
                            {images.map((image, index) => (
                                <CarouselItem key={index} itemsPerView={6}>
                                    <img
                                        src={image}
                                        alt={`Slide ${index + 1}`}
                                        className="rounded-lg shadow-md w-[100px] h-[100px] cursor-pointer object-cover"
                                        onClick={() => handleImageClick(image)}
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselNext />
                    </Carousel>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="w-full h-auto max-w-4xl p-0">
                            <div className="relative">
                                <img src={selectedImage} alt="Selected" className="w-full h-auto rounded-lg" />
                                <DialogClose asChild></DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog> */}
                    <ImageGallery
                        thumbnailUrl={campaign?.thumbnailUrl}
                        imagesFolderUrl={campaign?.imagesFolderUrl}
                    />
                    <div className="text-right">
                        <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(campaign?.status)}`}>
                            {campaignStatus.find(item => item.value === campaign?.status)?.label}
                        </span>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="flex space-x-2 bg-inherit">
                            <TabsTrigger value="story" className="relative py-1 px-4 text-md font-medium">
                                Câu chuyện
                            </TabsTrigger>
                            <TabsTrigger value="activities" className="relative py-1 px-4 text-md font-medium">
                                Hoạt động
                            </TabsTrigger>
                            <TabsTrigger value="donations" className="relative py-1 px-4 text-md font-medium">
                                Danh sách ủng hộ ({donationsTotal?.totalDonations || 0})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="story" className="p-4 min-h-[400px]">
                            <h3 className="text-xl font-bold text-gray-800">Thông tin của trẻ</h3>
                            <p className="text-lg text-gray-700 mt-2">
                                <strong>Tên:</strong> {campaign?.childName}
                            </p>
                            <div className="flex space-x-24">
                                <p className="text-lg text-gray-700 mt-2">
                                    <strong>Tuổi:</strong> {new Date().getFullYear() - campaign?.childBirthYear}
                                </p>
                                <p className="text-lg text-gray-700 mt-2">
                                    <strong>Giới tính:</strong> {campaign?.childGender === 1 ? 'Nam' : 'Nữ'}
                                </p>
                            </div>
                            <p className="text-lg text-gray-700 mt-2">
                                <strong>Địa chỉ:</strong>{' '}
                                {`${campaign?.childLocation}, ${campaign?.childWard}, ${campaign?.childDistrict}, ${campaign?.childProvince}`}
                            </p>
                            <div
                                className="prose max-w-none text-gray-600 rounded-lg p-6"
                                dangerouslySetInnerHTML={{ __html: campaign?.story }}
                            />
                        </TabsContent>

                        <TabsContent value="activities" className="p-4 min-h-[400px]">
                            <Tabs value={subTab} onValueChange={setSubTab}>
                                <TabsList className="flex space-x-2 justify-center">
                                    <TabsTrigger
                                        value="disbursement activities"
                                        className="relative px-4 py-2 duration-500"
                                    >
                                        Hoạt động giải ngân
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="additional activities"
                                        className="relative px-4 py-2 duration-500"
                                    >
                                        Hoạt động bổ sung
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="disbursement activities" className="mt-4">
                                    <Activity campaignId={id} />
                                </TabsContent>
                                <TabsContent value="additional activities" className="mt-4">
                                    <CampaignActivities />
                                </TabsContent>
                            </Tabs>
                        </TabsContent>

                        <TabsContent value="donations" className="p-4">
                            {donationsTotal?.totalDonations === 0 ? (
                                <p className="text-gray-400 italic text-center mt-8 min-h-[400px]">
                                    Hiện chiến dịch chưa có người ủng hộ.
                                </p>
                            ) : donationsLoading ? (
                                <p>Loading donations...</p>
                            ) : donationsError ? (
                                <p>Error loading donations: {donationsError.message}</p>
                            ) : (
                                <DonationList
                                    donations={donations.data}
                                    currentPage={currentPage}
                                    totalPages={donations.totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            )}
                        </TabsContent>
                    </Tabs>

                    <Comment />
                </div>

                <div className="w-full md:w-2/5 mt-4 md:mt-0 bg-white">
                    <div className="shadow-xl p-4 rounded-lg">
                        <div className="flex items-center mb-4 space-x-5">
                            <img
                                src="https://static.thiennguyen.app/public/user/profile/2024/7/10/1e9cee97-78a0-4b2f-b655-1af4ac05a0e9.jpg"
                                className="w-12 h-12 rounded-full border-[#69A6B8] border-[3px]"
                            />
                            <div>
                                <span className="text-gray-500">Tiền ủng hộ được chuyển đến</span>
                                <div className="flex items-center">
                                    <h1 className="w-[80%] text-lg font-bold text-[#69A6B8] truncate max-w-xs mr-2">
                                        {campaign?.guaranteeName || 'Quỹ thiện nguyên'}
                                    </h1>
                                    <div className="bg-[#69A6B8] p-1 rounded-full">
                                        <Check className="text-white" size={10} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="my-4 border-2 border-gray-100" />

                        <div className="flex flex-row justify-between">
                            <div className="flex items-center mt-2 space-x-3">
                                <div className="bg-amber-300 p-2 rounded-full border border-white">
                                    <Target className="text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold">Mục tiêu chiến dịch</div>
                                    <div className="text-lg font-bold text-[#69A6B8]">
                                        {campaign?.targetAmount.toLocaleString('vi-VN')} VNĐ
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center mt-2 space-x-3">
                                <div className="bg-rose-300 p-2 rounded-full border border-white">
                                    <Clock className="text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold">Thời gian còn lại</div>
                                    <div className="text-lg font-bold text-[#69A6B8]">
                                        {Math.ceil((new Date(campaign?.endDate) - new Date()) / (1000 * 60 * 60 * 24)) >
                                            0
                                            ? `Còn ${Math.ceil(
                                                (new Date(campaign?.endDate) - new Date()) / (1000 * 60 * 60 * 24),
                                            )} ngày`
                                            : 'Hết hạn'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center mt-6">
                            <MapPin className="text-gray-500 mr-2" />
                            <span className="text-sm text-gray-600">{`${campaign?.childLocation}, ${campaign?.childWard}, ${campaign?.childDistrict}, ${campaign?.childProvince}`}</span>
                        </div>

                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="h-2.5 rounded-full"
                                    style={{
                                        width: `${(campaign?.raisedAmount / campaign?.targetAmount) * 100}%`,
                                        background: 'linear-gradient(to right, #7EDAD7, #69A6B8)',
                                    }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-2 text-sm text-gray-600">
                                <div>
                                    Đã đạt được:{' '}
                                    <span className="text-[#69A6B8] font-bold">
                                        {campaign?.raisedAmount.toLocaleString('vi-VN')} VND
                                    </span>
                                </div>
                                <p className="font-bold text-sm">
                                    {campaign?.raisedAmount >= campaign?.targetAmount
                                        ? '100%'
                                        : Math.floor((campaign?.raisedAmount / campaign?.targetAmount) * 100) + '%'}
                                </p>                            </div>
                        </div>

                        <div className="flex mt-4 space-x-2">
                            <Button variant="outline" onClick={handleShare} className="flex-1 hover:bg-zinc-100">
                                Chia sẻ
                            </Button>
                            {campaign?.status === 4 && (
                                <Button
                                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-white"
                                    onClick={navigateToInfoDonate}
                                >
                                    Ủng hộ
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* <div className="mt-12 shadow-xl p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-black">
                            Đồng hành gây quỹ <span className="text-[#69A6B8]">({partners.length})</span>
                        </h3>
                        <div className="mt-4 space-y-3 h-[300px] overflow-y-auto">
                            {partners.map((partner, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <img
                                        src={partner.avatar || 'https://via.placeholder.com/40/40'}
                                        alt={partner.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800">{partner.name}</h4>
                                        <p className="text-sm text-gray-500 italic">Đã kêu gọi {partner.raised}</p>
                                        <p className="text-xs text-gray-400 italic">
                                            Ngày bắt đầu: {partner.startDate}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div> */}

                    <div className="mt-12 shadow-xl p-4 rounded-lg shadow-gray-300">
                        <h3 className="text-lg font-semibold text-black">Thông tin người vận động</h3>

                        <hr className="my-4 border-2 border-gray-100" />

                        <div className="flex items-center mb-4 space-x-5">
                            <img
                                src="https://static.thiennguyen.app/public/user/profile/2024/7/10/1e9cee97-78a0-4b2f-b655-1af4ac05a0e9.jpg"
                                className="w-14 h-14 rounded-full border-[#69A6B8] border-[3px]"
                            />
                            <div>
                                <div className="flex items-center">
                                    <h1 className="w-full text-lg font-bold text-[#69A6B8] truncate max-w-xs mr-2">
                                        {campaign?.guaranteeName || 'Quỹ thiện nguyên'}
                                    </h1>
                                    <div className="bg-[#69A6B8] p-1 rounded-full">
                                        <Check className="text-white" size={10} />
                                    </div>
                                </div>
                                <span className="text-xs bg-teal-50 text-teal-600 px-2 py-1 rounded-full inline-block mt-1">
                                    Tổ chức
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-2">
                            <img
                                className="w-4"
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/1200px-Gmail_icon_%282020%29.svg.png"
                            />
                            <a
                                href="https://mail.google.com/mail/u/0/#inbox?compose=new"
                                className="text-sm text-gray-700"
                            >
                                quydacamtrunguong@gmail.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="mt-16 border-2 border-gray-100" />

            <CampaignList excludeCampaignId={campaign?.campaignID} />
        </div>
    );
};

export default CampaignDetail;
