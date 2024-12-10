import * as React from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTableColumnHeader } from '@/components/datatable/DataTableColumnHeader';
import { DataTablePagination } from '@/components/datatable/DataTablePagination';
import { useGetFundUsageHistoryQuery } from '@/redux/fund/fundApi';
import DateRangePicker from '../ui/calendar-range';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

const columns = [
    {
        accessorKey: 'purpose',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mục đích sử dụng" />,
        cell: ({ row }) => <div className="font-medium">{row.getValue('purpose')}</div>,
    },
    {
        accessorKey: 'campaignTitle',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên chiến dịch" />,
        cell: ({ row }) => <div className="font-medium max-w-[400px] truncate">{row.getValue('campaignTitle')}</div>,
    },
    {
        accessorKey: 'visitTitle',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tên chuyến thăm" />,
        cell: ({ row }) => <div className="font-medium max-w-[400px] truncate">{row.getValue('visitTitle')}</div>,
    },
    {
        accessorKey: 'amountUsed',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Số tiền" className="justify-end" />,
        cell: ({ row }) => <div className="text-right font-medium">{row.getValue('amountUsed').toLocaleString('vi-VN')} ₫</div>,
    },
    {
        accessorKey: 'commonFundTotal',
        header: ({ column }) => <DataTableColumnHeader column={column} title="ST Quỹ chung" className="justify-end" />,
        cell: ({ row }) => <div className="text-right font-medium">{row.getValue('commonFundTotal').toLocaleString('vi-VN')} ₫</div>,
    },
    {
        accessorKey: 'dateUsed',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('dateUsed'));
            return <div className="whitespace-nowrap w-32 text-center">{format(date, 'dd/MM/yyyy HH:mm')}</div>;
        },
    },
    // {
    //     id: 'actions',
    //     cell: ({ row }) => <ActionMenu row={row} />,
    // },
];
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
                <DropdownMenuItem onClick={() => navigate(`/campaign-detail/${row.original.campaignID}`)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Xem chi tiết chiến dịch
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export function UsageFundTable() {
    const { data, error, isLoading } = useGetFundUsageHistoryQuery();
    const [sorting, setSorting] = React.useState([{ id: 'dateUsed', desc: true }]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnFilters, setColumnFilters] = React.useState([]);
    const [columnVisibility, setColumnVisibility] = React.useState({});
    const [dateRange, setDateRange] = React.useState({ from: null, to: null });

    const tableData = React.useMemo(() => {
        if (!data?.usageHistories) return [];

        // Filter data based on the selected date range
        const filteredData = data.usageHistories.filter((item) => {
            const dateAdded = new Date(item.dateAdded);
            if (dateRange.from && dateRange.to) {
                return dateAdded >= new Date(dateRange.from) && dateAdded <= new Date(dateRange.to);
            }
            return true; // Không lọc nếu không có khoảng ngày
        });

        // Sort data by dateUsed in descending order by default
        return filteredData.sort((a, b) => new Date(b.dateUsed) - new Date(a.dateUsed));
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
        <div className="w-full space-y-4 p-6">
            <div className="flex justify-end mb-4">
                <DateRangePicker onRangeChange={setDateRange} />
            </div>
            <div className="rounded-lg border shadow-sm bg-white overflow-hidden">
                <Table className="table-auto w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-gray-100">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className={`px-4 py-2 font-semibold text-gray-700 text-center ${header.column.id === 'purpose' ? 'w-1/2' : 'w-1/6'
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
                                            className={`px-4 py-3 text-gray-800 ${cell.column.id === 'purpose' ? 'w-1/3' : 'w-1/4'
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
