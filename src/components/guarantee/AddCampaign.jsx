import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CustomCalendar } from '@/components/ui/customcalendar';

const AddCampaign = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);

    const onSubmit = () => {
    };

    return (
        <div className='py-20 relative'>
            <Card className="w-full max-w-4xl mx-auto rounded-lg border-2 border-primary">
                <CardHeader>
                    <CardTitle className="text-center">Thêm Chiến Dịch Mới</CardTitle>
                    <CardDescription>Tạo một chiến dịch gây quỹ mới</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Tiêu Đề Chiến Dịch</Label>
                            <Input id="title" {...register("title", { required: "Vui lòng nhập Tiêu Đề" })} />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Mô Tả Chiến Dịch</Label>
                            <Textarea id="description" {...register("description", { required: "Vui lòng nhập Mô tả" })} />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="targetAmount">Số Tiền Mục Tiêu (VNĐ)</Label>
                            <Input id="targetAmount" type="number" {...register("targetAmount", { required: "Vui lòng nhập Số tiền mục tiêu" })} />
                            {errors.targetAmount && <p className="text-red-500 text-sm">{errors.targetAmount.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="thumbnailUrl">Đường Dẫn Ảnh Đại Diện</Label>
                            <Input id="thumbnailUrl" {...register("thumbnailUrl", { required: "Vui lòng nhập đường dẫn ảnh đại diện" })} />
                            {errors.thumbnailUrl && <p className="text-red-500 text-sm">{errors.thumbnailUrl.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="imagesFolder">Thư Mục Chứa Ảnh</Label>
                            <Input id="imagesFolder" {...register("imagesFolder", { required: "Vui lòng nhập Thư mục chứa ảnh" })} />
                            {errors.imagesFolder && <p className="text-red-500 text-sm">{errors.imagesFolder.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Ngày Bắt Đầu</Label>
                            <CustomCalendar
                                date={startDate}
                                onDateSelect={setStartDate}
                                className=" ml-6"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Ngày Kết Thúc</Label>
                            <CustomCalendar
                                date={endDate}
                                onDateSelect={setEndDate}
                                className=" ml-6"
                            />
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmit(onSubmit)} className="w-full">Tạo Chiến Dịch</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default AddCampaign;