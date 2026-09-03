
# Vũ Hồn Family OS v21 - Grave Map + QR

## Mục tiêu
V21 biến module mộ phần thành công cụ dùng thực tế hơn:

- Bản đồ mộ phần.
- Marker theo tọa độ GPS.
- Danh sách mộ.
- Chi tiết mộ.
- Nút chỉ đường Google Maps.
- QR tưởng niệm cho từng mộ.
- Upload ảnh bia / ảnh toàn cảnh.
- Checklist tảo mộ.

## Chức năng đã có

### 1. Grave Map
Component:

```text
src/components/GraveMap.jsx
```

Nếu mộ có `lat/lng`, hệ thống hiển thị marker.  
Nếu chưa có tọa độ, hệ thống hiện thông báo cần nhập GPS.

### 2. QR tưởng niệm
Component:

```text
src/components/QrCodeBox.jsx
```

Dùng package:

```text
qrcode
```

Có nút tải QR PNG.

### 3. Upload ảnh mộ
Component:

```text
src/components/GravePhotoUpload.jsx
```

- Static mode: preview local, không upload thật.
- Supabase mode: upload vào bucket `family-assets`.

### 4. Checklist tảo mộ
Checklist gồm:

- ảnh toàn cảnh khu mộ
- ảnh bia đọc rõ
- tọa độ GPS
- Google Maps URL
- ghi chú đường đi
- người xác nhận
- ngày cập nhật

## File mới

```text
src/components/GraveMap.jsx
src/components/QrCodeBox.jsx
src/components/GravePhotoUpload.jsx
src/lib/graveUtils.js
src/services/storageService.js
V21_GRAVE_MAP_QR.md
PROMPT_ANTIGRAVITY_V22.md
```

## Supabase cần tạo thêm
- bucket `family-assets`
- bảng `grave_photos`

## Ghi chú riêng tư
Mộ phần không hiển thị cho public ở V19 privacy layer.  
Nếu muốn public mộ nào, cần đặt `privacy=public` và có đồng ý của gia đình.
