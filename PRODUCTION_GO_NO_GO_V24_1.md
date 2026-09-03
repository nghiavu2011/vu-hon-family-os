# Go / No-Go V24.1

## GO
- Demo nội bộ.
- Beta nội tộc nhỏ sau khi `npm run build` pass.
- Thu thập dữ liệu bằng JSON patch.

## Conditional GO
- Supabase beta nếu đã chạy `SUPABASE_SCHEMA.sql` + `SECURITY_RLS_POLICIES_V24_1.sql` trên staging và test đủ role.

## NO-GO
- Public rộng.
- Lưu dữ liệu contact/trẻ nhỏ/mộ phần thật khi chưa bật RLS và Storage policy.

## Gate bắt buộc trước production thật
1. `npm ci && npm run build` pass trên CI.
2. Supabase RLS test pass cho public/family/editor/admin.
3. Storage bucket private + signed URL nếu ảnh nhạy cảm.
4. UAT 5–10 người xong, không còn lỗi critical/high.
5. Admin operations manual được người vận hành đọc và duyệt.
