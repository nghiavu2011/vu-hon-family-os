# V18 RLS Policy Plan

V18 mới là Supabase-ready. V19 sẽ bật auth/role/privacy.

## Roles
- public: chỉ xem dữ liệu public.
- family_member: xem public + family.
- same_branch: xem thêm dữ liệu cùng chi.
- contributor: gửi request bổ sung.
- editor: nhập/sửa draft/needs_review.
- admin: duyệt, phân quyền, export.

## Dữ liệu mặc định cần khóa
- CMND/CMT/CCCD: không đưa vào public schema.
- SĐT/Zalo/email: chỉ trong contact_profiles, có consent.
- Trẻ nhỏ: private/family.
- Tọa độ mộ: family mặc định.
