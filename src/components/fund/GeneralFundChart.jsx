'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { YearPicker } from '@/components/ui/year-picker';
import { useGetFundMonthlyIncomeExpenseQuery } from '@/redux/fund/fundApi';

const chartConfig = {
    income: {
        label: 'Thu',
        color: '#2a9d90',
    },
    expenditure: {
        label: 'Chi',
        color: '#e76e50',
    },
};

export function GeneralFundChart() {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const { data: apiData, isLoading } = useGetFundMonthlyIncomeExpenseQuery();

    const transformedData = apiData
        ? apiData.flatMap((yearData) =>
              yearData.year === selectedYear
                  ? yearData.monthlyData.map((monthData) => ({
                        month: `${yearData.year}-${String(monthData.month).padStart(2, '0')}-01`,
                        income: monthData.totalIncome,
                        expenditure: monthData.totalExpense,
                    }))
                  : [],
          )
        : [];

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quỹ Chung - Thu và Chi</CardTitle>
                <CardDescription>Đóng góp giúp đỡ trẻ em</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center mb-4">
                    <span>Lọc theo năm:</span>
                    <YearPicker
                        date={new Date(selectedYear, 0, 1)}
                        onYearSelect={(date) => setSelectedYear(date.getFullYear())}
                        fromYear={2000}
                        toYear={new Date().getFullYear()}
                        className="ml-2"
                    />
                </div>
                {transformedData.length === 0 ? (
                    <div className="text-center text-gray-500 mt-4">
                        Không có dữ liệu cho năm {selectedYear}. Vui lòng chọn năm khác.
                    </div>
                ) : (
                    <>
                        {/* Legend */}
                        <div className="flex justify-center mt-4 space-x-4">
                            <div className="flex items-center space-x-2">
                                <div
                                    style={{ backgroundColor: chartConfig.income.color }}
                                    className="w-4 h-4 rounded"
                                ></div>
                                <span className="text-sm text-gray-700">{chartConfig.income.label}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div
                                    style={{ backgroundColor: chartConfig.expenditure.color }}
                                    className="w-4 h-4 rounded"
                                ></div>
                                <span className="text-sm text-gray-700">{chartConfig.expenditure.label}</span>
                            </div>
                        </div>
                        <ChartContainer config={chartConfig}>
                            <BarChart data={transformedData} barSize={40}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) =>
                                        new Date(value).toLocaleString('vi-VN', { month: 'short' })
                                    }
                                />
                                <YAxis
                                    width={100} 
                                    tickFormatter={(value) =>
                                        `${new Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(value)} đ`
                                    }
                                />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                                <Bar dataKey="income" fill={chartConfig.income.color} radius={10} />
                                <Bar dataKey="expenditure" fill={chartConfig.expenditure.color} radius={10} />
                            </BarChart>
                        </ChartContainer>
                    </>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Tăng trưởng hỗ trợ <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">Hiển thị thu và chi trong năm đã chọn</div>
            </CardFooter>
        </Card>
    );
}
