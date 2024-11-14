import * as React from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTableColumnHeader } from '@/components/datatable/DataTableColumnHeader';
import { DataTablePagination } from '@/components/datatable/DataTablePagination';
import { useGetFundUsageHistoryQuery } from '@/redux/fund/fundApi';

const columns = [
    {
        accessorKey: 'purpose',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mục đích sử dụng" />,
        cell: ({ row }) => <div className="font-medium">{row.getValue('purpose')}</div>, 
    },
    {
        accessorKey: 'amountUsed',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số tiền" />,
        cell: ({ row }) => (
            <div className="font-medium">
                {row.getValue('amountUsed').toLocaleString('vi-VN')} ₫
            </div>
        ),
    },
    {
        accessorKey: 'dateUsed',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày" />,
        cell: ({ row }) => <div>{new Date(row.getValue('dateUsed')).toLocaleDateString('vi-VN')}</div>,
    },
    
];

export function UsageFundTable() {
    const { data, error, isLoading } = useGetFundUsageHistoryQuery();
    const [sorting, setSorting] = React.useState([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});

    const tableData = data?.usageHistories || [];

    const table = useReactTable({
        data: tableData,
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
        <div className="w-full space-y-4 p-6">
            <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
                <Table className="table-auto w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-gray-100">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className={`px-4 py-2 font-semibold text-gray-700 text-center ${
                                            header.column.id === 'purpose' ? 'w-1/2' : 'w-1/6'
                                        }`} 
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                                    Có lỗi xảy ra khi tải dữ liệu.
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={`px-4 py-3 text-gray-800 ${
                                                cell.column.id === 'purpose' ? 'w-1/3' : 'w-1/4'
                                            }`}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
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

export default UsageFundTable;
