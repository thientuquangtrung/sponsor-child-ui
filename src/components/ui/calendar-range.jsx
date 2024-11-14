import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function CalendarRange({ onSelect }) {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const [range, setRange] = useState({ from: null, to: null });

    useEffect(() => {
        if (range.from && range.to && range.from > range.to) {
            setRange({ from: range.from, to: null });
        }
        if (range.from && range.to) {
            onSelect && onSelect(range); 
        }
    }, [range, onSelect]);

    const daysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleDayClick = (date) => {
        if (!range.from || (range.from && range.to)) {
            setRange({ from: date, to: null });
        } else if (range.from && !range.to) {
            setRange({
                from: range.from,
                to: date > range.from ? date : null,
            });
        }
    };

    const isInRange = (day) => {
        if (!range.from || !range.to) return false;
        const date = new Date(currentYear, currentMonth, day);
        return date >= range.from && date <= range.to;
    };

    const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
    ];

    const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    const renderCalendar = (month, year) => {
        const totalDays = daysInMonth(month, year);
        const firstDay = getFirstDayOfMonth(month, year);
        const blankDays = Array(firstDay).fill(null);
        const daysArray = [...Array(totalDays).keys()].map((i) => i + 1);

        return (
            <div className="p-4">
                <div className="text-lg font-medium text-center mb-4">
                    <span>{monthNames[month]}</span> <span>{year}</span>
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day, index) => (
                        <div key={index} className="text-center text-sm font-medium text-gray-500">
                            {day}
                        </div>
                    ))}

                    {blankDays.map((_, index) => (
                        <div key={index} className="h-10"></div>
                    ))}

                    {daysArray.map((day) => {
                        const date = new Date(year, month, day);
                        const isFrom = range.from && date.getTime() === range.from.getTime();
                        const isTo = range.to && date.getTime() === range.to.getTime();
                        const isInRange = range.from && range.to && date > range.from && date < range.to;

                        return (
                            <div
                                key={day}
                                onClick={() => handleDayClick(date)}
                                className={`h-10 w-10 flex items-center justify-center rounded cursor-pointer 
                                    ${isFrom || isTo ? 'bg-black text-white' : isInRange ? 'bg-gray-200 text-black' : 'text-black'}
                                    hover:bg-normal`}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    return (
        <div className="flex flex-col items-center max-w-4xl mx-auto">
            <div className="flex justify-between items-center w-full my-4">
                <button onClick={handlePreviousMonth}>
                    <ChevronLeft size={24} className="text-gray-600 hover:text-black" />
                </button>
                <span className="text-lg font-medium space-x-2">
                    <span>{monthNames[currentMonth]}</span>
                    <span>{currentYear}</span> - <span>{monthNames[nextMonth]}</span> <span>{nextYear}</span>
                </span>
                <button onClick={handleNextMonth}>
                    <ChevronRight size={24} className="text-gray-600 hover:text-black" />
                </button>
            </div>

            <div className="flex gap-8">
                {renderCalendar(currentMonth, currentYear)}
                {renderCalendar(nextMonth, nextYear)}
            </div>
        </div>
    );
}

export { CalendarRange };
