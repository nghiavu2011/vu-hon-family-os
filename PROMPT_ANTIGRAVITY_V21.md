
Bạn là senior full-stack engineer. Hãy nâng Vũ Hồn Family OS v20 lên V21 Grave Map + QR.

Yêu cầu:
1. Giữ nguyên Auth, Privacy, Admin CMS.
2. Thêm Grave Map module:
   - danh sách mộ
   - map view bằng Leaflet hoặc Google Maps
   - marker theo tọa độ
   - click marker mở grave detail
   - nút chỉ đường Google Maps
3. Thêm QR:
   - tạo QR link tới `/person/:id` hoặc `/grave/:id`
   - xuất ảnh QR PNG hoặc SVG
4. Thêm upload ảnh bia:
   - static mode: chỉ demo bằng local preview
   - supabase mode: upload Supabase Storage
5. Thêm checklist tảo mộ:
   - ảnh toàn cảnh
   - ảnh bia
   - tọa độ
   - người xác nhận
   - ngày cập nhật
6. Không public tọa độ mộ nếu role public.
7. npm run build phải chạy được.
