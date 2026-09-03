# Vũ Hồn Family OS V24.1 - Production Hardening

## Mục tiêu
Khắc phục các nhóm đã chấm dưới 8 trong review V24: React architecture, data model, privacy/security, admin workflow, testing readiness và deploy readiness.

## Đã sửa P0
- `package.json` bỏ toàn bộ `^latest`, pin version cụ thể.
- Thêm `vite.config.js`.
- Sửa `App.jsx` để không gọi hook sau conditional return.
- Thêm bảng `places` vào `SUPABASE_SCHEMA.sql`.
- Thêm `EnvironmentGuard` cảnh báo cấu hình production nguy hiểm.
- Tắt demo role switcher khi `VITE_APP_ENV=production`.

## Đã sửa P1
- Header role-aware: public không thấy CMS/Beta/Launch/Governance.
- Thêm hamburger menu mobile.
- Thêm lazy loading cho nhiều ảnh nội dung.
- Thêm smoke test và CI workflow.
- Thêm RLS policy scaffold riêng: `SECURITY_RLS_POLICIES_V24_1.sql`.
- Thêm audit log schema.

## Chưa thay thế hoàn toàn được bằng code trong vòng này
- Chưa chạy UAT với người thật.
- Chưa có Supabase production thật để xác nhận RLS runtime.
- Chưa có tọa độ/ảnh bia mộ thực địa.
- Chưa chuyển toàn bộ PNG sang WebP do cần review visual regression sau chuyển đổi.

## Cách kiểm tra
```bash
npm install
npm run verify:package
npm run smoke
npm run build
npm run preview
```
