Bạn là senior full-stack engineer. Hãy nâng Vũ Hồn Family OS v19 lên V20 Admin CMS.

Yêu cầu:
1. Giữ nguyên UI và privacy/auth.
2. Thêm Admin Dashboard chỉ cho role editor/admin.
3. Tạo form:
   - thêm/sửa person
   - thêm/sửa spouse/parent/child relationship
   - thêm/sửa ngày giỗ
   - thêm/sửa mộ phần
   - duyệt family_requests
4. Nếu static mode:
   - form chỉ demo và export JSON patch.
5. Nếu supabase mode:
   - ghi vào bảng Supabase:
     people, relationships, family_events, grave_sites, family_requests.
6. Mọi record mới mặc định status=draft hoặc needs_review.
7. Admin mới được chuyển verified.
8. Không cho nhập/public CMND/CMT/CCCD.
9. npm run build phải chạy được.
