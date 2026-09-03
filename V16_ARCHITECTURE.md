# Vũ Hồn Family OS v16 - Production Architecture

## Mục tiêu
Bản v16 chuyển từ HTML demo nguyên khối sang kiến trúc static-json sạch hơn:

```text
index.html
src/
  styles.css
  app.js
  config.js
  supabase-client.example.js
data/
  people.json
  events.json
  places.json
  grave-sites.json
assets/
SUPABASE_SCHEMA.sql
DATA_POLICY.md
DATA_COLLECTION_CHECKLIST.md
```

## Thay đổi chính
- `src/app.js` không còn nhúng dữ liệu trực tiếp.
- Dữ liệu được tải từ `/data/*.json` bằng `fetch`.
- Có thông báo loading và cảnh báo nếu người dùng mở file trực tiếp thay vì chạy Vite.
- Chuẩn bị scaffold Supabase.

## Cách chạy
```bash
npm install
npm run dev
```

## Cách kiểm tra
- Mở trang chủ.
- Vào Cây gia phả.
- Tìm "Vũ Hữu Dũng".
- Mở drawer hồ sơ.
- Thử export JSON.
- Vào Công cụ mộ phần, chọn một mộ. Vì chưa có tọa độ thật, hệ thống sẽ báo cần nhập GPS.

## Bước v17
- Chuyển sang React/Vite hoặc Next.js.
- Dùng component tree.
- Dùng @xyflow/react cho cây gia phả.
- Kết nối Supabase thật.
- Thêm auth + RLS + consent.
