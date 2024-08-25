import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';

const profileSchema = z.object({
    fullname: z.string().min(1, 'Tên tài khoản không được bỏ trống'),
    email: z.string().email('Email không hợp lệ'),
    dateOfBirth: z.string(),
    phoneNumber: z.string(),
    address: z.string(),
    bio: z.string().max(255, 'Giới thiệu bản thân tối đa 255 ký tự')
});

export default function MyProfile() {
    const [avatarSrc, setAvatarSrc] = useState('https://via.placeholder.com/150');
    const [dragging, setDragging] = useState(false);
    const form = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullname: '',
            email: '',
            dateOfBirth: '',
            phoneNumber: '',
            address: '',
            bio: ''
        },
    });

    function onSubmit(values) {
        console.log(values);
    }

    function handleAvatarChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
        setDragging(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDragging(false);
    }

    function handleDrop(event) {
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
    }

    return (
        <div className="container mx-auto px-4 md:px-16 py-12">
            <div className="flex flex-col items-center space-y-4">
                <h2 className="text-3xl font-semibold mb-8">Thông tin cá nhân</h2>
                <div className="relative flex flex-col items-center space-y-4">
                    <div
                        className={`relative border-4 border-dashed ${dragging ? 'border-primary bg-white' : 'border-secondary bg-white'} rounded-full p-4 cursor-pointer overflow-hidden flex items-center justify-center transition-all`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <Avatar className="h-40 w-40 border-4 border-white rounded-full shadow-lg">
                            <AvatarImage className="object-cover" src={avatarSrc} alt="Avatar" />
                            <AvatarFallback>AB</AvatarFallback>
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
                                            <Input className="text-lg h-14 border-2 border-primary" placeholder="Nhập tên tài khoản" {...field} />
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
                                            <Input className="text-lg h-14 border-2 border-primary" placeholder="Nhập email" {...field} />
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
                                                type="date"
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
                                        <FormLabel className="text-xl">Số điện thoại</FormLabel>
                                        <FormControl>
                                            <Input className="text-lg h-14 border-2 border-primary" placeholder="Nhập số điện thoại" {...field} />
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
                                            <Input className="text-lg h-14 border-2 border-primary" placeholder="Nhập địa chỉ" {...field} />
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
                                            <Input className="text-lg h-20 border-2 border-primary" placeholder="Tối đa 255 ký tự" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <Button className="w-full md:w-[40%] h-14 mt-4 text-white text-2xl bg-gradient-to-r from-primary to-secondary" type="submit">
                            Cập nhật
                        </Button>
        </div>
                </form>
            </Form>
        </div>
    );
}
