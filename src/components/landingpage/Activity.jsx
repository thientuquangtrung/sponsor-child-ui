import React, { useMemo, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, ChevronDown, ChevronUp, Goal, Inbox, Receipt } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetCampaignDetailAcivityByIdQuery } from '@/redux/campaign/campaignApi';
import LoadingScreen from '@/components/common/LoadingScreen';

const Activity = ({ campaignId }) => {
    const { data: campaign, isLoading, error } = useGetCampaignDetailAcivityByIdQuery(campaignId);
    const [expandedActivities, setExpandedActivities] = useState({});

    const sortedPlans = useMemo(() => {
        if (!campaign?.disbursementPlans?.length) return [];

        return [...campaign.disbursementPlans].sort((a, b) => {
            if (a.isCurrent) return -1;
            if (b.isCurrent) return 1;

            const getLatestActivityDate = (plan) => {
                const latestStage = plan.stages.reduce((latest, stage) => {
                    if (stage.activity?.activityDate) {
                        const currentDate = new Date(stage.activity.activityDate);
                        return !latest || currentDate > latest ? currentDate : latest;
                    }
                    return latest;
                }, null);

                return latestStage || new Date(0);
            };

            const dateA = getLatestActivityDate(a);
            const dateB = getLatestActivityDate(b);

            return dateB - dateA;
        });
    }, [campaign?.disbursementPlans]);

    const formatPlanName = (plan) => {
        const earliestStage = plan.stages.reduce((earliest, stage) => {
            if (stage.activity?.activityDate) {
                const currentDate = new Date(stage.activity.activityDate);
                return !earliest || currentDate < earliest ? currentDate : earliest;
            }
            return earliest;
        }, null);

        return earliestStage
            ? `HĐ_${earliestStage.getDate().toString().padStart(2, '0')}/${(earliestStage.getMonth() + 1).toString().padStart(2, '0')}/${earliestStage.getFullYear()}`
            : 'HĐ';
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
    const toggleActivity = (id) => {
        setExpandedActivities((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const formatAmount = (amount) => {
        return amount?.toLocaleString('vi-VN') + 'đ';
    };

    const getStatusColor = (status) => {
        const colors = {
            0: 'bg-yellow-100 text-yellow-800',
            1: 'bg-blue-100 text-blue-800',
            2: 'bg-green-100 text-green-800',
            3: 'bg-red-100 text-red-800',
            4: 'bg-gray-100 text-gray-800',
            5: 'bg-purple-100 text-purple-800'
        };
        return colors[status] || colors[0];
    };

    const getActivityStatusText = (status) => {
        const statuses = {
            0: 'Chờ thực hiện',
            1: 'Đang thực hiện',
            2: 'Hoàn thành',
            3: 'Đã hủy'
        };
        return statuses[status] || 'Không xác định';
    };

    const getRequestStatusText = (status) => {
        const statuses = {
            0: 'Chờ duyệt',
            1: 'Đang xử lý',
            2: 'Từ chối',
            3: 'Chờ sửa',
            4: 'Chờ hoàn thành',
            5: 'Hoàn thành'
        };
        return statuses[status] || 'Không xác định';
    };


    const currentPlan = sortedPlans.find(plan => plan.isCurrent) || sortedPlans[0];
    const defaultTabValue = currentPlan?.planID;
    if (!sortedPlans?.length) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <Inbox className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600">Chưa có kế hoạch giải ngân nào được tạo</p>
            </div>
        );
    }
    return (
        <Tabs defaultValue={defaultTabValue} className="w-full">
            <TabsList className="mb-4">
                {sortedPlans.map((plan) => (
                    <TabsTrigger
                        key={plan.planID}
                        value={plan.planID}
                        className="relative px-4 py-2 rounded-none transition-colors duration-200
                        data-[state=active]:bg-transparent
                        data-[state=active]:text-teal-500
                        hover:text-teal-500
                        after:content-['']
                        after:absolute
                        after:bottom-0
                        after:left-0
                        after:w-full
                        after:h-0.5
                        after:bg-teal-500
                        after:scale-x-0
                        after:transition-transform
                        after:duration-300
                        whitespace-nowrap" >
                        {formatPlanName(plan)}
                        {plan.isCurrent && (
                            <Badge variant="secondary" className="ml-2">
                                Hiện tại
                            </Badge>
                        )}
                    </TabsTrigger>
                ))}
            </TabsList>

            {sortedPlans.map((plan) => (
                <TabsContent key={plan.planID} value={plan.planID}>
                    <ScrollArea className="h-[600px] pr-4">
                        <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

                            <div className="space-y-6">
                                {plan.stages.map((stage) => (
                                    <div key={stage.stageID} className="relative ml-12">
                                        {/* Marker icon */}
                                        <div className="absolute -left-[44px] p-2 bg-white rounded-full border-2 border-gray-300">
                                            <Goal className="w-6 h-6 text-gray-500" />
                                        </div>

                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-grow">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="space-y-2">
                                                                <h3 className="text-lg font-semibold">
                                                                    {stage.activity?.description || 'Chưa có hoạt động'}
                                                                </h3>
                                                                {stage.activity?.activityDate && (
                                                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                                        <Calendar className="w-4 h-4" />
                                                                        <span>{formatDate(stage.activity.activityDate)}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-3">
                                                        {stage.activity?.status !== undefined && (
                                                            <Badge className={getStatusColor(stage.activity.status)}>
                                                                {getActivityStatusText(stage.activity.status)}
                                                            </Badge>
                                                        )}
                                                        {stage.completedDisbursementRequests?.length > 0 && (
                                                            <button
                                                                onClick={() => toggleActivity(stage.stageID)}
                                                                className="p-1 hover:bg-gray-100 rounded-full"
                                                            >
                                                                {expandedActivities[stage.stageID] ? (
                                                                    <ChevronUp className="w-5 h-5" />
                                                                ) : (
                                                                    <ChevronDown className="w-5 h-5" />
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Disbursement Details */}
                                                {expandedActivities[stage.stageID] && stage.completedDisbursementRequests?.length > 0 && (
                                                    <div className="mt-4 space-y-4">
                                                        {stage.completedDisbursementRequests.map((request) => (
                                                            <div key={request.requestID} className="bg-gray-50 rounded-lg p-4">
                                                                <div className="flex justify-between items-center mb-3">
                                                                    <h4 className="font-medium">Chi tiết giải ngân</h4>
                                                                    <Badge className={getStatusColor(request.requestStatus)}>
                                                                        {getRequestStatusText(request.requestStatus)}
                                                                    </Badge>
                                                                </div>

                                                                {request.disbursementReports?.map((report) => (
                                                                    report.isCurrent && (
                                                                        <div key={report.reportID} className="space-y-3">
                                                                            {report.reportItems?.map((item, index) => (
                                                                                <div key={index} className="bg-white p-3 rounded border">
                                                                                    <div className="font-medium mb-2">{item.itemDescription}</div>
                                                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                                                        <div>Dự kiến: {formatAmount(item.amountSpent)}</div>
                                                                                        <div>Thực tế: {formatAmount(item.actualAmountSpent)}</div>
                                                                                    </div>
                                                                                    {item.receiptUrl && (
                                                                                        <a
                                                                                            href={item.receiptUrl}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 mt-2"
                                                                                        >
                                                                                            <Receipt className="w-4 h-4" />
                                                                                            <span>Xem hóa đơn</span>
                                                                                        </a>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollArea>
                </TabsContent>
            ))}
        </Tabs>
    );
};

export default Activity;