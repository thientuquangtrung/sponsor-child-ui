import React from 'react';

import { useNavigate } from 'react-router-dom';

import textlogo from '@/assets/images/text-logo-black.png';
import logo from '@/assets/images/img-children.png';

import banner from '@/assets/images/banner.png';
import intro from '@/assets/images/general-introduction.png';
import vision from '@/assets/images/icon-vision.png';
import mission from '@/assets/images/icon-mission.png';
import value from '@/assets/images/icon-values.png';
import solution1 from '@/assets/images/solution1.png';
import solution2 from '@/assets/images/solution2.png';
import solution3 from '@/assets/images/solution3.png';
import solution4 from '@/assets/images/solution4.png';

import { Check } from 'lucide-react';

import { Button } from '../ui/button';

const PageIntroduction = () => {
    const navigate = useNavigate();

    const navigateToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="bg-white">
            <div className="relative bg-cover bg-center">
                <img src={banner} alt="banner" className="w-full object-cover" />
            </div>

            <section
                className="py-8 relative bg-cover bg-center"
                style={{
                    backgroundImage: `url(${intro})`,
                }}
            >
                <div className="container mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-3">Giới thiệu chung</h2>
                    <hr className="border-2 border-teal-600 w-[100px] mx-auto mb-4" />
                    <p className="text-black max-w-5xl mx-auto mb-8">
                        Giải pháp công nghệ tích hợp của chúng tôi cung cấp nền tảng web thân thiện, minh bạch cho các
                        tổ chức và cá nhân hoạt động trong lĩnh vực vận động gây quỹ cộng đồng. Hệ thống đảm bảo quản lý
                        thông tin và giao dịch một cách rõ ràng, minh bạch, giúp tối ưu hóa quy trình gây quỹ và kết nối
                        với cộng đồng một cách hiệu quả.
                    </p>

                    <div className="flex justify-between align-middle items-center">
                        <div className="text-center flex-1 max-w-[300px]">
                            <img src={vision} alt="Tầm nhìn" className="mx-auto mb-4 w-[80px] h-[80px]" />
                            <h3 className="text-lg font-bold">Tầm nhìn</h3>
                            <p className="text-black">
                                Đến năm 2025 trở thành mạng xã hội thiện nguyện đầu tiên tại Việt Nam dành cho cộng đồng
                                thiện nguyện minh bạch
                            </p>
                        </div>

                        <div className="text-center flex-1 max-w-[300px]">
                            <img src={mission} alt="Sứ mệnh" className="mx-auto mb-4 w-[80px] h-[80px]" />
                            <h3 className="text-lg font-bold">Sứ mệnh</h3>
                            <p className="text-black">
                                Ứng dụng công nghệ vào hoạt động nhân đạo, thiện nguyện, cộng đồng, thúc đẩy tính minh
                                bạch
                            </p>
                        </div>

                        <div className="text-center flex-1 max-w-[300px]">
                            <img src={value} alt="Giá trị cốt lõi" className="mx-auto mb-4 w-[80px] h-[80px]" />
                            <h3 className="text-lg font-bold">Giá trị cốt lõi</h3>
                            <p className="text-black">Minh bạch, sẻ chia, kết nối, thuận tiện</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative bg-gradient-to-r from-teal-400 to-secondary text-white py-4">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <img
                        src="https://thiennguyen.app/_next/static/media/commit4.f5ce2e65.png"
                        className="absolute w-[100px] h-[150px] top-[20px] left-[10px]"
                    />
                    <img
                        src="https://thiennguyen.app/_next/static/media/commit3.0fe20744.png"
                        className="absolute w-[48px] h-[48px] top-[30px] right-[20px]"
                    />
                    <img
                        src="https://thiennguyen.app/_next/static/media/commit1.62072109.png"
                        className="absolute w-[48px] h-[48px] bottom-[70px] left-[40px]"
                    />
                    <img
                        src="https://thiennguyen.app/_next/static/media/commit5.012c7322.png"
                        className="absolute w-[150px] h-[100px] right-[70px] bottom-[40px]"
                    />
                </div>

                <div className="flex justify-evenly mb-12 mx-28">
                    <div className="bg-white text-black rounded-lg shadow-md max-w-lg">
                        <h3 className="text-xl text-center font-semibold bg-gray-200 py-2 px-4 rounded-t-lg">
                            Minh bạch cho tổ chức, cá nhân gây quỹ
                        </h3>
                        <div className="flex items-start mt-2 p-4">
                            <div className="flex items-center justify-center bg-secondary text-white rounded-full w-6 h-6 mr-2">
                                <Check />
                            </div>
                            <p className="text-sm">
                                Giúp bạn nhanh chóng thiết lập mục tiêu, minh bạch sao kê tài khoản, lập báo cáo thu chi
                                theo quy định, đăng bài viết, cập nhật các hoạt động, kết nối với nhà hảo tâm mọi lúc
                                mọi nơi
                            </p>
                        </div>
                    </div>
                    <div className="bg-white text-black rounded-lg shadow-md max-w-lg">
                        <h3 className="text-xl text-center font-semibold bg-gray-200 py-2 px-4 rounded-t-lg">
                            Niềm tin cho nhà hảo tâm
                        </h3>
                        <div className="flex items-start mt-2 p-4">
                            <div className="flex items-center justify-center bg-secondary text-white rounded-full w-6 h-6 mr-2">
                                <Check />
                            </div>
                            <p className="text-sm">
                                Giúp bạn ủng hộ trực tuyến thuận tiện và minh bạch, giám sát sao kê tài khoản thiện
                                nguyện, lựa chọn theo dõi và đồng hành cùng các chiến dịch bạn quan tâm, dễ dàng tương
                                tác, hỗ trợ các chiến dịch
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between space-x-8">
                    <img className="w-[40%] h-auto object-contain" src={logo} />
                    <div className="flex-1 relative">
                        <h2 className="text-2xl font-semibold mb-4">Đồng hành dễ dàng hơn cùng</h2>
                        <img src={textlogo} alt="logo" className="w-[250px] mb-6" />

                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-center">
                                <h3 className="text-3xl font-semibold">0</h3>
                                <p className="text-sm">Tổ chức thiện nguyện</p>
                            </div>
                            <div className="text-center">
                                <h3 className="text-3xl font-semibold">0</h3>
                                <p className="text-sm">Cá nhân thiện nguyện</p>
                            </div>
                            <div className="text-center">
                                <h3 className="text-3xl font-semibold">0</h3>
                                <p className="text-sm">Thành viên tham gia</p>
                            </div>
                            <div className="text-center">
                                <h3 className="text-3xl font-semibold">0</h3>
                                <p className="text-sm">Chiến dịch thiện nguyện</p>
                            </div>
                            <div className="text-center">
                                <h3 className="text-3xl font-semibold">0,00</h3>
                                <p className="text-sm">Số tiền ủng hộ (tỷ đồng)</p>
                            </div>
                            <div className="text-center">
                                <h3 className="text-3xl font-semibold">0</h3>
                                <p className="text-sm">Lượt đã ủng hộ</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-white py-16">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold mb-4 text-center">Giải pháp thúc đẩy tính minh bạch</h2>
                    <hr className="border-2 border-teal-700 w-[100px] mx-auto mb-16" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex items-start">
                            <img src={solution1} alt="Minh bạch" className="w-16 mr-4" />
                            <div>
                                <p className="font-bold text-lg">Minh bạch công khai 24/7</p>
                                <p>Tự động báo cáo, thống kê, chia sẻ và xuất báo cáo sao kê theo yêu cầu</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <img src={solution3} alt="Quản lý hiệu quả" className="w-16 mr-4" />
                            <div>
                                <p className="font-bold text-lg">Tối ưu hóa quy trình gây quỹ</p>
                                <p>
                                    Hệ thống giúp tự động hóa và tối ưu hóa quy trình quản lý gây quỹ, giảm thiểu công
                                    việc thủ công và nâng cao hiệu quả cho các tổ chức và cá nhân.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <img src={solution2} alt="Dễ dàng" className="w-16 mr-4" />
                            <div>
                                <p className="font-bold text-lg">Dễ dàng tạo mục tiêu gây quỹ</p>
                                <p>
                                    Thiết kế, quản lý mục tiêu gây quỹ và đăng tải, cập nhật các hoạt động thiện nguyện
                                    bằng các thao tác đơn giản
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <img src={solution4} alt="Mở rộng kết nối" className="w-16 mr-4" />
                            <div>
                                <p className="font-bold text-lg">Mở rộng kết nối</p>
                                <p>
                                    Lan tỏa mục tiêu gây quỹ và kết nối với cộng đồng thông qua các nền tảng mạng xã hội
                                    và website của hệ thống.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-r from-secondary to-teal-400 text-white py-12 relative rounded-lg">
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <h1 className="absolute text-[150px] font-bold text-white text-opacity-10">SPONSOR CHILD</h1>
                    <img
                        src="https://thiennguyen.app/_next/static/media/commit4.f5ce2e65.png"
                        className="absolute w-[100px] h-[150px] top-[20px] left-[10px]"
                    />
                    <img
                        src="https://thiennguyen.app/_next/static/media/commit3.0fe20744.png"
                        className="absolute w-[48px] h-[48px] top-[30px] right-[20px]"
                    />
                    <img
                        src="https://thiennguyen.app/_next/static/media/commit1.62072109.png"
                        className="absolute w-[48px] h-[48px] bottom-[70px] left-[40px]"
                    />
                    <img
                        src="https://thiennguyen.app/_next/static/media/commit5.012c7322.png"
                        className="absolute w-[150px] h-[100px] right-[30px] bottom-[20px]"
                    />
                </div>
                <div className="mx-auto text-center">
                    <h2 className="text-3xl font-semibold text-center mb-8 drop-shadow-2xl">
                        Bắt đầu sứ mệnh cộng đồng của bạn
                    </h2>
                    <hr className="border-2 border-teal-700 w-[100px] mx-auto mb-16" />
                    <div className="relative mb-4">
                        <svg
                            className="absolute left-0 right-0 mx-auto my-0"
                            width="60%"
                            height="100px"
                            viewBox="0 0 1000 100"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M 1000,50 C 750,0 250,100 0,50"
                                stroke="white"
                                strokeWidth="2"
                                strokeDasharray="10,10"
                            />
                        </svg>

                        <div className="flex justify-center gap-12">
                            <div className="relative z-10 space-y-6">
                                <div className="bg-white text-teal-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 text-4xl font-extrabold">
                                    1
                                </div>
                                <p className="w-[150px] font-bold drop-shadow-2xl">
                                    Đăng ký tài khoản người dùng trên Web Sponsor Child
                                </p>
                            </div>

                            <div className="relative z-10 space-y-6">
                                <div className="bg-white text-teal-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 text-4xl font-extrabold">
                                    2
                                </div>
                                <p className="w-[150px] font-bold drop-shadow-2xl">
                                    Đăng ký trở thành Người Bảo Lãnh
                                </p>
                            </div>

                            <div className="relative z-10 space-y-6">
                                <div className="bg-white text-teal-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 text-4xl font-extrabold">
                                    3
                                </div>
                                <p className="w-[150px] font-bold drop-shadow-2xl">
                                    Nhận thông báo tài khoản người dùng được xác thực
                                </p>
                            </div>

                            <div className="relative z-10 space-y-6">
                                <div className="bg-white text-teal-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 text-4xl font-extrabold">
                                    4
                                </div>
                                <p className="w-[150px] font-bold drop-shadow-2xl">Tạo và chia sẻ mục tiêu gây quỹ</p>
                            </div>

                            <div className="relative z-10 space-y-6">
                                <div className="bg-white text-teal-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 text-4xl font-extrabold">
                                    5
                                </div>
                                <p className="w-[150px] font-bold drop-shadow-2xl">Cập nhật hoạt động và báo cáo</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="flex justify-center my-12">
                <Button
                    className="bg-gradient-to-r from-teal-400 to-secondary text-white text-lg font-semibold px-6 py-6 rounded-md"
                    onClick={navigateToRegister}
                >
                    Đăng ký ngay
                </Button>
            </div>
        </div>
    );
};

export default PageIntroduction;
