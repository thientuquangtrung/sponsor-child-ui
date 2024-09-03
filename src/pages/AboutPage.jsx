import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Utensils, HandHeart, Gift, ShieldCheck, Target, Users, DollarSign, UserPlus, BarChart, CreditCard, Link, Leaf } from 'lucide-react';

const missionItems = [
  {
    title: "Quyên góp cho giáo dục",
    description: "Góp phần vào việc nâng cao chất lượng giáo dục bằng cách đóng góp tài chính và nguồn lực để hỗ trợ học sinh và các cơ sở giáo dục",
    icon: BookOpen
  },
  {
    title: "Bữa ăn cho trẻ",
    description: "Cung cấp thực phẩm đầy đủ và dinh dưỡng, đảm bảo trẻ em có thể lớn lên mạnh khỏe và tràn đầy năng lượng.",
    icon: Utensils
  },

  {
    title: "Kết nối yêu thương",
    description: "Kết nối trẻ em với những người bảo trợ, tình nguyện viên và các tổ chức từ thiện, tạo nên một cộng đồng hỗ trợ mạnh mẽ.",
    icon: Link
  },
  {
    title: "Tương lai bền vững",
    description: "Hỗ trợ các dự án bền vững nhằm cung cấp các giải pháp dài hạn cho các vấn đề mà trẻ em và cộng đồng đang đối mặt.",
    icon: Leaf
  },
  {
    title: "Cùng nhau giúp đỡ",
    description: "Kết nối cộng đồng và các tổ chức để chung tay giúp đỡ những trẻ em kém may mắn, tạo ra sự thay đổi tích cực trong cuộc sống của các em.",
    icon: HandHeart
  },
  {
    title: "Quyên góp cho trẻ em",
    description: "Đóng góp tài chính và vật phẩm để hỗ trợ nhu cầu của trẻ em",
    icon: Gift
  }
];

const actionItems = [
  {
    title: "Đóng góp",
    description: "Tạo điều kiện cho bạn quyên góp tiền, hiến tặng vật phẩm, tham gia sự kiện, và làm tình nguyện viên một cách dễ dàng và minh bạch. Mọi đóng góp đều được công khai, đảm bảo sử dụng đúng mục đích để tạo ra tác động tích cực và bền vững cho cộng đồng.",
    action: "Đóng góp ngay",
    icon: DollarSign
  },
  {
    title: "Tình nguyện viên",
    description: "Cơ hội để bạn đăng ký làm tình nguyện viên cho các dự án từ thiện. Bạn có thể tham gia vào các hoạt động như tổ chức sự kiện, hỗ trợ cộng đồng, và các nhiệm vụ khác, đóng góp thời gian và công sức để tạo ra tác động tích cực trong xã hội.r id tempus",
    action: "Tham gia",
    icon: UserPlus
  },
  {
    title: "Gây quỹ",
    description: "Cho phép bạn tạo và tham gia các chiến dịch gây quỹ để hỗ trợ các mục tiêu từ thiện. Bạn có thể đóng góp, kêu gọi người khác tham gia, và theo dõi tiến độ gây quỹ một cách minh bạch, đảm bảo mọi khoản đóng góp đều được sử dụng đúng mục đích để giúp đỡ cộng đồng.",
    action: "Xem thêm",
    icon: BarChart
  }
];

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Về Chúng Tôi</h1>
      <p className="text-base text-gray-600 text-center">Sứ mệnh của chúng tôi là tạo ra một nền tảng minh bạch và đáng tin cậy,
        nơi mọi người dễ dàng kết nối và tham gia vào các hoạt động thiện nguyện,
        đảm bảo mỗi đóng góp được công khai và sử dụng hiệu quả để tạo tác động tích cực cho xã hội.</p>
      <div className="mt-4 flex justify-center">
        <span className="inline-block w-36 h-1 bg-primary rounded-full"></span>
      </div>
      <section className="mt-6 mb-12">
        <h2 className="text-3xl font-semibold mb-4">Sứ mệnh của chúng tôi</h2>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {missionItems.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="bg-primary p-2 rounded-md">
                  {React.createElement(item.icon, { className: "text-white", size: 24 })}
                </div>
                <span className="ml-2">{item.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>


      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Tại sao chọn chúng tôi ?</h2>
        <div className="mt-4 mb-6">
          <span className="inline-block w-36 h-1 bg-primary rounded-full"></span>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <span className="flex items-center">
                    <ShieldCheck className="mr-2 text-primary" size={20} />
                    Cam kết minh bạch
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  Chúng tôi cam kết minh bạch trong mọi hoạt động và sử dụng quỹ từ thiện.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <span className="flex items-center">
                    <Target className="mr-2 text-primary" size={20} />
                    Tác động lâu dài
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  Các dự án của chúng tôi được thiết kế để tạo ra tác động lâu dài và bền vững.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <span className="flex items-center">
                    <Users className="mr-2 text-primary" size={20} />
                    Đội ngũ chuyên nghiệp
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  Chúng tôi có đội ngũ chuyên nghiệp và tận tâm với công việc từ thiện.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  <span className="flex items-center">
                    <CreditCard className="mr-2 text-primary" size={20} />
                    Hệ thống quyên góp trực tuyến với các phương thức khác nhau                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  Một nền tảng cho phép quyên góp tiền trực tuyến qua các phương thức khác nhau, như thẻ tín dụng, chuyển khoản ngân hàng và ví điện tử.                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div class="w-full md:w-1/2 relative">
            <div class="grid grid-cols-3 gap-4">
              <div class="col-span-2 row-span-2">
                <img src="https://static.thiennguyen.app/public/donate-target/photo/2024/7/31/9cdf1fcd-9c94-44eb-b1a1-dc713e78ee2d.jpg"
                  alt="Image1" class="w-full h-full object-cover rounded-lg" />
              </div>
              <div class="col-span-1 space-y-4">
                <div>
                  <img src="https://static.thiennguyen.app/public/donate-target/photo/2024/7/13/13c8ec29-f3e5-4e42-a463-bf31b13ea87c.jpg"
                    alt="image2" class="w-full h-full object-cover rounded-lg" />
                </div>
                <div>
                  <img src="https://static.thiennguyen.app/public/donate-target/photo/2024/8/8/7b89fee8-efb8-45e4-bfd0-c7c2365bd485.jpg"
                    alt="Image3" class="w-full h-full object-cover rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actionItems.map((item, index) => (
          <Card
            key={index}
            className={`flex flex-col ${index === 1 ? "bg-[#adf0ef] hover:bg-[#27aca9]" : "bg-primary hover:bg-[#27aca9]"
              } transition-colors duration-300`}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                {React.createElement(item.icon, { className: "mr-2", size: 24 })}
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{item.description}</p>
            </CardContent>
            <CardFooter className="mt-auto flex justify-center">
              <Button className="border-2  border-white">{item.action}</Button>
            </CardFooter>

          </Card>
        ))}
      </section>

    </div>
  );
};

export default AboutPage;