
# Vũ Hồn Family OS v20 - Admin CMS

## Mục tiêu
V20 bổ sung khu vực nhập/sửa dữ liệu để bắt đầu dùng thật ở mức MVP.

## Chức năng đã có
- Admin CMS chỉ mở cho role `editor` hoặc `admin`.
- Form thêm hồ sơ nhân danh.
- Form thêm quan hệ:
  - con
  - cha/mẹ
  - vợ/chồng
  - anh/chị/em
  - chưa rõ
- Form thêm ngày giỗ / sự kiện.
- Form thêm mộ phần:
  - tọa độ
  - Google Maps URL
  - ghi chú đường đi
  - văn bia
- Form góp ý / yêu cầu chỉnh sửa.
- Form duyệt request theo request id.
- Static mode: xuất JSON patch.
- Supabase mode: ghi vào database.

## Nguyên tắc bảo mật
CMS không có trường CMND/CMT/CCCD. Không đưa dữ liệu định danh cá nhân vào public web.

## Cách test static mode
1. Chạy `npm run dev`.
2. Vào khu "Đăng nhập & phân quyền".
3. Chọn role `Biên tập dữ liệu` hoặc `Quản trị viên`.
4. Mở menu `CMS`.
5. Nhập thử một hồ sơ.
6. Bấm lưu draft.
7. Trình duyệt sẽ tải file JSON patch.

## Cách dùng Supabase mode
1. Tạo Supabase project.
2. Chạy `SUPABASE_SCHEMA.sql`.
3. Điền `.env`:
```env
VITE_DATA_MODE=supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```
4. Tạo user và profile role `editor` hoặc `admin`.
5. Dùng CMS để ghi database.

## Vòng tiếp theo: V21
- Grave Map + QR.
- Upload ảnh bia mộ.
- Chỉ đường Google Maps.
- Checklist tảo mộ.
