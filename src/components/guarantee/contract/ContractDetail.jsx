import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Toaster, toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { contractStatus, contractPartyType, contractType } from '@/config/combobox';
import { useGetContractByIdQuery, useUpdateContractMutation } from '@/redux/contract/contractApi';
import LoadingScreen from '@/components/common/LoadingScreen';
import { CheckCircle, FileText } from 'lucide-react';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const ContractDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: contract, error, isLoading } = useGetContractByIdQuery(id);
    const [numPages, setNumPages] = useState(null);
    const [updateContract] = useUpdateContractMutation();
    const [isRejecting, setIsRejecting] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const getContractTypeString = (type) => {
        return contractType.find(t => t.value === type)?.label || 'Không xác định';
    };

    const getContractStatusString = (status) => {
        return contractStatus.find(s => s.value === status)?.label || 'Không xác định';
    };

    const getPartyTypeString = (type) => {
        return contractPartyType.find(t => t.value === type)?.label || 'Không xác định';
    };

    const handleRejectConfirm = async () => {
        setIsRejecting(true);
        try {
            const updateResponse = await updateContract({
                contractId: contract.contractID,
                contractType: contract.contractType,
                partyAType: contract.partyAType,
                partyAID: contract.partyAID,
                partyBType: contract.partyBType,
                partyBID: contract.partyBID,
                signDate: contract.signDate,
                softContractUrl: contract.softContractUrl,
                hardContractUrl: contract.hardContractUrl,
                status: 3,
                partyBSignatureUrl: contract.signatureUrl
            });

            if (updateResponse.error) {
                throw new Error('Failed to update contract');
            }

            toast.success('Hợp đồng đã bị từ chối.');
            navigate('/guarantee/contracts');
        } catch (error) {
            console.error('Error rejecting contract:', error);
            toast.error('Đã xảy ra lỗi khi từ chối hợp đồng.');
        } finally {
            setIsRejecting(false);
            setShowConfirmDialog(false);
        }
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleViewHardContract = () => {
        if (contract.hardContractUrl) {
            window.open(contract.hardContractUrl, '_blank');
        } else {
            toast.error('Không tìm thấy file hợp đồng cứng');
        }
    };

    if (isLoading) return <LoadingScreen />;
    if (error) return <div className="flex justify-center items-center h-screen">Lỗi: {error.message}</div>;
    if (!contract) return <div className="flex justify-center items-center h-screen">Không tìm thấy hợp đồng</div>;

    return (
        <div className="bg-gray-100 min-h-screen relative pb-20">
            <Toaster richColors />
            <div className="container mx-auto p-4">
                <Card className="mb-6">
                    <CardHeader className="bg-teal-600 text-white">
                        <CardTitle className="text-2xl">Chi tiết hợp đồng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableHead className="font-semibold">Loại hợp đồng</TableHead>
                                    <TableCell>{getContractTypeString(contract.contractType)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="font-semibold">Bên A</TableHead>
                                    <TableCell>{contract.partyAName} ({getPartyTypeString(contract.partyAType)})</TableCell>
                                    <TableHead className="font-semibold">Bên B</TableHead>
                                    <TableCell>{contract.partyBName} ({getPartyTypeString(contract.partyBType)})</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="font-semibold">Ngày ký</TableHead>
                                    <TableCell>
                                        {contract.signDate
                                            ? new Date(contract.signDate).toLocaleDateString('vi-VN')
                                            : "Chưa ký"
                                        }
                                    </TableCell>
                                    <TableHead className="font-semibold">Trạng thái</TableHead>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${contract.status === 2 ? 'bg-green-200 text-green-800' :
                                            contract.status === 0 || contract.status === 1 ? 'bg-yellow-200 text-yellow-800' :
                                                'bg-gray-200 text-gray-800'
                                            }`}>
                                            {getContractStatusString(contract.status)}
                                        </span>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="font-semibold">Ngày bắt đầu</TableHead>
                                    <TableCell>{new Date(contract.startDate).toLocaleDateString('vi-VN')}</TableCell>
                                    <TableHead className="font-semibold">Ngày kết thúc</TableHead>
                                    <TableCell>{new Date(contract.endDate).toLocaleDateString('vi-VN')}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {contract.status === 0 ? (
                    <div className="flex justify-end gap-4 mt-4">
                        <Button
                            onClick={() => navigate(`/guarantee/contract/contract-campaign/${contract.contractID}/${contract.campaignID}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                        >
                            Xem và ký hợp đồng
                        </Button>
                        <Button
                            onClick={() => setShowConfirmDialog(true)}
                            className="bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded-lg"
                            disabled={isRejecting}
                        >
                            {isRejecting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                'Từ chối hợp đồng'
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="flex space-x-4">
                        <Card className="w-2/3">
                            <CardHeader className="bg-teal-600 text-white">
                                <CardTitle className="text-2xl">File ảnh hợp đồng</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[800px] w-full rounded-md border p-4 bg-white">
                                    <Document
                                        file={contract.softContractUrl}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        loading={<div>Đang tải PDF...</div>}
                                        error={<div>Lỗi khi tải PDF. Vui lòng thử lại.</div>}
                                    >
                                        {Array.from(new Array(numPages), (el, index) => (
                                            <Page
                                                key={`page_${index + 1}`}
                                                pageNumber={index + 1}
                                                width={740}
                                                renderAnnotationLayer={false}
                                                renderTextLayer={false}
                                            />
                                        ))}
                                    </Document>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        {contract.status === 2 && (
                            <Card className="w-1/3">
                                <CardHeader className="bg-teal-600 text-white">
                                    <CardTitle className="text-2xl">Trạng thái hợp đồng</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6 py-4">
                                        <div className="flex items-center justify-center space-x-2 text-green-600 my-10">
                                            <CheckCircle className="h-8 w-8" />
                                            <span className="text-lg font-medium">
                                                Hợp đồng đã được ký kết thành công
                                            </span>
                                        </div>

                                        <div className="flex flex-col items-center space-y-4 my-6">
                                            <Button
                                                onClick={handleViewHardContract}
                                                className="bg-yellow-400 hover:bg-yellow-500"
                                            >
                                                <FileText className="h-4 w-4 mr-2" />
                                                Xem bản cứng hợp đồng
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận từ chối hợp đồng</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn từ chối hợp đồng này? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRejectConfirm}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Xác nhận từ chối
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ContractDetail;