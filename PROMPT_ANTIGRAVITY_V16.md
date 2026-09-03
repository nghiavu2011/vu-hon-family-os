Bạn là senior product engineer, UI/UX lead và system architect. Hãy nâng cấp project Vũ Hồn Family OS v15 thành bản v16 production-ready.

Yêu cầu:
1. Giữ nguyên art direction: giấy dó, đỏ son, nâu gỗ, vàng đồng, truyền thống Việt, Hán Nôm tinh tế.
2. Không thay đổi dữ liệu gia phả nếu không có yêu cầu.
3. Chuyển dữ liệu nhúng trong JS sang đọc từ `/data/*.json`.
4. Tách app thành module/component rõ ràng: Header, Hero, Stats, LineagePreview, ModuleCards, FamilyTree, PersonDrawer, MemberSearch, GraveTools, GovernanceCenter, PrivacyCenter, SourceNotes.
5. Nếu giữ HTML/Vite: tạo `/src/data.js`, `/src/tree.js`, `/src/grave-tools.js`.
6. Nếu chuyển React: dùng React + Vite hoặc Next.js; cân nhắc @xyflow/react cho cây gia phả.
7. Bổ sung Supabase integration scaffold, nhưng không cần connect thật nếu chưa có key.
8. Bảo mật: không public CMND/CMT/CCCD; không public số điện thoại, Zalo, email khi chưa có consent; trẻ nhỏ chỉ hiển thị nội bộ.
9. `npm run dev` và `npm run build` phải chạy được.

Kết quả cần trả:
- code hoàn chỉnh
- hướng dẫn chạy
- ghi chú migration
- danh sách việc còn cần người trong họ bổ sung.
