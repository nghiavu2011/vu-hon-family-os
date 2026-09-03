import { useState, useEffect } from 'react';

export default function QuickNavPills({ onOpenSources, onOpenPrivacy }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav className="quickNavWrap" aria-label="Điều hướng nhanh 1 chạm">
        <div className="wrap quickNavInner">
          <div className="quickNavPrompt">
            <span>⚡ Truy cập nhanh:</span>
          </div>

          <div className="quickNavButtons">
            <button type="button" className="quickNavBtn" onClick={() => scrollTo('heritage-video')}>
              🎬 Phim Di Sản
            </button>
            <button type="button" className="quickNavBtn" onClick={() => scrollTo('tree')}>
              🌳 Cây Phả Hệ
            </button>
            <button type="button" className="quickNavBtn" onClick={() => scrollTo('kinship')}>
              🧭 Tra Xưng Hô
            </button>
            <button type="button" className="quickNavBtn" onClick={() => scrollTo('people')}>
              📖 Danh Bạ
            </button>
            <button type="button" className="quickNavBtn highlight" onClick={() => scrollTo('grave-map')}>
              📍 Bản Đồ Mộ
            </button>
            <button type="button" className="quickNavBtn" onClick={() => scrollTo('events')}>
              📜 Lịch Giỗ Kỵ
            </button>
            <button type="button" className="quickNavBtn" onClick={() => scrollTo('career')}>
              🎓 Khuyến Học
            </button>
            <button type="button" className="quickNavBtn" onClick={() => scrollTo('analytics')}>
              📊 Thống Kê
            </button>

            <span className="quickNavDivider">|</span>

            <button type="button" className="quickNavBtn modalBtn" onClick={onOpenSources} title="Xem Tư liệu gốc & ghi chú văn thư">
              📜 Tư Liệu Gốc
            </button>
            <button type="button" className="quickNavBtn modalBtn" onClick={onOpenPrivacy} title="Xem Chính sách riêng tư nội tộc">
              🔒 Quyền Riêng Tư
            </button>
          </div>
        </div>
      </nav>

      {/* Nút lướt nhanh về đầu trang khi cuộn xuống */}
      {showScrollTop && (
        <button
          type="button"
          className="scrollTopBtn"
          onClick={scrollToTop}
          title="Lướt nhanh về đầu trang"
        >
          ▲ Lên đầu trang
        </button>
      )}
    </>
  );
}
