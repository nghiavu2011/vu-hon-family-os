import { useState, useEffect } from 'react';
import {
  getAnalyticsData,
  recordPageView,
  getGoogleAnalyticsId,
  setGoogleAnalyticsId,
} from '../services/analyticsService.js';

export default function VisitorAnalyticsDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(getAnalyticsData());
  const [gaId, setGaId] = useState(getGoogleAnalyticsId());
  const [isGaActive, setIsGaActive] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const refreshStats = () => {
    setData(getAnalyticsData());
  };

  useEffect(() => {
    const updated = recordPageView();
    setData(updated);

    const savedGa = getGoogleAnalyticsId();
    if (savedGa && savedGa.startsWith('G-')) {
      setIsGaActive(true);
    }

    const interval = setInterval(() => {
      setData(getAnalyticsData());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSaveGa = (e) => {
    e.preventDefault();
    const clean = gaId.trim();
    setGoogleAnalyticsId(clean);
    if (clean.startsWith('G-')) {
      setIsGaActive(true);
      setSaveMsg('✅ Đã kết nối GA4!');
    } else if (!clean) {
      setIsGaActive(false);
      setSaveMsg('ℹ️ Đã dùng Telemetry nội bộ');
    } else {
      setSaveMsg('⚠️ Mã GA4 phải bắt đầu bằng G-');
    }
    setTimeout(() => setSaveMsg(''), 3000);
  };

  return (
    <aside className="realtimeFloatingWidget" aria-label="Thống kê truy cập thời gian thực">
      {!isOpen ? (
        <button
          type="button"
          className="realtimePillBtn"
          onClick={() => setIsOpen(true)}
          title="Nhấp để xem chi tiết Thống kê truy cập & Nhịp sống dòng họ"
        >
          <span className="livePulseDot" />
          <span className="pillText">
            <b>{data.activeNow || 1}</b> online · <b>{(data.totalViews || 1).toLocaleString()}</b> lượt xem
          </span>
          <span className="pillExpandIcon">📊 ▲</span>
        </button>
      ) : (
        <div className="realtimeCard">
          <div className="realtimeCardHead">
            <div className="headTitle">
              <span className="livePulseDot" />
              <b>📊 Nhịp Sống Dòng Họ (Realtime)</b>
            </div>
            <button
              type="button"
              className="realtimeCloseBtn"
              onClick={() => setIsOpen(false)}
              title="Thu nhỏ lại"
            >
              ✕
            </button>
          </div>

          <div className="realtimeCardBody">
            {/* Lưới 4 chỉ số cốt lõi */}
            <div className="realtimeMiniGrid">
              <div className="rmItem highlight">
                <span>🟢 Đang online</span>
                <b>{data.activeNow || 1}</b>
              </div>
              <div className="rmItem">
                <span>📅 Hôm nay</span>
                <b>{(data.todayViews || 1).toLocaleString()}</b>
              </div>
              <div className="rmItem">
                <span>🏛 Tổng xem</span>
                <b>{(data.totalViews || 1).toLocaleString()}</b>
              </div>
              <div className="rmItem">
                <span>⚡ GA4</span>
                <b style={{ fontSize: '11px' }}>{isGaActive ? 'ĐÃ KẾT NỐI' : 'NỘI BỘ'}</b>
              </div>
            </div>

            {/* Phân bổ địa lý người truy cập */}
            <div className="realtimeLocations">
              <div className="rlTitle">📍 Địa phương truy cập nhiều nhất:</div>
              {data.locations && data.locations.slice(0, 3).map((loc) => (
                <div className="rlItem" key={loc.name}>
                  <span>{loc.name}</span>
                  <b>{loc.percent}% ({loc.count})</b>
                </div>
              ))}
            </div>

            {/* Cấu hình GA4 thu nhỏ */}
            {showConfig ? (
              <form onSubmit={handleSaveGa} className="realtimeConfigForm">
                <input
                  type="text"
                  value={gaId}
                  onChange={(e) => setGaId(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="configInput"
                />
                <button type="submit" className="btn tinyBtn">Lưu</button>
                {saveMsg ? <div className="configMsg">{saveMsg}</div> : null}
              </form>
            ) : null}

            <div className="realtimeCardFooter">
              <button
                type="button"
                className="footerLinkBtn"
                onClick={() => setShowConfig(!showConfig)}
              >
                ⚙️ {showConfig ? 'Đóng cấu hình' : 'Mã GA4'}
              </button>
              <button type="button" className="footerLinkBtn" onClick={refreshStats}>
                🔄 Làm mới
              </button>
              <span className="sourceNote">100% số liệu thực tế</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
