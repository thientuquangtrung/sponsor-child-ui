import React from 'react';
import { useParams } from 'react-router-dom';
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTableColumnHeader } from '@/components/datatable/DataTableColumnHeader';
import { DataTablePagination } from '@/components/datatable/DataTablePagination';
import { useGetActivityByCampaignIdQuery } from '@/redux/activity/activityApi';
import DateRangePicker from '@/components/ui/calendar-range';

// Status mapping for labels and styles
const statusLabels = {
    0: 'Đang lên lịch',
    1: 'Đang xử lý',
    2: 'Hoàn thành',
    3: 'Kết thúc',
};

const statusStyles = {
    0: 'bg-blue-50 text-blue-700',
    1: 'bg-yellow-50 text-yellow-700',
    2: 'bg-green-50 text-green-700',
    3: 'bg-red-50 text-red-700',
};

// Table columns definition
const columns = [
    {
        accessorKey: 'imageFolderUrl',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Hình ảnh"  />,
        cell: ({ row }) => {
            const imageUrl = row.getValue('imageFolderUrl');
            return (
                <div className="flex">
                    {imageUrl ? (
                        <img src={imageUrl} alt="Hoạt động" className="w-16 h-16 object-cover rounded-md shadow-sm" />
                    ) : (
                        <span className="text-gray-500">Không có hình ảnh</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Mô tả" />,
        cell: ({ row }) => <div className="text-gray-800">{row.getValue('description')}</div>,
    },
    {
        accessorKey: 'activityDate',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày hoạt động" />,
        cell: ({ row }) => <div>{new Date(row.getValue('activityDate')).toLocaleDateString('vi-VN')}</div>,
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
        cell: ({ row }) => {
            const status = row.getValue('status');
            return (
                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusStyles[status] || 'bg-gray-200 text-gray-600'
                    }`}
                >
                    {statusLabels[status] || 'Không xác định'}
                </span>
            );
        },
    },
];

const ActivityList = () => {
    const { id } = useParams();
    const { data: activities = [], isLoading, isError } = useGetActivityByCampaignIdQuery(id);
    const [sorting, setSorting] = React.useState([{ id: 'activityDate', desc: true }]);
    const [dateRange, setDateRange] = React.useState({ from: null, to: null });

    // Process table data with filtering and sorting
    const tableData = React.useMemo(() => {
        if (!activities.length) return [];

        // Filter data by selected date range
        const filteredData = activities.filter((activity) => {
            const activityDate = new Date(activity.activityDate);
            if (dateRange.from && dateRange.to) {
                return activityDate >= new Date(dateRange.from) && activityDate <= new Date(dateRange.to);
            }
            return true;
        });

        return filteredData;
    }, [activities, dateRange]);

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: { sorting },
    });

    return (
        <div className="w-full space-y-6 p-2 sm:p-6 lg:p-8">
            <div className="flex justify-end mb-4">
                <DateRangePicker onRangeChange={setDateRange} />
            </div>
            <div className="rounded-lg border bg-white shadow-sm">
                <Table className="table-auto w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-gray-100">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="px-4 py-2 font-semibold text-gray-700 text-center"
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
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                                    Có lỗi xảy ra khi tải dữ liệu.
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-4 py-3 text-gray-800">
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
};

export default ActivityList;
