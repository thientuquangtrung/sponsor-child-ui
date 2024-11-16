import React, { useEffect, useState } from 'react';
import fund from '@/assets/images/savings.gif';
import banner from '@/assets/images/banner-general-fund.png';
import bgfund from '@/assets/images/general-introduction.png';
import { FileSearch, CalendarDays, RefreshCw } from 'lucide-react';
import GeneralFundTable from './GeneralFundTable';
import { GeneralFundChart } from './GeneralFundChart';
import { useGetFundCommonQuery } from '@/redux/fund/fundApi';
import UsageFundTable from './UsageFundTable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DonateToCommonFund from './DonateToCommonFund';

export default function GeneralFund() {
    const { data: generalFunds, isLoading, isError } = useGetFundCommonQuery();
    const [displayAmount, setDisplayAmount] = useState(0);

    useEffect(() => {
        if (generalFunds?.totalAmount) {
            let start = 0;
            const increment = 1000000;
            const counter = setInterval(() => {
                start += increment;
                if (start >= generalFunds.totalAmount) {
                    clearInterval(counter);
                    setDisplayAmount(generalFunds.totalAmount);
                } else {
                    setDisplayAmount(start);
                }
            }, 30);

            return () => clearInterval(counter);
        }
    }, [generalFunds?.totalAmount]);

    return (
        <div>
            <div className="relative bg-cover bg-center">
                <img src={banner} alt="banner" className="w-full object-cover shadow-md" />
            </div>

            <div className="bg-white p-12 text-center">
                <div className="flex justify-between gap-12 mb-6">
                    <div className="flex flex-col items-center">
                        <div className="bg-teal-600 text-white p-4 rounded-full mb-4 shadow-lg">
                            <RefreshCw size={48} className="text-white animate-pulse" />
                        </div>
                        <p className="text-lg">DỮ LIỆU MINH BẠCH</p>
                        <p className="text-lg font-semibold">DỮ LIỆU ĐƯỢC CẬP NHẬT THƯỜNG XUYÊN</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="bg-teal-600 text-white p-4 rounded-full mb-4 shadow-lg">
                            <CalendarDays size={48} className="text-white animate-pulse" />
                        </div>
                        <p className="text-lg">THỐNG KÊ CHI TIẾT</p>
                        <p className="text-lg font-semibold">CÁC THÔNG TIN CHI TIÊU HIỂN THỊ RÕ RÀNG</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="bg-teal-600 text-white p-4 rounded-full mb-4 shadow-lg">
                            <FileSearch size={48} className="text-white animate-pulse" />
                        </div>
                        <p className="text-lg">QUẢN LÝ TIỆN LỢI</p>
                        <p className="text-black font-semibold text-center">CÁC CÔNG CỤ TÌM KIẾM VÀ LỌC DỮ LIỆU</p>
                    </div>
                </div>
            </div>

            {/* Total Amount Section */}
            <div
                className="flex justify-center items-center rounded-xl h-[300px] p-8 transition-transform transform hover:scale-105"
                style={{
                    backgroundImage: `url(${bgfund})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <img src={fund} alt="fund" className="mr-6 h-[300px]" />
                <div className="text-center flex flex-col space-y-4">
                    <p className="text-3xl font-semibold text-teal-600">Tổng Số Tiền Quỹ Chung</p>
                    <p className="text-[5rem] font-extrabold text-teal-500 mt-2">
                        {displayAmount.toLocaleString('vi-VN')} VNĐ
                    </p>
                </div>
            </div>

            {/* Chart Section */}
            <div className='mt-4'>
                <GeneralFundChart />
            </div>

            {/* Styled Tabs Section */}
            <div>
                <h2 className="text-3xl font-semibold py-10 text-center text-teal-500">
                    THỐNG KÊ BIẾN ĐỘNG SỐ DƯ QUỸ CHUNG
                </h2>
                <Tabs defaultValue="donationHistory" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                            value="donationHistory"
                            className="relative px-6 py-3 font-semibold transition-all duration-300 ease-in-out"
                        >
                            Lịch sử nhận tiền
                        </TabsTrigger>
                        <TabsTrigger
                            value="usageHistory"
                            className="relative px-6 py-3font-semibold transition-all duration-300 ease-in-out"
                        >
                            Lịch sử chi tiền
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="donationHistory">
                        <GeneralFundTable />
                    </TabsContent>
                    <TabsContent value="usageHistory">
                        <UsageFundTable />
                    </TabsContent>
                </Tabs>
            </div>

            <div>
                <DonateToCommonFund />
            </div>
        </div>
    );
}
