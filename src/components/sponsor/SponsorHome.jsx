import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Users, DollarSign, ArrowUp, ArrowDown, Mail, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const SponsorHome = () => {
  const sponsorInfo = {
    name: "Kim jisoo",
    email: "jisoo@gmail.com",
    avatarUrl: "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/6/3/1052267/IMG_7095.jpg"
  };

  const stats = [
    {
      title: "Tổng Số Chiến Dịch",
      value: 12,
      change: 2,
      icon: BarChart
    },
    {
      title: "Tổng Số Người Tiếp Cận",
      value: 1234,
      change: 246,
      icon: Users
    },
    {
      title: "Tổng Chi Tiêu",
      value: 50000000,
      change: 7500000,
      icon: DollarSign
    },
  ];

  const featuredCampaigns = [
    {
      id: 1,
      title: "Hỗ trợ trẻ em vùng cao",
      description: "Quyên góp sách vở và đồ dùng học tập cho trẻ em vùng cao",
      imageUrl: "https://thanhnien.mediacdn.vn/Uploaded/nuvuong/2022_11_09/z3859751276507-161a58f0117a5fd86756e4f7b851b5b5-8154.jpg",
      progress: 75,
      target: 100000000
    },
    {
      id: 2,
      title: "Hỗ trợ trẻ em vùng cao",
      description: "Quyên góp sách vở và đồ dùng học tập cho trẻ em vùng cao",
      imageUrl: "https://thanhnien.mediacdn.vn/Uploaded/nuvuong/2022_11_09/z3859751276507-161a58f0117a5fd86756e4f7b851b5b5-8154.jpg",
      progress: 75,
      target: 100000000
    }
  ];

  const emergencyCampaigns = [
    {
      id: 3,
      title: "Hỗ trợ trẻ em vùng cao",
      description: "Quyên góp sách vở và đồ dùng học tập cho trẻ em vùng cao",
      imageUrl: "https://thanhnien.mediacdn.vn/Uploaded/nuvuong/2022_11_09/z3859751276507-161a58f0117a5fd86756e4f7b851b5b5-8154.jpg",
      progress: 75,
      target: 100000000
    }
  ];

  const recentCampaigns = [
    {
      id: 4,
      title: "Chiến Dịch 1",
      status: "Đang Hoạt Động",
      reach: 50,
      budget: 10000000
    },
    {
      id: 5,
      title: "Chiến dịch 2",
      status: "Đã Lên Lịch",
      reach: 2,
      budget: 14000000
    }
  ];

  const formatValue = (value, title) => {
    if (title.includes("Chi Tiêu")) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    }
    return value.toLocaleString('vi-VN');
  };

  const formatChange = (change, title) => {
    const prefix = change > 0 ? '+' : '';
    if (title.includes("Chi Tiêu")) {
      return prefix + new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(change);
    }
    return prefix + change.toLocaleString('vi-VN');
  };

  const CampaignCard = ({ campaign, isEmergency }) => (
    <Card className={`overflow-hidden ${isEmergency ? 'border-red-500' : ''}`}>
      <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-48 object-cover" />
      <CardHeader>
        <CardTitle className="flex items-center">
          {isEmergency && <AlertTriangle className="text-red-500 mr-2" />}
          {campaign.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{campaign.description}</p>
        <Progress value={campaign.progress} className="mb-2" />
        <p className="text-sm text-gray-600">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(campaign.target * campaign.progress / 100)} / {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(campaign.target)}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tổng Quan Về Nhà Tài Trợ</h1>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-semibold text-gray-900">{sponsorInfo.name}</p>
            <p className="text-sm text-gray-600 flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              {sponsorInfo.email}
            </p>
          </div>
          <Avatar className="h-12 w-12">
            <AvatarImage src={sponsorInfo.avatarUrl} alt={sponsorInfo.name} />
            <AvatarFallback>{sponsorInfo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-800">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900">{formatValue(stat.value, stat.title)}</div>
                <div className={`flex items-center ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change > 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                  <span className="text-xs">{formatChange(stat.change, stat.title)}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600">so với tháng trước</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Các Chiến Dịch Khẩn Cấp</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emergencyCampaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} isEmergency={true} />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Các Chiến Dịch Nổi Bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCampaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} isEmergency={false} />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Chiến Dịch Gần Đây</h2>
          <Button variant="outline" className="bg-primary text-white hover:bg-primary-dark">
            Xem Tất Cả Chiến Dịch
          </Button>
        </div>

        <div className="space-y-4">
          {recentCampaigns.map(campaign => (
            <Card key={campaign.id}>
              <CardHeader>
                <CardTitle>{campaign.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Trạng Thái:</strong> {campaign.status}</p>
                <p><strong>Tiếp Cận:</strong> {campaign.reach}</p>
                <p><strong>Ngân Sách:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(campaign.budget)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorHome;