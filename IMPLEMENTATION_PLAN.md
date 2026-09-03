# Vũ Hồn Family OS v15 - kế hoạch triển khai tiếp

## Mục tiêu v15
Tách bản demo HTML lớn thành cấu trúc dễ bảo trì:
- `index.html`
- `src/styles.css`
- `src/app.js`
- `assets/*`
- `data/*`

## Việc đã làm ở v15
- Tách CSS khỏi HTML.
- Tách JavaScript khỏi HTML.
- Giữ nguyên assets và dữ liệu.
- Thêm `SUPABASE_SCHEMA.sql`.
- Thêm prompt tiếp theo cho Antigravity.
- Thêm tài liệu migration sang production.

## Bước v16 nên làm
1. Chuyển sang Next.js hoặc React + Vite.
2. Dùng `data/people.json`, `data/events.json`, `data/grave-sites.json` để render thay vì nhúng data vào JS.
3. Tách component: Header, Hero, ModuleCards, FamilyTree, PersonDrawer, GraveTools, GovernanceCenter, PrivacyCenter, SourceNotes.
4. Thay cây HTML/CSS bằng React Flow nếu cần trải nghiệm thật mượt.
5. Kết nối Supabase: people, relationships, grave_sites, contact_profiles, career_profiles, source_evidence, family_requests.
6. Thêm đăng nhập và phân quyền: Public, Family, Same Branch, Editor, Admin.
7. Thêm consent cho dữ liệu liên hệ cá nhân.

## Ưu tiên thực địa
- Lập danh sách mộ cần đi chụp.
- Mỗi mộ cần: ảnh toàn cảnh, ảnh bia mộ, tọa độ GPS, ghi chú đường đi, người phụ trách, tình trạng cần tu sửa hay không.
