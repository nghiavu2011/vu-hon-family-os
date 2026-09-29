import { useState, useEffect, useRef, useCallback } from 'react';
import { DANG_VU_PHA_KY_PAGES } from '../data/dangVuPhaKyData.js';

export default function DangVuPhaKyBook() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0); // 0 to 21
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('next'); // 'next' | 'prev'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState('book'); // 'book' | 'fulltext'

  const bookContainerRef = useRef(null);
  const audioRef = useRef(null);

  const totalPages = DANG_VU_PHA_KY_PAGES.length;
  const current = DANG_VU_PHA_KY_PAGES[currentPageIndex];

  // Khởi tạo audio lật sách
  useEffect(() => {
    audioRef.current = new Audio('/assets/audio/page-flip.mp3');
    audioRef.current.preload = 'auto';
  }, []);

  const playPageFlipSound = useCallback(() => {
    if (!soundEnabled || !audioRef.current) return;
    try {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Fallback Web Audio API synthetic paper rustle if browser blocked autoplay
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const bufferSize = ctx.sampleRate * 0.15;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.value = 1200;
          noise.connect(filter);
          filter.connect(ctx.destination);
          noise.start();
        } catch (_) {}
      });
    } catch (_) {}
  }, [soundEnabled]);

  const goToNextPage = useCallback(() => {
    if (currentPageIndex < totalPages - 1 && !isFlipping) {
      setFlipDirection('next');
      setIsFlipping(true);
      playPageFlipSound();
      setTimeout(() => {
        setCurrentPageIndex((prev) => prev + 1);
        setIsFlipping(false);
      }, 350);
    }
  }, [currentPageIndex, totalPages, isFlipping, playPageFlipSound]);

  const goToPrevPage = useCallback(() => {
    if (currentPageIndex > 0 && !isFlipping) {
      setFlipDirection('prev');
      setIsFlipping(true);
      playPageFlipSound();
      setTimeout(() => {
        setCurrentPageIndex((prev) => prev - 1);
        setIsFlipping(false);
      }, 350);
    }
  }, [currentPageIndex, isFlipping, playPageFlipSound]);

  const jumpToPage = useCallback((index) => {
    if (index !== currentPageIndex && !isFlipping) {
      setFlipDirection(index > currentPageIndex ? 'next' : 'prev');
      setIsFlipping(true);
      playPageFlipSound();
      setTimeout(() => {
        setCurrentPageIndex(index);
        setIsFlipping(false);
      }, 300);
    }
  }, [currentPageIndex, isFlipping, playPageFlipSound]);

  // Phím tắt bàn phím ← và →
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Chỉ kích hoạt khi đang focus vào vùng sách hoặc màn hình toàn cảnh
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextPage, goToPrevPage]);

  // Toàn màn hình toggle
  const toggleFullscreen = () => {
    if (!bookContainerRef.current) return;
    if (!document.fullscreenElement) {
      bookContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <section id="dang-vu-pha-ky" className="dangVuSection wrap" ref={bookContainerRef}>
      {/* Tiêu đề Phân đoạn mang đậm bản sắc văn hiến */}
      <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div className="sectionBadge">
          <span>📜 CỔ THƯ VĂN HIẾN · 22 TRANG MINH HỌA</span>
        </div>
        <h2 className="sectionTitle" style={{ fontSize: '2.1rem', color: '#8b2500', margin: '8px 0' }}>
          ĐẶNG-VŨ PHẢ KÝ (鄧武譜記)
        </h2>
        <p className="sectionSubTitle" style={{ color: '#555', maxWidth: '800px', margin: '0 auto' }}>
          Tác phẩm phả học kinh điển của <strong>GS. Đặng Phương-Nghi</strong> (Centre International d'Études Vietnamiennes, Paris) — 
          Hành trình từ cội nguồn Mộ Trạch (Hải Dương) đến mảnh đất cá chép Hành Thiện (Nam Định).
        </p>
      </div>

      {/* Thanh điều khiển cuốn sách (Book Toolbar) */}
      <div className="bookToolbar">
        <div className="bookPageIndicator">
          <span className="pageCounter">
            Trang <strong>{current.pageNumber}</strong> / {totalPages}
          </span>
          <span className="chapterTag">· Hồi {current.pageNumber}: {current.title}</span>
        </div>

        <div className="bookActions">
          {/* Nút Bật/Tắt âm thanh lật sách */}
          <button
            type="button"
            className={`btn utilityBtn ${soundEnabled ? 'activeSound' : ''}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Đang bật âm thanh lật sách (Pixabay Flipping Sound)' : 'Đã tắt âm thanh lật sách'}
          >
            {soundEnabled ? '🔊 Âm thanh lật: BẬT' : '🔇 Âm thanh lật: TẮT'}
          </button>

          {/* Chế độ xem: Lật sách hoặc Sử liệu đầy đủ */}
          <button
            type="button"
            className="btn utilityBtn"
            onClick={() => setViewMode(viewMode === 'book' ? 'fulltext' : 'book')}
            title="Chuyển đổi giao diện đọc sách"
          >
            {viewMode === 'book' ? '📑 Đọc Văn Bản Chi Tiết' : '📖 Chế Độ Sách Lật 3D'}
          </button>

          {/* Nút Toàn màn hình */}
          <button
            type="button"
            className="btn utilityBtn"
            onClick={toggleFullscreen}
            title="Đọc toàn màn hình chìm đắm"
          >
            {isFullscreen ? '🗗 Thu nhỏ' : '🗖 Toàn màn hình'}
          </button>
        </div>
      </div>

      {/* GIAO DIỆN SÁCH LẬT 3D (3D OPEN BOOK SPREAD) */}
      {viewMode === 'book' ? (
        <div className="bookPerspectiveWrapper">
          <div className={`bookSpread ${isFlipping ? `flipping-${flipDirection}` : ''}`}>
            {/* TRANG BÊN TRÁI: TRANH MINH HỌA MÀU NƯỚC TINH TẾ */}
            <div className="bookPage bookPageLeft">
              <div className="pageWatermarkSeal">
                <span>鄧武譜記</span>
              </div>
              
              <div className="illustrationFrame">
                <img
                  src={current.image}
                  alt={current.title}
                  className="watercolorImg"
                  onError={(e) => {
                    // Fallback sang png nếu cần
                    if (e.target.src.endsWith('.webp')) {
                      e.target.src = current.fallbackImage;
                    }
                  }}
                  loading="eager"
                />
                <div className="illustrationCaption">
                  <span className="captionTitle">{current.title}</span>
                  <span className="captionPage">Hình họa trang {current.pageNumber} · Màu nước trên giấy Dó</span>
                </div>
              </div>

              {/* Nếp gáy sách cổ ở cạnh phải trang trái */}
              <div className="bookGutterLeft" />
            </div>

            {/* TRANG BÊN PHẢI: BÀI TRUYỆN & CHÍNH VĂN SỬ LIỆU */}
            <div className="bookPage bookPageRight">
              <div className="bookPageHeader">
                <span className="bookHeaderCat">HỒI THỨ {current.pageNumber}</span>
                <span className="bookHeaderSub">{current.subtitle}</span>
              </div>

              <div className="bookPageBody">
                <h3 className="storyTitle">{current.title}</h3>
                
                {/* Lời dẫn truyện văn phong truyền cảm */}
                <p className="storyNarrative">{current.story}</p>

                {/* Khung Trích dẫn Sử Liệu Gốc / Điển tích */}
                <div className="historicalFactBox">
                  <div className="factHeader">
                    <span className="factIcon">🏛</span>
                    <strong>Sử Liệu Đặng-Vũ Phả Ký:</strong>
                  </div>
                  <p className="factContent">{current.historicalFact}</p>
                </div>

                {/* Câu đối / Danh ngôn / Thơ Nôm */}
                {current.quote && (
                  <blockquote className="poeticQuote">
                    <p>{current.quote}</p>
                  </blockquote>
                )}

                {/* Chú thích nguồn tài liệu khảo cứu */}
                {current.notes && (
                  <div className="pageFootnotes">
                    <small>📚 {current.notes}</small>
                  </div>
                )}
              </div>

              <div className="bookPageFooter">
                <span className="pageNumberDisplay">— {current.pageNumber} —</span>
              </div>

              {/* Nếp gáy sách cổ ở cạnh trái trang phải */}
              <div className="bookGutterRight" />
            </div>
          </div>

          {/* Nút lật trang trái & phải nổi hai bên sách */}
          <button
            type="button"
            className="flipNavBtn prevBtn"
            onClick={goToPrevPage}
            disabled={currentPageIndex === 0}
            title="Lật về trang trước (Phím mũi tên Trái)"
            aria-label="Trang trước"
          >
            ❮
          </button>

          <button
            type="button"
            className="flipNavBtn nextBtn"
            onClick={goToNextPage}
            disabled={currentPageIndex === totalPages - 1}
            title="Lật sang trang sau (Phím mũi tên Phải)"
            aria-label="Trang sau"
          >
            ❯
          </button>
        </div>
      ) : (
        /* GIAO DIỆN ĐỌC SỬ LIỆU CHI TIẾT (FULL TEXT RESEARCH VIEW) */
        <div className="fulltextResearchView">
          <div className="fulltextHeader">
            <h3>Toàn Văn Nghiên Cứu Lịch Sử: Hồi {current.pageNumber} - {current.title}</h3>
            <p>Trích xuất từ bản in 48 trang sách gấp lưu trữ tại Trung tâm Quốc tế Nghiên cứu Việt Nam (Paris).</p>
          </div>

          <div className="fulltextContentGrid">
            <div className="fulltextImageCol">
              <img src={current.image} alt={current.title} className="fulltextArt" />
              <p className="fulltextCaption">{current.title} (Trang {current.pageNumber})</p>
            </div>
            <div className="fulltextBodyCol">
              <h4>Bối cảnh & Phân tích phả học:</h4>
              <p>{current.story}</p>
              
              <div className="historicalFactBox">
                <strong>Văn bản sử liệu gốc:</strong>
                <p>{current.historicalFact}</p>
              </div>

              {current.quote && (
                <blockquote className="poeticQuote">
                  <p>{current.quote}</p>
                </blockquote>
              )}

              <p className="fulltextNote"><strong>Nguồn tài liệu:</strong> {current.notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* DẢI ĐIỀU HƯỚNG NHANH 22 TRANG (THUMBNAIL CAROUSEL) */}
      <div className="bookThumbnailsContainer">
        <div className="thumbLabel">
          <span>📚 Mục Lục 22 Trang (Nhấp để lật nhanh):</span>
        </div>
        <div className="thumbList">
          {DANG_VU_PHA_KY_PAGES.map((page, idx) => (
            <button
              key={page.pageNumber}
              type="button"
              className={`thumbItem ${idx === currentPageIndex ? 'activeThumb' : ''}`}
              onClick={() => jumpToPage(idx)}
              title={`Trang ${page.pageNumber}: ${page.title}`}
            >
              <div className="thumbImgWrap">
                <img
                  src={page.image}
                  alt=""
                  onError={(e) => {
                    if (e.target.src.endsWith('.webp')) {
                      e.target.src = page.fallbackImage;
                    }
                  }}
                  loading="lazy"
                />
                <span className="thumbNumber">{page.pageNumber}</span>
              </div>
              <span className="thumbTitle">{page.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
