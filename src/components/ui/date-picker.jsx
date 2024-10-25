import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar as DayPickerCalendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const DatePicker = React.forwardRef(({ className, date, onDateSelect, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(date);
    const [month, setMonth] = useState(date || new Date());

    useEffect(() => {
        setSelectedDate(date);
    }, [date]);

    const handleDateSelect = (newDate) => {
        if (newDate) {
            setSelectedDate(newDate);
            onDateSelect(newDate);
            setIsOpen(false);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button ref={ref} className={cn('w-auto bg-white hover:bg-gray-100', className)} {...props}>
                    {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: vi }) : <span>Chọn ngày</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border border-primary shadow-lg rounded-lg">
                {/* Hiển thị lịch */}
                <DayPickerCalendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    month={month}
                    onMonthChange={setMonth}
                    initialFocus
                    locale={vi} 
                    className="p-4"
                    
                />
            </PopoverContent>
        </Popover>
    );
});

DatePicker.displayName = 'DatePicker';

export { DatePicker };
