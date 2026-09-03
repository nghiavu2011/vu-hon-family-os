import { useState } from 'react';
import { formatLunar } from '../lib/utils.js';
import DeathAnniversaryReminderModal from './DeathAnniversaryReminderModal.jsx';

export default function EventList({ events }) {
  const [showPrayer, setShowPrayer] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const sorted = [...events].sort((a, b) => {
    const [da, ma] = a.dateLunar.split('-').map(Number);
    const [db, mb] = b.dateLunar.split('-').map(Number);
    return ma - mb || da - db;
  });

  const prayerContent = `Nam mô A Di Đà Phật! (3 lần, 3 lạy)

Con lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.
Con kính lạy Hoàng Thiên Hậu Thổ chư vị Tôn thần.
Con kính lạy ngài Đông Trù Tư mệnh Táo phủ Thần quân.
Con kính lạy ngài Tiền Hậu Địa chủ Tài thần.
Con kính lạy Đức Thủy tổ Vũ Hồn cùng liệt vị Tiên linh, Cao Tằng Tổ Khảo, Cao Tằng Tổ Tỷ, Bá thúc huynh đệ, cô di tỷ muội nội ngoại tộc họ Vũ.

Hôm nay là ngày kỵ nhật (ngày giỗ).
Tín chủ con là: ................................................................
Ngụ tại: ........................................................................

Nhân tiết chính kỵ, chúng con cùng toàn thể gia quyến thành tâm sắm sửa hương hoa lễ vật, kim ngân trà quả, dâng lên trước án.
Kính cẩn thỉnh mời: Các bậc Tiên tổ họ Vũ giáng lâm trước án, chứng giám lòng thành, thụ hưởng lễ vật.
Cúi xin phù hộ độ trì cho toàn gia đại tiểu bình an, khang ninh cát khánh, con cháu hiếu học, hiển đạt vẻ vang, rạng danh dòng tộc Mộ Trạch muôn đời.

Chúng con lễ bạc tâm thành, trước án kính lễ, cúi xin được phù hộ độ trì.

Nam mô A Di Đà Phật! (3 lần, 3 lạy)`;

  const handleCopyPrayer = () => {
    navigator.clipboard.writeText(prayerContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="section wrap lowerGrid" id="events">
      <div className="panel pad">
        <div className="sectionHead">
          <div>
            <h2>Lịch Giỗ Tổ & Kỵ Nhật Dòng Họ</h2>
            <p className="sub">Các ngày kỵ nhật âm lịch được đối chiếu từ phả ký Mộ Trạch và gia phả các chi ngành.</p>
          </div>
          <div className="eventHeadActions">
            <button
              type="button"
              className="btn primary reminderPulseBtn"
              onClick={() => setShowReminderModal(true)}
              title="Cài đặt nhắc nhở trước 1 ngày qua số điện thoại, Zalo hoặc ứng dụng Lịch"
            >
              🔔 Nhắc Giỗ Tự Động (Trước 1 Ngày)
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => setShowPrayer(!showPrayer)}
            >
              {showPrayer ? 'Ẩn bài Văn khấn' : '📜 Văn khấn cúng Giỗ'}
            </button>
          </div>
        </div>

        {showPrayer && (
          <div className="prayerModalBox">
            <div className="prayerHeader">
              <h3>📜 Văn khấn Nôm cúng Giỗ Tiên Tổ Họ Vũ Cổ Truyền</h3>
              <button className="btn smallBtn" onClick={handleCopyPrayer} type="button">
                {copied ? '✅ Đã sao chép văn khấn!' : '📋 Sao chép bài khấn'}
              </button>
            </div>
            <pre className="prayerText">{prayerContent}</pre>
            <p className="prayerNote">
              💡 <i>Văn khấn lưu truyền theo chuẩn nghi lễ thờ cúng gia tiên họ Vũ làng Mộ Trạch (Hải Dương).</i>
            </p>
          </div>
        )}

        {sorted.map((event) => (
          <div className="eventItem" key={`${event.personId}-${event.dateLunar}`}>
            <div className="eventDate">{formatLunar(event.dateLunar)}</div>
            <div className="eventDetails">
              <b>{event.title}</b>
              <div className="sub">
                <span className="eventBranchBadge">{event.branch}</span>
                {event.note ? <span className="eventNoteText"> · {event.note}</span> : null}
              </div>
            </div>
            <img src="/assets/incense-altar.png" alt="" />
          </div>
        ))}
      </div>

      <div className="panel pad" id="connect">
        <h2>Kết nối Nội tộc & Khuyến học</h2>
        <p className="sub">Mạng lưới đồng tộc tương trợ, quỹ khuyến học Vũ Hồn và hỗ trợ kiều bào muôn phương.</p>
        <div className="clanConnectHighlights">
          <div className="clanPillar">
            <b>🏮 Quỹ Khuyến học Mộ Trạch</b>
            <p className="sub">Tiếp nối truyền thống "Lò tiến sĩ", vinh danh con cháu đạt giải quốc gia, đỗ đạt đại học.</p>
          </div>
          <div className="clanPillar">
            <b>🤝 Tương trợ Nghề nghiệp</b>
            <p className="sub">Doanh nhân, chuyên gia trong họ kết nối mở ra cơ hội việc làm, thực tập cho thế hệ trẻ.</p>
          </div>
          <div className="clanPillar">
            <b>📍 Trợ duyên Hành hương</b>
            <p className="sub">Hỗ trợ con cháu phương xa về bái tổ Mộ Trạch, viếng lăng mộ Thủy tổ dịp lễ 8 tháng Giêng.</p>
          </div>
        </div>
      </div>

      {showReminderModal && (
        <DeathAnniversaryReminderModal
          events={events}
          onClose={() => setShowReminderModal(false)}
        />
      )}
    </section>
  );
}
