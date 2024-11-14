import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarRange } from '@/components/ui/calendar-range';

export function DatePickerWithRange({ className, onDateChange }) {
    const [date, setDate] = React.useState({ from: null, to: null });

    const handleDateChange = (selectedDate) => {
        setDate(selectedDate);
        if (onDateChange) {
            onDateChange(selectedDate);
        }
    };

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline"
                        className={cn(
                            'w-[300px] justify-start text-left font-normal hover:bg-gray-200',
                            !date.from && !date.to && 'text-muted-foreground',
                        )}
                    >
                        <CalendarIcon className="mr-2" />
                        {date.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, 'dd/MM/yyyy')} - {format(date.to, 'dd/MM/yyyy')}
                                </>
                            ) : (
                                format(date.from, 'dd/MM/yyyy')
                            )
                        ) : (
                            <span className="ml-2">Chọn thời gian</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[600px] p-0" align="start">
                    <CalendarRange onSelect={handleDateChange} numberOfMonths={2} />
                </PopoverContent>
            </Popover>
        </div>
    );
}
