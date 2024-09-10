import * as React from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DataTablePagination } from '@/components/datatable/DataTablePagination';
import { DataTableToolbar } from '@/components/datatable/DataTableToolbar';
import { DataTableColumnHeader } from '@/components/datatable/DataTableColumnHeader';

const data = [
    {
        id: 'don001',
        donor: 'Nguyễn A',
        campaign: 'Chiến dịch A',
        amount: 1000000,
        status: 'Đã xác nhận',
        date: new Date(2024, 5, 15).toISOString(),
    },
    {
        id: 'don002',
        donor: 'Nguyễn B',
        campaign: 'Chiến dịch B',
        amount: 500000,
        status: 'Đang xử lý',
        date: new Date(2024, 5, 16).toISOString(),
    },
    {
        id: 'don003',
        donor: 'Nguyễn C',
        campaign: 'Chiến dịch C',
        amount: 2000000,
        status: 'Đã xác nhận',
        date: new Date(2024, 5, 17).toISOString(),
    },
];

const columns = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Chọn tất cả"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Chọn hàng"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'donor',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Người quyên góp" />,
        cell: ({ row }) => <div className="font-medium">{row.getValue('donor')}</div>,
    },
    {
        accessorKey: 'campaign',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Chiến dịch" />,
        cell: ({ row }) => <div>{row.getValue('campaign')}</div>,
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số tiền" className="justify-end" />,
        cell: ({ row }) => (
            <div className="text-right font-medium">
                {row.getValue('amount').toLocaleString('vi-VN')} ₫
            </div>
        ),
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => (
            <Badge variant={row.getValue('status') === 'Đã xác nhận' ? 'default' : 'secondary'}>
                {row.getValue('status')}
            </Badge>
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'date',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày quyên góp" />,
        cell: ({ row }) => <div>{new Date(row.getValue('date')).toLocaleDateString('vi-VN')}</div>,
    },
    {
        id: 'actions',
        cell: ({ row }) => <ActionMenu row={row} />,
    },
];

const ActionMenu = ({ row }) => {
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
                <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                <DropdownMenuItem>Cập nhật trạng thái</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Hủy quyên góp</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export function DonationHistory() {
    const [sorting, setSorting] = React.useState([]);
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full space-y-4 mx-3">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold ml-6 mt-6">Lịch sử Quyên góp</h1>
            </div>
            <DataTableToolbar table={table} />
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
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
                                    Không có kết quả.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}

export default DonationHistory;