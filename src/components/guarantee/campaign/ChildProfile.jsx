import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSelector } from 'react-redux';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateChildProfileMutation } from '@/redux/childProfile/childProfileApi';
import { useDropzone } from 'react-dropzone';
import { Loader, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

const schema = z.object({
    name: z.string().min(1, "Vui lòng nhập tên trẻ."),
    age: z.number().int().nonnegative("Tuổi phải là số không âm.").max(16, "Tuổi của trẻ phải nhỏ hơn 17."),
    gender: z.number().min(0).max(1),
    location: z.string().min(1, "Vui lòng nhập địa chỉ trẻ."),
    identificationInformationFile: z.any().refine((val) => val !== null, "Vui lòng tải ảnh trẻ"),
    ward: z.string().min(1, "Vui lòng nhập phường/xã"),
    district: z.string().min(1, "Vui lòng nhập quận/huyện"),
    province: z.string().min(1, "Vui lòng nhập tỉnh/thành phố"),
});

const useCustomDropzone = (onDrop) => {
    return useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
            'application/pdf': ['.pdf']
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

const ChildProfile = ({ nextStep, onSuccess }) => {
    const { user } = useSelector((state) => state.auth);
    const [createChildProfile, { isLoading: isCreatingChildProfile }] = useCreateChildProfileMutation();
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            age: 0,
            gender: 0,
            location: "",
            identificationInformationFile: null,
            ward: "",
            district: "",
            province: ""
        },
    });

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET_NAME);
        formData.append('folder', `user_${user.userID}/child_profiles`);

        try {
            setIsUploading(true);
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
        setFile(Object.assign(file, {
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        }));
        form.setValue('identificationInformationFile', file);
        form.clearErrors('identificationInformationFile');
    }, [form]);

    const removeFile = () => {
        if (file.preview) {
            URL.revokeObjectURL(file.preview);
        }
        setFile(null);
        form.setValue('identificationInformationFile', null);
    };

    const onSubmit = async (data) => {
        try {
            const fileUrl = await uploadToCloudinary(data.identificationInformationFile);

            const childProfileData = {
                name: data.name,
                age: Number(data.age),
                gender: Number(data.gender),
                location: data.location,
                identificationInformationFile: fileUrl,
                ward: data.ward,
                district: data.district,
                province: data.province
            };

            const result = await createChildProfile(childProfileData).unwrap();

            if (result) {
                toast.success('Hồ sơ trẻ em đã được tạo thành công!');
                onSuccess(result.childProfile.childID);
                nextStep();
            }
        } catch (error) {
            console.error("Lỗi khi tạo hồ sơ trẻ em:", error);
            toast.error(error.data?.message || 'Không thể tạo hồ sơ trẻ em. Vui lòng thử lại.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white p-8 shadow-md w-full max-w-6xl mx-auto rounded-lg border-2">
            <h2 className="text-2xl font-bold text-center mb-6">Thông Tin Trẻ Em</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mx-32">
                    <div className="flex space-x-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel className="text-lg">Tên</FormLabel>
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
                                <FormItem className="flex-1">
                                    <FormLabel className="text-lg">Tuổi</FormLabel>
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
                                            className="border-gray-300 rounded-lg w-1/5"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg">Địa chỉ</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nhập địa chỉ" {...field} className="border-gray-300 rounded-lg" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="ward"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg">Phường/Xã</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập phường/xã" {...field} className="border-gray-300 rounded-lg" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="district"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg">Quận/Huyện</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập quận/huyện" {...field} className="border-gray-300 rounded-lg" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="province"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg">Tỉnh/Thành phố</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập tỉnh/thành phố" {...field} className="border-gray-300 rounded-lg" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="identificationInformationFile"
                        render={() => (
                            <FormItem>
                                <FormLabel className="text-lg">Ảnh trẻ</FormLabel>
                                <FormControl>
                                    <CustomDropzone onDrop={onDrop}>
                                        {file ? (
                                            <div className="flex justify-center items-center w-full py-4">
                                                <div className="relative">
                                                    {file.type.startsWith('image/') ? (
                                                        <img
                                                            src={file.preview}
                                                            alt="ID Document"
                                                            className="w-40 h-40 object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <div className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded-lg">
                                                            <p className="text-gray-500">File: {file.name}</p>
                                                        </div>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeFile();
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
                                                <p>Kéo và thả file vào đây, hoặc click để chọn</p>
                                            </div>
                                        )}
                                    </CustomDropzone>
                                </FormControl>
                                <FormDescription>
                                    Tải lên ảnh của trẻ (JPEG, PNG, PDF)
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-center">
                        <Button
                            type="submit"
                            className={`w-1/2 ${(isUploading || isCreatingChildProfile) ? 'bg-gray-400' : 'bg-[#2fabab]'} hover:bg-[#287176] text-white py-2 rounded-lg`}
                            disabled={isUploading || isCreatingChildProfile}
                        >
                            {(isUploading || isCreatingChildProfile) ? (
                                <div className="flex items-center gap-2">
                                    <Loader className="animate-spin" size={18} />
                                    {isUploading ? 'Đang Tạo...' : 'Đang Tạo Hồ Sơ...'}
                                </div>
                            ) : (
                                'Tạo Hồ Sơ'
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ChildProfile;