import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Calendar() {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

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

    const monthNames = [
        'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu', 
        'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'
    ];

    const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

    // Tạo các ô rỗng trước khi tháng bắt đầu
    const blankDays = Array(firstDay).fill(null);

    // Tạo danh sách các ngày trong tháng
    const daysArray = [...Array(totalDays).keys()].map((i) => i + 1);

    return (
        <div className="max-w-xs mx-auto bg-white p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePreviousMonth}>
                    <ChevronLeft size={24} className="text-gray-600 hover:text-black" />
                </button>
                {/* Thêm khoảng cách giữa tháng và năm */}
                <span className="text-lg font-medium space-x-2">
                    <span>{monthNames[currentMonth]}</span> 
                    <span>{currentYear}</span>
                </span>
                <button onClick={handleNextMonth}>
                    <ChevronRight size={24} className="text-gray-600 hover:text-black" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {/* Hiển thị các ngày trong tuần */}
                {weekDays.map((day, index) => (
                    <div key={index} className="text-center text-sm font-medium text-gray-500">
                        {day}
                    </div>
                ))}

                {/* Hiển thị các ô trống trước ngày đầu tháng */}
                {blankDays.map((_, index) => (
                    <div key={index} className="h-10"></div>
                ))}

                {/* Hiển thị các ngày của tháng */}
                {daysArray.map((day) => (
                    <div
                        key={day}
                        className={`h-10 w-10 flex items-center justify-center rounded-lg cursor-pointer ${
                            day === today.getDate() &&
                            currentMonth === today.getMonth() &&
                            currentYear === today.getFullYear()
                                ? 'bg-teal-500 text-white'
                                : 'bg-normal text-black'
                        } hover:bg-blue-100`}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
}

export { Calendar };
