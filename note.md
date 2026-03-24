# My Notes

## Chuyển hướng trong Trang web

- Trang public
    - LoginPage:
        - Kiểm tra người dùng đã đăng nhập chưa. Nếu đã đăng nhập rồi thì chặn không cho truy cập bằng cách redirect về 1 chỗ khác
- Trang nội bộ:
    - Tạo một object để khai báo route + Các quyển để truy cập
- ProtectedRoute:
    - Kiểm tra: Nếu như chưa Login thì bắn người dùng về trang Login
    - Nêu như Login rồi thì cho tràn xuống
    - Kiểm tra với role hiện tại thì: + Nếu role không đáp ứng điều kiện: Có thể cho bay về LoginPage hoặc đơn gian cho về trang dashboard (trang trung gian, chỉ cần login là vào được) + Neu role đáp ứng điều kiện thì cho truy cập vào children

## Hướng dẫn cách nối API

### 1. API docs

- Repo Backend: https://github.com/nguyenkhaan/BookStoreBE

- Chạy dự án Backend. Dự án Backend sẽ khởi động tại đường link: http://localhost:4000/api

- Api docs: http://localhost:4000/api/docs

### 2. Tạo Service

- Nối API liên quan đến phần nào thì tạo một thư mục liên quan đến API đó bên trong folder services
    - Ví dụ: `auth.service.ts`: Nối các API liên quan đến Authentication/Authorization

- Trình bày dưới dạng class

- Đường link api yêu cầu jwt-token => axios instance: `privateApi`
- Đường link api không có jwt-token => axios instance: `publicApi`

- Xem thêm file: `auth.service.ts` để biết chi tiết :))

## 3. Viết hàm nối

- Xem trong file `LoginPage.tsx`. Hàm `handleSubmit` đang gọi về hàm `login` bên trong `auth.service.ts`
- Nếu như thành công thì sẽ lấy được dữ liệu trả về từ hàm `login`
- Nếu thất bại thì sẽ đi vào catch. Lúc này:
    - Lấy HttpStatus của gói tín: `err.response.status`
    - Lấy data (body gói tin): `err.response.data`
    - Lấy message của BE: `err.response.data.message`

## 3. Rerender khi nối API

- Trước khi gọi hàm để nối API. Phải có 1 state loading được đặt thành true

- Sau khi API đã chạy xong. Set lại biến state loading thành false, để UI thực hiện rerender và cập nhật dữ liệu mới
