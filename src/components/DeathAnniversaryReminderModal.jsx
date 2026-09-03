import { useState, useEffect } from 'react';
import { downloadIcsCalendar } from '../lib/calendarExport.js';

export default function DeathAnniversaryReminderModal({ events = [], onClose }) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('Chi Vũ Thành');
  const [remindDaysBefore, setRemindDaysBefore] = useState(1);
  const [savedList, setSavedList] = useState([]);
  const [notice, setNotice] = useState('');
  const [activeTab, setActiveTab] = useState('phone'); // 'phone' | 'calendar' | 'gateway'

  useEffect(() => {
    try {
      const stored = localStorage.getItem('vu_hon_registered_reminders');
      if (stored) {
        setSavedList(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSavePhone = (e) => {
    e.preventDefault();
    const cleanPhone = phone.trim().replace(/[\s.-]/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setNotice('⚠️ Vui lòng nhập số điện thoại hợp lệ (10 số).');
      return;
    }

    const newEntry = {
      id: Date.now(),
      phone: cleanPhone,
      name: name.trim() || 'Con cháu họ Vũ',
      branch,
      remindDaysBefore,
      createdAt: new Date().toISOString(),
    };

    const updated = [newEntry, ...savedList.filter((item) => item.phone !== cleanPhone)];
    setSavedList(updated);
    try {
      localStorage.setItem('vu_hon_registered_reminders', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setNotice(`✅ Đã lưu số ${cleanPhone} (${name || 'Con cháu'}) thành công!`);
    setPhone('');
    setName('');
    setTimeout(() => setNotice(''), 4000);
  };

  const handleRemovePhone = (phoneToRemove) => {
    const updated = savedList.filter((item) => item.phone !== phoneToRemove);
    setSavedList(updated);
    try {
      localStorage.setItem('vu_hon_registered_reminders', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const createZaloShareUrl = (entry) => {
    const text = encodeURIComponent(
      `Kính gửi Ban liên lạc họ Vũ (Zalo 0985.578.385),\nTôi là: ${entry.name || 'Con cháu'}\nSĐT nhận tin: ${entry.phone}\nThuộc: ${entry.branch}\nXin đăng ký nhận thông báo kỵ nhật (ngày giỗ) tự động trước ${entry.remindDaysBefore || 1} ngày qua Zalo/SMS. Trân trọng cảm ơn!`
    );
    return `https://zalo.me/0985578385?text=${text}`;
  };

  return (
    <div className="modalBackdrop show" onClick={onClose}>
      <div className="modalCard reminderModalCard" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <div>
            <h3>🔔 Đăng Ký Nhắc Giỗ Tự Động (Trước 1 Ngày)</h3>
            <p className="sub">Nhận tin báo kỵ nhật qua Số điện thoại, Zalo hoặc đồng bộ chuông reo trên điện thoại.</p>
          </div>
          <button type="button" className="closeBtn" onClick={onClose} title="Đóng">✕</button>
        </div>

        <div className="reminderTabsNav">
          <button
            type="button"
            className={`rTabBtn ${activeTab === 'phone' ? 'active' : ''}`}
            onClick={() => setActiveTab('phone')}
          >
            📱 Số Điện Thoại & Zalo
          </button>
          <button
            type="button"
            className={`rTabBtn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            🍎 Đồng Bộ Lịch iPhone / Android
          </button>
          <button
            type="button"
            className={`rTabBtn ${activeTab === 'gateway' ? 'active' : ''}`}
            onClick={() => setActiveTab('gateway')}
          >
            ⚙️ Cổng Tự Động Hóa (ZNS / SMS)
          </button>
        </div>

        <div className="reminderModalBody">
          {/* TAB 1: NHẬP SỐ ĐIỆN THOẠI & KẾT NỐI ZALO */}
          {activeTab === 'phone' && (
            <div className="reminderSection">
              <form onSubmit={handleSavePhone} className="reminderForm">
                <div className="formRow">
                  <label>
                    <span>Số điện thoại (Nhận tin SMS / Zalo): *</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ví dụ: 0985578385"
                      required
                    />
                  </label>
                  <label>
                    <span>Họ và tên con cháu:</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ví dụ: Vũ Trọng Nghĩa"
                    />
                  </label>
                </div>

                <div className="formRow">
                  <label>
                    <span>Chi nhánh / Phân chi:</span>
                    <select value={branch} onChange={(e) => setBranch(e.target.value)}>
                      <option value="Tất cả các chi (Toàn họ)">Tất cả các chi (Toàn họ)</option>
                      <option value="Chi Vũ Thành">Chi Vũ Thành</option>
                      <option value="Chi Vũ Điền">Chi Vũ Điền</option>
                      <option value="Chi Vũ Ngọc Điền">Chi Vũ Ngọc Điền</option>
                      <option value="Chi Vũ Văn Rũi">Chi Vũ Văn Rũi</option>
                    </select>
                  </label>

                  <label>
                    <span>Thời điểm báo tin:</span>
                    <select
                      value={remindDaysBefore}
                      onChange={(e) => setRemindDaysBefore(Number(e.target.value))}
                    >
                      <option value={1}>Trước 1 ngày (Mặc định - Chuẩn bị cơm cúng)</option>
                      <option value={2}>Trước 2 ngày (Để thu xếp công việc, về quê)</option>
                      <option value={0}>Đúng sáng ngày chính kỵ (07:00 sáng)</option>
                    </select>
                  </label>
                </div>

                <div className="formActions">
                  <button type="submit" className="btn primary">
                    💾 Lưu Số Điện Thoại Nhận Tin Nhắc Giỗ
                  </button>
                </div>

                {notice && <div className="noticeMsg">{notice}</div>}
              </form>

              {/* Danh sách các số đã lưu */}
              <div className="savedPhoneSection">
                <h4>📋 Danh sách số điện thoại đã lưu trên thiết bị ({savedList.length}):</h4>
                {savedList.length > 0 ? (
                  <div className="savedPhoneList">
                    {savedList.map((entry) => (
                      <div className="savedPhoneItem" key={entry.phone}>
                        <div className="spInfo">
                          <b>📞 {entry.phone}</b>
                          <span>({entry.name} · {entry.branch}) · <i>Nhắc trước {entry.remindDaysBefore || 1} ngày</i></span>
                        </div>
                        <div className="spActions">
                          <a
                            href={createZaloShareUrl(entry)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn smallBtn zaloConnectBtn"
                            title="Mở Zalo gửi đăng ký tới Ban liên lạc"
                          >
                            💬 Kích hoạt Zalo
                          </a>
                          <button
                            type="button"
                            className="btn smallBtn deleteBtn"
                            onClick={() => handleRemovePhone(entry.phone)}
                            title="Xóa số này"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="sub emptyNote">
                    Chưa có số điện thoại nào được lưu. Bạn hãy nhập số điện thoại bên trên để hệ thống ghi nhớ và tự động gửi tin nhé!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ĐỒNG BỘ LỊCH ĐIỆN THOẠI (1-CHẠM REO CHUÔNG TRƯỚC 1 NGÀY) */}
          {activeTab === 'calendar' && (
            <div className="reminderSection">
              <div className="calendarSyncCard">
                <div className="csIcon">📲</div>
                <div>
                  <h4>Đồng bộ trực tiếp vào ứng dụng Lịch điện thoại (Miễn phí 100%)</h4>
                  <p>
                    Đây là phương thức <b>tiện lợi, chính xác nhất và hoàn toàn không tốn phí tin nhắn</b>:
                    Hệ thống sẽ tải tệp lịch <b>.ics</b> đã cài sẵn chuông báo thức:
                    <br />
                    🔔 <b>Tự động reo chuông báo trước 1 ngày</b> (vào lúc 08:00 sáng) trên màn hình khóa điện thoại để con cháu kịp sắm sửa đồ lễ!
                  </p>
                </div>
              </div>

              <div className="calendarDownloadBox">
                <button
                  type="button"
                  className="btn primary calendarBigBtn"
                  onClick={() => downloadIcsCalendar(events)}
                >
                  📥 Tải Tệp Lịch Giỗ Tổ Tự Nhắc Vào Điện Thoại (.ics)
                </button>
                <div className="calendarGuide">
                  <b>💡 Hướng dẫn kích hoạt cực dễ trong 5 giây:</b>
                  <ol>
                    <li>Bấm nút <b>"Tải Tệp Lịch Giỗ Tổ"</b> ở trên.</li>
                    <li>
                      <b>Trên iPhone / iPad:</b> Mở tệp vừa tải ➔ Bấm <b>"Thêm tất cả"</b> vào ứng dụng <b>Lịch (Calendar)</b> có sẵn của Apple.
                    </li>
                    <li>
                      <b>Trên Android (Samsung, Oppo, Xiaomi...):</b> Mở tệp vừa tải ➔ Chọn mở bằng <b>Google Calendar</b> ➔ Bấm <b>"Lưu tất cả"</b>.
                    </li>
                    <li>Từ nay, trước mỗi ngày giỗ 1 ngày, điện thoại của bạn sẽ tự động reo chuông nhắc nhở chuẩn xác!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HƯỚNG DẪN KẾT NỐI TỰ ĐỘNG HÓA TỔNG ĐÀI ZALO ZNS & SMS BRANDNAME */}
          {activeTab === 'gateway' && (
            <div className="reminderSection">
              <div className="gatewayGuideBox">
                <h4>📡 Cơ chế kỹ thuật gửi tin nhắn tự động (Zalo ZNS / SMS Tổng đài):</h4>
                <p>
                  Để tin nhắn tự động bắn thẳng về Zalo hoặc SMS của từng số điện thoại mà không cần con cháu thao tác hàng năm, hệ thống sử dụng quy trình chuẩn:
                </p>
                
                <div className="gatewaySteps">
                  <div className="gwStep">
                    <b>1. Lưu trữ danh bạ phụng tự:</b>
                    <span>Số điện thoại và thông tin đăng ký của bà con được lưu an toàn trong cơ sở dữ liệu nội tộc.</span>
                  </div>
                  <div className="gwStep">
                    <b>2. Bộ đếm giờ tự động (Cloud Cron Job):</b>
                    <span>Mỗi ngày vào 08:00 sáng, máy chủ kiểm tra xem ngày mai có phải là ngày kỵ nhật âm lịch của cụ nào không.</span>
                  </div>
                  <div className="gwStep">
                    <b>3. Cổng gửi tin Zalo ZNS / SMS:</b>
                    <span>Nếu phát hiện ngày giỗ, hệ thống tự động gọi API của Zalo OA (ZNS) hoặc SMS Brandname bắn tin nhắn mẫu: <i>"Kính gửi ông/bà [Tên], ngày mai 17/7 Âm lịch là ngày Giỗ Cụ Nguyễn Văn Sơn (Chi Vũ Thành)..."</i></span>
                  </div>
                </div>

                <div className="gatewayContactNote">
                  💡 <b>Kích hoạt miễn phí qua Zalo:</b> Bạn chỉ cần lưu số điện thoại ở Tab 1 và bấm <b>"Kích hoạt Zalo"</b>, Ban liên lạc (`0985.578.385`) sẽ tự động lên lịch gửi tin nhắn thông báo mỗi khi dòng họ chuẩn bị có ngày kỵ nhật!
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
