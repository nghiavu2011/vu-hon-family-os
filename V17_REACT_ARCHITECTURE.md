# Vũ Hồn Family OS v17 - React Production

## Điểm mới so với v16

- Chuyển từ HTML/JS static sang React + Vite.
- Component hóa giao diện.
- Dùng `@xyflow/react` cho cây gia phả.
- Dữ liệu vẫn đọc từ `/data/*.json`.
- Giữ nguyên 15 ảnh asset đã tạo sinh.
- Chuẩn bị kiến trúc lên Supabase ở các phase sau.

## Component chính

```text
src/
  App.jsx
  main.jsx
  styles.css
  components/
    Header.jsx
    Hero.jsx
    StatsBar.jsx
    LineagePreview.jsx
    ModuleCards.jsx
    FamilyTree.jsx
    PersonNode.jsx
    PersonDrawer.jsx
    MemberDirectory.jsx
    GraveTools.jsx
    EventList.jsx
    GovernanceCenter.jsx
    PrivacyCenter.jsx
    CareerSection.jsx
    SourceNotes.jsx
    Footer.jsx
  lib/
    data.js
    tree.js
    utils.js
```

## Chạy

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Ghi chú

- Không mở trực tiếp `index.html`.
- Bản này cần Vite dev server vì đọc JSON bằng fetch.
- Cây gia phả dùng React Flow nên trải nghiệm pan/zoom/minimap tốt hơn v16.
