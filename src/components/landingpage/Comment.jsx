import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import line from '@/assets/images/line.png';
import logo from '@/assets/images/logo-short.png';
import { Heart, MessageCircleMore, Camera, X, Check, SendHorizonal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const Comment = () => {
    const { user } = useSelector((state) => state.auth);
    const [visiblePostsCount, setVisiblePostsCount] = useState(2);
    const [posts, setPosts] = useState([
        {
            id: 1,
            title: 'Tổ chức VNO',
            content:
                'Chào mừng Nhà sáng tạo nội dung kiêm Food creator Giao Heo gia nhập Biệt đội Anh Trai Vươn Đến Tương Lai. Thêm một nhân tố bí ẩn mang đến những điều cực kỳ đặc biệt cho điểm trường Tiểu học 3 Khánh Hải.',
            avatar: `${logo}`,
            image: 'https://via.placeholder.com/400x200',
            likes: 12,
            isLiked: false,
            commentsVisible: false,
            commentInput: '',
            uploadedImage: null,
            timePosted: '3 ngày trước',
            isExpanded: false,
        },
        {
            id: 2,
            title: 'Chương trình "Ánh Sáng Tri Thức"',
            content:
                'Chúng tôi đã trao 200 bộ sách giáo khoa và dụng cụ học tập đến các em học sinh tại vùng cao Điện Biên. Cảm ơn các nhà hảo tâm đã đồng hành trong hành trình mang lại ánh sáng tri thức.',
            avatar: `${logo}`,
            image: 'https://via.placeholder.com/400x200',
            likes: 45,
            isLiked: false,
            commentsVisible: false,
            commentInput: '',
            uploadedImage: null,
            timePosted: '5 ngày trước',
            isExpanded: false,
        },
        {
            id: 3,
            title: 'Dự án "Bữa Ăn Đủ Chất"',
            content:
                'Nhờ sự đóng góp của cộng đồng, 300 trẻ em tại Hà Giang đã nhận được các bữa ăn đầy đủ dinh dưỡng trong 3 tháng qua. Hãy cùng chúng tôi tiếp tục hành trình này!',
            avatar: `${logo}`,
            image: 'https://via.placeholder.com/400x200',
            likes: 78,
            isLiked: false,
            commentsVisible: false,
            commentInput: '',
            uploadedImage: null,
            timePosted: '1 tuần trước',
            isExpanded: false,
        },
        {
            id: 4,
            title: 'Chiến dịch "Áo Ấm Cho Em"',
            content:
                'Chúng tôi đang vận động quyên góp để mua 500 áo ấm cho trẻ em tại các tỉnh miền núi phía Bắc trong mùa đông năm nay. Mỗi sự đóng góp đều mang đến hơi ấm cho các em nhỏ.',
            avatar: `${logo}`,
            image: 'https://via.placeholder.com/400x200',
            likes: 92,
            isLiked: false,
            commentsVisible: false,
            commentInput: '',
            uploadedImage: null,
            timePosted: '2 tuần trước',
            isExpanded: false,
        },
        {
            id: 5,
            title: 'Dự án "Cây Cầu Mơ Ước"',
            content:
                'Chúng tôi đã hoàn thành cây cầu treo dài 50m nối liền hai bản làng tại tỉnh Sơn La, giúp trẻ em đến trường an toàn hơn trong mùa lũ. Cảm ơn sự chung tay của các nhà hảo tâm!',
            avatar: `${logo}`,
            image: 'https://via.placeholder.com/400x200',
            likes: 135,
            isLiked: false,
            commentsVisible: false,
            commentInput: '',
            uploadedImage: null,
            timePosted: '1 tháng trước',
            isExpanded: false,
        },
    ]);

    const handleShowMore = () => {
        setVisiblePostsCount((prevCount) => prevCount + 2);
    };

    const toggleExpand = (postId) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) => (post.id === postId ? { ...post, isExpanded: !post.isExpanded } : post)),
        );
    };

    const toggleComments = (postId) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId && !post.commentsVisible ? { ...post, commentsVisible: true } : post,
            ),
        );
    };

    const handleCommentChange = (postId, value) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) => (post.id === postId ? { ...post, commentInput: value } : post)),
        );
    };

    const handleImageUpload = (postId, file) => {
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPosts((prevPosts) =>
                prevPosts.map((post) => (post.id === postId ? { ...post, uploadedImage: imageUrl } : post)),
            );
        }
    };

    const handleImageRemove = (postId) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) => (post.id === postId ? { ...post, uploadedImage: null } : post)),
        );
    };

    const handleCommentSubmit = (postId) => {
        const post = posts.find((post) => post.id === postId);
        if (!post.commentInput.trim()) {
            alert('Vui lòng nhập nội dung bình luận!');
            return;
        }
        alert(`Bình luận đã gửi: ${post.commentInput}`);
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId ? { ...post, commentInput: '', uploadedImage: null, commentsVisible: false } : post,
            ),
        );
    };

    const handleLikeToggle = (postId) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId
                    ? {
                          ...post,
                          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                          isLiked: !post.isLiked,
                      }
                    : post,
            ),
        );
    };

    return (
        <div className="min-h-screen">
            {posts.slice(0, visiblePostsCount).map((post) => (
                <div key={post.id} className="post w-full mb-4">
                    <div className="flex items-center mb-4">
                        <img src={post.avatar} alt="Avatar" className="w-12 h-12 rounded-full mr-4 border" />
                        <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                                <h2 className="font-bold text-lg">{post.title}</h2>{' '}
                                <div className="bg-[#69A6B8] p-1 rounded-full">
                                    <Check className="text-white" size={10} />
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm">3 ngày trước</p>
                        </div>
                    </div>

                    <div>
                        <p className={`text-gray-600 ${!post.isExpanded ? 'line-clamp-2' : ''}`}>
                            {!post.isExpanded && post.content.length > 100
                                ? `${post.content.slice(0, 100)}...`
                                : post.content}
                        </p>
                        {post.content.length > 100 && (
                            <button
                                className="text-blue-500 hover:underline text-sm mt-2"
                                onClick={() => toggleExpand(post.id)}
                            >
                                {post.isExpanded ? 'Thu gọn' : 'Xem thêm'}
                            </button>
                        )}
                    </div>
                    <img src={post.image} alt="Post" className="w-full h-auto rounded-lg my-4" />

                    {user.role !== 'Guest' && (
                        <div className="flex items-center justify-between">
                            <button
                                className={`flex items-center ${post.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                                onClick={() => handleLikeToggle(post.id)}
                            >
                                <Heart
                                    size={20}
                                    className={`mr-2 ${post.isLiked ? 'fill-current text-red-500' : ''}`}
                                />
                                {post.likes} lượt thích
                            </button>
                            <button className="flex items-center text-gray-500" onClick={() => toggleComments(post.id)}>
                                <MessageCircleMore size={20} className="mr-2" />
                                Bình luận
                            </button>
                        </div>
                    )}

                    {post.commentsVisible && (
                        <div className="mt-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full">
                                        D
                                    </div>
                                    <Label
                                        htmlFor={`upload-image-${post.id}`}
                                        className="cursor-pointer text-gray-500 hover:text-teal-500"
                                    >
                                        <Camera size={24} />
                                    </Label>
                                    <div className="relative flex-grow">
                                        <Input
                                            type="text"
                                            placeholder="Thêm bình luận"
                                            value={post.commentInput}
                                            onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <SendHorizonal
                                            size={20}
                                            className={`absolute top-1/2 right-3 transform -translate-y-1/2 ${
                                                post.commentInput.trim() || post.uploadedImage
                                                    ? 'text-teal-500 cursor-pointer hover:text-teal-600'
                                                    : 'text-gray-400 cursor-not-allowed'
                                            }`}
                                            onClick={() => {
                                                if (post.commentInput.trim() || post.uploadedImage) {
                                                    handleCommentSubmit(post.id);
                                                }
                                            }}
                                            disabled={!post.commentInput.trim() && !post.uploadedImage}
                                        />
                                    </div>
                                    <button
                                        className="mt-2 text-red-500 hover:underline text-sm"
                                        onClick={() =>
                                            setPosts((prevPosts) =>
                                                prevPosts.map((currentPost) =>
                                                    currentPost.id === post.id
                                                        ? { ...currentPost, commentsVisible: false }
                                                        : currentPost,
                                                ),
                                            )
                                        }
                                    >
                                        Hủy
                                    </button>

                                    <Input
                                        id={`upload-image-${post.id}`}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageUpload(post.id, e.target.files[0])}
                                    />
                                </div>
                            </div>

                            {post.uploadedImage && (
                                <div className="mt-4 relative inline-block">
                                    <img
                                        src={post.uploadedImage}
                                        alt="Uploaded"
                                        className="w-16 h-16 object-cover rounded-md border"
                                    />

                                    <button
                                        onClick={() => handleImageRemove(post.id)}
                                        className="absolute top-0 right-0 bg-teal-500 rounded-full p-1 shadow text-white hover:bg-teal-600"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    <img src={line} className="py-6" />
                </div>
            ))}
            {visiblePostsCount < posts.length && (
                <div className="text-center">
                    <Button className="mt-4 bg-teal-500 text-white hover:bg-teal-600" onClick={handleShowMore}>
                        Xem thêm
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Comment;
