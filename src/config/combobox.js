export const guaranteeType = [
    { label: 'Cá nhân', value: 0 },
    { label: 'Tổ chức', value: 1 },
];

export const campaignStatus = [
    { label: 'Đợi duyệt', value: 0 },
    { label: 'Chờ ký hợp đồng', value: 1 },
    { label: 'Đã duyệt', value: 2 },
    { label: 'Từ chối', value: 3 },
    { label: 'Hoạt động', value: 4 },
    { label: 'Đã kết thúc', value: 5 },
    { label: 'Đã hủy', value: 6 },
    { label: 'Quá hạn', value: 7 },
    { label: 'Đang giải ngân', value: 8 },
    { label: 'Đã ngưng', value: 9 },
];

export const campaignStatusUser = [
    { label: 'Đang hoạt động', value: 4 },
    { label: 'Đang giải ngân', value: 8 },
    { label: 'Quá hạn', value: 7 },
];

export const campaignTypes = [
    { label: 'Nuôi trẻ', value: 0 },
    { label: 'Khẩn cấp', value: 1 },
];

export const organizationTypes = [
    { value: 0, label: 'Tổ chức chính trị xã hội' },
    { value: 1, label: 'Tổ chức xã hội' },
    { value: 2, label: 'Tổ chức xã hội nghề nghiệp' },
    { value: 3, label: 'Tổ chức tôn giáo' },
    { value: 4, label: 'Tổ chức kinh tế, Doanh nghiệp' },
];

export const bankNames = [
    { value: 0, label: 'Vietcombank' },
    { value: 1, label: 'Techcombank' },
    { value: 2, label: 'VietinBank' },
    { value: 3, label: 'BIDV' },
    { value: 4, label: 'Agribank' },
    { value: 5, label: 'Sacombank' },
    { value: 6, label: 'MB' },
    { value: 7, label: 'ACB' },
    { value: 8, label: 'VPBank' },
    { value: 9, label: 'HDBank' },
    { value: 10, label: 'TPBank' },
    { value: 11, label: 'VIB' },
    { value: 12, label: 'SHB' },
    { value: 13, label: 'Eximbank' },
    { value: 14, label: 'OceanBank' }
];

//child profile
export const guaranteeRelation = [
    { value: 0, label: 'Cha mẹ' },
    { value: 1, label: 'Chú' },
    { value: 2, label: 'Anh/chị họ' },
    { value: 3, label: 'Chị' },
    { value: 4, label: 'Anh' },
    { value: 5, label: 'Dì' },
    { value: 6, label: 'Ông bà' },
];
//contract
export const contractStatus = [
    { label: 'Đang chờ', value: 0 },
    { label: 'Đang chờ quản trị viên', value: 1 },
    { label: 'Đã duyệt', value: 2 },
    { label: 'Từ chối bởi bảo lãnh', value: 3 },
    { label: 'Từ chối bởi quản trị viên', value: 4 },
    { label: 'Đã hủy', value: 5 },
    { label: 'Chờ tải bản cứng', value: 6 },

];
export const contractPartyType = [
    { label: 'Quản trị viên', value: 0 },
    { label: 'Bảo lãnh', value: 1 },
];

export const contractType = [
    { label: 'Đăng ký Bảo lãnh', value: 0 },
    { label: 'Chiến dịch gây quỹ', value: 1 },
];

// bank names

export const bankName = [
    { label: 'Vietcombank', value: 0 },
    { label: 'Techcombank', value: 1 },
    { label: 'VietinBank', value: 2 },
    { label: 'BIDV', value: 3 },
    { label: 'Agribank', value: 4 },
    { label: 'Sacombank', value: 5 },
    { label: 'MB', value: 6 },
    { label: 'ACB', value: 7 },
    { label: 'VPBank', value: 8 },
    { label: 'HDBank', value: 9 },
    { label: 'TPBank', value: 10 },
    { label: 'VIB', value: 11 },
    { label: 'SHB', value: 12 },
    { label: 'Eximbank', value: 13 },
    { label: 'OceanBank', value: 14 },
];

//disbursement

export const disbursementStageStatus = [
    { label: 'Đã lên lịch', value: 0 },
    { label: 'Đang tiến hành', value: 1 },
    { label: 'Đã hoàn thành', value: 2 },
    { label: 'Thất bại', value: 3 },
    { label: 'Đã hủy', value: 4 },
    { label: 'Đã thay thế', value: 5 },
];
export const disbursementRequestStatus = [
    { label: 'Đã yêu cầu', value: 0 },
    { label: 'Đã duyệt', value: 1 },
    { label: 'Từ chối', value: 2 },
    { label: 'Yêu cầu chỉnh sửa', value: 3 },
    { label: 'Yêu cầu báo cáo', value: 4 },
    { label: 'Hoàn thành', value: 5 },
];
//activity 
export const activityStatus = [
    { label: 'Đã lên lịch', value: 0 },
    { label: 'Đang tiến hành', value: 1 },
    { label: 'Đã hoàn thành', value: 2 },
    { label: 'Đã hủy', value: 3 },
];
//event-visit
export const visitStatus = [
    { label: 'Đã lên kế hoạch', value: 0 },
    { label: 'Đang mở đăng ký', value: 1 },
    { label: 'Đã đóng đăng ký', value: 2 },
    { label: 'Đang diễn ra', value: 3 },
    { label: 'Đã hoàn thành', value: 4 },
    { label: 'Đã hủy', value: 5 },
    { label: 'Đã hoãn', value: 6 },
];
export const visitRegistrationStatus = [
    { label: 'Đang chờ thanh toán', value: 0 },
    { label: 'Đã đăng ký', value: 1 },
    { label: 'Đang chờ hoàn tiền', value: 2 },
    { label: 'Hủy đăng ký', value: 3 },
    { label: 'Góp vào quỹ chung', value: 4 },

];
export const visitRegistrationStatus2 = [
    { label: 'vui lòng hủy và thanh toán lại. Lỗi đã được ghi nhận', value: 0 },
    { label: 'đã đăng ký', value: 1 },
    { label: 'đã hủy và yêu cầu hoàn tiền', value: 2 },
    { label: 'hủy đăng ký', value: 3 },
    { label: 'góp vào quỹ chung', value: 4 },

];
export const giftDeliveryMethod = [
    { label: 'Giao tận nơi', value: 0 },
    { label: 'Dịch vụ bưu chính', value: 1 },
];
export const giftStatus = [
    { label: 'Chờ xử lý', value: 0 },
    { label: 'Đang vận chuyển', value: 1 },
    { label: 'Đã nhận quà', value: 2 },
    { label: 'Đã hủy', value: 3 },
    { label: 'Đã trả lại', value: 4 },
    { label: 'Không giao được', value: 5 },
];
export const giftType = [
    { label: 'Gạo', value: 0 },
    { label: 'Mì ăn liền', value: 1 },
    { label: 'Dầu ăn', value: 2 },
    { label: 'Muối và gia vị', value: 3 },
    { label: 'Đường', value: 4 },
    { label: 'Kem đánh răng và bàn chải', value: 5 },
    { label: 'Xà phòng và dầu gội', value: 6 },
    { label: 'Khẩu trang', value: 7 },
    { label: 'Bộ sơ cứu', value: 8 },
    { label: 'Quần áo', value: 9 },
    { label: 'Chăn', value: 10 },
    { label: 'Giày dép', value: 11 },
    { label: 'Sách và vở', value: 12 },
    { label: 'Bút viết', value: 13 },
    { label: 'Cặp sách', value: 14 },
    { label: 'Đồng phục', value: 15 },
    { label: 'Sữa và thực phẩm bổ sung', value: 16 },
    { label: 'Nước đóng chai', value: 17 },
    { label: 'Thực phẩm đóng hộp', value: 18 },
    { label: 'Quạt điện', value: 19 },
    { label: 'Xe đạp', value: 20 },
    { label: 'Mùng chống muỗi', value: 21 },
    { label: 'Bếp nấu', value: 22 },
    { label: 'Máy tính bảng', value: 23 },
    { label: 'Laptop', value: 24 },
    { label: 'Router WiFi', value: 25 },
];

//fund
export const fundType = [
    { label: 'Cá nhân', value: 0 },
    { label: 'Chiến dịch', value: 1 },
];
