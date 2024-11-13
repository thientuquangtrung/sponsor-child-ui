import React from 'react';
import { Progress } from '@/components/ui/progress';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { activityStatus } from '@/config/combobox';

const DisbursementProgress = ({ disbursementPlans }) => {
    if (!disbursementPlans || disbursementPlans.length === 0) {
        return null;
    }

    const currentPlan = disbursementPlans.find(plan => plan.isCurrent);
    if (!currentPlan) return null;

    const getStageStatusLabel = (status) => {
        const statusInfo = activityStatus.find(s => s.value === status);
        const variant = status === 2 ? "success" :
            status === 3 ? "destructive" :
                status === 1 ? "warning" : "secondary";

        return (
            <Badge variant={variant}>
                {statusInfo ? statusInfo.label : 'Không xác định'}
            </Badge>
        );
    };

    const { stages } = currentPlan;

    const totalPlannedAmount = currentPlan.totalPlannedAmount;
    const disbursedAmount = stages.reduce((sum, stage) => {
        return sum + (stage.status === 2 ? stage.disbursementAmount : 0);
    }, 0);

    const progressPercentage = Math.round((disbursedAmount / totalPlannedAmount) * 100);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="w-full">
                    <div className="space-y-2 w-full relative">
                        <Progress
                            value={progressPercentage}
                            className="w-full h-3 bg-gray-300"
                            indicatorClassName="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 animate-pulse"
                        />
                        <div className="absolute inset-0 flex justify-center items-center text-sm">
                            <span className="font-bold">
                                {progressPercentage}%
                            </span>
                        </div>
                    </div>

                </TooltipTrigger>
                <TooltipContent className="w-72">
                    <div className="space-y-2">
                        <div className="font-medium pb-2">Chi tiết giải ngân:</div>
                        {stages.map((stage) => (
                            <div key={stage.stageID} className="flex items-center justify-between text-sm border-b pb-2 last:border-b-0">
                                <div className="flex flex-col">
                                    <span className="font-medium">Giai đoạn {stage.stageNumber}</span>
                                    <span className="text-xs text-muted-foreground">
                                        Dự kiến: {new Date(stage.scheduledDate).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="font-medium">{stage.disbursementAmount.toLocaleString('vi-VN')}₫</span>
                                    {getStageStatusLabel(stage.status)}
                                </div>
                            </div>
                        ))}
                        <div className="pt-2 border-t text-sm">
                            <div className="flex justify-between font-medium">
                                <span>Tổng đã giải ngân:</span>
                                <span>{disbursedAmount.toLocaleString('vi-VN')}₫</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Tổng kế hoạch:</span>
                                <span>{totalPlannedAmount.toLocaleString('vi-VN')}₫</span>
                            </div>
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default DisbursementProgress;