import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { MoreHorizontal, Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTablePagination } from '@/components/datatable/DataTablePagination';
import { DataTableColumnHeader } from '@/components/datatable/DataTableColumnHeader';
import { ToolbarForContractGuarantee } from '@/components/datatable/ToolbarForContractGuarantee';
import { contractStatus, contractPartyType, contractType } from '@/config/combobox';
import { useGetContractsByUserIdQuery } from '@/redux/contract/contractApi';
import LoadingScreen from '@/components/common/LoadingScreen';

export function ContractPage() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { data: contracts, isLoading, isError } = useGetContractsByUserIdQuery(user.userID);
    const [sorting, setSorting] = React.useState([
        { id: 'startDate', desc: true }
    ]);


    const columns = [
        // {
        //     accessorKey: 'contractID',
        //     header: ({ column }) => <DataTableColumnHeader column={column} title="Số hợp đồng" />,
        //     cell: ({ row }) => <div>{row.getValue('contractID').substring(0, 8)}</div>,
        // },
        {
            accessorKey: 'contractType',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Loại hợp đồng" />,
            cell: ({ row }) => {
                const type = contractType.find(t => t.value === row.getValue('contractType'));
                return <div>{type?.label || 'Không xác định'}</div>;
            },
        },
        {
            accessorKey: 'partyAType',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Bên A" />,
            cell: ({ row }) => {
                const type = contractPartyType.find(t => t.value === row.getValue('partyAType'));
                return <div>{type?.label || 'Không xác định'}</div>;
            },
        },
        {
            accessorKey: 'partyBType',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Bên B" />,
            cell: ({ row }) => {
                const type = contractPartyType.find(t => t.value === row.getValue('partyBType'));
                return <div>{type?.label || 'Không xác định'}</div>;
            },
        },
        {
            accessorKey: 'startDate',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày bắt đầu" />,
            cell: ({ row }) => <div>{new Date(row.getValue('startDate')).toLocaleDateString('vi-VN')}</div>,
            sortingFn: (rowA, rowB, columnId) => {
                const a = new Date(rowA.getValue(columnId)).getTime();
                const b = new Date(rowB.getValue(columnId)).getTime();
                return a < b ? -1 : a > b ? 1 : 0;
            },
        },
        {
            accessorKey: 'endDate',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày kết thúc" />,
            cell: ({ row }) => <div>{new Date(row.getValue('endDate')).toLocaleDateString('vi-VN')}</div>,
        },
        {
            accessorKey: 'status',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
            cell: ({ row }) => {
                const status = contractStatus.find(s => s.value === row.getValue('status'));
                const getStatusColor = (statusValue) => {
                    switch (statusValue) {
                        case 2: // Đã duyệt
                            return 'text-green-600';
                        case 3: // Từ chối bởi bảo lãnh
                        case 4: // Từ chối bởi quản trị viên
                        case 5: // Đã hủy
                            return 'text-red-600';
                        case 0: // Đang chờ
                        case 1: // Đang chờ quản trị viên
                            return 'text-blue-600';
                        default:
                            return 'text-gray-600';
                    }
                };

                return (
                    <div className={`font-medium ${getStatusColor(row.getValue('status'))}`}>
                        {status?.label || 'Không xác định'}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigate(`/guarantee/contract/${row.original.contractID}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                        </DropdownMenuItem>
                        {row.original.status === 0 && (
                            <DropdownMenuItem onClick={() => navigate(`/guarantee/contract/contract-campaign/${row.original.contractID}/${row.original.campaignID}`)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Ký hợp đồng
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        }

    ];
    const sortedData = React.useMemo(() => {
        if (!contracts) return [];
        return [...contracts].sort((a, b) => {
            const dateA = new Date(a.startDate).getTime();
            const dateB = new Date(b.startDate).getTime();
            return dateB - dateA;
        });
    }, [contracts]);
    const table = useReactTable({
        data: sortedData,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    if (isLoading) {
        return <div><LoadingScreen /></div>;
    }

    if (isError) {
        return <div className="flex justify-center items-center h-screen">Đã có lỗi xảy ra khi tải dữ liệu</div>;
    }

    return (
        <>
            <div className="w-full space-y-4 mx-3">
                <h1 className="text-2xl font-bold ml-6 mt-6">Danh sách hợp đồng</h1>


                <ToolbarForContractGuarantee table={table} />

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
        </>
    );
}

export default ContractPage;