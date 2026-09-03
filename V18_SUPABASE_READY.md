# Vũ Hồn Family OS v18 - Supabase-ready

## Mục tiêu
Chạy được 2 chế độ: static-json và supabase.

## Static mode
```env
VITE_DATA_MODE=static
```

## Supabase mode
```env
VITE_DATA_MODE=supabase
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## File mới
- src/runtimeConfig.js
- src/services/supabaseClient.js
- src/services/staticDataService.js
- src/services/supabaseDataService.js
- src/services/familyDataService.js
- src/services/peopleService.js
- src/services/gravesService.js
- src/services/authService.js
- src/services/mappers.js
- RLS_POLICY_PLAN.md
