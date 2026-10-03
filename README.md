# Quản lý sinh viên - React Form Validation

Bài tập React theo mẫu: form thông tin sinh viên, bảng danh sách và tìm kiếm.

## Chức năng

- Thêm, xóa, chỉnh sửa và cập nhật sinh viên với Redux Toolkit.
- Kiểm tra các trường bắt buộc, mã sinh viên trùng, họ tên, số điện thoại và email.
- Tìm kiếm bằng `Array.filter`, hỗ trợ không dấu và không phân biệt hoa thường.
- Dùng lifecycle `componentDidUpdate` để đưa thông tin sinh viên đang chỉnh sửa vào form.
- Bố cục hai cột trên máy tính, một cột trên điện thoại.

Dữ liệu được lưu trong Redux trên bộ nhớ; tải lại trang sẽ trở về hai sinh viên mẫu.

## Chạy dự án

Yêu cầu Node.js 20.19+ hoặc 22.12+.

```sh
npm ci
npm run dev
```

Trên PowerShell, dùng `npm.cmd` nếu hệ thống chặn `npm.ps1`.

## Kiểm tra

```sh
npm test
npm run build
npm run preview
```
