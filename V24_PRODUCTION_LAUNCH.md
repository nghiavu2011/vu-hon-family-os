# Vũ Hồn Family OS v24 - Production Launch

## Mục tiêu
V24 là bản chuẩn bị triển khai domain thật sau V23 beta nội tộc.

## Điểm mới
- Error Boundary.
- Production Launch Dashboard.
- Launch readiness checklist.
- Backup/export bundle.
- SEO/meta cơ bản.
- PWA manifest.
- robots.txt mặc định `noindex,nofollow` để tránh public nhầm.
- Tài liệu deploy, privacy launch và admin vận hành.

## File mới
```text
src/components/ErrorBoundary.jsx
src/components/ProductionLaunch.jsx
src/services/backupService.js
manifest.webmanifest
robots.txt
V24_PRODUCTION_LAUNCH.md
PRODUCTION_DEPLOYMENT.md
PRIVACY_LAUNCH_CHECKLIST.md
ADMIN_OPERATIONS_MANUAL.md
DATA_BACKUP_POLICY.md
RELEASE_NOTES_V24.md
```

## Nguyên tắc launch
Không mở rộng public nếu chưa đạt:
1. Không còn lỗi critical/high từ V23 beta.
2. Public không thấy contact, người sống, trẻ nhỏ, mộ phần nội bộ.
3. Đã backup dữ liệu.
4. Có admin chịu trách nhiệm duyệt dữ liệu.
