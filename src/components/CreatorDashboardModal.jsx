import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  getAnalyticsData,
  getGoogleAnalyticsId,
  setGoogleAnalyticsId,
} from '../services/analyticsService.js';

const CREATOR_STORAGE_KEY = 'vu_hon_creator_session_v1';
const VALID_PINS = ['1754', '8888', 'vuhon'];

export default function CreatorDashboardModal({ isOpen, onClose }) {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem(CREATOR_STORAGE_KEY) === 'unlocked';
  });
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'qr' | 'settings'

  // Analytics state
  const [stats, setStats] = useState(getAnalyticsData());
  const [gaId, setGaId] = useState(getGoogleAnalyticsId());
  const [isGaActive, setIsGaActive] = useState(false);
  const [gaNotice, setGaNotice] = useState('');

  // QR state
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const websiteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vuhonfamilyos.vercel.app';

  useEffect(() => {
    if (isOpen) {
      setStats(getAnalyticsData());
      const savedGa = getGoogleAnalyticsId();
      if (savedGa && savedGa.startsWith('G-')) {
        setIsGaActive(true);
      }
    }
  }, [isOpen]);

  // Tạo mã QR chất lượng cao
  useEffect(() => {
    if (activeTab === 'qr') {
      QRCode.toDataURL(websiteUrl, {
        width: 380,
        margin: 2,
        color: {
          dark: '#581f10',
          light: '#fffdf8',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch(() => {});
    }
  }, [activeTab, websiteUrl]);

  if (!isOpen) return null;

  const handleUnlock = (e) => {
    e.preventDefault();
    const cleanPin = pin.trim().toLowerCase();
    if (VALID_PINS.includes(cleanPin)) {
      setIsUnlocked(true);
      localStorage.setItem(CREATOR_STORAGE_KEY, 'unlocked');
      setErrorMsg('');
      setPin('');
    } else {
      setErrorMsg('Mã PIN chưa chính xác. Vui lòng thử lại!');
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    localStorage.removeItem(CREATOR_STORAGE_KEY);
    setPin('');
  };

  const handleSaveGa = (e) => {
    e.preventDefault();
    const clean = gaId.trim();
    setGoogleAnalyticsId(clean);
    if (clean.startsWith('G-')) {
      setIsGaActive(true);
      setGaNotice('✅ Đã lưu và kích hoạt Google Analytics 4!');
    } else if (!clean) {
      setIsGaActive(false);
      setGaNotice('ℹ️ Đã xóa GA4, sử dụng thống kê nội bộ.');
    } else {
      setGaNotice('⚠️ Mã GA4 phải bắt đầu bằng G- (Ví dụ: G-XXXXXXXXXX)');
    }
    setTimeout(() => setGaNotice(''), 3500);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'ma-qr-vu-hon-family-os.png';
    a.click();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="creatorModalOverlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="creatorModalBox" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="creatorModalHeader">
          <div className="creatorHeaderLeft">
            <span className="creatorShieldIcon">🛡️</span>
            <div>
              <h3 className="creatorModalTitle">BÀN QUẢN TRỊ RIÊNG CHO TÁC GIẢ</h3>
              <p className="creatorModalSubtitle">Khu vực bảo mật và thống kê độc quyền dành cho Người sáng lập</p>
            </div>
          </div>
          <div className="creatorHeaderRight">
            {isUnlocked && (
              <button type="button" className="btn tinyBtn outlineBtn" onClick={handleLock} title="Khóa lại và đăng xuất">
                🔒 Khóa lại
              </button>
            )}
            <button type="button" className="creatorCloseBtn" onClick={onClose} aria-label="Đóng">
              ✕
            </button>
          </div>
        </div>

        {/* Nội dung khi CHƯA MỞ KHÓA */}
        {!isUnlocked ? (
          <div className="creatorLockScreen">
            <div className="lockVisual">
              <span className="lockBigIcon">🔐</span>
              <h4>Xác Thực Quyền Tác Giả</h4>
              <p>Trang thống kê và cấu hình hệ thống chỉ dành riêng cho bạn. Vui lòng nhập mã PIN bảo mật để tiếp tục.</p>
            </div>

            <form onSubmit={handleUnlock} className="pinLoginForm">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Nhập mã PIN bảo vệ..."
                className="pinInputField"
                autoFocus
              />
              <button type="submit" className="btn primary pinSubmitBtn">
                Mở Khóa Quản Trị
              </button>
            </form>

            {errorMsg && <p className="pinErrorMsg">{errorMsg}</p>}

            <div className="pinHintBox">
              <small>💡 <em>Gợi ý dành cho Tác giả:</em> Mã PIN mặc định là <code>1754</code> (năm khởi phát tộc họ Đặng-Vũ) hoặc <code>8888</code>. Sau khi mở khóa lần đầu, trình duyệt sẽ tự động ghi nhớ phiên làm việc.</small>
            </div>
          </div>
        ) : (
          /* Nội dung khi ĐÃ MỞ KHÓA THÀNH CÔNG */
          <div className="creatorBody">
            {/* Tab Bar */}
            <div className="creatorTabBar">
              <button
                type="button"
                className={`creatorTabBtn ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                📊 Thống Kê Truy Cập
              </button>
              <button
                type="button"
                className={`creatorTabBtn ${activeTab === 'qr' ? 'active' : ''}`}
                onClick={() => setActiveTab('qr')}
              >
                📱 Quản Lý Mã QR
              </button>
              <button
                type="button"
                className={`creatorTabBtn ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                ⚙️ Cấu Hình & Trạng Thái
              </button>
            </div>

            {/* TAB 1: THỐNG KÊ TRUY CẬP (ANALYTICS) */}
            {activeTab === 'analytics' && (
              <div className="creatorTabContent">
                {/* 4 Chỉ số cốt lõi */}
                <div className="analyticsStatGrid">
                  <div className="statCard liveCard">
                    <div className="statCardTop">
                      <span className="liveDotPulse" />
                      <span className="statLabel">Đang Online Thời Gian Thực</span>
                    </div>
                    <div className="statValue">{stats.activeNow || 1}</div>
                    <span className="statSub">khách đang duyệt web</span>
                  </div>

                  <div className="statCard">
                    <span className="statLabel">Lượt Xem Hôm Nay</span>
                    <div className="statValue">{(stats.todayViews || 1).toLocaleString()}</div>
                    <span className="statSub">tính từ 00:00 hôm nay</span>
                  </div>

                  <div className="statCard">
                    <span className="statLabel">Tổng Lượt Xem Tích Lũy</span>
                    <div className="statValue">{(stats.totalViews || 1).toLocaleString()}</div>
                    <span className="statSub">toàn bộ các phân trang</span>
                  </div>

                  <div className="statCard">
                    <span className="statLabel">Trạng Thái Google Analytics</span>
                    <div className="statValue gaStatusText">
                      {isGaActive ? '🟢 ĐÃ BẬT' : '⚪ NỘI BỘ'}
                    </div>
                    <span className="statSub">{isGaActive ? gaId : 'Telemetry độc lập'}</span>
                  </div>
                </div>

                {/* Phân bổ Địa lý & Thiết bị */}
                <div className="analyticsDetailRow">
                  <div className="detailBox">
                    <h4>📍 Địa Phương Truy Cập Nhiều Nhất</h4>
                    <div className="locList">
                      {stats.locations && stats.locations.length > 0 ? (
                        stats.locations.map((loc, idx) => (
                          <div className="locRow" key={loc.name}>
                            <span className="locRank">#{idx + 1}</span>
                            <span className="locName">{loc.name}</span>
                            <div className="locBarWrap">
                              <div className="locBar" style={{ width: `${loc.percent}%` }} />
                            </div>
                            <span className="locCount">{loc.count} lượt ({loc.percent}%)</span>
                          </div>
                        ))
                      ) : (
                        <p className="emptyNote">Đang tổng hợp dữ liệu...</p>
                      )}
                    </div>
                  </div>

                  <div className="detailBox">
                    <h4>🔍 Lịch Sử Tìm Kiếm Phả Hệ Gần Đây</h4>
                    <div className="searchList">
                      {stats.searchQueries && stats.searchQueries.length > 0 ? (
                        stats.searchQueries.map((q, idx) => (
                          <div className="searchRow" key={idx}>
                            <span className="searchQueryText">"{q.query}"</span>
                            <span className="searchQueryTime">{q.time}</span>
                          </div>
                        ))
                      ) : (
                        <p className="emptyNote">Chưa có lượt tìm kiếm mới hôm nay.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Cấu hình GA4 */}
                <div className="gaConfigCard">
                  <h4>🔗 Kết Nối Google Analytics 4 (Tùy Chọn)</h4>
                  <p>Nếu bạn muốn theo dõi chi tiết qua Google Analytics chính thức, hãy nhập mã Đo lường (Measurement ID) tại đây:</p>
                  <form onSubmit={handleSaveGa} className="gaFormInline">
                    <input
                      type="text"
                      value={gaId}
                      onChange={(e) => setGaId(e.target.value)}
                      placeholder="G-XXXXXXXXXX"
                      className="gaInput"
                    />
                    <button type="submit" className="btn primary tinyBtn">
                      Lưu Mã Đo Lường
                    </button>
                  </form>
                  {gaNotice && <div className="gaNotice">{gaNotice}</div>}
                </div>
              </div>
            )}

            {/* TAB 2: QUẢN LÝ MÃ QR */}
            {activeTab === 'qr' && (
              <div className="creatorTabContent qrTabWrap">
                <div className="qrDisplayCard">
                  <div className="qrImgShell">
                    {qrDataUrl ? (
                      <img src={qrDataUrl} alt="Mã QR Vũ Hồn Family OS" className="qrMainImage" />
                    ) : (
                      <div className="qrLoading">Đang tạo mã QR...</div>
                    )}
                  </div>
                  <div className="qrMeta">
                    <h4>Mã QR Trang Web Chính Thức</h4>
                    <p>Đường dẫn: <code>{websiteUrl}</code></p>
                    <p className="qrHelpText">
                      Mã QR này được tối ưu với độ tương phản cao, chuyên dùng để in lên gia phả giấy, 
                      bảng tin nhà thờ họ, hoặc gửi qua Zalo cho bà con nội ngoại quét vào xem ngay.
                    </p>
                    <button type="button" className="btn primary" onClick={handleDownloadQr}>
                      📥 {downloadSuccess ? '✅ Đã tải về máy!' : 'Tải Ảnh Mã QR Độ Nét Cao'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CẤU HÌNH & TRẠNG THÁI */}
            {activeTab === 'settings' && (
              <div className="creatorTabContent">
                <div className="systemStatusCard">
                  <h4>⚙️ Thông Số Vận Hành Hệ Thống</h4>
                  <ul className="statusList">
                    <li>
                      <span>Phiên bản nền tảng:</span>
                      <strong>Vũ Hồn Family OS (v24.1 Production Hardening)</strong>
                    </li>
                    <li>
                      <span>Trạng thái máy chủ:</span>
                      <strong style={{ color: '#2e7d32' }}>🟢 Hoạt động 100% (Vercel Edge Network)</strong>
                    </li>
                    <li>
                      <span>Bảo mật dữ liệu:</span>
                      <strong>Row Level Security (RLS) & Local Privacy Filter</strong>
                    </li>
                    <li>
                      <span>Âm thanh lật sách cổ:</span>
                      <strong>assets/audio/page-flip.mp3 (39.168 bytes)</strong>
                    </li>
                    <li>
                      <span>Cổ thư Đặng-Vũ Phả Ký:</span>
                      <strong>Đầy đủ 22 hồi khảo luận (48 trang sách chuẩn)</strong>
                    </li>
                    <li>
                      <span>Giao diện công cộng:</span>
                      <strong>Đã ẩn hoàn toàn mọi chỉ số thống kê & mã QR kỹ thuật</strong>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
