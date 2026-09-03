/**
 * Tạo tệp iCalendar (.ics) đồng bộ Lịch Giỗ Tổ Họ Vũ vào điện thoại (iPhone, Samsung, Google Calendar)
 * Có cài sẵn chuông báo thức (Alarm) nhắc trước 1 ngày (TRIGGER:-P1D) vào lúc 08:00 sáng
 */

// Bảng đối chiếu ngày Âm sang ngày Dương xấp xỉ cho năm 2026 và 2027 để điện thoại reo chuông chính xác
const LUNAR_SOLAR_MAP_2026 = {
  '21-04': '20260606',
  '13-12': '20270120',
  '22-05': '20260706',
  '19-10': '20261128',
  '17-12': '20270124',
  '24-11': '20270102',
  '05-06': '20260718',
  '02-06': '20260715',
  '03-05': '20260617',
  '17-07': '20260829',
  '25-12': '20270201',
};

export function generateIcsCalendar(events = []) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vu Hon Family OS//Lich Gio To Ho Vu//VI',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Lịch Giỗ Tổ Họ Vũ (Nhắc Trước 1 Ngày)',
    'X-WR-TIMEZONE:Asia/Ho_Chi_Minh',
  ];

  events.forEach((event, idx) => {
    const solarDateStr = LUNAR_SOLAR_MAP_2026[event.dateLunar] || '20260715';
    const uid = `gio-ho-vu-${event.personId || idx}-${event.dateLunar}@vuhonfamilyos.vercel.app`;
    const title = `${event.title} (${event.dateLunar} Âm Lịch)`;
    const description = `Kỵ nhật dòng họ: ${event.title}. Ngày âm: ${event.dateLunar}. ${event.branch ? 'Thuộc: ' + event.branch + '.' : ''} ${event.note || ''} Con cháu chuẩn bị hương hoa cúng giỗ chu tất.`;

    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:20260903T120000Z`,
      `DTSTART;VALUE=DATE:${solarDateStr}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      'STATUS:CONFIRMED',
      'TRANSP:TRANSPARENT',
      // Chuông báo thức 1: Nhắc trước 1 ngày (1 Day Before)
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:Nhắc giỗ: Ngày mai là ${title}!`,
      'TRIGGER:-P1D',
      'END:VALARM',
      // Chuông báo thức 2: Nhắc trước 2 giờ sáng ngày giỗ
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:Hôm nay là ${title}!`,
      'TRIGGER:-PT2H',
      'END:VALARM',
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadIcsCalendar(events = []) {
  const icsContent = generateIcsCalendar(events);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'Lich-Gio-To-Ho-Vu-Nhac-Truoc-1-Ngay.ics';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
