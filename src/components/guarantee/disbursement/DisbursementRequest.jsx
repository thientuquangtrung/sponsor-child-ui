import * as React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CircleFadingPlus, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingScreen from '@/components/common/LoadingScreen';
import { DataTableColumnHeader } from '@/components/datatable/DataTableColumnHeader';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetDisbursementRequestByGuaranteeIdQuery } from '@/redux/guarantee/disbursementRequestApi';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const getRequestStatusVariant = (status) => {
    switch (status) {
        case 0:
            return 'bg-yellow-500 text-yellow-100 hover:bg-normal';
        case 1:
            return 'bg-teal-500 text-white hover:bg-normal';
        case 2:
            return 'bg-secondary text-white hover:bg-normal';
        default:
            return 'bg-gray-200 text-gray-800 hover:bg-normal';
    }
};

const getRequestStatusLabel = (status) => {
    switch (status) {
        case 0:
            return 'Đã gửi yêu cầu';
        case 1:
            return 'Đã phê duyệt';
        case 2:
            return 'Đã từ chối';
        default:
            return 'Không xác định';
    }
};

export function DisbursementRequests() {
    const { user } = useSelector((state) => state.auth);
    const guaranteeID = user?.userID;
    const {
        data: disbursementRequests,
        isLoading,
        error,
        refetch,
    } = useGetDisbursementRequestByGuaranteeIdQuery(guaranteeID);
    const [sorting, setSorting] = React.useState([{ id: 'requestDate', desc: true }]);
    const navigate = useNavigate();

    const columns = [
        {
            accessorKey: 'bankAccountName',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Tên tài khoản ngân hàng" />,
            cell: ({ row }) => <div className="font-medium">{row.getValue('bankAccountName')}</div>,
        },
        {
            accessorKey: 'bankAccountNumber',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Số tài khoản ngân hàng" />,
            cell: ({ row }) => <div>{row.getValue('bankAccountNumber')}</div>,
        },
        {
            accessorKey: 'requestDate',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày yêu cầu" />,
            cell: ({ row }) => <div>{new Date(row.getValue('requestDate')).toLocaleDateString('vi-VN')}</div>,
        },
        {
            accessorFn: (row) => row.disbursementStage?.scheduledDate,
            id: 'customScheduledDate', 
            header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày dự kiến" />,
            cell: ({ row }) => {
                const date = row.getValue('customScheduledDate');
                return date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A';
            },
        },
        {
            accessorKey: 'bankName',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Tên ngân hàng" />,
            cell: ({ row }) => <div>{row.getValue('bankName')}</div>,
        },
        {
            accessorKey: 'requestStatus',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
            cell: ({ row }) => {
                const statusValue = row.getValue('requestStatus');
                return (
                    <Badge className={getRequestStatusVariant(statusValue)}>{getRequestStatusLabel(statusValue)}</Badge>
                );
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => <ActionMenu row={row} />,
        },
    ];

    const table = useReactTable({
        data: disbursementRequests || [],
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    });

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">Đã có lỗi khi tải dữ liệu</div>;
    }

    const ActionMenu = ({ row }) => {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-normal">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/guarantee/disbursement-request-detail/${row.original.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    return (
        <div className="w-full space-y-4">
            <h1 className="text-4xl text-center font-bold py-4 bg-gradient-to-b from-teal-500 to-rose-300 text-transparent bg-clip-text">
                Danh sách yêu cầu giải ngân
            </h1>

            {/* <div className="flex justify-end pb-4">
                <div className="h-auto w-[220px] bg-gradient-to-r from-teal-500 via-gray-400 to-rose-300 p-[2px] rounded-md">
                    <Button
                        onClick={() => navigate('/guarantee/create-disbursement-request')}
                        className="bg-white text-black text-md font-semibold rounded-md flex items-center space-x-2 h-full w-full hover:bg-normal"
                    >
                        <CircleFadingPlus className="mr-2 h-4 w-4" />
                        Tạo yêu cầu giải ngân
                    </Button>
                </div>
            </div> */}

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
                                    Không có yêu cầu giải ngân nào.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default DisbursementRequests;
