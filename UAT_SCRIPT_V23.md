
# UAT Script V23 - Beta nội tộc

## Nhóm test đề xuất
5–10 người:
- 1 người cao tuổi / am hiểu gia phả
- 1 đại diện chi Vũ Thành
- 1 người trẻ dùng mobile
- 1 người thử nhập liệu
- 1 admin duyệt dữ liệu
- 1 người đi thực địa mộ phần

## 10 kịch bản test

1. Mở trang ở mobile và desktop.
2. Xem trang chủ, kiểm tra slogan, module, bố cục.
3. Tìm “Vũ Thành”, mở hồ sơ, kiểm tra quan hệ.
4. Tìm “Vũ Hữu Dũng”, kiểm tra cha/mẹ/vợ/con.
5. Chuyển role public, kiểm tra dữ liệu nhạy cảm bị ẩn.
6. Chuyển role family_member/admin, kiểm tra dữ liệu nội bộ hiện lại.
7. Editor nhập thử một người mới bằng CMS, xuất JSON patch.
8. Thêm thử một ngày giỗ, xuất JSON patch.
9. Mở Grave Map, kiểm tra danh sách mộ, QR, upload ảnh preview.
10. Gửi contact request hoặc mentorship request, kiểm tra JSON patch.

## Tiêu chí pass
- Không lỗi trắng trang.
- Không lộ contact người sống.
- Không lộ mộ phần ở public.
- Search và drawer dùng được.
- JSON patch tải được.
- UI mobile không vỡ nghiêm trọng.
