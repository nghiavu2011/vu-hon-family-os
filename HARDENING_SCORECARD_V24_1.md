# Hardening Scorecard V24.1

| Nhóm dưới 8 ở V24 | Điểm cũ | Hành động V24.1 | Ước tính sau sửa |
|---|---:|---|---:|
| React architecture | 6.5 | Fix Rules of Hooks, environment guard, role-aware render | 7.8 |
| Data model | 6.5 | Add places table, audit log, RLS scaffold | 7.6 |
| Privacy design | 7.0 | Hide admin modules/nav from public, disable demo role in prod | 8.0 |
| Security production | 4.0 | RLS SQL scaffold, production guard, audit log schema | 6.8 |
| Admin workflow | 6.0 | Safer public/admin separation, smoke tests; edit/diff vẫn còn backlog | 7.0 |
| Testing readiness | 6.5 | Smoke test + CI workflow + package verifier | 7.8 |
| Deploy readiness | 4.0 | Pinned deps, vite config, CI scaffold, build scripts | 7.2 |

## Kết luận
V24.1 đủ điều kiện hơn cho beta nội bộ có kiểm soát. Vẫn chưa nên public rộng nếu chưa chạy Supabase RLS thật và UAT thật.
