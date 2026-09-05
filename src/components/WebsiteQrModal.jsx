import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const WEBSITE_URL = 'https://vuhonfamilyos.vercel.app';

export default function WebsiteQrModal({ onClose }) {
  const [dataUrl, setDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState('iphone'); // 'iphone' | 'android' | 'zalo'

  useEffect(() => {
    let alive = true;

    async function generate() {
      try {
        const url = await QRCode.toDataURL(WEBSITE_URL, {
          width: 340,
          margin: 2,
          color: {
            dark: '#2a1107',
            light: '#fffdf7',
          },
          errorCorrectionLevel: 'H',
        });
        if (alive) setDataUrl(url);
      } catch (err) {
        console.error(err);
      }
    }

    generate();
    return () => {
      alive = false;
    };
  }, []);

  const handleDownloadQr = () => {
    if (!dataUrl) return;
    const anchor = document.createElement('a');
    anchor.href = dataUrl;
    anchor.download = 'ma-qr-vuhonfamilyos.png';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(WEBSITE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const zaloShareLink = `https://zalo.me/share?url=${encodeURIComponent(WEBSITE_URL)}&title=${encodeURIComponent('Gia Phả Họ Vũ - Vũ Hồn Family OS')}`;

  return (
    <div className="modalBackdrop show" onClick={onClose}>
      <div className="modalCard websiteQrModalCard" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <div className="qrModalHead">
            <span className="qrModalIcon">📱</span>
            <div>
              <h3>Mã QR Quét & Cài Ứng Dụng Gia Phả</h3>
              <p className="sub">Quét bằng Camera điện thoại, Zalo, Safari, Chrome hoặc Cốc Cốc.</p>
            </div>
          </div>
          <button type="button" className="closeBtn" onClick={onClose} title="Đóng">✕</button>
        </div>

        <div className="websiteQrBody">
          {/* Khung hiển thị mã QR vàng hoàng kim */}
          <div className="qrDisplayFrame">
            <div className="qrImageWrapper">
              {dataUrl ? (
                <img src={dataUrl} alt="Mã QR Vũ Hồn Family OS" className="qrMainImg" />
              ) : (
                <div className="qrLoadingMock">Đang tạo mã QR...</div>
              )}
              <div className="qrUrlBadge">{WEBSITE_URL}</div>
            </div>

            <div className="qrActionButtons">
              <button type="button" className="btn primary smallBtn" onClick={handleDownloadQr}>
                📥 Tải Ảnh Mã QR Về Máy
              </button>
              <button type="button" className="btn smallBtn" onClick={handleCopyLink}>
                {copied ? '✅ Đã sao chép link!' : '📋 Sao Chép Link Web'}
              </button>
              <a
                href={zaloShareLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn smallBtn zaloQrBtn"
              >
                💬 Chia Sẻ Zalo
              </a>
            </div>
          </div>

          {/* Khối hướng dẫn lưu vào bộ nhớ máy / Cài app trên mọi nền tảng */}
          <div className="qrGuideSection">
            <div className="guideTabsHeader">
              <b>📲 Hướng dẫn lưu vào màn hình chính / Trình duyệt:</b>
              <div className="guideTabs">
                <button
                  type="button"
                  className={`gTab ${activeGuideTab === 'iphone' ? 'active' : ''}`}
                  onClick={() => setActiveGuideTab('iphone')}
                >
                  🍎 iPhone (Safari)
                </button>
                <button
                  type="button"
                  className={`gTab ${activeGuideTab === 'android' ? 'active' : ''}`}
                  onClick={() => setActiveGuideTab('android')}
                >
                  🤖 Android (Chrome/Cốc Cốc)
                </button>
                <button
                  type="button"
                  className={`gTab ${activeGuideTab === 'zalo' ? 'active' : ''}`}
                  onClick={() => setActiveGuideTab('zalo')}
                >
                  💬 Quét Qua Zalo
                </button>
              </div>
            </div>

            <div className="guideTabContent">
              {activeGuideTab === 'iphone' && (
                <div className="guideStepList">
                  <div className="gStep">
                    <b>Bước 1:</b> Mở ứng dụng <b>Camera</b> trên iPhone quét mã QR trên (hoặc mở bằng trình duyệt <b>Safari</b>).
                  </div>
                  <div className="gStep">
                    <b>Bước 2:</b> Nhấn vào biểu tượng <b>Chia sẻ</b> (hình vuông có mũi tên hướng lên ⬆️ ở thanh công cụ dưới đáy màn hình).
                  </div>
                  <div className="gStep">
                    <b>Bước 3:</b> Cuộn xuống chọn <b>"Thêm vào MH chính"</b> (Add to Home Screen) ➔ Nhấn <b>"Thêm"</b> ở góc phải trên.
                  </div>
                  <div className="gResult">
                    🎉 <i>Biểu tượng Vũ Hồn Family OS sẽ xuất hiện ngay trên màn hình chính của iPhone như một ứng dụng thực thụ, mở ra xem bất cứ lúc nào!</i>
                  </div>
                </div>
              )}

              {activeGuideTab === 'android' && (
                <div className="guideStepList">
                  <div className="gStep">
                    <b>Bước 1:</b> Quét mã QR bằng Camera hoặc mở link trên <b>Google Chrome</b> / <b>Cốc Cốc</b>.
                  </div>
                  <div className="gStep">
                    <b>Bước 2:</b> Nhấn vào dấu <b>3 chấm dọc ⋮</b> ở góc trên cùng bên phải màn hình.
                  </div>
                  <div className="gStep">
                    <b>Bước 3:</b> Chọn <b>"Cài đặt ứng dụng"</b> hoặc <b>"Thêm vào Màn hình chính"</b>.
                  </div>
                  <div className="gResult">
                    🎉 <i>Ứng dụng sẽ được lưu trực tiếp vào bộ nhớ máy, tự động cập nhật dữ liệu gia tộc mới nhất mỗi khi mở ra!</i>
                  </div>
                </div>
              )}

              {activeGuideTab === 'zalo' && (
                <div className="guideStepList">
                  <div className="gStep">
                    <b>Bước 1:</b> Mở <b>Zalo</b> ➔ Nhấn vào biểu tượng <b>Mã QR</b> ở góc trên bên phải để quét.
                  </div>
                  <div className="gStep">
                    <b>Bước 2:</b> Khi trang web mở ra trong Zalo, nhấn vào dấu <b>3 chấm …</b> ở góc trên cùng bên phải.
                  </div>
                  <div className="gStep">
                    <b>Bước 3:</b> Chọn <b>"Mở bằng trình duyệt mặc định"</b> (Safari / Chrome / Cốc Cốc) để trải nghiệm giao diện mượt mà và lưu lại tiện lợi nhất.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
