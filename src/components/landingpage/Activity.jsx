// import React, { useState } from 'react';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Calendar, ChevronDown, ChevronUp, FileText, Goal, Inbox, Receipt } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card';
// import { disbursementStageStatus, disbursementRequestStatus, activityStatus } from '@/config/combobox';
// import CampaignActivities from './CampaignActivities';

// const Activity = ({ campaign }) => {
//     const [expandedActivities, setExpandedActivities] = useState({});

//     const toggleActivity = (id) => {
//         setExpandedActivities((prev) => ({
//             ...prev,
//             [id]: !prev[id],
//         }));
//     };

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('vi-VN');
//     };

//     const formatAmount = (amount) => {
//         return amount?.toLocaleString('vi-VN') + 'đ';
//     };

//     const findStatusLabel = (statusArray, value) => {
//         return statusArray.find((status) => status.value === value)?.label || 'Không xác định';
//     };

//     const getStageStatusColor = (status) => {
//         switch (status) {
//             case 0:
//                 return 'text-yellow-600 bg-yellow-50';
//             case 1:
//                 return 'text-blue-600 bg-blue-50';
//             case 2:
//                 return 'text-green-600 bg-green-50';
//             case 3:
//                 return 'text-red-600 bg-red-50';
//             case 4:
//                 return 'text-gray-600 bg-gray-50';
//             case 5:
//                 return 'text-purple-600 bg-purple-50';
//             default:
//                 return 'text-gray-600 bg-gray-50';
//         }
//     };

//     const getActivityStatusColor = (status) => {
//         switch (status) {
//             case 0:
//                 return 'text-yellow-600 bg-yellow-50';
//             case 1:
//                 return 'text-blue-600 bg-blue-50';
//             case 2:
//                 return 'text-green-600 bg-green-50';
//             case 3:
//                 return 'text-gray-600 bg-gray-50';
//             default:
//                 return 'text-gray-600 bg-gray-50';
//         }
//     };

//     const getRequestStatusColor = (status) => {
//         switch (status) {
//             case 0:
//                 return 'text-yellow-600 bg-yellow-50';
//             case 1:
//                 return 'text-blue-600 bg-blue-50';
//             case 2:
//                 return 'text-red-600 bg-red-50';
//             case 3:
//                 return 'text-orange-600 bg-orange-50';
//             case 4:
//                 return 'text-indigo-600 bg-indigo-50';
//             case 5:
//                 return 'text-green-600 bg-green-50';
//             default:
//                 return 'text-gray-600 bg-gray-50';
//         }
//     };

//     const disbursementPlans = campaign?.disbursementPlans || [];
//     const currentPlan = disbursementPlans.find((plan) => plan.isCurrent) || disbursementPlans[0];

//     const stages = [...(currentPlan?.simplifiedStages || [])].sort((a, b) => {
//         const dateA = new Date(a.scheduledDate);
//         const dateB = new Date(b.scheduledDate);
//         return dateB - dateA;
//     });

//     if (!disbursementPlans.length || !stages.length) {
//         return (
//             <div className="flex flex-col items-center justify-center text-center space-y-4">
//                 <div className="bg-teal-50 p-4 rounded-full mb-4">
//                     <Inbox className="w-12 h-12 text-teal-600" />
//                 </div>
//                 <p className="text-gray-600">(｡•́︿•̀｡) Hiện chiến dịch chưa có hoạt động. Hãy quay lại sau nhé! ✨</p>
//             </div>
//         );
//     }

//     return (
//         <ScrollArea className="h-[900px] pr-4">
//             <div className="relative">
//                 <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-teal-100" />

//                 <div className="space-y-8">
//                     {stages.map((stage) => (
//                         <div key={stage.stageID} className="relative ml-12">
//                             <div className="absolute -left-[44px] p-2 bg-white rounded-full border-2 border-teal-500">
//                                 <Goal className="w-6 h-6 text-teal-500" />
//                             </div>

//                             <Card className="border-none shadow-lg">
//                                 <CardContent className="p-6">
//                                     <div className="flex justify-between items-start mb-6">
//                                         <div className="flex-grow">
//                                             <div className="flex items-center space-x-3">
//                                                 <div className="space-y-2 flex-grow">
//                                                     <h3 className="text-xl font-bold text-gray-900">
//                                                         {stage.stageActivity?.description || 'Chưa có hoạt động'}
//                                                     </h3>
//                                                     <div className="flex items-center space-x-2 text-sm text-gray-500">
//                                                         <Calendar className="w-4 h-4" />
//                                                         <span>Ngày dự kiến: {formatDate(stage.scheduledDate)}</span>
//                                                     </div>
//                                                 </div>
//                                                 <button
//                                                     onClick={() => toggleActivity(stage.stageID)}
//                                                     className="p-1 hover:bg-teal-50 rounded-full transition-colors"
//                                                 >
//                                                     {expandedActivities[stage.stageID] ? (
//                                                         <ChevronUp className="w-5 h-5 text-teal-500" />
//                                                     ) : (
//                                                         <ChevronDown className="w-5 h-5 text-teal-500" />
//                                                     )}
//                                                 </button>
//                                             </div>
//                                         </div>
//                                         <div className="flex flex-col items-end space-y-2">
//                                             <span
//                                                 className={`px-4 py-2 rounded-full text-sm font-medium ${getStageStatusColor(
//                                                     stage.status,
//                                                 )}`}
//                                             >
//                                                 {findStatusLabel(disbursementStageStatus, stage.status)}
//                                             </span>
//                                             <div className="text-right">
//                                                 <div className="text-blue-600 font-medium">
//                                                     Tổng chi phí dự kiến: {formatAmount(stage.disbursementAmount)}
//                                                 </div>
//                                                 {/* {stage.actualDisbursementAmount && (
//                                                         <div className="text-green-600 font-medium">
//                                                             Số tiền thực tế: {formatAmount(stage.actualDisbursementAmount)}
//                                                         </div>
//                                                     )} */}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {expandedActivities[stage.stageID] && (
//                                         <div className="mt-6 space-y-4">
//                                             <div className="border-l-2 border-teal-200 pl-4 ml-2 relative">
//                                                 <div className="absolute -left-[5px] top-3 w-2 h-2 rounded-full bg-teal-500" />
//                                                 <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
//                                                     <div className="flex justify-between items-start mb-3">
//                                                         <div className="flex items-center space-x-2">
//                                                             <Calendar className="w-4 h-4" />
//                                                             <span className="text-sm text-gray-500">
//                                                                 {formatDate(stage.stageActivity.activityDate)}
//                                                             </span>
//                                                         </div>
//                                                         <span
//                                                             className={`px-3 py-1 rounded-full text-xs font-medium ${getActivityStatusColor(
//                                                                 stage.stageActivity.status,
//                                                             )}`}
//                                                         >
//                                                             {findStatusLabel(
//                                                                 activityStatus,
//                                                                 stage.stageActivity.status,
//                                                             )}
//                                                         </span>
//                                                     </div>

//                                                     {stage.latestDisbursementRequest && (
//                                                         <div className="mt-3 pt-3 border-t border-gray-200">
//                                                             <div className="text-sm text-gray-600">
//                                                                 <div className="flex justify-between items-center mb-2">
//                                                                     <span>Yêu cầu giải ngân:</span>
//                                                                     <span
//                                                                         className={`px-3 py-1 rounded-full text-xs font-medium ${getRequestStatusColor(
//                                                                             stage.latestDisbursementRequest
//                                                                                 .requestStatus,
//                                                                         )}`}
//                                                                     >
//                                                                         {findStatusLabel(
//                                                                             disbursementRequestStatus,
//                                                                             stage.latestDisbursementRequest
//                                                                                 .requestStatus,
//                                                                         )}
//                                                                     </span>
//                                                                 </div>
//                                                                 <div>
//                                                                     Ngày yêu cầu:{' '}
//                                                                     {formatDate(
//                                                                         stage.latestDisbursementRequest.requestDate,
//                                                                     )}
//                                                                 </div>

//                                                                 {stage.latestDisbursementRequest
//                                                                     .simplifiedDisbursementReports?.length > 0 && (
//                                                                     <div className="mt-4">
//                                                                         <h5 className="font-medium mb-2">Chi tiết:</h5>
//                                                                         {stage.latestDisbursementRequest.simplifiedDisbursementReports
//                                                                             .filter((report) => report.isCurrent)
//                                                                             .map((report) => (
//                                                                                 <div
//                                                                                     key={report.id}
//                                                                                     className="space-y-3"
//                                                                                 >
//                                                                                     {report.disbursementReportDetails.map(
//                                                                                         (detail) => (
//                                                                                             <div
//                                                                                                 key={detail.id}
//                                                                                                 className="bg-white p-3 rounded-lg"
//                                                                                             >
//                                                                                                 <div className="font-medium">
//                                                                                                     {
//                                                                                                         detail.itemDescription
//                                                                                                     }
//                                                                                                 </div>
//                                                                                                 <div className="text-sm">
//                                                                                                     <div className="text-blue-600">
//                                                                                                         Chi phí dự kiến:{' '}
//                                                                                                         {formatAmount(
//                                                                                                             detail.amountSpent,
//                                                                                                         )}
//                                                                                                     </div>
//                                                                                                     <div className="text-green-600">
//                                                                                                         Chi phí thực tế:{' '}
//                                                                                                         {formatAmount(
//                                                                                                             detail.actualAmountSpent,
//                                                                                                         )}
//                                                                                                     </div>
//                                                                                                 </div>
//                                                                                                 {detail.receiptUrl && (
//                                                                                                     <a
//                                                                                                         href={
//                                                                                                             detail.receiptUrl
//                                                                                                         }
//                                                                                                         target="_blank"
//                                                                                                         rel="noopener noreferrer"
//                                                                                                         className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 mt-2"
//                                                                                                     >
//                                                                                                         <Receipt className="w-4 h-4" />
//                                                                                                         <span>
//                                                                                                             Xem hóa đơn
//                                                                                                         </span>
//                                                                                                     </a>
//                                                                                                 )}
//                                                                                             </div>
//                                                                                         ),
//                                                                                     )}
//                                                                                 </div>
//                                                                             ))}
//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </CardContent>
//                             </Card>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             <CampaignActivities />
//         </ScrollArea>
//     );
// };

// export default Activity;

import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Receipt } from 'lucide-react';
import { Table, TableHead, TableRow, TableCell, TableBody, TableHeader } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { disbursementStageStatus, disbursementRequestStatus, activityStatus } from '@/config/combobox';
import CampaignActivities from './CampaignActivities';
import { Badge } from '../ui/badge';

const Activity = ({ campaign }) => {
    const [expandedRows, setExpandedRows] = useState([]);

    const toggleRow = (id) => {
        setExpandedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const formatAmount = (amount) => {
        return amount?.toLocaleString('vi-VN') + ' ₫';
    };

    const findStatusLabel = (statusArray, value) => {
        return statusArray.find((status) => status.value === value)?.label || 'Không xác định';
    };

    const getStageStatusColor = (status) => {
        switch (status) {
            case 0:
                return 'text-yellow-600 bg-yellow-50';
            case 1:
                return 'text-blue-600 bg-blue-50';
            case 2:
                return 'text-green-600 bg-green-50';
            case 3:
                return 'text-red-600 bg-red-50';
            case 4:
                return 'text-gray-600 bg-gray-50';
            case 5:
                return 'text-purple-600 bg-purple-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const getActivityStatusColor = (status) => {
        switch (status) {
            case 0:
                return 'text-yellow-600 bg-yellow-50';
            case 1:
                return 'text-blue-600 bg-blue-50';
            case 2:
                return 'text-green-600 bg-green-50';
            case 3:
                return 'text-gray-600 bg-gray-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const getRequestStatusColor = (status) => {
        switch (status) {
            case 0:
                return 'text-yellow-600 bg-yellow-50';
            case 1:
                return 'text-blue-600 bg-blue-50';
            case 2:
                return 'text-red-600 bg-red-50';
            case 3:
                return 'text-orange-600 bg-orange-50';
            case 4:
                return 'text-indigo-600 bg-indigo-50';
            case 5:
                return 'text-green-600 bg-green-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const disbursementPlans = campaign?.disbursementPlans || [];
    const currentPlan = disbursementPlans.find((plan) => plan.isCurrent) || disbursementPlans[0];

    const stages = [...(currentPlan?.simplifiedStages || [])].sort((a, b) => {
        const dateA = new Date(a.scheduledDate);
        const dateB = new Date(b.scheduledDate);
        return dateB - dateA;
    });

    if (!stages.length) {
        return (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
                <p className="text-gray-600">(｡•́︿•̀｡) Hiện chiến dịch chưa có hoạt động. Hãy quay lại sau nhé! ✨</p>
            </div>
        );
    }

    return (
        <ScrollArea className="">
            <Table className="border-collapse border-solid-2 border-slate-500 w-full bg-white shadow-lg rounded-lg overflow-hidden">
                <TableHeader className="bg-gradient-to-l from-rose-100 to-teal-100 border-b border-slate-500">
                    <TableRow>
                        <TableHead className="text-center py-2 text-black">Hoạt động</TableHead>
                        <TableHead className="text-center py-2 text-black">Ngày dự kiến</TableHead>
                        <TableHead className="text-center py-2 text-black">Trạng thái</TableHead>
                        <TableHead className="text-center py-2 text-black">Tổng chi phí dự kiến</TableHead>
                        <TableHead className="text-center py-2 text-black"></TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {stages.map((stage) => (
                        <React.Fragment key={stage.stageID}>
                            <TableRow>
                                <TableCell className="font-medium">
                                    {stage.stageActivity?.description || 'Chưa có hoạt động'}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(stage.scheduledDate)}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        className={`${getStageStatusColor(
                                            stage.status,
                                        )}`}
                                    >
                                        {findStatusLabel(disbursementStageStatus, stage.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">{formatAmount(stage.disbursementAmount)}</TableCell>
                                <TableCell>
                                    {stage.stageActivity?.description && (
                                        <button
                                            onClick={() => toggleRow(stage.stageID)}
                                            className="p-1 hover:bg-teal-50 rounded-full transition-colors"
                                        >
                                            {expandedRows.includes(stage.stageID) ? (
                                                <ChevronUp className="w-5 h-5 text-teal-500" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-teal-500" />
                                            )}
                                        </button>
                                    )}
                                </TableCell>
                            </TableRow>
                            {expandedRows.includes(stage.stageID) && (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <div className="border-l-2 border-teal-300 px-6 py-4 bg-gray-50 rounded-md shadow-sm space-y-4 hover:bg-normal">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-2">
                                                    <Calendar className="w-5 h-5 text-teal-600" />
                                                    <span className="text-gray-700">
                                                        Ngày hoạt động:{' '}
                                                        <span className="font-medium text-gray-800">
                                                            {formatDate(stage.stageActivity?.activityDate)}
                                                        </span>
                                                    </span>
                                                </div>

                                                <div>
                                                    <span className="text-gray-700">
                                                        Trạng thái:{' '}
                                                        <Badge
                                                            className={`${getActivityStatusColor(
                                                                stage.stageActivity?.status,
                                                            )}`}
                                                        >
                                                            {findStatusLabel(
                                                                activityStatus,
                                                                stage.stageActivity?.status,
                                                            )}
                                                        </Badge>
                                                    </span>
                                                </div>
                                            </div>

                                            {stage.latestDisbursementRequest && (
                                                <div className="border-t border-gray-200 py-4">
                                                    <h5 className="text-lg font-semibold text-gray-800">
                                                        Yêu cầu giải ngân
                                                    </h5>
                                                    <div className="text-gray-700 mt-4 flex justify-between items-center">
                                                        <div>
                                                            Ngày yêu cầu:{' '}
                                                            <span className="font-medium">
                                                                {formatDate(
                                                                    stage.latestDisbursementRequest.requestDate,
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            Trạng thái:{' '}
                                                            <span
                                                                className={`px-3 py-1 rounded-full text-xs font-medium ${getRequestStatusColor(
                                                                    stage.latestDisbursementRequest.requestStatus,
                                                                )}`}
                                                            >
                                                                {findStatusLabel(
                                                                    disbursementRequestStatus,
                                                                    stage.latestDisbursementRequest.requestStatus,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {stage.latestDisbursementRequest.simplifiedDisbursementReports
                                                        ?.length > 0 && (
                                                        <div className="mt-4 space-y-4">
                                                            <h5 className="text-lg font-semibold text-gray-800 pb-2">
                                                                Chi tiết giải ngân
                                                            </h5>
                                                            {stage.latestDisbursementRequest.simplifiedDisbursementReports
                                                                .filter((report) => report.isCurrent)
                                                                .map((report) => (
                                                                    <div key={report.id} className="space-y-4">
                                                                        {report.disbursementReportDetails.map(
                                                                            (detail) => (
                                                                                <div
                                                                                    key={detail.id}
                                                                                    className="bg-white p-4 rounded-lg shadow-md border border-gray-300 space-y-4"
                                                                                >
                                                                                    <div className="text-gray-900 font-bold text-lg border-b border-gray-200 pb-2">
                                                                                        {detail.itemDescription}
                                                                                    </div>

                                                                                    <div className="text-sm text-gray-700 flex justify-between items-center space-x-4">
                                                                                        <div className="flex flex-col items-start space-y-2">
                                                                                            <span className="font-medium">
                                                                                                Chi phí dự kiến:
                                                                                            </span>
                                                                                            <Badge className="bg-blue-50 text-blue-600 font-semibold">
                                                                                                {formatAmount(
                                                                                                    detail.amountSpent,
                                                                                                )}
                                                                                            </Badge>
                                                                                        </div>

                                                                                        <div className="flex flex-col items-start space-y-2">
                                                                                            <span className="font-medium">
                                                                                                Chi phí thực tế:
                                                                                            </span>
                                                                                            <Badge className="bg-green-50 text-green-600 font-semibold">
                                                                                                {formatAmount(
                                                                                                    detail.actualAmountSpent,
                                                                                                )}
                                                                                            </Badge>
                                                                                        </div>

                                                                                        {detail.receiptUrl && (
                                                                                            <a
                                                                                                href={detail.receiptUrl}
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                                className="flex items-center text-teal-600 hover:text-teal-700 space-x-2"
                                                                                            >
                                                                                                <Receipt className="w-5 h-5" />
                                                                                                <span className="underline">
                                                                                                    Xem hóa đơn
                                                                                                </span>
                                                                                            </a>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
            <CampaignActivities />
        </ScrollArea>
    );
};

export default Activity;
