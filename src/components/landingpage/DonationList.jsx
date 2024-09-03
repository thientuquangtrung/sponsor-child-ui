import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { Input } from '../ui/input';

const DonationList = ({ donations }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const donationsPerPage = 10;

    // Filter donations based on the search query
    const filteredDonations = donations.filter((donation) =>
        donation.donor.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const totalPages = Math.ceil(filteredDonations.length / donationsPerPage);
    const indexOfLastDonation = currentPage * donationsPerPage;
    const indexOfFirstDonation = indexOfLastDonation - donationsPerPage;
    const currentDonations = filteredDonations.slice(indexOfFirstDonation, indexOfLastDonation);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); 
    };

    const renderPageNumbers = () => {
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pages.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-3 py-1 rounded ${
                            currentPage === i
                                ? 'bg-teal-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {i}
                    </button>,
                );
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                pages.push(
                    <span key={i} className="px-2 py-1 text-gray-500">
                        ...
                    </span>,
                );
            }
        }

        return pages;
    };

    return (
        <div className="shadow-xl">
            <div className="w-full bg-zinc-100 py-2 relative">
                <h2 className="text-lg ml-5 font-semibold text-teal-600">Danh sách ủng hộ</h2>
                <div className="absolute bottom-0 left-0 w-48 border-b-2 border-teal-600"></div>
            </div>

            <div className="px-4">
                <div className="relative my-8">
                    <Input
                        placeholder="Nhập tên người ủng hộ"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full pl-12 rounded-full shadow-[0px_1px_16px_0px_rgba(0,0,0,0.059)] border-none"
                    />
                    <Search className="absolute left-4 top-3 text-teal-600" size={20} />
                </div>

                <table className="min-w-full bg-zinc-50 text-sm">
                    <thead>
                        <tr className="bg-[#8CD5D34D] text-gray-700 uppercase leading-normal">
                            <th className="py-3 px-4 text-left font-medium">Người ủng hộ</th>
                            <th className="py-3 px-4 text-left font-medium">Số tiền ủng hộ</th>
                            <th className="py-3 px-4 text-left font-medium">Thời gian ủng hộ</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {currentDonations.map((donation, index) => (
                            <tr
                                key={index}
                                className={`border-b border-gray-200 ${
                                    index % 2 ? 'bg-white' : 'bg-zinc-50'
                                } hover:bg-zinc-100`}
                            >
                                <td className="py-3 px-4">{donation.donor}</td>
                                <td className="py-3 px-4">{donation.amount}</td>
                                <td className="py-3 px-4">{donation.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-center items-center py-4 space-x-2">
                    <span className="text-sm text-teal-600 font-semibold">
                        {currentPage}/{totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-white hover:bg-gray-100 disabled:opacity-50"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    {renderPageNumbers()}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-white hover:bg-gray-100 disabled:opacity-50"
                    >
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DonationList;
