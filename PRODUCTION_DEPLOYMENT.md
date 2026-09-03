# Production Deployment Guide

## 1. Chuẩn bị
```bash
npm install
npm run build
npm run preview
```

## 2. Deploy đề xuất
- Frontend: Vercel / Netlify / Cloudflare Pages.
- Database/Auth/Storage: Supabase.
- Domain: chỉ trỏ sau privacy review.

## 3. Environment
```env
VITE_DATA_MODE=static
# hoặc
VITE_DATA_MODE=supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## 4. Checklist trước deploy
- Chạy V23 UAT.
- Chạy V24 launch checklist.
- Export backup bundle.
- Kiểm tra role public.
- Kiểm tra mobile.
- Kiểm tra CMS.

## 5. Sau deploy
- Không bật index search engine ngay.
- Chạy test lại trên domain thật.
- Mời nhóm nhỏ vào test lần cuối.
