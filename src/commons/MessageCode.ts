export enum MessageCode {
	USER_NOT_FOUND = 'Không tìm thấy thông tin người dùng',
	USER_NOT_REGISTER = 'Bạn chưa đăng ký dịch vụ, vui lòng liên hệ quản trị hệ thống để đăng ký',
	USER_IS_DELETED = 'Tài khoản đã bị khóa',
	USER_ALREADY_EXISTED = 'Tên người dùng đã tồn tại trong hệ thống',
	USER_CREATE_ERROR = 'Không thể đăng ký ngay lúc này',
	USER_PASSWORD_WRONG = 'Tên người dùng hoặc mật khẩu không chính xác',
	USER_NOT_HAVE_PERMISSION = 'Bạn không có quyền truy cập chức năng này',
	USER_INVALID_TOKEN = 'Token không hợp lệ hoặc đã hết hạn',

	UNKNOWN_ERROR = 'Lỗi không xác định',
	SERVICE_TYPE_NOT_FOUND = "Không tìm thấy loại dịch vụ",
	LOCATION_NOT_FOUND = "Không tìm thấy thông tin địa điểm",
	SERVICE_NOT_FOUND = "Không tìm thấy dịch vụ",
	OPENING_HOURS_REQUIRED = "Thời gian mở cửa không được để trống",
	OPENING_HOURS_WRONG_FORMAT = "Thời gian mở cửa không đúng định dạng",
	SERVICE_CREATE_FAILED = "Không thể tạo dịch vụ",
}