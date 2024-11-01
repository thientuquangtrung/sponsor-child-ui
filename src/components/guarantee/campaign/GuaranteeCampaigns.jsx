import * as React from 'react';
import { useSelector } from 'react-redux';
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { BadgePlus, Eye, MoreHorizontal } from 'lucide-react';
import { campaignStatus } from '@/config/combobox';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/datatable/DataTableColumnHeader';
import { useGetCampaignByGuaranteeIdQuery } from '@/redux/campaign/campaignApi';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useNavigate } from 'react-router-dom';

const getStatusVariant = (statusValue) => {
    switch (statusValue) {
        case 0: // pending
            return 'secondary';
        case 1: // pending contract
            return 'warning';
        case 2: // approved
            return 'success';
        case 3: // rejected
            return 'destructive';
        case 4: // active
            return 'default';
        case 5: // finished
            return 'outline';
        case 6: // canceled
            return 'destructive';
        case 7: // expired
            return 'destructive';
        case 8: //  in disbursement
            return 'info';
        case 9: // suspended
            return 'outline';
        default:
            return 'secondary';
    }
};

const getStatusLabel = (statusValue) => {
    const status = campaignStatus.find(s => s.value === statusValue);
    return status ? status.label : 'Không xác định';
};

const ActionMenu = ({ row }) => {
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Mở menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate(`/guarantee/campaign/${row.original.campaignID}`)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Xem chi tiết
                </DropdownMenuItem>            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export function GuaranteeCampaigns() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { data: campaigns, isLoading, error } = useGetCampaignByGuaranteeIdQuery(user.userID);
    const [sorting, setSorting] = React.useState([
        { id: 'startDate', desc: true }
    ]);

    console.log(campaigns);

    const columns = [
        {
            accessorKey: 'thumbnailUrl',
            header: 'Hình ảnh',
            cell: ({ row }) => (
                <img
                    src={row.getValue('thumbnailUrl')}
                    alt={row.getValue('title')}
                    className="w-16 h-16 object-cover rounded"
                />
            ),
        },
        {
            accessorKey: 'title',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Tên chiến dịch" />,
            cell: ({ row }) => <div className="font-medium text-ellipsis whitespace-nowrap overflow-hidden w-48 ">{row.getValue('title')}</div>,
        },
        {
            accessorKey: 'targetAmount',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Số tiền mục tiêu" />,
            cell: ({ row }) => (
                <div className="text-right font-medium">
                    {row.getValue('targetAmount').toLocaleString('vi-VN')} ₫
                </div>
            ),
        },
        {
            accessorKey: 'startDate',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày bắt đầu" />,
            cell: ({ row }) => (
                <div>{new Date(row.getValue('startDate')).toLocaleDateString('vi-VN')}</div>
            ),
        },
        {
            accessorKey: 'endDate',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày kết thúc" />,
            cell: ({ row }) => (
                <div>{new Date(row.getValue('endDate')).toLocaleDateString('vi-VN')}</div>
            ),
        },
        {
            accessorKey: 'status',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
            cell: ({ row }) => {
                const statusValue = row.getValue('status');
                return (
                    <Badge variant={getStatusVariant(statusValue)}>
                        {getStatusLabel(statusValue)}
                    </Badge>
                );
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },
        },
        {
            accessorKey: 'childName',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Tên trẻ em" />,
            cell: ({ row }) => <div>{row.getValue('childName') || 'Chưa có thông tin'}</div>,
        },
        {
            id: 'actions',
            cell: ({ row }) => <ActionMenu row={row} />,
        },
    ];

    const table = useReactTable({
        data: campaigns || [],
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },

    });

    if (isLoading) {
        return <div><LoadingScreen /></div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">Đã có lỗi</div>;
    }

    return (
        <div className="w-full space-y-4">
            <h1 className="text-2xl font-bold px-6 pt-6">Danh sách chiến dịch của bạn</h1>

            <div className="flex justify-end items-center mb-6">
                <Button
                    className="bg-gradient-to-l from-secondary to-primary text-white"
                    onClick={() => navigate('/guarantee/create-campaign')}
                >
                    <BadgePlus className="w-4 h-4 mr-2" />
                    Tạo Chiến dịch
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
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
                                    Không có chiến dịch nào.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default GuaranteeCampaigns;