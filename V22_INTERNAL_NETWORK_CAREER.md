
# Vũ Hồn Family OS v22 - Internal Network + Career/Mentor

## Mục tiêu
V22 biến gia phả từ “tra cứu quá khứ” thành “mạng lưới sống”:

- Kết nối nội tộc có consent.
- Hồ sơ liên hệ không public trực tiếp.
- Yêu cầu kết nối giữa người trong họ.
- Hồ sơ nghề nghiệp.
- Mentor nội tộc.
- Hồ sơ thế hệ trẻ.

## Chức năng đã có

### 1. Kết nối nội tộc
Component:

```text
src/components/InternalNetwork.jsx
```

Có:
- form gửi yêu cầu kết nối
- form hồ sơ liên hệ
- quyền hiển thị phone/social/email
- consent checkbox
- static mode export JSON patch
- supabase mode ghi `contact_profiles` và `family_requests`

### 2. Hướng nghiệp & Mentor
Component:

```text
src/components/CareerMentor.jsx
```

Có:
- hồ sơ nghề nghiệp
- kỹ năng
- ngành nghề
- công ty
- có thể mentor
- có thể nhận thực tập
- có thể review CV
- có thể giới thiệu việc
- yêu cầu mentor
- hồ sơ thế hệ trẻ

### 3. Service
```text
src/services/networkCareerService.js
```

Ghi/patch:
- `contact_profiles`
- `career_profiles`
- `young_generation_profiles`
- `family_requests`

## Nguyên tắc riêng tư
- Không public số điện thoại/Zalo/email trực tiếp.
- Contact request là mặc định.
- Người nhận đồng ý thì mới chia sẻ liên hệ.
- Trẻ nhỏ / thế hệ trẻ chỉ hiển thị nội bộ hoặc riêng tư.
- Career profile nên mặc định `family`.

## Vòng tiếp theo: V23 Beta nội tộc
- Beta checklist.
- Feedback form.
- Bug report.
- Import/export test pack.
- UAT nội tộc 5–10 người.
- Data quality dashboard.
