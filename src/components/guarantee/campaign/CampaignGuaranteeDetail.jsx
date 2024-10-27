import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useGetCampaignByIdQuery } from '@/redux/campaign/campaignApi';
import { useNavigate, useParams } from 'react-router-dom';
import {
    guaranteeType,
    campaignStatus,
    contractStatus,
    contractType,
    campaignTypes
} from '@/config/combobox';
import LoadingScreen from '@/components/common/LoadingScreen';
import { cn } from '@/lib/utils';

const CampaignGuaranteeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: campaignData, isLoading, error } = useGetCampaignByIdQuery(id);

    const getStatusLabel = (status) => {
        return campaignStatus.find(s => s.value === status)?.label || 'Không xác định';
    };

    const getGuaranteeTypeLabel = (type) => {
        return guaranteeType.find(t => t.value === type)?.label || 'Không xác định';
    };

    const getContractStatusLabel = (status) => {
        return contractStatus.find(s => s.value === status)?.label || 'Không xác định';
    };

    const getContractTypeLabel = (type) => {
        return contractType.find(t => t.value === type)?.label || 'Không xác định';
    };
    const getCampaignTypeLabel = (type) => {
        return campaignTypes.find(t => t.value === type)?.label || 'Không xác định';
    };

    if (isLoading) {
        return (
            <LoadingScreen />
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-rose-50 to-primary/10">
                <div className="text-center py-4 text-red-500 font-medium">
                    Đã có lỗi khi tải dữ liệu chiến dịch
                </div>
            </div>
        );
    }

    if (!campaignData) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-rose-50 to-primary/10">
                <div className="text-center py-4 text-gray-600 font-medium">
                    Không tìm thấy thông tin chiến dịch
                </div>
            </div>
        );
    }

    const progress = (campaignData.raisedAmount / campaignData.targetAmount) * 100;

    console.log(campaignData);

    const handleContractSign = () => {
        if (campaignData.contracts && campaignData.contracts.length > 0) {
            const contractID = campaignData.contracts[0].contractID;
            const campaignID = campaignData.campaignID;
            navigate(`/guarantee/contract/contract-campaign/${contractID}/${campaignID}`);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-100 to-primary p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <Card className="w-full bg-white shadow-xl rounded-xl overflow-hidden border-none">
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
                                            "px-3 py-1 text-sm font-medium",
                                            campaignData.campaignType === 1
                                                ? "bg-red-400 hover:bg-red-500 text-white"
                                                : "bg-primary hover:bg-primary/90 text-primary-foreground"
                                        )}
                                    >
                                        {getCampaignTypeLabel(campaignData.campaignType)}
                                    </Badge>
                                </div>
                            </div>
                            <img
                                src={campaignData.thumbnailUrl}
                                alt={campaignData.title}
                                className="w-100 h-100 rounded-xl object-cover shadow-lg transform hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-8">


                        <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-gray-600">Tiến độ gây quỹ</span>
                                <span className="text-primary font-bold">{progress.toFixed(1)}%</span>
                            </div>
                            <Progress value={progress} className="h-3 rounded-full" />
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <span className="block text-2xl font-bold text-primary">
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                                <CardHeader className="bg-rose-50 border-b border-gray-100">
                                    <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                                        Thông tin chiến dịch
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-6">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Calendar className="h-5 w-5 text-teal-500" />
                                        <span>Bắt đầu: {new Date(campaignData.startDate).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Clock className="h-5 w-5 text-teal-500" />
                                        <span>Kết thúc: {new Date(campaignData.endDate).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <MapPin className="h-5 w-5 text-teal-500" />
                                        <span>Địa điểm: {campaignData.childProfile.province}</span>
                                    </div>
                                </CardContent>
                            </Card>


                        </div>

                        <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="bg-rose-50 border-b border-gray-100">
                                <CardTitle className="text-lg text-gray-800">Câu chuyện</CardTitle>
                            </CardHeader>
                            <CardContent className="prose prose-sm max-w-none pt-6">
                                <div
                                    className="text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: campaignData.story }}
                                />
                            </CardContent>
                        </Card>

                        <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="bg-rose-50 border-b border-gray-100">
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

                        <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="bg-rose-50 border-b border-gray-100">
                                <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                                    Kế hoạch giải ngân
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-6">
                                {campaignData.disbursementPlans.map((plan, planIndex) => (
                                    <div key={planIndex} className="space-y-4">
                                        <div key={planIndex} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                                                <div>
                                                    <span className="font-medium">Bắt đầu:</span>{' '}
                                                    {new Date(plan.plannedStartDate).toLocaleDateString('vi-VN')}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Kết thúc:</span>{' '}
                                                    {new Date(plan.plannedEndDate).toLocaleDateString('vi-VN')}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Tổng số tiền:</span>{' '}
                                                    {plan.totalPlannedAmount.toLocaleString('vi-VN')}đ
                                                </div>

                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="font-medium text-gray-800">Các giai đoạn giải ngân:</div>
                                            <div className="grid gap-3">
                                                {[...plan.stages].sort((a, b) => a.stageNumber - b.stageNumber).map((stage, index) => (
                                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                                        <div className="space-y-1">
                                                            <div className="font-medium text-gray-700">
                                                                Giai đoạn {stage.stageNumber}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {new Date(stage.scheduledDate).toLocaleDateString('vi-VN')}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-medium text-primary">
                                                                {stage.disbursementAmount.toLocaleString('vi-VN')}đ
                                                            </div>
                                                            <Badge variant={stage.status === 0 ? 'secondary' : 'success'}>
                                                                {stage.status === 0 ? 'Chưa giải ngân' : 'Đã giải ngân'}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>


                        <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardHeader className="bg-rose-50 border-b border-gray-100">
                                <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                                    Thông tin hợp đồng
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                {campaignData.contracts.map((contract, index) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

                                            <div>
                                                <span className="font-medium text-gray-700">Loại hợp đồng:</span>{' '}
                                                <Badge variant="outline">
                                                    {getContractTypeLabel(contract.contractType)}
                                                </Badge>
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
                                                        contract.status === 2 ? 'success' :
                                                            contract.status === 0 || contract.status === 1 ? 'secondary' :
                                                                'destructive'
                                                    }
                                                >
                                                    {getContractStatusLabel(contract.status)}
                                                </Badge>
                                            </div>
                                        </div>

                                        {contract.contractParties && contract.contractParties.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="font-medium text-gray-800 mb-3">Bên tham gia hợp đồng:</h4>
                                                <div className="space-y-3">
                                                    {contract.contractParties.map((party, partyIndex) => (
                                                        <div key={partyIndex} className="bg-white p-3 rounded-lg shadow-sm">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                <div>
                                                                    <span className="font-medium text-gray-700">Tên:</span>{' '}
                                                                    <span className="text-gray-600">{party.name}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-gray-700">Email:</span>{' '}
                                                                    <span className="text-gray-600">{party.email}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-gray-700">Số điện thoại:</span>{' '}
                                                                    <span className="text-gray-600">{party.phone}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-gray-700">Trạng thái ký:</span>{' '}
                                                                    <Badge
                                                                        variant={party.signStatus ? 'success' : 'secondary'}
                                                                    >
                                                                        {party.signStatus ? 'Đã ký' : 'Chưa ký'}
                                                                    </Badge>
                                                                </div>
                                                                {party.signedDate && (
                                                                    <div>
                                                                        <span className="font-medium text-gray-700">Ngày ký:</span>{' '}
                                                                        <span className="text-gray-600">
                                                                            {new Date(party.signedDate).toLocaleDateString('vi-VN')}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}



                                    </div>
                                ))}
                            </CardContent>

                        </Card>
                        {campaignData.status === 1 && (
                            <div className="flex justify-center">
                                <Button
                                    onClick={handleContractSign}
                                    className="bg-primary hover:bg-primary/90 text-white py-6 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    Xem và ký hợp đồng tham gia chiến dịch
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CampaignGuaranteeDetail;