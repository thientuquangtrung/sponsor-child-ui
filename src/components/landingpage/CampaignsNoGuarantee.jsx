import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetAllCampaignsQuery } from '@/redux/campaign/campaignApi';
import { Carousel, CarouselPrevious, CarouselNext, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Eye, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from '@/components/ui/dialog';
import { getAssetsList } from '@/lib/cloudinary';

const CampaignsNoGuarantee = () => {
    const [URLSearchParams] = useSearchParams();
    const { data: campaigns = [], isLoading, error } = useGetAllCampaignsQuery(URLSearchParams.toString());

    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [images, setImages] = useState([]);

    useEffect(() => {
        // Fetch images by tag from Cloudinary
        const fetchImages = async () => {
            try {
                const resources = await getAssetsList('campaign_1');

                //gen urls
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
        return <p>Đang tải danh sách chiến dịch...</p>;
    }

    if (error) {
        return <p>Lỗi khi tải dữ liệu: {error.message}</p>;
    }

    const openDialog = (campaign) => {
        setSelectedCampaign(campaign);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedCampaign(null);
    };

    return (
        <div
            className="container mx-auto py-8 bg"
            style={{
                backgroundImage: `url(${'https://i.pinimg.com/control/564x/1a/05/07/1a05071b4b031859c93fa9657f05c53d.jpg'})`,
            }}
        >
            <h1 className="text-4xl font-extrabold mb-12 text-center bg-gradient-to-r from-teal-400 to-pink-500 text-transparent bg-clip-text">
                Hãy cùng chúng tôi bảo trợ các chiến dịch tuyệt vời này và mang lại niềm vui cho những trẻ em cần sự
                giúp đỡ!
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {campaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-white shadow-xl rounded-lg flex flex-col justify-between">
                        <div>
                            <img
                                src={campaign?.thumbnailUrl}
                                alt={campaign.title}
                                className="w-full object-cover mb-4"
                            />
                            <h3 className="text-xl font-bold mb-2 px-4">{campaign?.title}</h3>
                            <div className="flex flex-row items-center space-x-2 p-4">
                                <MapPin size={20} />
                                <p className="text-md text-gray-600">{campaign?.provinceName}</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => openDialog(campaign)}
                            className="space-x-2 bg-gradient-to-r from-teal-300 to-secondary text-white text-md font-semibold py-2 px-4 m-4 rounded-lg transition"
                        >
                            <Eye size={20} />
                            <span>Xem chi tiết</span>
                        </Button>
                    </div>
                ))}
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-xl">
                    {selectedCampaign && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-center text-lg">{selectedCampaign?.title}</DialogTitle>
                                <DialogDescription className="max-h-60 overflow-auto">
                                    <p className="font-bold">Câu chuyện:</p> {selectedCampaign?.story}
                                </DialogDescription>
                            </DialogHeader>
                            <img
                                src={selectedCampaign?.thumbnailUrl}
                                alt={selectedCampaign?.title}
                                className="w-full object-cover rounded-lg mb-2"
                            />
                            <Carousel opts={{ loop: true }}>
                                <CarouselPrevious />
                                <CarouselContent>
                                    {images.map((image, index) => (
                                        <CarouselItem key={index} itemsPerView={5}>
                                            <img
                                                src={image}
                                                alt={`Slide ${index + 1}`}
                                                className="rounded-lg shadow-md w-[80px] h-[80px] cursor-pointer object-cover"
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselNext />
                            </Carousel>

                            <div className="mt-4 text-center">
                                <p className="text-md font-semibold">
                                    Bạn có muốn trở thành Nhà Bảo Lãnh của dự án này không?
                                </p>
                            </div>

                            <div className="flex justify-center space-x-4 mt-2">
                                <Button
                                    onClick={() =>
                                        alert(`Bạn đã chấp nhận bảo lãnh cho chiến dịch ID: ${selectedCampaign.id}`)
                                    }
                                    className="bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-600 transition"
                                >
                                    Có
                                </Button>
                                <Button
                                    onClick={closeDialog}
                                    className="bg-gray-300 text-black font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Không
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CampaignsNoGuarantee;
