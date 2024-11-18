import React, { useState } from 'react';
import line from '@/assets/images/line.png';
import { Camera, X, SendHorizonal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSelector } from 'react-redux';

const Comment = () => {
    const { user } = useSelector((state) => state.auth); 
    const [uploadedImage, setUploadedImage] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [comments, setComments] = useState([
        {
            id: 1,
            name: 'Nguyễn Đăng',
            text: 'Hy vọng rằng mọi sự đóng góp sẽ giúp các bé có một tương lai tốt đẹp hơn.',
            image: null,
            time: '3 ngày trước',
            replies: [
                {
                    id: 11,
                    name: 'Nguyễn Thành Trung',
                    text: 'Cảm động trước sự chung tay của cộng đồng. Hy vọng các bé sẽ sớm vượt qua khó khăn.',
                    image: null,
                    time: '2 ngày trước',
                },
            ],
        },
        {
            id: 2,
            name: 'Ngô Hoàng Minh Đăng',
            text: 'Hãy cùng nhau lan tỏa yêu thương và giúp các bé thực hiện ước mơ của mình.',
            image: null,
            time: '2 ngày trước',
            replies: [
                {
                    id: 1,
                    name: 'Nguyễn Minh Tú',
                    text: 'Thật xúc động khi thấy những hành động nhỏ mang lại thay đổi lớn lao cho các bé.',
                    image: null,
                    time: '1 ngày trước',
                },
                {
                    id: 2,
                    name: 'Nguyễn Ngân',
                    text: 'Cảm ơn chương trình đã giúp tôi có cơ hội đóng góp cho các bé. Chúc các em thật nhiều sức khỏe!',
                    image: null,
                    time: '5 phút trước',
                },
            ],
        },
        {
            id: 3,
            name: 'Nguyễn Minh Tú',
            text: 'Mong các bé sớm tìm thấy nụ cười và hạnh phúc trong cuộc sống.',
            image: null,
            time: '3 tháng trước',
            replies: [],
        },
        {
            id: 4,
            name: 'Minh Giang',
            text: 'Chúng ta có thể làm được nhiều điều kỳ diệu nếu cùng nhau chung tay giúp đỡ các bé.',
            image: null,
            time: '4 tháng trước',
            replies: [],
        },
        {
            id: 5,
            name: 'Chim Trường An',
            text: 'Những đóng góp nhỏ hôm nay sẽ là nền tảng cho tương lai các em mai sau.',
            image: 'https://via.placeholder.com/150',
            time: '5 tháng trước',
            replies: [],
        },
        {
            id: 6,
            name: 'Phạm Hữu Lộc',
            text: 'Hãy cùng trao đi yêu thương để các em nhỏ có cơ hội phát triển toàn diện.',
            image: 'https://via.placeholder.com/150',
            time: '5 tháng trước',
            replies: [],
        },
    ]);
    const [replyingCommentId, setReplyingCommentId] = useState(null);
    const [replyValue, setReplyValue] = useState('');
    const [replyImage, setReplyImage] = useState(null);
    const [visibleCount, setVisibleCount] = useState(3);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(imageUrl);
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleAddComment = () => {
        if (!['Admin', 'Guarantee', 'Donor'].includes(user?.role)) {
            return;
        }
        if (inputValue.trim() || uploadedImage) {
            const newComment = {
                id: Date.now(),
                name: user.name || 'Bạn',
                text: inputValue,
                image: uploadedImage,
                time: 'Vừa xong',
                replies: [],
            };
            setComments([newComment, ...comments]);
            setInputValue('');
            setUploadedImage(null);
        }
    };

    const handleReplyFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setReplyImage(imageUrl);
        }
    };

    const handleReplyInputChange = (e) => {
        setReplyValue(e.target.value);
    };

    const handleReplySubmit = (commentId) => {
        if (!['Admin', 'Guarantee', 'Donor'].includes(user?.role)) {
            return;
        }
        if (replyValue.trim() || replyImage) {
            const updatedComments = comments.map((comment) => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        replies: [
                            ...comment.replies,
                            {
                                id: Date.now(),
                                name: user.name || 'Bạn',
                                text: replyValue,
                                image: replyImage,
                                time: 'Vừa xong',
                            },
                        ],
                    };
                }
                return comment;
            });
            setComments(updatedComments);
            setReplyingCommentId(null);
            setReplyValue('');
            setReplyImage(null);
        }
    };

    const handleLoadMore = () => {
        setVisibleCount((prevCount) => prevCount + 3);
    };

    return (
        <div className="min-h-screen">
            <img src={line} alt="Decorative line" />
            <h2 className="text-2xl font-bold py-8">Bình luận</h2>

            {['Admin', 'Guarantee', 'Donor'].includes(user?.role) ? (
                <div className="post w-full">
                    <div className="mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full">D</div>
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
                                    onClick={handleAddComment}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            <div>
                {comments.slice(0, visibleCount).map((comment) => (
                    <div key={comment.id} className="py-4">
                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full">
                                {comment.name[0]}
                            </div>
                            <div className="flex-grow space-y-2">
                                <div className="text-md font-semibold">{comment.name}</div>
                                <div className="text-sm text-gray-800 mb-2">{comment.text}</div>
                                {comment.image && (
                                    <img
                                        src={comment.image}
                                        alt="Commented"
                                        className="w-24 h-24 object-cover rounded-md border"
                                    />
                                )}
                                <div className="flex items-center space-x-4">
                                    <div className="text-xs text-gray-500">{comment.time}</div>
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

                                {['Admin', 'Guarantee', 'Donor'].includes(user?.role) &&
                                    replyingCommentId === comment.id && (
                                        <div className="flex items-center gap-2 py-2 ml-2">
                                            <div className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full">
                                                T
                                            </div>
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
                                                    placeholder={`Trả lời ${comment.name}`}
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
                                                    onClick={() => handleReplySubmit(comment.id)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                {[...comment.replies]
                                    .sort((a, b) => {
                                        const parseTime = (timeString) => {
                                            if (timeString.includes('phút')) {
                                                return new Date().getTime() - parseInt(timeString) * 60 * 1000;
                                            } else if (timeString.includes('giờ')) {
                                                return new Date().getTime() - parseInt(timeString) * 60 * 60 * 1000;
                                            } else if (timeString.includes('ngày')) {
                                                return (
                                                    new Date().getTime() - parseInt(timeString) * 24 * 60 * 60 * 1000
                                                );
                                            } else if (timeString.includes('tháng')) {
                                                return (
                                                    new Date().getTime() -
                                                    parseInt(timeString) * 30 * 24 * 60 * 60 * 1000
                                                );
                                            } else {
                                                return new Date().getTime(); 
                                            }
                                        };

                                        return parseTime(b.time) - parseTime(a.time); 
                                    })
                                    .map((reply) => (
                                        <div key={reply.id} className="ml-2 pt-4 flex items-start gap-4">
                                            <div className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full">
                                                {reply.name[0]}
                                            </div>
                                            <div className="flex-grow space-y-2">
                                                <div className="text-sm font-semibold">{reply.name}</div>
                                                <div className="text-sm text-gray-800">{reply.text}</div>
                                                {reply.image && (
                                                    <img
                                                        src={reply.image}
                                                        alt="Reply Image"
                                                        className="w-16 h-16 object-cover rounded-md border mt-2"
                                                    />
                                                )}
                                                <div className="text-xs text-gray-500">{reply.time}</div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                ))}
                {visibleCount < comments.length && (
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
