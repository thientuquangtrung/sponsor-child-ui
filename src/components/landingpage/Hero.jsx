import React from 'react';
import { Heart, HopOff, Handshake } from 'lucide-react';

const Hero = () => {
    return (
        <div className="w-full relative flex lg:flex-row sm:flex-col bg-white font-sans">
            <div className="lg:w-3/5 lg:!bg-none lg:pt-[12%] lg:h-0 sm:h-screen sm:bg-cover flex justify-center">
                <div className="pl-20 sm:my-auto">
                    <h1 className="lg:text-black sm:text-black font-bold text-4xl mb-2">
                        <span className="text-primary">Cộng đồng</span> hỗ trợ minh bạch,{" "}
                        <br />
                        Kết nối yêu thương, <span className="text-primary">xây dựng niềm tin</span>
                    </h1>
                    <p>
                        Hành trình thiện nguyện của bạn sẽ góp phần làm nên những thay đổi tích cực và bền vững.
                    </p>
                </div>
            </div>

            <div
                className="lg:h-4/12 bg-gray-100 lg:w-9/12 sm:w-full flex justify-between lg:absolute bottom-0 left-0 rounded-r-[20px] z-10 p-6"
            >
                <div className="w-1/3 p-2">
                    <div className="mb-2">
                        <Heart className="text-red-700 lg:text-xl" />
                    </div>
                    <h2 className="font-bold mb-2 lg:text-xl">Tình thương</h2>
                    <p className="sm:text-[12px] lg:text-[16px]">
                        Sự quan tâm và chia sẻ yêu thương với những người có hoàn cảnh khó khăn
                    </p>
                </div>
                <div className="w-1/3 p-2">
                    <div className="mb-2">
                        <HopOff className="text-green-400 lg:text-xl" />
                    </div>
                    <h2 className="font-bold mb-2 lg:text-xl">Hy vọng</h2>
                    <p className="sm:text-[12px] lg:text-[16px]">
                        Niềm tin và mong ước về một tương lai tốt đẹp hơn cho những người được hỗ trợ.
                    </p>
                </div>
                <div className="w-1/3 p-2">
                    <div className="mb-2">
                        <Handshake className="text-blue-400 lg:text-xl" />
                    </div>
                    <h2 className="font-bold mb-2 lg:text-xl">Chia sẻ</h2>
                    <p className="sm:text-[12px] lg:text-[16px]">
                        Hành động giúp đỡ, hỗ trợ cả về vật chất lẫn tinh thần cho cộng đồng.
                    </p>
                </div>
            </div>

            <div className="lg:block hidden w-5/12 h-full">
                <img
                    src="https://toquoc.mediacdn.vn/280518851207290880/2022/9/4/z3648644725961ca9fe75c70acf7bcb6e1a98b3ccfa19b-16623013688991113728747.jpg"
                    className="w-full h-full lg:bg-transparent sm:bg-white"
                    alt="Hero"
                />
            </div>
        </div>
    );
};

export default Hero;
