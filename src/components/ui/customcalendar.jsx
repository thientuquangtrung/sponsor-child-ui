import React, { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const multiSelectVariants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground text-background",
    link: "text-primary underline-offset-4 hover:underline text-background",
};

const months = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
];

const CustomCalendar = React.forwardRef(({ className, date, onDateSelect, variant = "default", ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(date);
    const [month, setMonth] = useState(date || new Date());

    useEffect(() => {
        setSelectedDate(date);
    }, [date]);

    const years = Array.from(
        { length: 10 },
        (_, i) => new Date().getFullYear() - 5 + i
    );

    const handleMonthChange = (value) => {
        const newMonth = months.indexOf(value);
        const newDate = new Date(month);
        newDate.setMonth(newMonth);
        setMonth(newDate);
    };

    const handleYearChange = (value) => {
        const newYear = parseInt(value, 10);
        const newDate = new Date(month);
        newDate.setFullYear(newYear);
        setMonth(newDate);
    };

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
                <Button
                    ref={ref}
                    className={cn("w-auto", multiSelectVariants[variant], className)}
                    {...props}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="flex items-center justify-between px-3 pt-3">
                    <Select
                        onValueChange={handleMonthChange}
                        value={months[month.getMonth()]}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Tháng" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((month) => (
                                <SelectItem key={month} value={month}>
                                    {month}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        onValueChange={handleYearChange}
                        value={month.getFullYear().toString()}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Năm" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    month={month}
                    onMonthChange={setMonth}
                    initialFocus
                    locale={vi}
                />
            </PopoverContent>
        </Popover>
    );
});

CustomCalendar.displayName = "CustomCalendar";

export { CustomCalendar };