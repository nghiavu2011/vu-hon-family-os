
# Vũ Hồn Family OS v23 - Beta nội tộc

## Mục tiêu
V23 chuẩn bị cho giai đoạn beta với 5–10 người trong họ.

## Chức năng đã có

### 1. Beta Dashboard
Component:

```text
src/components/BetaDashboard.jsx
```

Hiển thị:
- số hồ sơ tổng
- số hồ sơ đang hiển thị sau privacy filter
- số hồ sơ đang ẩn
- số ngày giỗ
- số mộ phần
- số mộ có GPS
- số mộ thiếu GPS
- số dữ liệu cần kiểm

### 2. Checklist chức năng
Checklist gồm 10 hạng mục:
- Trang chủ
- Cây gia phả
- Drawer hồ sơ
- Privacy public
- Privacy family
- CMS patch
- Grave map
- QR download
- Contact request
- Mentor request

Mỗi hạng mục có trạng thái:
- PASS
- FAIL
- PENDING

Checklist được lưu localStorage ở static mode.

### 3. Feedback / Bug report
Có form:
- loại feedback
- màn hình
- mức độ
- tiêu đề
- mô tả
- người gửi
- liên hệ người gửi

Static mode: xuất JSON patch.  
Supabase mode: ghi bảng `beta_feedback`.

### 4. UAT Script
Có 10 kịch bản kiểm thử dành cho 5–10 người trong họ.

## File mới

```text
src/components/BetaDashboard.jsx
src/lib/betaMetrics.js
src/services/betaService.js
V23_INTERNAL_BETA.md
UAT_SCRIPT_V23.md
RELEASE_NOTES_V23.md
PROMPT_ANTIGRAVITY_V24.md
```

## Điều kiện trước khi lên V24
- Không còn lỗi critical.
- Public không thấy dữ liệu nhạy cảm.
- Admin CMS xuất patch/ghi Supabase ổn.
- Mộ phần không public nếu chưa có consent.
- Feedback beta được xử lý.
