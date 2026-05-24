
// BOOK CATEGORY
export const BookCategoryLabel: Record<string, string> = {
	VAN_HOC: 'Văn học',
	TRINH_THAM: 'Trinh thám',
	THIEU_NHI: 'Thiếu nhi',
	GIAO_DUC: 'Giáo dục',
	KINH_TE: 'Kinh tế',
	KY_NANG_SONG: 'Kỹ năng sống',
};

// MEMBER GRADE
export const MemberGradeLabel: Record<string, string> = {
	BRONZE: 'Đồng',
	SILVER: 'Bạc',
	GOLD: 'Vàng',
	DIAMOND: 'Kim cương',
};

// RULE TYPE
export const RegulationTypeLabel: Record<string, string> = {
	HUMAN: 'Nhân sự',
	SALE: 'Bán hàng',
	LOGISTIC: 'Vận hành',
	SERVICE: 'Dịch vụ',
	FINANCE: 'Tài chính',
	SAFETY: 'An toàn',
};

// VOUCHER TYPE
export const VoucherTypeLabel: Record<string, string> = {
	VND: 'Tiền mặt',
	PERCENT: 'Phần trăm',
};

// INCOME STATUS
export const IncomeStatusLabel: Record<string, string> = {
	COMPLETE: 'Hoàn thành',
	PENDING: 'Chờ xử lý',
	CANCEL: 'Đã hủy',
};

// OUTCOME STATUS
export const ImportStatusLabel: Record<string, string> = {
	COMPLETE: 'Hoàn thành',
	PENDING: 'Chờ xử lý',
	CANCEL: 'Đã hủy',
};

// VOUCHER STATUS
export const VoucherStatusLabel: Record<string, string> = {
	APPLYING: 'Đang áp dụng',
	UPCOMING: 'Sắp diễn ra',
	ENDED: 'Đã kết thúc',
};

// TOKEN TYPE
export const TokenTypeLabel: Record<string, string> = {
	RESET_PASSWORD: 'Đặt lại mật khẩu',
	ACCESS: 'Truy cập',
	REFRESH: 'Làm mới',
	VERIFY_EMAIL: 'Xác thực email',
};

// EMPLOYEE STATUS
export const EmployeeStatusLabel: Record<string, string> = {
	WORKING: 'Đang làm',
	LEAVE: 'Nghỉ phép',
	RETIRED: 'Nghỉ việc',
};

// RULE STATUS
export const RuleStatusLabel: Record<string, string> = {
	APPLYING: 'Đang áp dụng',
	UPCOMING: 'Sắp áp dụng',
	REJECT: 'Từ chối',
};

// BILL STATUS
export const BillStatusLabel: Record<string, string> = {
	COMPLETE: 'Hoàn thành',
	NOT_STARTED: 'Chưa thanh toán',
	OVERDUE: 'Quá hạn',
};

// PAYMENT TYPE
export const ReceiptPaymentTypeLabel: Record<string, string> = {
	CASH: 'Tiền mặt',
	TRANSFER: 'Chuyển khoản',
	CARD: 'Thẻ',
};
