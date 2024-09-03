import React from 'react';

const CampaignList = () => {
    const campaigns = [
        {
            daysLeft: 3,
            image: 'https://chuthapdophutho.org.vn/uploads/news/2016_12/e2.jpg', 
            title: 'Kêu gọi giúp đỡ viện phí để cứu em Điều Chung sinh năm 2009 tại ấp Mười Mẫu, xã Phước Thiện, huyện',
            description: 'Hội Chữ thập đỏ tỉnh Bình Phước',
            raisedAmount: 5145000,
            targetAmount: 20000000,
        },
        {
            daysLeft: 35,
            image: 'https://cdn.vntour.com.vn/storage/media/img/2016/08/25/net-hon-nhien-tre-em-vung-cao5_1472097871.jpg',
            title: 'Anh trai của em mới mất năm 2023, khó khăn chồng chất khó khăn, bố mẹ già yếu phải đi rửa chén thuê',
            description: 'Hội Chữ thập đỏ tỉnh Bình Phước',
            raisedAmount: 1403000,
            targetAmount: 10000000,
        },
        {
            daysLeft: 123,
            image: 'https://toquoc.mediacdn.vn/2020/6/1/ngam-net-dep-hon-nhien-cua-tre-em-vung-cao10-15909769396692063692588.jpg',
            title: 'Ủng hộ suất ăn với giá 2.000 đồng cho bệnh nhân & người nhà bệnh nhân viện K Tân Triều',
            description: 'Quán Nụ Cười Shinbi',
            raisedAmount: 108488415,
            targetAmount: 500000000,
        },
    ];

    return (
        <div>
            <div className='flex justify-between items-center'>
                <h2 className='text-lg font-semibold my-8'>Các chiến dịch khác</h2>
                <h2 className='text-lg text-teal-600'>Xem tất cả</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {campaigns.map((campaign, index) => (
                    <div key={index} className="bg-white rounded shadow-md">
                        <div className='relative'>
                            <img src={campaign.image} alt={campaign.title} className="w-full h-48 object-cover rounded-t-md" />
                            <div className="flex justify-between items-center mt-2">
                                <span className="absolute top-[10px] left-[10px] bg-white text-rose-400 font-semibold rounded-full px-3 py-1 text-xs">
                                    Còn {campaign.daysLeft} ngày
                                </span>
                            </div>
                        </div>
                        <div className='p-4'>
                            <h3 className="mt-2 font-semibold line-clamp-2">{campaign.title}</h3>
                            <p className="text-sm text-gray-600 my-3">Tạo bởi <span className='font-bold text-yellow-500'>{campaign.description}</span></p>
                            <div className="mt-2">
                                <div className="h-2 w-full bg-gray-300 rounded">
                                    <div
                                        className="h-2 bg-green-500 rounded"
                                        style={{
                                            width: `${(campaign.raisedAmount / campaign.targetAmount) * 100}%`,
                                            background: 'linear-gradient(to right, #7EDAD7, #69A6B8)',
                                        }}
                                    ></div>
                                </div>
                                <div className='flex justify-between'>
                                    <p className="text-sm mt-1">
                                        Đã đạt được: <span className="font-bold text-[#69A6B8]">{campaign.raisedAmount.toLocaleString()} VND</span>
                                    </p>
                                    <p className='font-bold text-sm'>{Math.round((campaign.raisedAmount / campaign.targetAmount) * 100)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CampaignList;
