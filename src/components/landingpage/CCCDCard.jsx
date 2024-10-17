import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { Form, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { uploadFile } from '@/lib/cloudinary';

const CCCDCard = () => {
    const [frontCCCD, setFrontCCCD] = useState(null);
    const [backCCCD, setBackCCCD] = useState(null);
    const [cccdData, setCccdData] = useState({
        id: '',
        name: '',
        dob: '',
        address: '',
        issue_date: '',
        issue_location: '',
    });
    const [isScanned, setIsScanned] = useState(false);
    const form = useForm();

    const frontCCCDInputRef = useRef(null);
    const backCCCDInputRef = useRef(null);

    const uploadToCloudinary = async (file, folder) => {
        try {
            const result = await uploadFile({
                file,
                folder,
            });
            return result.secure_url;
        } catch (error) {
            console.error('Upload failed:', error);
            throw error;
        }
    };

    const uploadCCCDAndRecognize = async (file, type) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('https://api.fpt.ai/vision/idr/vnm', {
                method: 'POST',
                headers: {
                    'api-key': 'KRosD34JKZa60M99NSynhncVZH2wELaU',
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            if (type === 'front') {
                setCccdData((prevData) => ({
                    ...prevData,
                    id: data?.data[0]?.id || '',
                    name: data?.data[0]?.name || '',
                    dob: data?.data[0]?.dob || '',
                    address: data?.data[0]?.address || '',
                }));
            } else if (type === 'back') {
                setCccdData((prevData) => ({
                    ...prevData,
                    issue_date: data?.data[0]?.issue_date || '',
                    issue_location: data?.data[0]?.issue_loc || '',
                }));
            }
        } catch (error) {
            console.error('Failed to recognize CCCD:', error);
        }
    };

    const handleScanCCCD = async () => {
        if (frontCCCD?.file) {
            await uploadCCCDAndRecognize(frontCCCD.file, 'front');
        }
        if (backCCCD?.file) {
            await uploadCCCDAndRecognize(backCCCD.file, 'back');
        }
        setIsScanned(true);
    };

    const handleFrontCCCDChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setFrontCCCD({ file, preview });
        }
    };

    const handleBackCCCDChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const preview = URL.createObjectURL(file);
            setBackCCCD({ file, preview });
        }
    };

    const removeImage = (setImage, image, inputRef, type) => {
        if (image) {
            URL.revokeObjectURL(image.preview);
            setImage(null);
            if (type === 'front') {
                setCccdData((prevData) => ({ ...prevData, id: '', name: '', dob: '', address: '' }));
            } else if (type === 'back') {
                setCccdData((prevData) => ({ ...prevData, issue_date: '', issue_location: '' }));
            }
            inputRef.current.value = '';
        }
    };

    const handleSaveImages = async () => {
        try {
            let frontCCCDUrl = '';
            let backCCCDUrl = '';

            const guaranteeId = Math.floor(Math.random() * 10000);
            const dynamicFolder = `guarantees/${guaranteeId}/cccd`;

            if (frontCCCD?.file) {
                frontCCCDUrl = await uploadToCloudinary(frontCCCD.file, `${dynamicFolder}/front`);
                console.log('Front CCCD URL:', frontCCCDUrl);
            }

            if (backCCCD?.file) {
                backCCCDUrl = await uploadToCloudinary(backCCCD.file, `${dynamicFolder}/back`);
                console.log('Back CCCD URL:', backCCCDUrl);
            }

            console.log('Save completed for guaranteeId:', guaranteeId);
        } catch (error) {
            console.error('Error saving images:', error);
        }
    };

    return (
        <Card className="mb-6">
            <CardContent className="bg-white rounded-md p-10 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <Label htmlFor="frontCCCD" className="block text-black font-semibold mb-2">
                            Mặt trước CCCD <span className="text-red-600">*</span>
                        </Label>
                        <div className="w-full h-[200px] md:w-[300px] border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                            {frontCCCD ? (
                                <div className="relative w-full h-full">
                                    <img
                                        src={frontCCCD.preview}
                                        alt="Mặt trước CCCD"
                                        className="object-cover w-full h-full rounded-md"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => removeImage(setFrontCCCD, frontCCCD, frontCCCDInputRef, 'front')}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-8 h-8 hover:bg-red-600"
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            ) : (
                                <Label htmlFor="frontCCCDUpload" className="flex flex-col items-center cursor-pointer">
                                    <Upload className="text-gray-400" />
                                    <span className="mt-2 text-gray-500">Thêm mặt trước CCCD</span>
                                </Label>
                            )}
                        </div>
                        <Input
                            type="file"
                            id="frontCCCDUpload"
                            ref={frontCCCDInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFrontCCCDChange}
                        />
                    </div>

                    <div className="w-full md:w-1/2">
                        <Label htmlFor="backCCCD" className="block text-black font-semibold mb-2">
                            Mặt sau CCCD <span className="text-red-600">*</span>
                        </Label>
                        <div className="w-full h-[200px] md:w-[300px] border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                            {backCCCD ? (
                                <div className="relative w-full h-full">
                                    <img
                                        src={backCCCD.preview}
                                        alt="Mặt sau CCCD"
                                        className="object-cover w-full h-full rounded-md"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => removeImage(setBackCCCD, backCCCD, backCCCDInputRef, 'back')}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-8 h-8 hover:bg-red-600"
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            ) : (
                                <Label htmlFor="backCCCDUpload" className="flex flex-col items-center cursor-pointer">
                                    <Upload className="text-gray-400" />
                                    <span className="mt-2 text-gray-500">Thêm mặt sau CCCD</span>
                                </Label>
                            )}
                        </div>
                        <Input
                            type="file"
                            id="backCCCDUpload"
                            ref={backCCCDInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleBackCCCDChange}
                        />
                    </div>
                </div>

                <Button onClick={handleScanCCCD} className="mt-4 bg-secondary text-white">
                    Scan CCCD
                </Button>

                <Button onClick={handleSaveImages} className="mt-4 ml-4 bg-teal-600 text-white">
                    Lưu ảnh lên Cloudinary
                </Button>

                {isScanned && (
                    <Form {...form}>
                        <form className="mt-4 space-y-4">
                            <h3 className="font-semibold">Thông tin CCCD nhận diện được:</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormItem>
                                    <FormLabel>Số CCCD</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...form.register('id')}
                                            value={cccdData.id}
                                            onChange={(e) =>
                                                setCccdData((prevData) => ({ ...prevData, id: e.target.value }))
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>

                                <FormItem>
                                    <FormLabel>Họ tên</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...form.register('name')}
                                            value={cccdData.name}
                                            onChange={(e) =>
                                                setCccdData((prevData) => ({ ...prevData, name: e.target.value }))
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>

                                <FormItem>
                                    <FormLabel>Ngày sinh</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...form.register('dob')}
                                            value={cccdData.dob}
                                            onChange={(e) =>
                                                setCccdData((prevData) => ({ ...prevData, dob: e.target.value }))
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>

                                <FormItem>
                                    <FormLabel>Địa chỉ</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...form.register('address')}
                                            value={cccdData.address}
                                            onChange={(e) =>
                                                setCccdData((prevData) => ({ ...prevData, address: e.target.value }))
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>

                                <FormItem>
                                    <FormLabel>Ngày cấp</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...form.register('issue_date')}
                                            value={cccdData.issue_date}
                                            onChange={(e) =>
                                                setCccdData((prevData) => ({ ...prevData, issue_date: e.target.value }))
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>

                                <FormItem>
                                    <FormLabel>Nơi cấp</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...form.register('issue_location')}
                                            value={cccdData.issue_location}
                                            onChange={(e) =>
                                                setCccdData((prevData) => ({
                                                    ...prevData,
                                                    issue_location: e.target.value,
                                                }))
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </div>
                        </form>
                    </Form>
                )}
            </CardContent>
        </Card>
    );
};

export default CCCDCard;
