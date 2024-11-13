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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/datatable/DataTableColumnHeader';
import { DataTablePagination } from '@/components/datatable/DataTablePagination';

const SampleTableData = [
    { id: 1, sourceName: 'Nguyễn Văn A', amount: 1000000, date: '2024-11-10' },
    { id: 2, sourceName: 'Chiến dịch hỗ trợ trẻ em vùng cao', amount: 5000000, date: '2024-11-11' },
    { id: 3, sourceName: 'Trần Thị B', amount: 200000, date: '2024-11-12' },
    { id: 4, sourceName: 'Chiến dịch mùa xuân yêu thương', amount: 3000000, date: '2024-11-13' },
    { id: 5, sourceName: 'Lê Văn C', amount: 1500000, date: '2024-11-14' },
    { id: 6, sourceName: 'Chiến dịch giáo dục cho trẻ em', amount: 7000000, date: '2024-11-15' },
    { id: 7, sourceName: 'Nguyễn Thị D', amount: 800000, date: '2024-11-16' },
    { id: 8, sourceName: 'Chiến dịch cứu trợ bão lũ', amount: 12000000, date: '2024-11-17' },
    { id: 9, sourceName: 'Phạm Văn E', amount: 500000, date: '2024-11-18' },
    { id: 10, sourceName: 'Chiến dịch ủng hộ miền Trung', amount: 10000000, date: '2024-11-19' },
    { id: 11, sourceName: 'Trần Thị F', amount: 300000, date: '2024-11-20' },
    { id: 12, sourceName: 'Chiến dịch hỗ trợ trẻ em khuyết tật', amount: 4000000, date: '2024-11-21' },
    { id: 13, sourceName: 'Hoàng Văn G', amount: 2500000, date: '2024-11-22' },
    { id: 14, sourceName: 'Chiến dịch phòng chống dịch bệnh', amount: 6000000, date: '2024-11-23' },
    { id: 15, sourceName: 'Lê Thị H', amount: 1200000, date: '2024-11-24' },
    { id: 16, sourceName: 'Chiến dịch nước sạch cho nông thôn', amount: 9000000, date: '2024-11-25' },
    { id: 17, sourceName: 'Vũ Văn I', amount: 450000, date: '2024-11-26' },
    { id: 18, sourceName: 'Chiến dịch giáo dục vùng cao', amount: 7500000, date: '2024-11-27' },
    { id: 19, sourceName: 'Ngô Thị K', amount: 2000000, date: '2024-11-28' },
    { id: 20, sourceName: 'Chiến dịch trồng rừng', amount: 11000000, date: '2024-11-29' },
];

const columns = [
    {
        accessorKey: 'sourceName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nguồn quyên góp" />,
        cell: ({ row }) => <div className="font-medium">{row.getValue('sourceName')}</div>,
    },
    {
        accessorKey: 'category',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Phân loại" />,
        cell: ({ row }) => <div>{row.getValue('sourceName').includes('Chiến dịch') ? 'Chiến dịch' : 'Cá nhân'}</div>,
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số tiền" />,
        cell: ({ row }) => (
            <div className="text-right font-medium">{row.getValue('amount').toLocaleString('vi-VN')} ₫</div>
        ),
    },
    {
        accessorKey: 'date',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày" />,
        cell: ({ row }) => <div>{new Date(row.getValue('date')).toLocaleDateString('vi-VN')}</div>,
    },
];

export function GeneralFundTable() {
    const [sorting, setSorting] = React.useState([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});

    const table = useReactTable({
        data: SampleTableData,
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
            
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
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

export default GeneralFundTable;
