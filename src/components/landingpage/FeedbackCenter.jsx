import React from "react";
import Slider from "react-slick";
import SliderWrapper from "@/components/common/SlickSliderStyle";
import { Quote } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Feedbacks = [
    {
        name: "Huỳnh Gia Vinh",
        role: "Tình nguyện viên",
        content: "Tôi rất vui khi được tham gia vào các hoạt động thiện nguyện. Nó cho tôi cơ hội để giúp đỡ cộng đồng và kết nối với những người cùng chí hướng.",
    },
    {
        name: "Trần Phạm Thành",
        role: "Nhà tài trợ",
        content: "Tôi tin rằng mỗi đóng góp nhỏ đều có thể tạo nên sự khác biệt lớn. Tôi rất hài lòng khi thấy số tiền quyên góp của mình được sử dụng hiệu quả để giúp đỡ những người cần thiết.",
    },
    {
        name: "Lê Văn Hằng",
        role: "Người thụ hưởng",
        content: "Tôi vô cùng biết ơn sự giúp đỡ mà tôi nhận được. Nó đã thay đổi cuộc sống của tôi theo hướng tích cực và cho tôi hy vọng về một tương lai tốt đẹp hơn.",
    },
];

export default function FeedbackCenter() {
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        arrows: false,
        slidesToScroll: 1,
        speed: 2000,
        autoplay: true,
        autoplaySpeed: 4000,
        cssEase: "linear"
    };

    return (
        <div className="grid md:grid-cols-2 sm:grid-cols-1 py-[60px]">
            <div className="col-span-1 flex justify-center items-center">
                <img
                    className="w-[300px] rounded-[50%] bg-gradient-to-r from-blue-400 to-purple-500 h-[300px] object-cover"
                    src="https://baothainguyen.vn/file/oldimage/baothainguyen/UserFiles/image/emagazineduocthientamsualaisapo.jpg"
                    alt="Feedback"
                />
            </div>
            <div className="col-span-1 md:pr-[30%] md:pl-0 sm:px-[15%]">
                <h1 className="lg:text-[26px] sm:text-[35px] px-[8px] text-[#000000b3] pb-2 pt-6 font-cabin font-semibold text-center"
                    style={{ textShadow: "-11px 10px 8px #909090b3" }}>
                    Chia sẻ từ người dùng Thiện nguyện
                </h1>

                <SliderWrapper>
                    <Slider {...settings} className="pt-4">
                        {Feedbacks && Feedbacks.map((feedback, index) => (
                            <div key={index} className="px-[8px]">
                                <Quote className="text-primary text-[25px]" />
                                <p className="lg:text-[16px] md:text-[13px]">
                                    {feedback.role}
                                </p>
                                <p className="pt-[10px] font-semibold lg:text-[20px] md:text-[15px] text-primary">
                                    {feedback.name}
                                </p>
                                <p className="pb-[10px]  lg:text-[16px] md:text-[13px]">
                                    {feedback.content}
                                </p>
                            </div>
                        ))}
                    </Slider>
                </SliderWrapper>
            </div>
        </div>
    );
}