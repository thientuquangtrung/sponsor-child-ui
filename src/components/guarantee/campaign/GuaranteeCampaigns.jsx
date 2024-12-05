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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { useCheckGuaranteeEligibilityQuery, useGetCampaignByGuaranteeIdQuery } from '@/redux/campaign/campaignApi';
import LoadingScreen from '@/components/common/LoadingScreen';
import { useNavigate } from 'react-router-dom';
import DisbursementProgress from '@/components/guarantee/campaign/DisbursementProgress';

const getStatusVariant = (statusValue) => {
    switch (statusValue) {
        case 0: return 'info';
        case 1: return 'warning';
        case 2: return 'success';
        case 3: return 'destructive';
        case 4: return 'default';
        case 5: return 'muted';
        case 6: return 'destructive';
        case 7: return 'destructive';
        case 8: return 'secondary';
        case 9: return 'outline';
        default: return 'secondary';
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
                </DropdownMenuItem>
            </DropdownMenuContent>
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
    const [isEligibilityDialogOpen, setIsEligibilityDialogOpen] = React.useState(false);
    const {
        data: eligibilityData,
        error: eligibilityError
    } = useCheckGuaranteeEligibilityQuery(user.userID);
    const handleCreateCampaign = () => {
        if (eligibilityData === true) {
            navigate('/guarantee/create-campaign');
        } else {
            setIsEligibilityDialogOpen(true);
        }
    };
    const columns = [
        {
            accessorKey: 'thumbnailUrl',
            header: 'Hình ảnh',
            cell: ({ row }) => (
                <div className="w-16 h-16 min-w-[64px]">
                    <img
                        src={row.getValue('thumbnailUrl')}
                        alt={row.getValue('title')}
                        className="w-full h-full object-cover rounded"
                    />
                </div>
            ),
        },
        {
            accessorKey: 'title',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Tên chiến dịch" />,
            cell: ({ row }) => (
                <div className="font-medium min-w-[200px] max-w-[200px] text-ellipsis overflow-hidden whitespace-nowrap">
                    {row.getValue('title')}
                </div>
            ),
        },
        {
            accessorKey: 'targetAmount',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Số tiền mục tiêu" />,
            cell: ({ row }) => (
                <div className="text-right font-medium min-w-[120px]">
                    {row.getValue('targetAmount').toLocaleString('vi-VN')} ₫
                </div>
            ),
        },
        {
            accessorKey: 'startDate',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày bắt đầu" />,
            cell: ({ row }) => (
                <div className="min-w-[100px]">
                    {new Date(row.getValue('startDate')).toLocaleDateString('vi-VN')}
                </div>
            ),
        },
        {
            accessorKey: 'endDate',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày kết thúc" />,
            cell: ({ row }) => (
                <div className="min-w-[100px]">
                    {new Date(row.getValue('endDate')).toLocaleDateString('vi-VN')}
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
            cell: ({ row }) => {
                const statusValue = row.getValue('status');
                return (
                    <div className="min-w-[120px]">
                        <Badge variant={getStatusVariant(statusValue)}>
                            {getStatusLabel(statusValue)}
                        </Badge>
                    </div>
                );
            },
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },
        },
        {
            accessorKey: 'childName',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Tên trẻ em" />,
            cell: ({ row }) => (
                <div className="min-w-[150px]">
                    {row.getValue('childName') || 'Chưa có thông tin'}
                </div>
            ),
        },
        {
            accessorKey: 'disbursementPlans',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Tiến độ giải ngân" />,
            cell: ({ row }) => (
                <div className="min-w-[200px]">
                    <DisbursementProgress disbursementPlans={row.getValue('disbursementPlans')} />
                </div>
            ),
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
        <div className="grid grid-cols-1 gap-4">
            <h1 className="text-2xl font-bold px-6 pt-6">Danh sách chiến dịch của bạn</h1>

            <div className="flex justify-end items-center mb-6">
                <Button
                    className="bg-gradient-to-l from-secondary to-primary text-white"
                    onClick={handleCreateCampaign}
                >
                    <BadgePlus className="w-4 h-4 mr-2" />
                    Tạo Chiến dịch
                </Button>
            </div>
            <Dialog
                open={isEligibilityDialogOpen}
                onOpenChange={setIsEligibilityDialogOpen}
            >
                <DialogContent className="rounded-lg shadow-lg p-6">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-2xl font-semibold text-center text-teal-500">
                            Thông báo
                        </DialogTitle>
                        <DialogDescription className="text-base text-gray-600 mt-2 text-center">
                            Bạn đã tạo 2 chiến dịch đang ở trạng thái chưa hoàn thành.
                            Vui lòng hoàn thành các chiến dịch trước khi tạo mới.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <div className="overflow-x-auto">
                <div className="border rounded-md min-w-full inline-block">
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
        </div>
    );
}

export default GuaranteeCampaigns;