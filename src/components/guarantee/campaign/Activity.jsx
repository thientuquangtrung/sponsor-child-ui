import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Upload, Trash2, X, Save, ChevronUp, ChevronDown, Calendar, LoaderCircle } from 'lucide-react';
import { useCreateActivityMutation, useGetActivityByCampaignIdQuery } from '@/redux/activity/activityApi';
import { UPLOAD_FOLDER, UPLOAD_NAME, uploadFile } from '@/lib/cloudinary';
import { Input } from '@/components/ui/input';

const Activity = () => {
    const { id } = useParams();
    const [isTable, setIsTable] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activities, setActivities] = useState([]);
    const [newActivity, setNewActivity] = useState({
        description: '',
        activityDate: null,
        imageFile: null,
        cost: '',
    });
    const [createActivity] = useCreateActivityMutation();

    const [isCreating, setIsCreating] = useState(false);

    const { data: activitiesData, refetch } = useGetActivityByCampaignIdQuery(id);

    useEffect(() => {
        if (activitiesData) {
            setActivities(activitiesData);
        }
    }, [activitiesData]);

    const toggleTable = () => {
        setIsTable((prev) => !prev);
    };

    const formatCost = (value) => {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');  
    };

    const handleInputChange = (field, value) => {
        if (field === 'cost') {
            value = value.replace(/[^0-9]/g, '');  
            value = formatCost(value);  
        }
    
        setNewActivity((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    
    

    const handleDateChange = (date) => {
        console.log(date);
        setNewActivity((prev) => ({
            ...prev,
            activityDate: date,
        }));
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNewActivity((prev) => ({
                ...prev,
                imageFile: file,
            }));
        }
    };

    const handleRemoveImage = () => {
        setNewActivity((prev) => ({
            ...prev,
            imageFile: null,
        }));
    };

    const handleSubmit = async () => {
        const cleanedCost = parseInt(newActivity.cost.replace(/,/g, ''), 10) || 0;  
    
        const campaignID = uuidv4();
        const campaignActivityFolder = UPLOAD_FOLDER.getCampaignActivityFolder(campaignID);
    
        const imageUrl = await uploadFile({
            file: newActivity.imageFile,
            folder: campaignActivityFolder,
            customFilename: UPLOAD_NAME.CAMPAIGN_ACTIVITY,
        });
    
        setIsSubmitting(true);
    
        try {
            const payload = {
                campaignID: id,
                description: newActivity.description,
                activityDate: newActivity.activityDate ? format(newActivity.activityDate, 'yyyy-MM-dd') : null,
                imageFolderUrl: imageUrl.secure_url,
                cost: cleanedCost,  // Gửi số nguyên đã được xử lý
            };
    
            const response = await createActivity(payload);
    
            console.log('Response:', response);
    
            if (!response.error) {
                toast.success('Hoạt động đã được thêm thành công.');
    
                refetch();
                setNewActivity({
                    description: '',
                    activityDate: null,
                    imageFile: null,
                    cost: '',  // Reset cost
                });
                setIsCreating(false);
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
    
    

    const handleDeleteActivity = () => {
        setNewActivity({
            description: '',
            activityDate: null,
            imageFile: null,
        });
        setIsCreating(false);
    };

    return (
        <Card className="shadow-lg border-0 mb-6">
            <CardHeader className="bg-gradient-to-r from-rose-100 to-teal-100 flex flex-row justify-between items-center">
                <CardTitle className="text-lg text-gray-800">Hoạt động chiến dịch</CardTitle>
                <Button
                    variant="ghost"
                    onClick={toggleTable}
                    className="flex items-center space-x-2 text-teal-800 hover:bg-normal"
                >
                    {isTable ? (
                        <>
                            <ChevronDown className="w-5 h-5" />
                        </>
                    ) : (
                        <>
                            <ChevronUp className="w-5 h-5" />
                        </>
                    )}
                </Button>
            </CardHeader>

            <CardContent className={`px-10 py-10 ${isTable ? 'block duration-500' : 'hidden duration-500'}`}>
                <Table className="shadow-lg">
                    {activities.length > 0 && (
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                <TableHead className="py-4 text-center">Hoạt động</TableHead>
                                <TableHead className="text-center">Mô tả hoạt động</TableHead>
                                <TableHead className="text-center">Chi phí</TableHead>
                                <TableHead className="text-center">Ngày hoạt động</TableHead>
                                <TableHead className="text-center">Hình ảnh</TableHead>
                                {isCreating && <TableHead className="py-3 px-4 text-center"></TableHead>}
                            </TableRow>
                        </TableHeader>
                    )}

                    <TableBody>
                        {/* Render existing activities */}
                        {activities.length <= 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-lg py-4 italic text-gray-400">
                                    Không có hoạt động nào.
                                </TableCell>
                            </TableRow>
                        )}
                        {activities.map((activity, index) => (
                            <TableRow key={activity.id} className="hover:bg-gray-50 transition-all duration-200">
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center">
                                        <Badge className="flex items-center justify-center w-8 h-8 p-2 text-white text-md hover:bg-normal bg-teal-500 rounded-full shadow-inner">
                                            {index + 1}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 px-4">
                                    <div readOnly className="w-full h-full text-center font-medium">
                                        {activity.description}
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 px-4 text-center">
                                    {activity.cost.toLocaleString('vi-VN')} ₫
                                </TableCell>
                                <TableCell className="py-4 px-4 text-center">
                                    <div className="flex space-x-2 items-center justify-center">
                                        <Calendar className="w-6 h-6 mr-2" />
                                        {activity.activityDate
                                            ? format(new Date(activity.activityDate), 'dd/MM/yyyy')
                                            : 'Không có dữ liệu'}
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 px-4 text-center">
                                    <div className="flex justify-center">
                                        {activity.imageFolderUrl && (
                                            <img
                                                src={activity.imageFolderUrl}
                                                alt="Activity"
                                                className="w-24 h-24 object-cover"
                                            />
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}

                        {isCreating && (
                            <TableRow className="hover:bg-gray-50 transition-all duration-200">
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center">
                                        <Badge className="flex items-center justify-center w-8 h-8 p-2 text-white text-md hover:bg-normal bg-teal-500 rounded-full shadow-inner">
                                            {activities.length + 1}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 px-4">
                                    <Textarea
                                        value={newActivity.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        placeholder="Mô tả hoạt động"
                                        className="w-full h-20 border border-gray-200 rounded-lg shadow-inner focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                                    />
                                </TableCell>
                                <TableCell className="py-4 px-4 text-center">
                                    <Input
                                        type="text"
                                        value={newActivity.cost}
                                        onChange={(e) => handleInputChange('cost', e.target.value)}
                                        placeholder="Chi phí"
                                        className="w-full h-10 border border-gray-200 rounded-lg shadow-inner focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                                    />
                                </TableCell>

                                <TableCell className="py-4 px-4 text-center">
                                    <DatePicker
                                        date={newActivity.activityDate}
                                        onDateSelect={handleDateChange}
                                        className="w-[70%] border border-gray-200 rounded-lg shadow-inner focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                                    />
                                </TableCell>

                                <TableCell className="py-4 px-4">
                                    <div className="flex justify-center">
                                        <div className="relative w-40 h-40 border-dashed border-2 border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 flex justify-center items-center">
                                            <Label className="flex flex-col items-center justify-center">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                                {!newActivity.imageFile && (
                                                    <>
                                                        <Upload className="w-6 h-6 text-gray-400" />
                                                        <span className="text-sm text-gray-500 mt-2">Tải ảnh lên</span>
                                                    </>
                                                )}
                                            </Label>

                                            {newActivity.imageFile && (
                                                <div className="relative w-full h-full flex justify-center items-center">
                                                    <img
                                                        src={URL.createObjectURL(newActivity.imageFile)}
                                                        alt="Preview"
                                                        className="max-w-full max-h-full object-cover rounded-lg"
                                                    />
                                                    <button
                                                        onClick={handleRemoveImage}
                                                        className="absolute top-0 right-0 bg-white text-red-500 rounded-full p-1 shadow-lg hover:bg-red-500 hover:text-white transition-all"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell className="py-4 px-4 text-center">
                                    <button
                                        onClick={handleDeleteActivity}
                                        className="flex justify-center items-center text-red-500 rounded-full bg-rose-100 p-3"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="flex justify-end">
                    {!isCreating && (
                        <Button
                            variant="outline"
                            onClick={() => setIsCreating(true)}
                            className="mt-4 flex justify-center items-center hover:bg-normal hover:text-white text-white bg-teal-500"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tạo hoạt động
                        </Button>
                    )}
                </div>

                <div className="flex justify-end">
                    {isCreating && (
                        <Button
                            variant="solid"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="mt-4 flex justify-center items-center bg-teal-500 text-white"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSubmitting ? (
                                <LoaderCircle className="animate-spin h-5 w-5 text-teal-500" />
                            ) : (
                                'Lưu hoạt động'
                            )}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default Activity;
