import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSelector } from 'react-redux';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateChildProfileMutation } from '@/redux/childProfile/childProfileApi';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

const schema = z.object({
    name: z.string().min(1, "Bạn vui lòng nhập tên trẻ."),
    age: z.number().int().nonnegative("Tuổi phải là số không âm.").max(16, "Tuổi của trẻ phải nhỏ hơn 17."),
    gender: z.number().min(0).max(1),
    location: z.string().min(1, "Bạn vui lòng nhập địa chỉ trẻ."),
    imageUrl: z.any().refine((val) => val !== null, "Bạn vui lòng tải lên hình ảnh cho trẻ"),
});

const useCustomDropzone = (onDrop) => {
    return useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
        },
        multiple: false
    });
};

const CustomDropzone = ({ onDrop, children }) => {
    const { getRootProps, getInputProps } = useCustomDropzone(onDrop);

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {children}
        </div>
    );
};

const ChildProfile = ({ nextStep }) => {
    const { user } = useSelector((state) => state.auth);
    const [createChildProfile] = useCreateChildProfileMutation();
    const [image, setImage] = useState(null);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            age: 0,
            gender: 0,
            location: "",
            imageUrl: null,
        },
    });

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET_NAME);
        formData.append('folder', `user_${user.userID}/child_profiles`);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw error;
        }
    };

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        setImage(Object.assign(file, {
            preview: URL.createObjectURL(file)
        }));
        form.setValue('imageUrl', file);
        form.clearErrors('imageUrl');
    }, [form]);

    const removeImage = () => {
        URL.revokeObjectURL(image.preview);
        setImage(null);
        form.setValue('imageUrl', null);
    };

    const onSubmit = async (data) => {
        try {
            const imageUrl = await uploadToCloudinary(data.imageUrl);

            const childProfileData = {
                ...data,
                imageUrl,
                provinceID: "068a06a3-9373-4bdb-9afa-1253d05af783", // test province ID
                guaranteeRelation: 0, // test with 0
            };

            await createChildProfile(childProfileData).unwrap();
            toast.success('Hồ sơ trẻ em đã được tạo thành công!');
            nextStep();
        } catch (error) {
            console.error("Lỗi khi tạo hồ sơ trẻ em:", error);
            toast.error('Không thể tạo hồ sơ trẻ em. Vui lòng thử lại.');
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">Thông Tin Trẻ Em</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập tên trẻ" {...field} className="border-gray-300 rounded-lg" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tuổi</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        {...field}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === '') {
                                                field.onChange('');
                                            } else {
                                                const numValue = parseInt(value, 10);
                                                field.onChange(numValue >= 0 ? numValue : 0);
                                            }
                                        }}
                                        className="border-gray-300 rounded-lg"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Giới tính</FormLabel>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <Checkbox
                                            checked={field.value === 0}
                                            onCheckedChange={(checked) => checked && field.onChange(0)}
                                        />
                                        <span className="ml-2 text-sm">Nam</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Checkbox
                                            checked={field.value === 1}
                                            onCheckedChange={(checked) => checked && field.onChange(1)}
                                        />
                                        <span className="ml-2 text-sm">Nữ</span>
                                    </div>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Địa chỉ</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập địa chỉ" {...field} className="border-gray-300 rounded-lg" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={() => (
                            <FormItem>
                                <FormLabel>Hình ảnh của trẻ</FormLabel>
                                <FormControl>
                                    <CustomDropzone onDrop={onDrop}>
                                        {image ? (
                                            <div className="flex justify-center items-center w-full py-4">
                                                <div className="relative">
                                                    <img
                                                        src={image.preview}
                                                        alt="Child"
                                                        className="w-40 h-40 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeImage();
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center w-full py-4 border-2 border-dashed border-gray-300 rounded-lg">
                                                <Upload className="mx-auto mb-2 text-gray-400" />
                                                <p>Kéo và thả hình ảnh vào đây, hoặc click để chọn</p>
                                            </div>
                                        )}
                                    </CustomDropzone>
                                </FormControl>
                                <FormDescription>
                                    Tải lên một hình ảnh cho trẻ (JPEG, PNG, GIF, BMP, WebP)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full bg-[#2fabab] hover:bg-[#287176] text-white py-2 rounded-lg">
                        Tạo Hồ Sơ
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default ChildProfile;