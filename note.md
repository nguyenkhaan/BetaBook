Tổng kết về chuyển hướng trong Trang web 


- Trang public 
    + LoginPage:  
        + Kiểm tra người dùng đã đăng nhập chưa. Nếu đã đăng nhập rồi thì chặn không cho truy cập bằng cách redirect về 1 chỗ khác 
        
- Trang nội bộ: 
    + Tạo một object để khai báo route + Các quyển để truy cập 
- ProtectedRoute: 
    + Kiểm tra: Nếu như chưa Login thì bắn người dùng về trang Login 
    + Nêu như Login rồi thì cho tràn xuống 
    + Kiểm tra với role hiện tại thì: 
            + Nếu role không đáp ứng điều kiện: Có thể cho bay về LoginPage hoặc đơn gian cho về trang dashboard (trang trung gian, chỉ cần login là vào được) 
            + Neu role đáp ứng điều kiện thì cho truy cập vào children 