import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUpdateUserMutation } from '@/redux/user/userApi';

const profileSchema = z.object({
    fullname: z.string().min(1, 'Tên tài khoản là bắt buộc'),
    email: z.string().email('Email không hợp lệ'),
    dateOfBirth: z.string().optional(),
    phoneNumber: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số').optional(),
    address: z.string().min(1, 'Địa chỉ là bắt buộc'), 
    bio: z.string().min(1, 'Giới thiệu bản thân là bắt buộc'), 
});

export default function MyProfile() {
    const { user } = useSelector((state) => state.auth);
    const [avatarSrc, setAvatarSrc] = useState('https://via.placeholder.com/150');
    const [dragging, setDragging] = useState(false);
    const [updateUser, { isLoading, isError, error }] = useUpdateUserMutation();

    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullname: user?.fullname || '',
            email: user?.email || '',
            dateOfBirth: user?.dateOfBirth || '',
            address: user?.address || '',
            bio: user?.bio || '',
        },
    });

    async function onSubmit(values) {
        try {
            const updateUserProfile = {
                id: user?.userID,
                fullname: user?.fullname,
                dateOfBirth:  user?.dateOfBirth,
                address: user?.address, 
                bio: user?.bio, 
            };

            console.log('Update User Profile Payload:', updateUserProfile);

            const response = await updateUser(updateUserProfile).unwrap();
            console.log('User updated successfully:', response);
        } catch (error) {
            console.error('Failed to update user profile:', error);

            if (error.data && error.data.errors) {
                console.log('Validation Errors:', error.data.errors);
            }
        }
    }

    // Handle avatar image changes (drag/drop and file input)
    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
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
                setAvatarSrc(reader.result);
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
                        className={`relative border-4 border-dashed ${
                            dragging ? 'border-primary bg-white' : 'border-secondary bg-white'
                        } rounded-full p-4 cursor-pointer overflow-hidden flex items-center justify-center transition-all`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <Avatar className="h-40 w-40 border-4 border-white rounded-full shadow-lg">
                            <AvatarImage className="object-cover" src={user?.imageUrl} alt={user?.fullname} />
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
                                    <FormItem>
                                        <FormLabel className="text-xl">Ngày sinh</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                className="text-lg h-14 border-2 border-primary"
                                                {...field}
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
                                        <FormLabel className="text-xl">Số điện thoại</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="text-lg h-14 border-2 border-primary"
                                                placeholder="Nhập số điện thoại"
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
                        <Button
                            className="w-full md:w-[40%] h-14 mt-4 text-white text-2xl bg-gradient-to-r from-primary to-secondary"
                            type="submit"
                        >
                            Cập nhật
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
