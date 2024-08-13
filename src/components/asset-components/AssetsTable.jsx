import * as React from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

import { MoreHorizontal, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { humanFileSize } from '@/lib/utils';
import { DataTablePagination } from '@/components/datatable/DataTablePagination';
import { DataTableToolbar } from '@/components/datatable/DataTableToolbar';
import { DataTableColumnHeader } from '@/components/datatable/DataTableColumnHeader';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const data = [
    {
        id: 'm5gr84i9',
        size: 31432556,
        type: '3dt',
        name: 'Google Photorealistic 3D Tiles',
        publisher: 'ken99@yahoo.com',
        addedDate: new Date(Math.random() * Date.now()).toISOString(),
    },
    {
        id: '3u1reuv4',
        size: 23442,
        type: '3dt',
        name: 'Cesium OSM Buildings',
        publisher: 'Abe45@gmail.com',
        addedDate: new Date(Math.random() * Date.now()).toISOString(),
    },
    {
        id: 'derv1ws0',
        size: 83753,
        type: 'clip',
        name: 'Bing Maps Road',
        publisher: 'Monserrat44@gmail.com',
        addedDate: new Date(Math.random() * Date.now()).toISOString(),
    },
    {
        id: '5kma53ae',
        size: 87437564,
        type: '3dt',
        name: 'Bing Maps Aerial with Label',
        publisher: 'Silas22@gmail.com',
        addedDate: new Date(Math.random() * Date.now()).toISOString(),
    },
    {
        id: 'bhqecj4p',
        size: 721,
        type: 'clip',
        name: 'Cesium World Terrain',
        publisher: 'carmella@hotmail.com',
        addedDate: new Date(Math.random() * Date.now()).toISOString(),
    },
];

const columns = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'id',
        header: 'Id',
        cell: ({ row }) => <div>{row.getValue('id')}</div>,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Name" />;
        },
        cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'type',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Type" />;
        },
        cell: ({ row }) => (
            <Badge className="uppercase" variant={row.getValue('type') === 'clip' ? 'secondary' : 'default'}>
                {row.getValue('type')}
            </Badge>
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'addedDate',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Date Added" className={'justify-end'} />;
        },
        cell: ({ row }) => {
            const date = row.getValue('addedDate');

            // Format the date
            const formatted = new Date(date).toLocaleDateString();

            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: 'size',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Size" className={'justify-end'} />;
        },
        cell: ({ row }) => {
            const size = parseFloat(row.getValue('size'));

            // Format the size
            const formatted = humanFileSize(size);

            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: 'publisher',
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Publisher" className={'justify-end'} />;
        },
        cell: ({ row }) => <div className="text-right font-medium">{row.getValue('publisher')}</div>,
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            return <ActionMenu row={row} />;
        },
    },
];

const ActionMenu = ({ row }) => {
    const handleDelete = (e) => {
        console.log(row);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Update asset</DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-destructive focus:text-destructive"
                            >
                                Delete asset
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your asset.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export function AssetsTable() {
    const navigate = useNavigate();

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
        <div className="w-full space-y-4">
            <div className="flex flex-col md:flex-row gap-2">
                <DataTableToolbar table={table} />
                <Button className="hidden md:flex" onClick={() => navigate('/assets/add')}>
                    Add Data
                    <Plus className="ml-2 h-4 w-4" />
                </Button>
                <Button
                    className="flex md:hidden fixed z-50 bottom-4 right-4 h-12 w-12 rounded-full items-center justify-center"
                    onClick={() => navigate('/assets/add')}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
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
                                    No results.
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
