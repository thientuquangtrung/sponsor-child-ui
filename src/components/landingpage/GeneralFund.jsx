import React from 'react';
import banner from '@/assets/images/banner-general-fund.png';
import line from '@/assets/images/line.png';
import { FileSearch, CalendarDays, RefreshCw } from 'lucide-react'; 
import GeneralFundTable from './GeneralFundTable';

export default function GeneralFund() {
    return (
        <div>
            {/* Banner Section */}
            <div className="relative bg-cover bg-center">
                <img src={banner} alt="banner" className="w-full object-cover shadow-md" />
            </div>

            {/* Main Content Section */}
            <div className="bg-gray-100 p-12 shadow-md">
                <h2 className="text-teal-600 text-2xl font-semibold mb-4 text-center">QUYÊN GÓP & BÁO CÁO</h2>

                <p className="text-black text-xl mb-6 leading-loose">
                    Trang Báo cáo của <span className="font-semibold">Sponsor Child</span> được cập nhật tự động theo
                    thời gian thực, giám sát bởi các tổ chức đáng tin cậy nhằm đảm bảo tính minh bạch và chính xác.{' '}
                    <span className="font-semibold">Sponsor Child</span> là chương trình được kiểm toán chặt chẽ và giám
                    sát thực hiện giải ngân bởi các đơn vị tài chính uy tín. Chúng tôi cam kết mang đến một chương trình
                    gây quỹ minh bạch, chặt chẽ và đáng tin cậy để giúp đỡ trẻ em có hoàn cảnh khó khăn, tạo điều kiện
                    cho các em có cơ hội phát triển tốt hơn.
                </p>
            </div>
            <div className="bg-white p-12 text-center">
                {/* Icon Section */}
                <div className="flex justify-between gap-12 mb-6">
                    {/* Continuous Update */}
                    <div className="flex flex-col items-center">
                        <div className="bg-teal-600 text-white p-4 rounded-full mb-4 shadow-lg">
                            <RefreshCw size={48} className="text-white" />
                        </div>
                        <p className="text-lg">CẬP NHẬT LIÊN TỤC</p>
                        <p className="text-lg font-semibold">THEO THỜI GIAN THỰC</p>
                    </div>

                    {/* Monthly Statement Update */}
                    <div className="flex flex-col items-center">
                        <div className="bg-teal-600 text-white p-4 rounded-full mb-4 shadow-lg">
                            <CalendarDays size={48} className="text-white" />
                        </div>
                        <p className="text-lg">CẬP NHẬT SAO KÊ</p>
                        <p className="text-lg font-semibold">HÀNG THÁNG</p>
                    </div>

                    {/* Supervision Section */}
                    <div className="flex flex-col items-center">
                        <div className="bg-teal-600 text-white p-4 rounded-full mb-4 shadow-lg">
                            <FileSearch size={48} className="text-white" />
                        </div>
                        <p className="text-lg">GIÁM SÁT BỞI</p>
                        <p className="text-black font-semibold text-center">NGÂN HÀNG CHÍNH SÁCH XÃ HỘI</p>
                    </div>
                </div>
            </div>
            <img src={line} alt="line" />
            <div>
                <GeneralFundTable />
            </div>
        </div>
    );
}
