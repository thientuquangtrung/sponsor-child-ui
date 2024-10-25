import React from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import SearchIcon from '@/assets/icons/SearchIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from '@/components/datatable/DataTableViewOptions';
import { DataTableFacetedFilter } from '@/components/datatable/DataTableFacetedFilter';

import { contractStatus, contractType } from '@/config/combobox';

export function ToolbarForContractGuarantee({ table }) {
    const isFiltered = table.getState().columnFilters.length > 0;

    const filters = [
        {
            name: 'status',
            options: contractStatus.map(status => ({
                value: status.value.toString(),
                label: status.label
            })),
        },
        {
            name: 'contractType',
            options: contractType.map(type => ({
                value: type.value.toString(),
                label: type.label
            })),
        },
    ];

    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex flex-1 flex-col sm:flex-row gap-y-4 items-center space-x-2 w-full">
                <Input
                    placeholder="Tìm kiếm tên bên B..."
                    value={table.getColumn('partyBName')?.getFilterValue() ?? ''}
                    onChange={(event) => table.getColumn('partyBName')?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                    endIcon={<SearchIcon />}
                />
                <div className="flex space-x-2 w-full overflow-auto no-scrollbar">
                    {filters.map((f, i) => (
                        <DataTableFacetedFilter
                            key={i}
                            column={table.getColumn(f.name)}
                            title={f.name === 'status' ? 'Trạng thái' : 'Loại hợp đồng'}
                            options={f.options}
                        />
                    ))}
                    {isFiltered && (
                        <Button
                            variant="ghost"
                            onClick={() => table.resetColumnFilters()}
                            className="h-8 px-2 lg:px-3 hidden lg:flex"
                        >
                            Đặt lại
                            <Cross2Icon className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}

export default ToolbarForContractGuarantee;