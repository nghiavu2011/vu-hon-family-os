
import { hasCoordinates } from './graveUtils.js';

export function getBetaMetrics({ people = [], visiblePeople = [], graves = [], events = [] }) {
  const totalPeople = people.length;
  const visibleCount = visiblePeople.length;
  const hiddenCount = Math.max(0, totalPeople - visibleCount);
  const gravesWithGps = graves.filter(hasCoordinates).length;
  const gravesMissingGps = Math.max(0, graves.length - gravesWithGps);
  const highConfidence = people.filter((person) => person.confidence === 'high').length;
  const needsReview = people.filter((person) => person.confidence !== 'high').length;
  const familyOnly = people.filter((person) => person.privacy === 'family').length;

  return {
    totalPeople,
    visibleCount,
    hiddenCount,
    eventsCount: events.length,
    gravesCount: graves.length,
    gravesWithGps,
    gravesMissingGps,
    highConfidence,
    needsReview,
    familyOnly,
  };
}

export const BETA_CHECKLIST = [
  {
    id: 'home-load',
    title: 'Trang chủ tải được',
    detail: 'Header, hero, thống kê, module chính hiển thị đúng.',
    group: 'Giao diện',
  },
  {
    id: 'tree-search',
    title: 'Cây gia phả tìm kiếm được',
    detail: 'Tìm thử Vũ Thành, Vũ Hữu Dũng, Vũ Trọng Nghĩa.',
    group: 'Gia phả',
  },
  {
    id: 'drawer-profile',
    title: 'Drawer hồ sơ mở đúng',
    detail: 'Click node hoặc card thành viên, kiểm tra cha/mẹ/vợ/chồng/con.',
    group: 'Gia phả',
  },
  {
    id: 'privacy-public',
    title: 'Public bị ẩn dữ liệu nhạy cảm',
    detail: 'Role public không thấy người còn sống/trẻ nhỏ/mộ phần.',
    group: 'Bảo mật',
  },
  {
    id: 'privacy-family',
    title: 'Family member xem nội bộ',
    detail: 'Role family_member thấy thêm dữ liệu family.',
    group: 'Bảo mật',
  },
  {
    id: 'cms-patch',
    title: 'CMS xuất JSON patch',
    detail: 'Role editor/admin nhập thử người mới và tải patch.',
    group: 'CMS',
  },
  {
    id: 'grave-map',
    title: 'Bản đồ mộ phần hoạt động',
    detail: 'Hiển thị danh sách mộ, báo thiếu GPS hoặc marker nếu có tọa độ.',
    group: 'Mộ phần',
  },
  {
    id: 'qr-download',
    title: 'QR tải được',
    detail: 'Mở chi tiết mộ, tạo và tải QR PNG.',
    group: 'Mộ phần',
  },
  {
    id: 'contact-request',
    title: 'Gửi yêu cầu kết nối',
    detail: 'Tạo contact request ở static mode và xuất patch.',
    group: 'Kết nối',
  },
  {
    id: 'mentor-request',
    title: 'Gửi yêu cầu mentor',
    detail: 'Tạo mentorship request và hồ sơ thế hệ trẻ.',
    group: 'Hướng nghiệp',
  },
];

export const UAT_SCENARIOS = [
  'Khách public mở trang và chỉ xem phần công khai.',
  'Thành viên nội tộc đăng nhập/đổi role và xem được dữ liệu family.',
  'Tìm một người theo tên và mở hồ sơ chi tiết.',
  'Kiểm tra quan hệ cha/mẹ/vợ/chồng/con trong drawer.',
  'Editor thêm một nhân danh mới bằng CMS và xuất JSON patch.',
  'Editor thêm ngày giỗ âm lịch và kiểm tra patch.',
  'Người đi thực địa nhập tọa độ mộ phần và kiểm tra bản đồ.',
  'Tải QR tưởng niệm cho một mộ phần.',
  'Gửi yêu cầu kết nối nội tộc mà không lộ SĐT/Zalo/email trực tiếp.',
  'Tạo yêu cầu mentor cho thế hệ trẻ và ghi nhận phản hồi.',
];

export function loadChecklistState() {
  try {
    return JSON.parse(localStorage.getItem('vu_hon_beta_checklist') || '{}');
  } catch {
    return {};
  }
}

export function saveChecklistState(state) {
  localStorage.setItem('vu_hon_beta_checklist', JSON.stringify(state));
}

export function summarizeChecklist(state) {
  const total = BETA_CHECKLIST.length;
  const pass = BETA_CHECKLIST.filter((item) => state[item.id] === 'pass').length;
  const fail = BETA_CHECKLIST.filter((item) => state[item.id] === 'fail').length;
  const pending = total - pass - fail;

  return { total, pass, fail, pending };
}
