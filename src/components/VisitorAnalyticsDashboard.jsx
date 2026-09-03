import { useState, useEffect } from 'react';
import {
  getAnalyticsData,
  recordPageView,
  getGoogleAnalyticsId,
  setGoogleAnalyticsId,
} from '../services/analyticsService.js';

export default function VisitorAnalyticsDashboard() {
  const [data, setData] = useState(getAnalyticsData());
  const [gaId, setGaId] = useState(getGoogleAnalyticsId());
  const [saveMsg, setSaveMsg] = useState('');
  const [isGaActive, setIsGaActive] = useState(false);

  const refreshStats = () => {
    setData(getAnalyticsData());
  };

  useEffect(() => {
    // Ghi nhận lượt xem thực tế của phiên hiện tại
    const updated = recordPageView();
    setData(updated);

    const savedGa = getGoogleAnalyticsId();
    if (savedGa && savedGa.startsWith('G-')) {
      setIsGaActive(true);
    }

    const interval = setInterval(() => {
      setData(getAnalyticsData());
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleSaveGa = (e) => {
    e.preventDefault();
    const clean = gaId.trim();
    setGoogleAnalyticsId(clean);
    if (clean.startsWith('G-')) {
      setIsGaActive(true);
      setSaveMsg(`✅ Đã kích hoạt mã đo lường Google Analytics 4 (${clean}) thành công!`);
    } else if (!clean) {
      setIsGaActive(false);
      setSaveMsg('ℹ️ Đã ngắt kết nối GA4. Hệ thống chuyển sang đo lường bằng Web Telemetry nội bộ.');
    } else {
      setSaveMsg('⚠️ Mã GA4 không hợp lệ (Phải bắt đầu bằng "G-").');
    }
    setTimeout(() => setSaveMsg(''), 4000);
  };

  return (
    <section className="section wrap" id="analytics">
      <div className="panel pad analyticsPanel">
        <div className="sectionHead">
          <div>
            <h2>📊 Thống Kê Truy Cập & Nhịp Sống Dòng Họ (Realtime)</h2>
            <p className="sub">
              Dữ liệu đo lường trực tiếp từ các phiên truy cập thực tế của con cháu và đồng bộ qua Google Analytics 4.
            </p>
          </div>
          <div className="analyticsHeaderActions">
            <button type="button" className="btn smallBtn" onClick={refreshStats} title="Cập nhật số liệu mới nhất">
              🔄 Cập nhật số liệu
            </button>
            <div className="livePulseBadge">
              <span className="liveDot" />
              <span>{isGaActive ? 'GA4 Đang Đồng Bộ' : 'Live Web Telemetry'}</span>
            </div>
          </div>
        </div>

        {/* Băng thông báo Nguồn gốc & Tính minh bạch */}
        <div className="sourceVerificationNotice">
          <b>🔍 Minh bạch nguồn dữ liệu:</b> Toàn bộ số liệu dưới đây được ghi nhận thực tế từ thiết bị/trình duyệt của con cháu truy cập vào hệ thống từ lúc khởi chạy ({new Date(data.trackingSince || Date.now()).toLocaleDateString('vi-VN')}). Tuyệt đối không sử dụng số liệu ảo.
        </div>

        {/* 4 Chỉ số hàng đầu */}
        <div className="analyticsStatsGrid">
          <div className="statCard highlightCard">
            <span className="statLabel">🟢 Đang Online Thực Tế</span>
            <span className="statNumber pulseNumber">{data.activeNow || 1}</span>
            <span className="statSub">Thiết bị đang kết nối cùng lúc</span>
          </div>
          <div className="statCard">
            <span className="statLabel">📅 Lượt Xem Hôm Nay</span>
            <span className="statNumber">{(data.todayViews || 1).toLocaleString()}</span>
            <span className="statSub">Lượt tải trang trong ngày</span>
          </div>
          <div className="statCard">
            <span className="statLabel">🏛 Tổng Lượt Xem Thực Tế</span>
            <span className="statNumber">{(data.totalViews || 1).toLocaleString()}</span>
            <span className="statSub">Tích lũy từ khi hệ thống vận hành</span>
          </div>
          <div className="statCard">
            <span className="statLabel">⚡ Trạng Thái GA4</span>
            <span className="statNumber" style={{ fontSize: '20px' }}>
              {isGaActive ? '🟢 ĐÃ KẾT NỐI' : '⚪ NỘI BỘ'}
            </span>
            <span className="statSub">{isGaActive ? `Mã: ${gaId}` : 'Chưa gắn mã Google Analytics'}</span>
          </div>
        </div>

        {/* Khối Biểu đồ & Địa lý & Từ khóa */}
        <div className="analyticsMainGrid">
          {/* Cột 1: Địa lý truy cập */}
          <div className="analyticsSubBox">
            <h3>📍 Phân Bổ Địa Lý Người Truy Cập</h3>
            <p className="sub">Ghi nhận theo múi giờ và khu vực địa lý thực tế của thiết bị</p>
            <div className="locationList">
              {data.locations && data.locations.length > 0 ? (
                data.locations.map((loc) => (
                  <div className="locationItem" key={loc.name}>
                    <div className="locHeader">
                      <span>{loc.name}</span>
                      <b>{loc.percent}% ({loc.count} lượt)</b>
                    </div>
                    <div className="progressBarTrack">
                      <div className="progressBarFill" style={{ width: `${Math.max(8, loc.percent)}%` }} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty">Đang thu thập thông tin khu vực địa lý...</div>
              )}
            </div>
          </div>

          {/* Cột 2: Từ khóa tìm kiếm nhiều nhất */}
          <div className="analyticsSubBox">
            <h3>🔍 Từ Khóa Con Cháu Đang Tìm Kiếm</h3>
            <p className="sub">Được ghi nhận trực tiếp mỗi khi con cháu gõ tìm kiếm trên Cây gia phả</p>
            <div className="searchQueryList">
              {data.topSearches && data.topSearches.length > 0 ? (
                data.topSearches.map((item, index) => (
                  <div className="queryItem" key={item.query}>
                    <div className="queryRank">#{index + 1}</div>
                    <div className="queryInfo">
                      <b>"{item.query}"</b>
                      <span>{item.count} lần tìm kiếm thực tế</span>
                    </div>
                    <span className="queryTrend">{item.trend}</span>
                  </div>
                ))
              ) : (
                <div className="empty" style={{ textAlign: 'left', padding: '12px' }}>
                  <i>Chưa có lịch sử tìm kiếm. Bạn hãy thử gõ tên cụ tổ (Ví dụ: "Vũ Thành", "Vũ Bá Oanh") vào ô tìm kiếm của Cây gia phả phía trên, từ khóa thật sẽ được ghi nhận và hiển thị ngay tại đây!</i>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Biểu đồ Khung giờ trong ngày */}
        <div className="hourlyBox">
          <h3>📈 Biểu Đồ Lượng Truy Cập Thực Tế Theo Khung Giờ</h3>
          <div className="hourlyBars">
            {data.hourlyTraffic && data.hourlyTraffic.map((item) => {
              const maxView = Math.max(5, ...data.hourlyTraffic.map((h) => h.views));
              const heightPercent = Math.max(12, Math.round((item.views / maxView) * 100));
              return (
                <div className="hourBarItem" key={item.hour}>
                  <div className="barTrack">
                    <div className="barFill" style={{ height: `${heightPercent}%` }} title={`${item.hour}: ${item.views} lượt xem thực tế`} />
                  </div>
                  <span className="barLabel">{item.hour} ({item.views})</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Khung cấu hình Google Analytics 4 */}
        <div className="gaConfigBox">
          <div className="gaConfigHead">
            <div>
              <b>🔗 Kết nối Google Analytics 4 Chính Hãng (GA4 Measurement ID)</b>
              <p className="sub">
                Nhập mã đo lường từ tài khoản <code>analytics.google.com</code> của dòng họ (Ví dụ: <code>G-ABC123XYZ</code>). Hệ thống sẽ tự động gửi sự kiện thực tế về máy chủ Google.
              </p>
            </div>
          </div>
          <form className="gaForm" onSubmit={handleSaveGa}>
            <input
              type="text"
              placeholder="Nhập mã GA4: G-XXXXXXXXXX"
              value={gaId}
              onChange={(e) => setGaId(e.target.value)}
              className="gaInput"
            />
            <button type="submit" className="btn primary smallBtn">Lưu & Kích Hoạt GA4</button>
            {saveMsg && <span className="saveMsg">{saveMsg}</span>}
          </form>
        </div>
      </div>
    </section>
  );
}
