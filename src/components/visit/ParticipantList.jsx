import React, { useState } from 'react';
import { Search, ArrowLeft, ArrowRight, LoaderCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

const ITEMS_PER_PAGE = 10;

const ParticipantList = ({ visitRegistrations = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const filteredRegistrations = visitRegistrations
        .filter(registration => registration.status === 1)
        .filter(registration =>
            registration.userName.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const totalItems = filteredRegistrations.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = filteredRegistrations.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            setIsLoading(true);
            setCurrentPage(page);
            setTimeout(() => setIsLoading(false), 200);
        }
    };

    const getPaginationRange = () => {
        const delta = 1;
        const range = [];
        const leftEllipsis = '...';

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                range.push(i);
            }
        } else {
            range.push(1, 2, 3, 4, 5);

            if (currentPage > 5 && currentPage <= totalPages) {
                if (currentPage > 6) range.push(leftEllipsis);

                const start = Math.max(6, currentPage - delta);
                const end = Math.min(totalPages - 1, currentPage + delta);

                for (let i = start; i <= end; i++) {
                    range.push(i);
                }

                if (currentPage + delta < totalPages - 1) {
                    range.push(leftEllipsis);
                }
            }

            range.push(totalPages);
        }

        return range;
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const activeParticipantsCount = visitRegistrations.filter(registration => registration.status === 1).length;

    return (
        <div className="shadow-xl">
            <div className="w-full bg-zinc-100 py-2 relative">
                <h2 className="text-lg ml-5 font-semibold text-teal-600">
                    Danh sách người tham gia ({activeParticipantsCount})
                </h2>
                <div className="absolute bottom-0 left-0 w-48 border-b-2 border-teal-600"></div>
            </div>

            <div className="px-4">
                <div className="relative my-8">
                    <Input
                        placeholder="Tìm kiếm người tham gia..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pl-12 rounded-full shadow-[0px_1px_16px_0px_rgba(0,0,0,0.059)] border-none"
                    />
                    <Search className="absolute left-4 top-3 text-teal-600" size={20} />
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <LoaderCircle className="animate-spin text-teal-500" size={60} />
                    </div>
                ) : (
                    <>
                        <table className="min-w-full bg-zinc-50 text-sm">
                            <thead>
                                <tr className="bg-[#8CD5D34D] text-gray-700 uppercase leading-normal">
                                    <th className="py-3 px-4 text-left font-medium">Người tham gia</th>
                                    <th className="py-3 px-4 text-left font-medium">Thời gian đăng ký</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600">
                                {currentItems.map((registration, index) => (
                                    <tr
                                        key={registration.id}
                                        className={`border-b border-gray-200 ${index % 2 ? 'bg-white' : 'bg-zinc-50'
                                            } hover:bg-zinc-100`}
                                    >
                                        <td className="py-3 px-4">{registration.userName}</td>
                                        <td className="py-3 px-4">
                                            {new Date(registration.createdAt).toLocaleString('vi-VN')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {currentItems.length === 0 && (
                            <div className="text-center text-gray-500 py-4">
                                Không tìm thấy kết quả
                            </div>
                        )}

                        {totalPages > 1 && (
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
                                {getPaginationRange().map((page, index) =>
                                    typeof page === 'string' ? (
                                        <span key={index} className="px-3 py-1 text-gray-500">
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-1 rounded ${currentPage === page
                                                ? 'bg-teal-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 bg-white hover:bg-gray-100 disabled:opacity-50"
                                >
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ParticipantList;