import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronUp, LoaderCircle, Plus, Trash2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateActivityMutation, useGetActivityByCampaignIdQuery } from '@/redux/activity/activityApi';
import { useParams } from 'react-router-dom';
import { DatePicker } from '@/components/ui/date-picker';
import ActivityList from './ActivityList';

const uploadToCloudinary = async (file, folder) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'sponsor_child_uploads');
    formData.append('folder', folder);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            },
        );

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};

const Activity = () => {
    const { id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activities, setActivities] = useState([]);
    const [isTableVisible, setIsTableVisible] = useState(false);
    const [isTable, setIsTable] = useState(true);
    const [createActivity] = useCreateActivityMutation();

    const toggleTable = () => {
        setIsTable((prev) => !prev);
    };

    const handleInputChange = (id, field, value) => {
        setActivities((prev) =>
            prev.map((activity) => (activity.id === id ? { ...activity, [field]: value } : activity)),
        );
    };

    const handleDateChange = (id, date) => {
        console.log(`Ngày được chọn (ID: ${id}):`, date); // Log ngày được chọn
        setActivities((prev) =>
            prev.map((activity) => (activity.id === id ? { ...activity, activityDate: date } : activity)),
        );
    };

    const handleImageUpload = (id, file) => {
        setActivities((prev) =>
            prev.map((activity) => (activity.id === id ? { ...activity, imageFile: file } : activity)),
        );
    };

    const handleRemoveImage = (id) => {
        setActivities((prev) =>
            prev.map((activity) => (activity.id === id ? { ...activity, imageFile: null } : activity)),
        );
    };

    const handleAddForm = () => {
        setIsTableVisible(true);
        const newActivity = {
            id: Date.now(),
            description: '',
            activityDate: null,
            imageFile: null,
        };
        setActivities((prev) => [...prev, newActivity]);
    };

    const handleDeleteForm = (id) => {
        setActivities((prev) => prev.filter((activity) => activity.id !== id));
        if (activities.length === 1) {
            setIsTableVisible(false);
        }
    };

    const handleSubmit = async (activityId) => {
        setIsSubmitting(true);

        const activity = activities.find((a) => a.id === activityId);

        try {
            // Upload hình ảnh lên Cloudinary
            const imageUrl = await uploadToCloudinary(activity.imageFile, 'activity-images');

            // Chuẩn bị payload
            const payload = {
                campaignID: id, // id lấy từ useParams hoặc truyền từ prop
                description: activity.description,
                activityDate: activity.activityDate ? activity.activityDate.toISOString() : null,
                imageFolderUrl: imageUrl,
            };

            console.log('Payload:', payload);

            // Gọi API
            const response = await createActivity(payload);

            if (!response.error) {
                toast.success('Hoạt động đã được thêm thành công.');
                setActivities((prev) => prev.filter((a) => a.id !== activityId)); // Xóa hoạt động đã submit khỏi danh sách
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            console.error('Error submitting activity:', error);
            toast.error('Đã xảy ra lỗi khi thêm hoạt động.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="shadow-lg border-0 mb-6">
            <CardHeader className="bg-gradient-to-r from-rose-100 to-teal-100 flex flex-row justify-between items-center">
                <CardTitle className="text-lg text-gray-800">Hoạt động chiến dịch</CardTitle>
                <Button
                    variant="ghost"
                    onClick={toggleTable}
                    className="flex items-center space-x-2 text-gray-800 hover:bg-normal"
                >
                    {isTable ? (
                        <>
                            <ChevronUp className="w-5 h-5" />
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-5 h-5" />
                        </>
                    )}
                </Button>
            </CardHeader>
            {isTable && (
                <div>
                    <ActivityList activities={activities} />
                    <div className="flex justify-end p-4">
                        <Button
                            onClick={handleAddForm}
                            className="bg-white hover:bg-normal text-teal-500 py-2 px-6 font-semibold rounded-xl flex items-center border-dashed border-2 border-teal-500"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tạo Hoạt động
                        </Button>
                    </div>
                </div>
            )}

            {isTableVisible && (
                <CardContent className="p-6">
                    <Table className="border border-gray-300">
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                <TableHead className="py-3 px-4 text-center">STT</TableHead>
                                <TableHead className="py-3 px-4 text-center">Mô tả</TableHead>
                                <TableHead className="py-3 px-4 text-center">Ngày</TableHead>
                                <TableHead className="py-3 px-4 text-center">Hình ảnh</TableHead>
                                <TableHead className="py-3 px-4 text-center">Hành động</TableHead>
                                <TableHead className="py-3 px-4 text-center"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activities.map((activity, index) => (
                                <TableRow key={activity.id} className="hover:bg-gray-50 transition-all duration-200">
                                    <TableCell className="py-4 px-4 text-center">{index + 1}</TableCell>
                                    <TableCell className="py-4 px-4">
                                        <Textarea
                                            placeholder="Mô tả hoạt động"
                                            value={activity.description}
                                            onChange={(e) =>
                                                handleInputChange(activity.id, 'description', e.target.value)
                                            }
                                            className="w-full h-20 border border-gray-200 rounded-lg shadow-inner focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                                        />
                                    </TableCell>
                                    <TableCell className="py-4 px-4">
                                        <DatePicker
                                            date={activity.activityDate}
                                            onDateSelect={(date) => handleDateChange(activity.id, date)}
                                            className="w-full border border-gray-200 rounded-lg shadow-inner focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                                        />
                                    </TableCell>
                                    <TableCell className="py-4 px-4 text-center">
                                        <div className="relative border-dashed border-2 border-gray-300 rounded-lg p-2 w-44 bg-gray-50 hover:bg-gray-100">
                                            {!activity.imageFile ? (
                                                <div className="flex flex-col items-center justify-center">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        id={`image-upload-${activity.id}`}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                        onChange={(e) =>
                                                            handleImageUpload(activity.id, e.target.files[0])
                                                        }
                                                    />
                                                    <Upload className="w-6 h-6 text-gray-400" />
                                                    <span className="text-sm text-gray-500 mt-2">Tải ảnh lên</span>
                                                </div>
                                            ) : (
                                                <div className="relative w-full h-full flex justify-center">
                                                    <img
                                                        src={URL.createObjectURL(activity.imageFile)}
                                                        alt="Uploaded"
                                                        className="max-w-full max-h-full object-cover rounded-lg"
                                                    />
                                                    <button
                                                        onClick={() => handleRemoveImage(activity.id)}
                                                        className="absolute top-0 right-0 bg-white text-red-500 rounded-full p-1 shadow-lg hover:bg-red-500 hover:text-white transition-all"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 px-4 text-center">
                                        <Button
                                            disabled={isSubmitting}
                                            onClick={() => handleSubmit(activity.id)}
                                            className="bg-teal-50 text-teal-500 py-1 font-semibold hover:bg-normal hover:text-teal-600"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <LoaderCircle className="animate-spin -ml-1 mr-3 h-5 w-5 inline" />
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                'Thêm hoạt động'
                                            )}
                                        </Button>
                                    </TableCell>
                                    <TableCell className="py-2 px-2 text-center">
                                        <Button
                                            onClick={() => handleDeleteForm(activity.id)}
                                            className="bg-red-50 text-red-500 font-semibold hover:bg-normal"
                                        >
                                            Xóa
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            )}
        </Card>
    );
};

export default Activity;
