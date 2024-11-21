import React, { useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import line from '@/assets/images/line.png';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import imageCompression from 'browser-image-compression';
import { Camera, X, SendHorizonal, LoaderCircle } from 'lucide-react';
import { useGetCommentByCampaignIdQuery, useCreateCommentMutation } from '@/redux/comment/commentApi';

const Comment = () => {
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);
    const [createComment] = useCreateCommentMutation();
    const [inputValue, setInputValue] = useState('');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [replyingCommentId, setReplyingCommentId] = useState(null);
    const [replyValue, setReplyValue] = useState('');
    const [replyImage, setReplyImage] = useState(null);
    const [visibleCount, setVisibleCount] = useState(3);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReplySubmitting, setIsReplySubmitting] = useState(null);
    const { data: comments = [], isLoading, refetch } = useGetCommentByCampaignIdQuery(id);

    const sortedComments = [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Dung lượng ảnh không được vượt quá 5MB');
                return;
            }
            try {
                const compressedFile = await compressImage(file);
                const imageUrl = URL.createObjectURL(compressedFile);
                setUploadedImage(imageUrl);
            } catch (error) {
                console.error('Lỗi nén ảnh:', error);
                toast.error('Nén ảnh thất bại!');
            }
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleAddComment = async () => {
        if (!['Admin', 'Guarantee', 'Donor'].includes(user?.role)) {
            return;
        }
        if (inputValue.trim() || uploadedImage) {
            setIsSubmitting(true);
            try {
                const payload = {
                    campaignID: id,
                    userID: user.userID,
                    content: inputValue.trim() || '',
                    imageUrl: uploadedImage ? await convertToBase64(uploadedImage) : null,
                };
                await createComment(payload).unwrap();
                toast.success('Thêm bình luận thành công!');
                setInputValue('');
                setUploadedImage(null);
                refetch();
            } catch (error) {
                console.error('Failed to add comment:', error);
                toast.error('Thêm bình luận thất bại!');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // Convert file to Base64
    const convertToBase64 = (fileUrl) => {
        return new Promise((resolve, reject) => {
            fetch(fileUrl)
                .then((res) => res.blob())
                .then((blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
        });
    };

    const handleReplyFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Dung lượng ảnh không được vượt quá 5MB');
                return;
            }
            try {
                const compressedFile = await compressImage(file);
                const imageUrl = URL.createObjectURL(compressedFile);
                setReplyImage(imageUrl);
            } catch (error) {
                console.error('Lỗi nén ảnh:', error);
                toast.error('Nén ảnh thất bại!');
            }
        }
    };

    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
        };
        return await imageCompression(file, options);
    };

    const handleReplyInputChange = (e) => {
        setReplyValue(e.target.value);
    };

    const handleReplySubmit = async (commentId) => {
        if (!['Admin', 'Guarantee', 'Donor'].includes(user?.role)) {
            return;
        }
        if (replyValue.trim() || replyImage) {
            setIsReplySubmitting(commentId);
            try {
                const payload = {
                    userID: user.userID,
                    parentCommentID: commentId,
                    content: replyValue.trim() || '',
                    imageUrl: replyImage ? await convertToBase64(replyImage) : null,
                };
                const newReply = await createComment(payload).unwrap();

                const updatedComments = comments.map((comment) =>
                    comment.id === commentId
                        ? {
                              ...comment,
                              replies: [...comment.replies, newReply],
                          }
                        : comment,
                );

                setReplyingCommentId(null);
                setReplyValue('');
                setReplyImage(null);
                refetch();
            } catch (error) {
                console.error('Failed to reply to comment:', error);
                toast.error('Trả lời bình luận thất bại!');
            } finally {
                setIsReplySubmitting(null);
            }
        }
    };

    const handleLoadMore = () => {
        setVisibleCount((prevCount) => prevCount + 3);
    };

    if (isLoading) {
        return <p>Đang tải bình luận...</p>;
    }

    return (
        <div className="min-h-[200px] mt-8">
            <img src={line} alt="Decorative line" />
            <h2 className="text-2xl font-bold py-8">Bình luận</h2>

            {['Admin', 'Guarantee', 'Donor'].includes(user?.role) ? (
                <div className="post w-full">
                    <div className="mb-4">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-14 w-14">
                                <AvatarImage src={user?.imageUrl} alt={user?.fullname} />
                                <AvatarFallback>{user?.fullname?.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <Label className="cursor-pointer text-gray-500 hover:text-teal-500">
                                <Camera size={24} />
                                <Input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </Label>
                            <div className="relative flex-grow">
                                <Input
                                    type="text"
                                    placeholder="Thêm bình luận"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                />
                                <SendHorizonal
                                    size={20}
                                    className={`absolute top-1/2 right-3 transform -translate-y-1/2 ${
                                        inputValue.trim() || uploadedImage
                                            ? 'text-teal-500 cursor-pointer'
                                            : 'text-gray-300'
                                    }`}
                                    style={{
                                        pointerEvents: inputValue.trim() || uploadedImage ? 'auto' : 'none',
                                    }}
                                    onClick={!isSubmitting ? handleAddComment : null}
                                >
                                    {isSubmitting ? (
                                        <LoaderCircle className="animate-spin h-5 w-5 text-teal-500" />
                                    ) : null}
                                </SendHorizonal>
                            </div>
                        </div>
                    </div>
                    {uploadedImage && (
                        <div className="relative w-24 h-24">
                            <img
                                src={uploadedImage}
                                alt="Uploaded"
                                className="object-cover w-full h-full rounded-lg border shadow-lg hover:scale-105 transition-transform duration-300"
                            />
                            <button
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                onClick={() => setUploadedImage(null)}
                            >
                                <X size={12} />
                            </button>
                        </div>
                    )}
                </div>
            ) : null}

            <div>
                {sortedComments.slice(0, visibleCount).map((comment) => (
                    <div key={comment.id} className="py-4">
                        <div className="flex items-start space-x-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={comment.userImageUrl} alt={comment?.userFullname} />
                                <AvatarFallback>{comment?.userFullname?.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow space-y-2">
                                <div className="text-md font-semibold">
                                    {comment.userFullname === user.fullname ? 'Bạn' : comment.userFullname}
                                </div>
                                <div className="text-sm text-gray-800 mb-2">{comment.content}</div>
                                {comment.imageUrl && (
                                    <img
                                        src={comment.imageUrl}
                                        alt="Commented"
                                        className="w-24 h-24 object-cover rounded-md border"
                                    />
                                )}
                                <div className="flex items-center space-x-4">
                                    <div className="text-xs text-gray-500">
                                        {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                                    </div>
                                    {['Admin', 'Guarantee', 'Donor'].includes(user?.role) && (
                                        <button
                                            className="text-sm text-teal-500"
                                            onClick={() =>
                                                setReplyingCommentId(
                                                    replyingCommentId === comment.id ? null : comment.id,
                                                )
                                            }
                                        >
                                            Trả lời
                                        </button>
                                    )}
                                </div>

                                {replyingCommentId === comment.id && (
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex items-center gap-2 py-2">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user?.imageUrl} alt={user?.fullname} />
                                                <AvatarFallback>
                                                    {user?.fullname?.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <Label className="cursor-pointer text-gray-500 hover:text-teal-500">
                                                <Camera size={24} />
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleReplyFileChange}
                                                />
                                            </Label>
                                            <div className="relative flex-grow">
                                                <Input
                                                    type="text"
                                                    placeholder={`Trả lời ${comment.userFullname}`}
                                                    className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                    value={replyValue}
                                                    onChange={handleReplyInputChange}
                                                />
                                                <SendHorizonal
                                                    size={20}
                                                    className={`absolute top-1/2 right-3 transform -translate-y-1/2 ${
                                                        replyValue.trim() || replyImage
                                                            ? 'text-teal-500 cursor-pointer'
                                                            : 'text-gray-300'
                                                    }`}
                                                    style={{
                                                        pointerEvents:
                                                            replyValue.trim() || replyImage ? 'auto' : 'none',
                                                    }}
                                                    onClick={
                                                        !isReplySubmitting ? () => handleReplySubmit(comment.id) : null
                                                    }
                                                >
                                                    {isReplySubmitting === comment.id ? (
                                                        <LoaderCircle className="animate-spin h-5 w-5 text-teal-500" />
                                                    ) : null}
                                                </SendHorizonal>
                                            </div>
                                        </div>
                                        {replyImage && (
                                            <div className="relative mt-4 w-24 h-24">
                                                <img
                                                    src={replyImage}
                                                    alt="Reply Image"
                                                    className="object-cover w-full h-full rounded-lg border shadow-lg hover:scale-105 transition-transform duration-300"
                                                />
                                                <button
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    onClick={() => setReplyImage(null)}
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {comment.replies
                                    .slice()
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                    .map((reply) => (
                                        <div key={reply.id} className="ml-2 pt-4 flex items-start gap-4">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={reply.userImageUrl} alt={reply?.userFullname} />
                                                <AvatarFallback>
                                                    {reply?.userFullname?.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-grow space-y-2">
                                                <div className="text-md font-semibold">
                                                    {reply.userFullname === user.fullname ? 'Bạn' : reply.userFullname}
                                                </div>
                                                <div className="text-sm text-gray-800">{reply.content}</div>
                                                {reply.imageUrl && (
                                                    <img
                                                        src={reply.imageUrl}
                                                        alt="Reply Image"
                                                        className="w-24 h-24 object-cover rounded-md border mt-2"
                                                    />
                                                )}
                                                <div className="text-xs text-gray-500">
                                                    {format(new Date(reply.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                ))}
                {visibleCount < sortedComments.length && (
                    <button
                        onClick={handleLoadMore}
                        className="w-full py-2 text-center text-teal-500 border border-teal-500 rounded-md mt-4"
                    >
                        Xem thêm
                    </button>
                )}
            </div>
        </div>
    );
};

export default Comment;
