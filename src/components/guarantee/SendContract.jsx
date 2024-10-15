import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Send } from 'lucide-react';

const SendContract = () => {
    const [file, setFile] = useState(null);
    const [isSending, setIsSending] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            alert('Vui lòng chọn file PDF');
            e.target.value = null;
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Vui lòng tải lên file PDF trước khi gửi');
            return;
        }
        setIsSending(true);

        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSending(false);
        alert('Hợp đồng đã được gửi thành công!');
    };

    return (
        <div className="container mx-auto p-4 font-sans max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Gửi Hợp Đồng</h2>
            <form onSubmit={handleSend} className="space-y-6 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div>
                    <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                        Tải lên hợp đồng (PDF)
                    </label>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Nhấp để tải lên</span> hoặc kéo và thả</p>
                                <p className="text-xs text-gray-500">PDF (Tối đa 10MB)</p>
                            </div>
                            <Input
                                type="file"
                                id="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                required
                                className="hidden"
                            />
                        </label>
                    </div>
                    {file && (
                        <p className="mt-2 text-sm text-gray-600">
                            Đã chọn: {file.name}
                        </p>
                    )}
                </div>
                <div className="flex justify-center">

                    <Button
                        type="submit"
                        disabled={isSending || !file}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        <Send className="mr-2 h-4 w-4" />
                        {isSending ? 'Đang gửi...' : 'Gửi hợp đồng'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default SendContract;