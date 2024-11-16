'use client';

import React, { useState } from 'react';
import { format, isEqual } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

function Calendar({ mode = 'single', selected, onSelect, className, numberOfMonths = 1, defaultMonth, ...props }) {
    const [currentDate, setCurrentDate] = useState(defaultMonth || new Date());

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const monthNames = [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
    ];

    const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    const isStartDate = (date) => {
        return selected?.from && isEqual(date, selected.from);
    };

    const isEndDate = (date) => {
        return selected?.to && isEqual(date, selected.to);
    };

    const isInBetween = (date) => {
        if (!selected?.from || !selected?.to) return false;
        return date > selected.from && date < selected.to;
    };

    const renderMonth = (monthOffset = 0) => {
        const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1);
        const month = currentMonth.getMonth();
        const year = currentMonth.getFullYear();

        const firstDay = getFirstDayOfMonth(month, year);
        const daysCount = daysInMonth(month, year);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10" />);
        }

        for (let day = 1; day <= daysCount; day++) {
            const date = new Date(year, month, day);

            days.push(
                <button
                    key={date.toString()}
                    onClick={() => {
                        if (mode === 'range') {
                            let newRange = { ...selected };
                            if (!selected?.from || (selected?.from && selected?.to)) {
                                newRange = { from: date, to: undefined };
                            } else {
                                if (date < selected.from) {
                                    newRange = { from: date, to: selected.from };
                                } else {
                                    newRange = { from: selected.from, to: date };
                                }
                            }
                            onSelect(newRange);
                        }
                    }}
                    className={cn(
                        'h-11 w-11 hover:bg-gray-100',
                        isStartDate(date) && 'bg-teal-500 text-white hover:bg-teal-600 rounded',
                        isEndDate(date) && 'bg-teal-500 text-white hover:bg-teal-600 rounded',
                        isInBetween(date) && 'bg-teal-100 hover:bg-teal-200',
                    )}
                >
                    {day}
                </button>,
            );
        }

        return (
            <div className="p-3 w-[320px] h-[370px]">
                <div className="text-center mb-2 font-semibold">
                    {monthNames[month]} {year}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {weekDays.map((day) => (
                        <div key={day} className="h-10 flex items-center justify-center text-sm font-medium">
                            {day}
                        </div>
                    ))}
                    {days}
                </div>
            </div>
        );
    };

    return (
        <div className={cn('w-fit', className)} {...props}>
            <div className="flex items-center justify-between px-3">
                <Button
                    className="hover:bg-gray-100"
                    variant="ghost"
                    onClick={() => setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium space-x-2">
                    <span>{monthNames[currentDate.getMonth()]}</span>
                    <span>{currentDate.getFullYear()}</span> -{' '}
                    <span>{monthNames[(currentDate.getMonth() + 1) % 12]}</span>
                    <span>
                        {currentDate.getMonth() === 11 ? currentDate.getFullYear() + 1 : currentDate.getFullYear()}
                    </span>
                </span>
                <Button
                    className="hover:bg-gray-100"
                    variant="ghost"
                    onClick={() => setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex">{[...Array(numberOfMonths)].map((_, i) => renderMonth(i))}</div>
        </div>
    );
}

function DateRangePicker({ className, onRangeChange }) {
    const [date, setDate] = useState({
        from: null,
        to: null,
    });

    const handleSelect = (range) => {
        setDate(range);
        if (onRangeChange) {
            onRangeChange(range);
        }
    };

    return (
        <div className={cn('grid gap-2 place-items-center', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline"
                        className={cn(
                            'w-[250px] justify-center text-center font-medium hover:bg-gray-200',
                            !date && 'text-muted-foreground',
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, 'dd/MM/yyyy', { locale: vi })} -{' '}
                                    {format(date.to, 'dd/MM/yyyy', { locale: vi })}
                                </>
                            ) : (
                                format(date.from, 'dd/MM/yyyy', { locale: vi })
                            )
                        ) : (
                            <span>Chọn khoảng thời gian</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-0" align="center">
                    <Calendar
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleSelect}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default DateRangePicker;
