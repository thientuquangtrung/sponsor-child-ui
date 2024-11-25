import * as React from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTableColumnHeader } from '@/components/datatable/DataTableColumnHeader';
import { DataTablePagination } from '@/components/datatable/DataTablePagination';
import { useGetFundSourceQuery } from '@/redux/fund/fundApi';
import ToolbarForDonationHistory from '../datatable/ToolbarForDonationHistory';
import { fundType } from '@/config/combobox';
import DateRangePicker from '../ui/calendar-range';

const columns = [
    {
        accessorKey: 'sourceName',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nguồn quyên góp" />,
        cell: ({ row }) => <div className="font-medium">{row.getValue('sourceName')}</div>,
    },
    {
        accessorKey: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nội dung quyên góp" />,
        cell: ({ row }) => <div className="font-medium">{row.getValue('description')}</div>,
    },
    {
        accessorKey: 'dateAdded',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày" />,
        cell: ({ row }) => <div>{new Date(row.getValue('dateAdded')).toLocaleDateString('vi-VN')}</div>,
    },
    {
        accessorKey: 'amountAdded',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số tiền" />,
        cell: ({ row }) => <div className="font-medium">{row.getValue('amountAdded').toLocaleString('vi-VN')} ₫</div>,
    },
    // {
    //     accessorKey: 'commonFundTotal',
    //     header: ({ column }) => <DataTableColumnHeader column={column} title="Tổng quỹ chung" />,
    //     cell: ({ row }) => (
    //         <div className="font-medium">{row.getValue('commonFundTotal').toLocaleString('vi-VN')} ₫</div>
    //     ),
    // },
    {
        accessorKey: 'fundSourceType',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Phân loại" />,
        cell: ({ row }) => {
            const fundTypeLabel = fundType.find((type) => type.value === row.getValue('fundSourceType'));
            return (
                <Badge
                    className={
                        row.getValue('fundSourceType') === 0
                            ? 'bg-teal-50 text-teal-500'
                            : row.getValue('fundSourceType') === 1
                                ? 'bg-rose-50 text-rose-400'
                                : 'bg-yellow-50 text-yellow-500'
                    }
                >
                    {fundTypeLabel?.label || 'Không xác định'}
                </Badge>
            );
        },

        filterFn: (row, id, value) => {
            const fundSourceType = row.getValue(id);
            let label;

            switch (fundSourceType) {
                case 0:
                    label = 'Cá nhân';
                    break;
                case 1:
                    label = 'Chiến dịch';
                    break;
                case 2:
                    label = 'Sự kiện';
                    break;
                default:
                    label = 'Không xác định';
            }

            return value.includes(label);
        },
    },
];

export function GeneralFundTable() {
    const { data, error, isLoading } = useGetFundSourceQuery();
    const [sorting, setSorting] = React.useState([{ id: 'dateAdded', desc: true }]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [dateRange, setDateRange] = React.useState({ from: null, to: null });

    const tableData = React.useMemo(() => {
        if (!data?.sources) return [];

        const filteredData = data.sources.filter((item) => {
            const dateAdded = new Date(item.dateAdded);
            if (dateRange.from && dateRange.to) {
                return dateAdded >= dateRange.from && dateAdded <= dateRange.to;
            }
            return true;
        });

        return filteredData.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    }, [data, dateRange]);

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
        <div className="w-full space-y-4 p-10">
            <div className="flex justify-between items-center space-x-2">
                <ToolbarForDonationHistory table={table} />
                <div>
                    <DateRangePicker onRangeChange={setDateRange} />
                </div>
            </div>
            <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
                <Table className="table-auto w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-gray-100">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className={'px-4 py-2 font-semibold text-gray-700 text-center'}
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
                                            className={`px-4 py-3 text-gray-800 ${cell.column.id === 'sourceName' ? 'w-1/3' : 'w-1/6'
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

export default GeneralFundTable;
