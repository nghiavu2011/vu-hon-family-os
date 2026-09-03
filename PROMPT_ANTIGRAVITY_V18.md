Bạn là senior full-stack engineer. Hãy nâng Vũ Hồn Family OS v17 React lên bản v18 Supabase-ready.

Yêu cầu:
1. Giữ nguyên UI/UX và art direction.
2. Không đổi dữ liệu gia phả.
3. Tạo service layer:
   - src/services/peopleService.js
   - src/services/eventsService.js
   - src/services/gravesService.js
   - src/services/authService.js
4. Cho phép chạy 2 mode:
   - static-json mode: đọc `/data/*.json`
   - supabase mode: đọc Supabase nếu có env
5. Thêm `.env.example`:
   - VITE_DATA_MODE=static
   - VITE_SUPABASE_URL=
   - VITE_SUPABASE_ANON_KEY=
6. Chuẩn bị auth roles:
   - public
   - family
   - same_branch
   - editor
   - admin
7. Không public CMND/CMT/CCCD, số điện thoại, email, Zalo nếu chưa có consent.
8. `npm run build` phải chạy được.
