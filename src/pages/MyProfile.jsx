import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUpdateUserMutation } from '@/redux/user/userApi';
import { uploadFile, UPLOAD_FOLDER, UPLOAD_NAME } from '@/lib/cloudinary';
import ButtonLoading from '@/components/ui/loading-button';
import { toast } from 'sonner';
import { UpdateUser } from '@/redux/auth/authActionCreators';
import { DatePicker } from '@/components/ui/date-picker';
import { formatDateForServer, setLocalDateWithoutTime } from '@/lib/utils';

const profileSchema = z.object({
    fullname: z.string().min(1, 'Tên tài khoản là bắt buộc'),
    email: z.string().email('Email không hợp lệ'),
    dateOfBirth: z.date().optional(),
    phoneNumber: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số').optional(),
    address: z.string().min(1, 'Địa chỉ là bắt buộc'),
    bio: z.string().min(1, 'Giới thiệu bản thân là bắt buộc'),
});

export default function MyProfile() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [avatarSrc, setAvatarSrc] = useState(user?.imageUrl || 'https://via.placeholder.com/150');
    const [newAvatarSrc, setNewAvatarSrc] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [isImgUploading, setIsImgUploading] = useState(false);
    const [updateUser, { isLoading, isError, error }] = useUpdateUserMutation();

    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullname: user?.fullname || '',
            email: user?.email || '',
            dateOfBirth: user?.dateOfBirth || '',
            address: user?.address || '',
            bio: user?.bio || '',
            phoneNumber: user?.phoneNumber || '',
        },
    });

    async function onSubmit(values) {
        try {
            const updateUserProfile = {
                id: user?.userID,
                fullname: values.fullname,
                dateOfBirth: values.dateOfBirth,
                address: values.address,
                bio: values.bio,
                phoneNumber: values.phoneNumber,
            };

            console.log('Update User Profile Payload:', updateUserProfile);

            // Check if there's a new avatar and upload it
            let newAvatarUrl;
            if (newAvatarSrc) {
                setIsImgUploading(true);

                // Upload new avatar
                const uploadResponse = await uploadFile({
                    file: newAvatarSrc,
                    folder: UPLOAD_FOLDER.getUserProfileFolder(user?.userID),
                    customFilename: UPLOAD_NAME.PROFILE_PICTURE,
                });

                newAvatarUrl = uploadResponse.secure_url;
                updateUserProfile.imageUrl = newAvatarUrl;
            }

            await updateUser(updateUserProfile)
                .unwrap()
                .then((res) => {
                    dispatch(UpdateUser({ user: { ...user, ...updateUserProfile } }));
                    console.log('User updated successfully:', updateUserProfile);
                    toast.success('Cập nhật thông tin thành công');
                })
                .catch((err) => {
                    toast.error('Cập nhật thông tin thất bại');
                    console.error('Failed to update user profile:', err);
                });
        } catch (error) {
            console.error('Failed to update user profile:', error);

            if (error.data && error.data.errors) {
                console.log('Validation Errors:', error.data.errors);
            }
        } finally {
            setIsImgUploading(false);
        }
    }

    // Handle avatar image changes (drag/drop and file input)
    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewAvatarSrc(reader.result);
                setAvatarSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);
        const file = event.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewAvatarSrc(reader.result); // Cập nhật newAvatarSrc với ảnh mới
                setAvatarSrc(reader.result); // Cập nhật avatarSrc để hiển thị ảnh mới
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container mx-auto px-4 md:px-16 py-12">
            <div className="flex flex-col items-center space-y-4">
                <h2 className="text-3xl font-semibold mb-8">Thông tin cá nhân</h2>
                <div className="relative flex flex-col items-center space-y-4">
                    <div
                        className={`relative border-4 border-dashed ${dragging ? 'border-primary bg-white' : 'border-secondary bg-white'
                            } rounded-full p-4 cursor-pointer overflow-hidden flex items-center justify-center transition-all`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <Avatar className="h-40 w-40 border-4 border-white rounded-full shadow-lg">
                            <AvatarImage className="object-cover" src={avatarSrc} alt={user?.fullname} />
                            <AvatarFallback>{user?.fullname?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                    <p className="mt-4 text-gray-500 text-center">Kéo và thả hoặc nhấp để tải ảnh lên</p>
                </div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-12">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-8">
                            <FormField
                                control={form.control}
                                name="fullname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xl">Tên tài khoản</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="text-lg h-14 border-2 border-primary"
                                                placeholder="Nhập tên tài khoản"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xl">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="text-lg h-14 border-2 border-primary"
                                                placeholder="Nhập email"
                                                {...field}
                                                disabled
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dateOfBirth"
                                render={({ field }) => (
                                    <FormItem className='flex flex-col'>
                                        <FormLabel className="text-xl">Ngày sinh</FormLabel>
                                        <FormControl>
                                            {/* <Input
                                                type="text"
                                                className="text-lg h-14 border-2 border-primary"
                                                {...field}
                                            /> */}
                                            <DatePicker
                                                date={setLocalDateWithoutTime(field.value)}
                                                onDateSelect={(date) => {
                                                    const formattedDate = formatDateForServer(date);
                                                    field.onChange(new Date(formattedDate));
                                                }}
                                                variant="outline"
                                                className="text-lg h-14 border-2 border-primary"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-8">
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xl">Số điện thoại</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="text-lg h-14 border-2 border-primary"
                                                placeholder="Nhập số điện thoại"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xl">Địa chỉ</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="text-lg h-14 border-2 border-primary"
                                                placeholder="Nhập địa chỉ"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xl">Giới thiệu bản thân</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="text-lg h-20 border-2 border-primary"
                                                placeholder="Tối đa 255 ký tự"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <ButtonLoading
                            className="w-full md:w-[40%] h-14 mt-4 text-white text-2xl bg-gradient-to-r from-primary to-secondary"
                            type="submit"
                            disabled={isLoading || isImgUploading}
                            isLoading={isLoading || isImgUploading}
                        >
                            Cập nhật
                        </ButtonLoading>
                    </div>
                </form>
            </Form>
        </div>
    );
}
