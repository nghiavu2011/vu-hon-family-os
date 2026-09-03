# Vũ Hồn Family OS v19 - Auth + Role + Privacy

## Mục tiêu
V19 thêm lớp đăng nhập, vai trò và lọc dữ liệu riêng tư.

## Chế độ static
Khi `VITE_DATA_MODE=static`, app chưa đăng nhập thật nhưng có role selector để demo:

- Khách xem công khai
- Thành viên nội tộc
- Người cùng chi
- Người góp dữ liệu
- Biên tập dữ liệu
- Quản trị viên

## Chế độ Supabase
Khi `VITE_DATA_MODE=supabase`, app dùng:

- Supabase Auth magic link email
- Bảng `profiles`
- Role từ `profiles.role`
- Branch từ `profiles.branch`

## Quy tắc lọc
- `public`: chỉ xem hồ sơ public, không xem người còn sống/trẻ nhỏ.
- `family_member`: xem public/family.
- `same_branch`: xem thêm dữ liệu cùng chi.
- `editor`: xem dữ liệu cần biên tập.
- `admin`: xem toàn bộ.
- Grave sites không hiển thị cho public.

## File mới
```text
src/contexts/AuthContext.jsx
src/components/AuthPanel.jsx
src/lib/privacy.js
V19_AUTH_PRIVACY.md
PROMPT_ANTIGRAVITY_V20.md
```

## Việc còn lại cho V20
- Admin CMS thêm/sửa người.
- Form thêm/sửa quan hệ.
- Form duyệt request.
- Form nhập ngày giỗ và mộ phần.
