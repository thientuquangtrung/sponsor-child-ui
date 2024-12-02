import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, MapPin, User2, UserRoundSearch, FileSearch } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useGetCampaignByIdQuery } from '@/redux/campaign/campaignApi';
import { useNavigate, useParams } from 'react-router-dom';
import { guaranteeType, campaignStatus, contractStatus, contractType, campaignTypes } from '@/config/combobox';
import LoadingScreen from '@/components/common/LoadingScreen';
import { cn } from '@/lib/utils';
import DisbursementPlan from './DisbursementPlan';
import ImageGallery from '@/components/landingpage/ImageGallery';
import Activity from './Activity';
import { useState } from 'react';

const CampaignGuaranteeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: campaignData, isLoading, error } = useGetCampaignByIdQuery(id);
    console.log(campaignData);
    const [activities, setActivities] = useState([]);

    const handleAddActivity = (newActivity) => {
        setActivities((prev) => [...prev, newActivity]);
    };

    const getStatusLabel = (status) => {
        return campaignStatus.find((s) => s.value === status)?.label || 'Không xác định';
    };

    const getGuaranteeTypeLabel = (type) => {
        return guaranteeType.find((t) => t.value === type)?.label || 'Không xác định';
    };

    const getContractStatusLabel = (status) => {
        return contractStatus.find((s) => s.value === status)?.label || 'Không xác định';
    };

    const getContractTypeLabel = (type) => {
        return contractType.find((t) => t.value === type)?.label || 'Không xác định';
    };
    const getCampaignTypeLabel = (type) => {
        return campaignTypes.find((t) => t.value === type)?.label || 'Không xác định';
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-rose-50 to-primary/10">
                <div className="text-center py-4 text-red-500 font-medium">Đã có lỗi khi tải dữ liệu chiến dịch</div>
            </div>
        );
    }

    if (!campaignData) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-rose-50 to-primary/10">
                <div className="text-center py-4 text-gray-600 font-medium">Không tìm thấy thông tin chiến dịch</div>
            </div>
        );
    }
    const { disbursementPlans } = campaignData;

    const progress = (campaignData.raisedAmount / campaignData.targetAmount) * 100;

    const handleContractSign = () => {
        if (campaignData.contracts && campaignData.contracts.length > 0) {
            const contractID = campaignData.contracts[0].contractID;
            const campaignID = campaignData.campaignID;
            navigate(`/guarantee/contract/contract-campaign/${contractID}/${campaignID}`);
        }
    };
    return (
        <div className="min-h-screen flex flex-col space-y-8 px-6">
            <Card className="border-0">
                <CardHeader className="bg-teal-50 pb-4 text-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="flex flex-col items-center">
                            <CardTitle className="text-3xl font-bold text-gray-900 mb-4 text-center">
                                {campaignData.title}
                            </CardTitle>
                            <div className="space-x-3 text-center">
                                <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
                                    {getGuaranteeTypeLabel(campaignData.guaranteeType)}
                                </Badge>
                                <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                                    {getStatusLabel(campaignData.status)}
                                </Badge>
                                <Badge
                                    className={cn(
                                        'px-3 py-1 text-sm font-medium',
                                        campaignData.campaignType === 1
                                            ? 'bg-red-400 hover:bg-red-500 text-white'
                                            : 'bg-primary hover:bg-primary/90 text-teal-600-foreground',
                                    )}
                                >
                                    {getCampaignTypeLabel(campaignData.campaignType)}
                                </Badge>
                            </div>
                        </div>

                        <ImageGallery
                            thumbnailUrl={campaignData.thumbnailUrl}
                            imagesFolderUrl={campaignData.imagesFolderUrl}
                        />
                    </div>
                </CardHeader>

                <CardContent className="space-y-8">
                    <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                        <div className="flex justify-between text-sm font-medium">
                            <span className="text-gray-600">Tiến độ gây quỹ</span>
                            <span className="text-teal-600 font-bold">{progress.toFixed(1)}%</span>
                        </div>
                        <Progress value={progress} className="h-3 rounded-full" />
                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <span className="block text-2xl font-bold text-teal-600">
                                    {campaignData.raisedAmount.toLocaleString('vi-VN')}đ
                                </span>
                                <span className="text-sm text-gray-500">Đã quyên góp được</span>
                            </div>
                            <div className="text-right space-y-1">
                                <span className="block text-2xl font-bold text-gray-700">
                                    {campaignData.targetAmount.toLocaleString('vi-VN')}đ
                                </span>
                                <span className="text-sm text-gray-500">Mục tiêu</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-gray-700">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-teal-600" />
                                <span>Bắt đầu: {new Date(campaignData.startDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-teal-600" />
                                <span>Kết thúc: {new Date(campaignData.endDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>


            <Card className="shadow-lg border-0 mb-6">
                <CardHeader className="bg-gradient-to-r from-rose-100 to-teal-100">
                    <CardTitle className="text-lg flex items-center gap-2 text-gray-800">Thông tin trẻ em</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-3 gap-6 text-gray-700">
                        <div className="flex items-center gap-3">
                            <User2 className="h-5 w-5 text-teal-600" />
                            <span>Tên: {campaignData.childName}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-teal-600" />
                            <span>Năm sinh: {campaignData.childBirthYear}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <UserRoundSearch className="h-5 w-5 text-teal-600" />
                            <span>Giới tính: {campaignData.childGender === 0 ? 'Nam' : 'Nữ'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                        <MapPin className="h-5 w-5 text-teal-600" />
                        <span>
                            Địa chỉ:{' '}
                            {`${campaignData.childLocation}, ${campaignData.childWard}, ${campaignData.childDistrict}, ${campaignData.childProvince}`}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-gray-700">
                        <div className="flex items-center gap-3">
                            <FileSearch className="h-5 w-5 text-teal-600" />
                            <span>
                                Mã định danh trẻ:{' '}
                                {`${campaignData?.childIdentificationCode}`}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-teal-600" />
                            <span>
                                Ảnh hay giấy tờ liên quan đến trẻ:
                                <a
                                    href={campaignData.childIdentificationInformationFile}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline"
                                >
                                    Xem
                                </a>
                            </span>
                        </div>
                    </div>

                </CardContent>
            </Card>
            <Card className="shadow-lg border-0 mb-6">
                <CardHeader className="bg-gradient-to-r from-rose-100 to-teal-100">
                    <CardTitle className="text-lg text-gray-800">Câu chuyện</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none pt-6">
                    <div
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: campaignData.story }}
                    />
                </CardContent>
            </Card>

            <Card className="shadow-lg border-0 mb-6">
                <CardHeader className="bg-gradient-to-r from-rose-100 to-teal-100">
                    <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                        Thông tin người bảo trợ
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Tên người bảo trợ:</span>
                        <span className="text-gray-600">{campaignData.guaranteeName}</span>
                    </div>
                </CardContent>
            </Card>

            <DisbursementPlan disbursementPlans={disbursementPlans} />

            <Card className="shadow-lg border-0 mb-6">
                <CardHeader className="bg-gradient-to-r from-rose-100 to-teal-100">
                    <CardTitle className="text-lg flex items-center gap-2 text-gray-800">Thông tin hợp đồng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    {campaignData.contracts && campaignData.contracts.length > 0 ? (
                        campaignData.contracts.map((contract, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">Loại hợp đồng:</span>{' '}
                                        <Badge variant="outline">{getContractTypeLabel(contract.contractType)}</Badge>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Ngày bắt đầu:</span>{' '}
                                        <span className="text-gray-600">
                                            {new Date(contract.startDate).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Ngày kết thúc:</span>{' '}
                                        <span className="text-gray-600">
                                            {new Date(contract.endDate).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Trạng thái:</span>{' '}
                                        <Badge
                                            variant={
                                                contract.status === 2
                                                    ? 'success'
                                                    : contract.status === 0 || contract.status === 1
                                                        ? 'secondary'
                                                        : 'outline'
                                            }
                                        >
                                            {getContractStatusLabel(contract.status)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-600 text-center">Chưa có hợp đồng</div>
                    )}
                </CardContent>
            </Card>
            {campaignData.contracts && campaignData.contracts.length > 0 && campaignData.contracts[0].status === 0 && (
                <div className="flex justify-center">
                    <Button
                        onClick={handleContractSign}
                        className="bg-primary hover:bg-primary/90 text-white py-6 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Xem và ký hợp đồng tham gia chiến dịch
                    </Button>
                </div>
            )}
            {campaignData.status >= 4 ? (
                <Activity onAddActivity={handleAddActivity} />
            ) : (
                <Card className="border border-gray-100 shadow-md">
                    <CardHeader className="bg-rose-200 border-b border-gray-100">
                        <CardTitle className="text-lg text-gray-800">Hoạt động chiến dịch</CardTitle>
                    </CardHeader>
                    <CardContent className="py-8">
                        <div className="text-center text-gray-600">
                            Chưa có hoạt động chiến dịch
                        </div>
                    </CardContent>
                </Card>
            )}
            {/* Danh sách hoạt động */}
            {activities.length > 0 && (
                <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="bg-rose-200 border-b border-gray-100">
                        <CardTitle className="text-lg text-gray-800">Danh sách hoạt động</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                        {activities.map((activity, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-2">
                                <h3 className="text-gray-800 font-semibold">{activity.name}</h3>
                                <p className="text-gray-600">{activity.description}</p>
                                <span className="text-gray-500 text-sm">
                                    Ngày: {new Date(activity.date).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default CampaignGuaranteeDetail;
