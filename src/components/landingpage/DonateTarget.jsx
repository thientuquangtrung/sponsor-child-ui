import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';
import banner from '@/assets/images/banner.png';
import { useGetAllCampaignsQuery } from '@/redux/campaign/campaignApi';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { campaignStatusUser, campaignTypes } from '@/config/combobox';
import { Button } from '../ui/button';
import { BellRing, X } from 'lucide-react';
import useLocationVN from '@/hooks/useLocationVN';

const DonateTarget = () => {
    const { provinces } = useLocationVN();
    const [URLSearchParams, SetURLSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const debouncedSearchTerm = useDebounce(searchTerm);

    // pass all search params to api call
    const {
        data: campaigns = [],
        isLoading,
        error,
    } = useGetAllCampaignsQuery({ searchParams: URLSearchParams.toString(), hasGuarantee: true });

    useEffect(() => {
        if (debouncedSearchTerm) {
            URLSearchParams.set('title', debouncedSearchTerm);
        } else {
            URLSearchParams.delete('title');
        }
        SetURLSearchParams(URLSearchParams);
    }, [debouncedSearchTerm]);

    const handleTabClick = (tab) => {
        if (tab !== 'all') {
            URLSearchParams.set('guaranteeType', tab === 'organization' ? '1' : '0');
            SetURLSearchParams(URLSearchParams);
        } else {
            //clear this search param
            URLSearchParams.delete('guaranteeType');
            SetURLSearchParams(URLSearchParams);
        }
        setActiveTab(tab);
    };

    const handleSelect = (type, value) => {
        // set search param
        URLSearchParams.set(type, value);
        SetURLSearchParams(URLSearchParams);
    };

    if (isLoading) {
        return <p>Đang tải thông tin chiến dịch...</p>;
    }

    if (error) {
        return <p>Lỗi khi tải thông tin chiến dịch: {error.message}</p>;
    }

    return (
        <div className="mx-auto py-8">
            <div className="relative bg-cover bg-center">
                <img src={banner} alt="banner" className="w-full object-cover rounded-lg shadow-md" />
            </div>

            <div className="flex items-center justify-center mt-8 mb-4">
                <div className="border-t-2 border-teal-500 w-16"></div>
                <h1 className="text-2xl font-semibold mx-4">Chiến dịch gây quỹ nổi bật</h1>
                <div className="border-t-2 border-teal-500 w-16"></div>
            </div>

            <div className="flex justify-center mb-8">
                <Link to="/campaigns-no-guarantee">
                    <div className="h-auto w-auto bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] rounded-md">
                        <Button className="bg-white text-black font-semibold px-6 py-2 rounded-md flex items-center space-x-2 h-full w-full hover:bg-normal">
                            <BellRing className="w-6 h-6 text-rose-600 animate-shake" />
                            <span className="text-rose-600">Chiến dịch chưa có Người bảo lãnh</span>
                        </Button>
                    </div>
                </Link>
            </div>

            <div className="flex justify-between items-center mb-4 flex-wrap">
                <div className="flex space-x-2 flex-wrap">
                    <Select
                        onValueChange={(value) => handleSelect('status', value)}
                        value={URLSearchParams.get('status') ? +URLSearchParams.get('status') : ''}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Trạng thái</SelectLabel>
                                {campaignStatusUser.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select
                        onValueChange={(value) => handleSelect('type', value)}
                        value={URLSearchParams.get('type') ? +URLSearchParams.get('type') : ''}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Loại quyên góp</SelectLabel>
                                {campaignTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select
                        onValueChange={(value) => handleSelect('province', value)}
                        value={URLSearchParams.get('province') || ''}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Chọn tỉnh thành" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Tỉnh</SelectLabel>
                                {provinces.map((province) => (
                                    <SelectItem key={province.id} value={province.name}>
                                        {province.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {(URLSearchParams.get('type') ||
                        URLSearchParams.get('province') ||
                        URLSearchParams.get('status')) && (
                            <Button
                                onClick={() => {
                                    URLSearchParams.delete('type');
                                    URLSearchParams.delete('province');
                                    URLSearchParams.delete('status');
                                    SetURLSearchParams(URLSearchParams);
                                }}
                                variant="outline"
                            >
                                <X className="w-4 h-4 mr-1" /> xoá bộ lọc
                            </Button>
                        )}
                </div>

                <div className="relative mb-2">
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        type="text"
                        className="bg-white border border-gray-300 rounded-full pl-10 pr-4 py-2 w-64"
                        placeholder="Tìm kiếm tên chiến dịch"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-4.35-4.35M16.11 9.17a6.94 6.94 0 11-13.87 0 6.94 6.94 0 0113.87 0z"
                            />
                        </svg>
                    </span>
                </div>
            </div>

            <div className="flex justify-start space-x-8 mb-4">
                {['all', 'organization', 'individual'].map((tab) => (
                    <button
                        key={tab}
                        className={`text-lg font-semibold ${activeTab === tab ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-700'
                            }`}
                        onClick={() => handleTabClick(tab)}
                    >
                        {tab === 'all' ? 'Tất cả' : tab === 'organization' ? 'Tổ chức' : 'Cá nhân'}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {campaigns.length > 0 &&
                    campaigns.map((campaign) => (
                        <Link
                            key={campaign.campaignID}
                            to={`/campaign-detail/${campaign.campaignID}`}
                            className="bg-white rounded shadow-md overflow-hidden"
                        >
                            <div className="relative">
                                <img
                                    src={campaign?.thumbnailUrl || 'https://via.placeholder.com/400x300'}
                                    alt={campaign?.title}
                                    className="w-full h-48 object-cover rounded-t-md"
                                />
                                <div className="absolute top-2 left-2 bg-white text-rose-400 font-semibold rounded-full px-3 py-1 text-xs">
                                    Còn{' '}
                                    {Math.max(
                                        0,
                                        Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)),
                                    )}{' '}
                                    ngày
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="mt-2 font-semibold line-clamp-2">{campaign?.title}</h3>
                                <p className="text-sm text-gray-600 my-3">
                                    Tạo bởi <span className="font-bold text-yellow-500">{campaign?.guaranteeName}</span>
                                </p>
                                <div className="mt-2">
                                    <div className="h-2 w-full bg-gray-300 rounded">
                                        <div
                                            className="h-2 bg-green-500 rounded"
                                            style={{
                                                width: `${(campaign?.raisedAmount / campaign?.targetAmount) * 100}%`,
                                                background: 'linear-gradient(to right, #7EDAD7, #69A6B8)',
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm mt-1">
                                            Đã đạt được:{' '}
                                            <span className="font-bold text-[#69A6B8]">
                                                {campaign?.raisedAmount.toLocaleString()} VND
                                            </span>
                                        </p>
                                        <p className="font-bold text-sm">
                                            {Math.round((campaign?.raisedAmount / campaign?.targetAmount) * 100)}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
            </div>
            {campaigns.length === 0 && <p className="text-center my-4">Không tìm thấy chiến dịch</p>}
        </div>
    );
};

export default DonateTarget;
