import React from 'react';
import { useSelector } from 'react-redux';
import { DataTableColumnHeader } from '@/components/datatable/DataTableColumnHeader';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Smile } from 'lucide-react';
import { useGetCampaignEligibleForDisbursementQuery } from '@/redux/campaign/campaignApi';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useNavigate } from 'react-router-dom';

const ListDisbursementCampaign = () => {
    const { user } = useSelector((state) => state.auth);
    const guaranteeID = user?.userID;
    const { data: campaigns, isLoading, error } = useGetCampaignEligibleForDisbursementQuery(guaranteeID);

    const getRequestStatusVariant = (status) => {
        switch (status) {
            case 0:
                return 'bg-blue-500 text-white';
            case 1:
                return 'bg-yellow-500 text-white';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    const getRequestStatusLabel = (status) => {
        switch (status) {
            case 0:
                return 'Đang giải ngân';
            case 1:
                return 'Đang tiến hành';
            default:
                return 'Không xác định';
        }
    };

    const columns = [
        {
            accessorKey: 'title',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Tên chiến dịch" />,
            cell: ({ row }) => {
                const title = row.getValue('title');
                return (
                    <div className="truncate max-w-xs" title={title}>
                        {title}
                    </div>
                );
            },
        },
        {
            accessorKey: 'targetAmount',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Số tiền mục tiêu" />,
            cell: ({ row }) => <div>{row.getValue('targetAmount').toLocaleString()} VND</div>,
        },
        {
            accessorKey: 'nextDisbursementStage.stageNumber',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Giai đoạn giải ngân" />,
            cell: ({ row }) => <div>{row.original.nextDisbursementStage?.stageNumber}</div>,
        },
        {
            accessorKey: 'nextDisbursementStage.disbursementAmount',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Số tiền cần giải ngân" />,
            cell: ({ row }) => <div>{row.original.nextDisbursementStage?.disbursementAmount?.toLocaleString()} VND</div>,
        },
        {
            accessorKey: 'nextDisbursementStage.scheduledDate',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày dự kiến giải ngân" />,
            cell: ({ row }) => <div>{new Date(row.original.nextDisbursementStage?.scheduledDate).toLocaleDateString('vi-VN')}</div>,
        },
        {
            accessorKey: 'nextDisbursementStage.status',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Tình trạng giải ngân" />,
            cell: ({ row }) => {
                const statusValue = row.original.nextDisbursementStage?.status;
                return (
                    <Badge className={getRequestStatusVariant(statusValue)}>{getRequestStatusLabel(statusValue)}</Badge>
                );
            },
        },
        {
            accessorKey: 'disbursementPlans[0].plannedStartDate',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày bắt đầu kế hoạch" />,
            cell: ({ row }) => <div>{new Date(row.original.disbursementPlans[0].plannedStartDate).toLocaleDateString('vi-VN')}</div>,
        },
        {
            accessorKey: 'disbursementPlans[0].plannedEndDate',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày kết thúc kế hoạch" />,
            cell: ({ row }) => <div>{new Date(row.original.disbursementPlans[0].plannedEndDate).toLocaleDateString('vi-VN')}</div>,
        },
        {
            id: 'actions',
            cell: ({ row }) => <ActionMenu row={row} />,
        },
    ];

    const table = useReactTable({
        data: campaigns || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        if (error.status === 404) {
            return (
                <div className="flex flex-col items-center justify-center pt-14">
                    <Smile className="w-16 h-16 text-yellow-400 mb-4" />
                    <p className="text-2xl text-teal-500">Hiện tại chưa có chiến dịch nào yêu cầu giải ngân.</p>
                    <p className="text-blue-500 mt-2">Xin hãy quay lại sau nhé!</p>
                </div>
            );
        } else {
            return <div className="text-center py-4 text-red-500">Đã xảy ra lỗi</div>;
        }
    }

    if (!campaigns || campaigns.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500">
                Không có chiến dịch nào cần yêu cầu giải ngân.
            </div>
        );
    }

    const ActionMenu = ({ row }) => {
        const navigate = useNavigate();
        const handleCreateDisbursementRequest = () => {
            const stageID = row.original.nextDisbursementStage.stageID;
            navigate(`/guarantee/create-disbursement-request?stageID=${stageID}`);
        };

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-normal">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleCreateDisbursementRequest}>
                        Tạo yêu cầu
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    return (
        <div className="w-full space-y-4">
            <h1 className="text-4xl text-center font-bold py-4 bg-gradient-to-b from-teal-500 to-rose-300 text-transparent bg-clip-text">
                Danh sách chiến dịch yêu cần giải ngân
            </h1>

            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-gradient-to-r from-rose-200 to-primary">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Không có chiến dịch nào cần giải ngân.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ListDisbursementCampaign;