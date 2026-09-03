import { useState, useEffect } from 'react';

export default function PwaInstallBanner() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Kiểm tra nếu đã cài đặt rồi
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    // Kiểm tra thiết bị iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      // Hiển thị banner cài đặt sau 2 giây
      setTimeout(() => setShowBanner(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Nếu là iOS và chưa cài đặt, cũng gợi ý banner
    if (isIosDevice && !window.navigator.standalone) {
      setTimeout(() => setShowBanner(true), 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowBanner(false);
      }
      setInstallPrompt(null);
    } else if (isIos) {
      setShowIosGuide(true);
    } else {
      alert('Để cài đặt ứng dụng, hãy mở menu trình duyệt (dấu 3 chấm ⋮) và chọn "Cài đặt ứng dụng" hoặc "Thêm vào màn hình chính".');
    }
  };

  if (isInstalled || !showBanner) return null;

  return (
    <div className="pwaInstallBanner">
      <div className="pwaBannerInner wrap">
        <div className="pwaBannerContent">
          <img src="/assets/seal-vu.png" alt="Triện Vũ" className="pwaAppIcon" />
          <div>
            <strong>Cài đặt Ứng dụng Gia Phả Họ Vũ vào Điện Thoại</strong>
            <p>Mở xem phả hệ & bản đồ mộ phần mọi lúc mọi nơi ngay cả khi ngoại tuyến mất sóng 4G.</p>
          </div>
        </div>

        <div className="pwaBannerActions">
          <button
            type="button"
            className="btn primary pwaInstallBtn"
            onClick={handleInstallClick}
          >
            📲 Cài Đặt Ngay
          </button>
          <button
            type="button"
            className="pwaDismissBtn"
            onClick={() => setShowBanner(false)}
            aria-label="Đóng thông báo"
          >
            ✕
          </button>
        </div>
      </div>

      {showIosGuide && (
        <div className="iosGuideModal" onClick={() => setShowIosGuide(false)}>
          <div className="iosGuideBox" onClick={(e) => e.stopPropagation()}>
            <h4>📲 Hướng Dẫn Cài Đặt Cho iPhone / iPad:</h4>
            <ol>
              <li>Bấm vào nút <b>Chia sẻ</b> (biểu tượng hình vuông có mũi tên trỏ lên ⎋ ở dưới cùng trình duyệt Safari).</li>
              <li>Cuộn xuống và chọn <b>"Thêm vào Màn hình chính"</b> (Add to Home Screen ➕).</li>
              <li>Bấm <b>"Thêm"</b> (Add) ở góc trên bên phải.</li>
            </ol>
            <p>Biểu tượng <b>Triện Họ Vũ</b> sẽ xuất hiện trên màn hình chính như một ứng dụng độc lập!</p>
            <button type="button" className="btn primary smallBtn" onClick={() => setShowIosGuide(false)}>
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
