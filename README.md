# Vũ Hồn Family OS v13 - Production HTML

## Chạy trên Antigravity

```bash
npm install
npm run dev
```

## Nội dung

Bản này ghép 15 ảnh asset đã tạo sinh vào giao diện HTML/CSS/JS thật:
- Hero có nền cổng/từ đường.
- Header dùng texture gỗ sơn son.
- Logo triện Vũ.
- Module cards dùng ảnh mộ phần, cây gia phả, bản đồ họ tộc, hướng nghiệp, phòng ký ức.
- Cây gia phả full màn hình, có fit, zoom, pan, tìm kiếm, lọc chi, thu gọn/mở nhánh.
- Hồ sơ cá nhân dạng drawer.
- Có mộ phần & bản đồ, kết nối nội tộc, hướng nghiệp, tư liệu nguồn.

## Asset đã copy

{
  "hero-gate.png": "cổng_đền_cổ_trong_sương_mù.png",
  "paper-texture.png": "nền_giấy_da_cổ_điển_màu_be.png",
  "wood-banner.png": "biểu_ngữ_gỗ_đỏ_sơn_mài_cổ_điển.png",
  "seal-vu.png": "huy_hiệu_vũ_hồn_đỏ_vàng.png",
  "cloud-red-gold.png": "mây_rồng_vàng_đỏ_cổ_điển.png",
  "bamboo-corner.png": "góc_tre_thủy_mặc_sepia_thanh_nhã.png",
  "corner-frame.png": "khung_góc_hoa_văn_vàng_đỏ_cổ_điển.png",
  "avatar-default.png": "huy_hiệu_avatar_cổ_điển_á_đông.png",
  "incense-altar.png": "bàn_thờ_hương_đồng_cổ_điển.png",
  "scroll-source.png": "cuộn_thư_cổ_phong_cách_việt_nam.png",
  "feature-graves-map.png": "lăng_mộ_cổ_trên_bản_đồ_xưa.png",
  "feature-family-tree.png": "cây_gia_phả_truyền_thống_á_đông.png",
  "feature-career.png": "di_sản_tri_thức_và_những_ngả_đường_tương_lai.png",
  "feature-clan-map.png": "bản_đồ_cổ_phương_đông_với_tuyến_hành_hương.png",
  "feature-memory.png": "bàn_thờ_ký_ức_gia_truyền.png"
}

## Asset thiếu khi đóng gói

[]

## Ghi chú

- Không hiển thị CMND/CMT/CCCD trên bản public.
- Dữ liệu cá nhân thế hệ gần đây đang để privacy = family.
- Mộ phần đang là dữ liệu khung để nhập tọa độ GPS, ảnh bia, ghi chú đường đi.


## V14 bổ sung
- Công cụ mộ phần & khoảng cách.
- Trung tâm hoàn thiện dữ liệu.
- Export JSON trực tiếp.
- Chính sách riêng tư nội tộc.
- Bảng checklist MVP.
- Tài liệu DATA_POLICY.md, V14_REVIEW.md, PROMPT_ANTIGRAVITY_NEXT.md.


## V15 modular-ready

Bản v15 tách project khỏi `index.html` nguyên khối:

```text
index.html
src/
  styles.css
  app.js
assets/
data/
SUPABASE_SCHEMA.sql
IMPLEMENTATION_PLAN.md
PROMPT_ANTIGRAVITY_V16.md
```

### Chạy

```bash
npm install
npm run dev
```

### Điểm chính
- Giao diện vẫn giữ asset-based UI từ v13/v14.
- CSS và JS đã tách ra để dễ bảo trì.
- Có schema Supabase để chuẩn bị lên production.
- Có kế hoạch triển khai v16.


## V16 production architecture

Bản v16 đã chuyển dữ liệu khỏi JS nhúng trực tiếp.

### Cấu trúc mới

```text
src/app.js       # logic ứng dụng, fetch data JSON
src/styles.css   # toàn bộ giao diện
data/*.json      # dữ liệu gia phả, ngày giỗ, địa điểm, mộ phần
assets/*         # 15 ảnh asset tạo sinh
```

### Chạy đúng cách

Không mở `index.html` trực tiếp bằng browser, vì fetch JSON sẽ bị chặn ở chế độ file. Hãy chạy:

```bash
npm install
npm run dev
```

### Tài liệu mới
- `V16_ARCHITECTURE.md`
- `DATA_COLLECTION_CHECKLIST.md`
- `PROMPT_ANTIGRAVITY_V17.md`
- `src/supabase-client.example.js`


## V17 React Production

Bản v17 chuyển toàn bộ app sang React + Vite, component hóa giao diện và dùng `@xyflow/react` cho cây gia phả.

### Chạy

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

### Điểm mới

- `src/App.jsx`: điều phối app.
- `src/components/*`: component UI.
- `src/lib/data.js`: tải dữ liệu JSON.
- `src/lib/tree.js`: dựng graph cho React Flow.
- `@xyflow/react`: cây gia phả pan/zoom/minimap.
- `PROMPT_ANTIGRAVITY_V18.md`: prompt nâng tiếp lên Supabase-ready.


## V18 Supabase-ready

Bản v18 thêm service layer để chạy 2 chế độ: static-json và supabase.

```bash
npm install
npm run dev
```

File mới: `src/services/*`, `src/runtimeConfig.js`, `RLS_POLICY_PLAN.md`, `V18_SUPABASE_READY.md`, `PROMPT_ANTIGRAVITY_V19.md`.


## V19 Auth + Privacy

Bản v19 thêm:

- `AuthProvider`
- `AuthPanel`
- role selector trong static mode
- Supabase magic link scaffold trong supabase mode
- lọc hồ sơ theo quyền riêng tư
- ẩn người còn sống/trẻ nhỏ với public
- ẩn grave-sites với public
- tài liệu `V19_AUTH_PRIVACY.md`
- prompt `PROMPT_ANTIGRAVITY_V20.md`

### Role
```text
public
family_member
same_branch
contributor
editor
admin
```

### Chạy
```bash
npm install
npm run dev
```



## V20 Admin CMS

Bản v20 bổ sung CMS nhập/sửa dữ liệu.

### Có gì mới
- `src/components/AdminDashboard.jsx`
- `src/services/adminCmsService.js`
- `src/lib/adminPatch.js`
- `V20_ADMIN_CMS.md`
- `PROMPT_ANTIGRAVITY_V21.md`

### Chạy
```bash
npm install
npm run dev
```

### Test CMS trong static mode
- Đổi role sang `editor` hoặc `admin`
- Vào mục `CMS`
- Nhập dữ liệu
- Lưu để xuất JSON patch



## V21 Grave Map + QR

Bản v21 bổ sung:

- `src/components/GraveMap.jsx`
- `src/components/QrCodeBox.jsx`
- `src/components/GravePhotoUpload.jsx`
- `src/lib/graveUtils.js`
- `src/services/storageService.js`
- `V21_GRAVE_MAP_QR.md`
- `PROMPT_ANTIGRAVITY_V22.md`

### Chạy
```bash
npm install
npm run dev
```

### Test nhanh
- Đổi role sang family_member/admin để xem mộ phần.
- Vào menu "Bản đồ mộ".
- Nếu chưa có tọa độ, hệ thống báo cần nhập GPS.
- Mở QR, tải QR PNG.
- Chọn ảnh bia để preview trong static mode.



## V22 Internal Network + Career/Mentor

Bản v22 bổ sung:

- `src/components/InternalNetwork.jsx`
- `src/components/CareerMentor.jsx`
- `src/services/networkCareerService.js`
- `V22_INTERNAL_NETWORK_CAREER.md`
- `PROMPT_ANTIGRAVITY_V23.md`

### Test nhanh
- Đổi role sang family_member/admin.
- Vào mục Kết nối.
- Gửi yêu cầu kết nối để xuất JSON patch.
- Vào mục Hướng nghiệp.
- Tạo hồ sơ nghề nghiệp / mentor / thế hệ trẻ.



## V23 Internal Beta

Bản v23 bổ sung:

- `src/components/BetaDashboard.jsx`
- `src/lib/betaMetrics.js`
- `src/services/betaService.js`
- `V23_INTERNAL_BETA.md`
- `UAT_SCRIPT_V23.md`
- `RELEASE_NOTES_V23.md`
- `PROMPT_ANTIGRAVITY_V24.md`

### Test nhanh
- Mở mục Beta.
- Chạy checklist PASS/FAIL.
- Gửi bug report.
- Xuất snapshot beta.
- Cho 5–10 người trong họ test theo UAT script.


## V24 Production Launch

Bản v24 bổ sung:

- `src/components/ErrorBoundary.jsx`
- `src/components/ProductionLaunch.jsx`
- `src/services/backupService.js`
- `manifest.webmanifest`
- `robots.txt`
- `V24_PRODUCTION_LAUNCH.md`
- `PRODUCTION_DEPLOYMENT.md`
- `PRIVACY_LAUNCH_CHECKLIST.md`
- `ADMIN_OPERATIONS_MANUAL.md`
- `DATA_BACKUP_POLICY.md`
- `RELEASE_NOTES_V24.md`

### Chạy
```bash
npm install
npm run dev
```

### Build production
```bash
npm run build
npm run preview
```

### Launch
- Vào mục Launch.
- Chạy checklist.
- Xuất backup bundle.
- Kiểm tra privacy public.
- Deploy sau khi không còn lỗi critical/high.


## V24.1 Production Hardening

Bản V24.1 tập trung sửa các nhóm dưới 8 điểm trong review V24:

- Sửa `package.json` bỏ `^latest`.
- Sửa Rules of Hooks trong `App.jsx`.
- Thêm `places` table.
- Thêm `SECURITY_RLS_POLICIES_V24_1.sql`.
- Thêm `EnvironmentGuard`.
- Tắt demo role switcher ở production.
- Header role-aware, public không thấy CMS/Beta/Launch.
- Hamburger menu mobile.
- Smoke test + CI workflow.

### Kiểm tra
```bash
npm install
npm run verify:package
npm run smoke
npm run build
```
