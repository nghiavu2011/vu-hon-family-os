import { useState, useEffect, useRef, useCallback } from 'react';
import { PageFlip } from 'page-flip';
import { DANG_VU_PHA_KY_PAGES } from '../data/dangVuPhaKyData.js';

// Khởi tạo 48 trang sách chuẩn cho Turn.js / StPageFlip HTML5 Engine
function createBookPagesDOM(pages) {
  const domPages = [];

  // 1. TRANG BÌA TRƯỚC (Front Cover - Hard)
  const coverFront = document.createElement('div');
  coverFront.className = 'turnjsPage turnjsCover turnjsCoverFront';
  coverFront.setAttribute('data-density', 'hard');
  coverFront.innerHTML = `
    <div class="turnjsCoverBorder">
      <div class="turnjsCoverCrest">
        <span class="turnjsCoverHan">鄧武譜記</span>
      </div>
      <div class="turnjsCoverHeader">
        <span class="coverSeriesTag">CỔ THƯ VĂN HIẾN · PHẢ HỌ ĐẶNG VŨ</span>
      </div>
      <h1 class="turnjsCoverTitle">ĐẶNG-VŨ PHẢ KÝ</h1>
      <h2 class="turnjsCoverSubTitle">鄧 武 譜 記</h2>
      <p class="turnjsCoverDesc">
        Sử điển khảo cứu cội nguồn dòng họ Vũ Hồn từ Mộ Trạch (Hải Dương) đến Hành Thiện (Nam Định)
      </p>
      <div class="turnjsCoverAuthor">
        <span class="authorRole">Biên khảo & Khảo chứng</span>
        <strong class="authorName">GS. ĐẶNG PHƯƠNG-NGHI</strong>
        <span class="authorOrg">Centre International d'Études Vietnamiennes (Paris)</span>
      </div>
      <div class="turnjsCoverSeal">
        <div class="sealSquare">
          <span>武族<br/>之寶</span>
        </div>
        <span class="sealText">VŨ TỘC ĐẠI TÔN TRIỆN</span>
      </div>
      <div class="turnjsCoverHint">
        <span>✦ Kéo góc trang hoặc nhấp mép sách để lật ✦</span>
      </div>
    </div>
  `;
  domPages.push(coverFront);

  // 2. 22 HỒI = 44 TRANG SÁCH MỀM (Soft Pages)
  pages.forEach((p) => {
    // Trang Trái: TRANH MINH HỌA MÀU NƯỚC
    const pageLeft = document.createElement('div');
    pageLeft.className = 'turnjsPage turnjsPageLeft';
    pageLeft.setAttribute('data-density', 'soft');
    pageLeft.innerHTML = `
      <div class="turnjsInner">
        <div class="turnjsTopBadge">
          <span class="topBadgeText">鄧武譜記 · HỒI THỨ ${p.pageNumber}</span>
          <span class="topBadgeSeal">印</span>
        </div>
        <div class="turnjsArtFrame">
          <img src="${p.image}" alt="${p.title}" class="turnjsImg" loading="lazy" onerror="if(this.src.endsWith('.webp')) this.src='${p.fallbackImage}'" />
          <div class="turnjsArtCaption">
            <span class="artCaptionTitle">${p.title}</span>
            <span class="artCaptionSub">Hình họa Hồi ${p.pageNumber} · Màu nước trên giấy Dó</span>
          </div>
        </div>
        <div class="turnjsPageNumber">
          <span>— ${p.pageNumber * 2 - 1} —</span>
        </div>
      </div>
      <div class="turnjsSpineGutter spineGutterRight"></div>
    `;
    domPages.push(pageLeft);

    // Trang Phải: CHÍNH VĂN SỬ LIỆU & ĐIỂN TÍCH
    const pageRight = document.createElement('div');
    pageRight.className = 'turnjsPage turnjsPageRight';
    pageRight.setAttribute('data-density', 'soft');

    const quoteHtml = p.quote
      ? `<blockquote class="turnjsQuote"><p>${p.quote}</p></blockquote>`
      : '';
    const notesHtml = p.notes
      ? `<div class="turnjsNotes"><small>📚 ${p.notes}</small></div>`
      : '';

    pageRight.innerHTML = `
      <div class="turnjsInner">
        <div class="turnjsPageHead">
          <span class="headChapter">HỒI THỨ ${p.pageNumber}</span>
          <span class="headSub">${p.subtitle}</span>
        </div>
        <div class="turnjsPageContent">
          <h3 class="turnjsStoryHeading">${p.title}</h3>
          <p class="turnjsStoryText">${p.story}</p>
          <div class="turnjsFactBox">
            <div class="factHead">
              <span class="factIcon">🏛</span>
              <strong>Sử Liệu Đặng-Vũ Phả Ký:</strong>
            </div>
            <p class="factText">${p.historicalFact}</p>
          </div>
          ${quoteHtml}
          ${notesHtml}
        </div>
        <div class="turnjsPageNumber">
          <span>— ${p.pageNumber * 2} —</span>
        </div>
      </div>
      <div class="turnjsSpineGutter spineGutterLeft"></div>
    `;
    domPages.push(pageRight);
  });

  // 3. TRANG KẾT: HẬU TỪ & BẢN QUYỀN SỐ HÓA (Pages 45 & 46 - Soft)
  const epilogue = document.createElement('div');
  epilogue.className = 'turnjsPage turnjsPageLeft turnjsEndingPage';
  epilogue.setAttribute('data-density', 'soft');
  epilogue.innerHTML = `
    <div class="turnjsInner">
      <div class="turnjsTopBadge">
        <span class="topBadgeText">HẬU TỪ · LỜI BẠT KẾT BỘ PHẢ KÝ</span>
      </div>
      <div class="turnjsPageContent endingContent">
        <h3 class="turnjsStoryHeading" style="color: #8b2500;">UỐNG NƯỚC NHỚ NGUỒN</h3>
        <p class="turnjsStoryText">
          Hai mươi hai trang khảo luận của Giáo sư Đặng Phương-Nghi không chỉ là tư liệu phả học mẫu mực 
          mà còn là khúc tráng ca về tinh thần hiếu học, ý chí tự lực tự cường của dòng họ Vũ Hồn suốt hơn nghìn năm văn hiến.
        </p>
        <p class="turnjsStoryText">
          Từ Mộ Trạch cổ ấp đến đất phát tích Hành Thiện, mỗi thế hệ con cháu họ Vũ luôn giữ trọn đạo nghĩa gia phong, 
          đóng góp rường cột cho xã tắc và làm rạng danh tiên tổ.
        </p>
        <div class="turnjsFactBox">
          <div class="factHead">
            <span class="factIcon">📜</span>
            <strong>Lời Cảm Tạ Tiên Hiền:</strong>
          </div>
          <p class="factText">
            "Mộc xuất vu căn, thụ tiêu diệp mậu; Thủy lưu vu nguyên, giang thâm lưu trường."  
            (Cây có gốc mới nở cành xanh ngọn; Nước có nguồn mới chảy xiết thành sông rộng.)
          </p>
        </div>
      </div>
      <div class="turnjsPageNumber">
        <span>— 45 —</span>
      </div>
    </div>
    <div class="turnjsSpineGutter spineGutterRight"></div>
  `;
  domPages.push(epilogue);

  const colophon = document.createElement('div');
  colophon.className = 'turnjsPage turnjsPageRight turnjsEndingPage';
  colophon.setAttribute('data-density', 'soft');
  colophon.innerHTML = `
    <div class="turnjsInner">
      <div class="turnjsTopBadge">
        <span class="topBadgeText">BẢO TỒN DI SẢN KỸ THUẬT SỐ</span>
      </div>
      <div class="turnjsPageContent endingContent">
        <h3 class="turnjsStoryHeading" style="color: #8b2500;">XUẤT BẢN SỐ HÓA</h3>
        <div class="colophonMeta">
          <p><strong>Tác phẩm:</strong> ĐẶNG-VŨ PHẢ KÝ (鄧武譜記)</p>
          <p><strong>Nguyên tác:</strong> GS. Đặng Phương-Nghi (1930 - 2024)</p>
          <p><strong>Cơ quan lưu trữ:</strong> Trung tâm Quốc tế Nghiên cứu Việt Nam (C.I.E.V Paris)</p>
          <p><strong>Bản quyền số hóa:</strong> Hội đồng Dòng họ Vũ Hồn Việt Nam lưu truyền bách thế</p>
        </div>
        <div class="sealSquareLarge">
          <span>萬代<br/>長存</span>
        </div>
        <p style="text-align: center; color: #7a5839; font-size: 0.9rem; margin-top: 10px;">
          Lưu truyền bách thế · Trao gửi tương lai
        </p>
      </div>
      <div class="turnjsPageNumber">
        <span>— 46 —</span>
      </div>
    </div>
    <div class="turnjsSpineGutter spineGutterLeft"></div>
  `;
  domPages.push(colophon);

  // 4. BÌA SAU (Back Cover - Hard)
  const coverBack = document.createElement('div');
  coverBack.className = 'turnjsPage turnjsCover turnjsCoverBack';
  coverBack.setAttribute('data-density', 'hard');
  coverBack.innerHTML = `
    <div class="turnjsCoverBorder">
      <div class="turnjsCoverCrest">
        <span class="turnjsCoverHan">萬代長存</span>
      </div>
      <div class="turnjsBackSealWrap">
        <div class="sealSquareBig">
          <span>武族<br/>永昌</span>
        </div>
      </div>
      <h2 class="turnjsBackTitle">VŨ TỘC ĐẠI TÔN</h2>
      <p class="turnjsBackMotto">
        "Đồng tâm hợp lực · Kính tổ phụng tông · Hiếu học thành tài · Tác phúc lưu ân"
      </p>
      <div class="turnjsBackFooter">
        <span>VŨ HỒN FAMILY OS · 2026</span>
      </div>
    </div>
  `;
  domPages.push(coverBack);

  return domPages;
}

export default function DangVuPhaKyBook() {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0); // 0 to 21
  const [currentPageNum, setCurrentPageNum] = useState(0); // 0 to 47
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState('book'); // 'book' | 'fulltext'

  const bookContainerRef = useRef(null);
  const flipMountRef = useRef(null);
  const pageFlipRef = useRef(null);
  const audioRef = useRef(null);

  const totalStories = DANG_VU_PHA_KY_PAGES.length;
  const current = DANG_VU_PHA_KY_PAGES[currentStoryIndex] || DANG_VU_PHA_KY_PAGES[0];

  // Khởi tạo audio lật sách bằng file page-flip.mp3 người dùng cung cấp
  useEffect(() => {
    const audio = new Audio('/assets/audio/page-flip.mp3');
    audio.preload = 'auto';
    audioRef.current = audio;
  }, []);

  const playPageFlipSound = useCallback(() => {
    if (!soundEnabled || !audioRef.current) return;
    try {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
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
      }
    } catch (_) {}
  }, [soundEnabled]);

  // Khởi tạo PageFlip (Turn.js HTML5 Engine) khi ở chế độ sách lật
  useEffect(() => {
    if (viewMode !== 'book' || !flipMountRef.current) return;

    // Tạo host DOM node cách ly hoàn toàn khỏi React Virtual DOM diffing
    const host = document.createElement('div');
    host.className = 'turnjsBookHost';
    flipMountRef.current.innerHTML = '';
    flipMountRef.current.appendChild(host);

    const isMobile = window.innerWidth < 768;
    const settings = {
      width: isMobile ? 360 : 520,
      height: isMobile ? 540 : 720,
      size: 'stretch',
      minWidth: 280,
      maxWidth: 620,
      minHeight: 420,
      maxHeight: 840,
      maxShadowOpacity: 0.65,
      showCover: true,
      mobileScrollSupport: false,
      drawShadow: true,
      flippingTime: 650,
      usePortrait: true,
      startPage: 0,
      showPageCorners: true,
      disableFlipByClick: false,
    };

    const pageFlip = new PageFlip(host, settings);
    pageFlipRef.current = pageFlip;

    const domPages = createBookPagesDOM(DANG_VU_PHA_KY_PAGES);
    pageFlip.loadFromHTML(domPages);

    // Bắt sự kiện lật trang để phát âm thanh chuẩn
    pageFlip.on('changeState', (e) => {
      if (e.data === 'flipping') {
        playPageFlipSound();
      }
    });

    // Đồng bộ số trang và mục lục hiện tại
    pageFlip.on('flip', (e) => {
      const pageIndex = e.data;
      setCurrentPageNum(pageIndex);

      if (pageIndex >= 1 && pageIndex <= 44) {
        const sIdx = Math.floor((pageIndex - 1) / 2);
        setCurrentStoryIndex(sIdx);
      }
    });

    return () => {
      try {
        pageFlip.destroy();
      } catch (_) {}
      pageFlipRef.current = null;
    };
  }, [viewMode, playPageFlipSound]);

  // Nút điều hướng sách
  const goToNextPage = useCallback(() => {
    pageFlipRef.current?.flipNext('top');
  }, []);

  const goToPrevPage = useCallback(() => {
    pageFlipRef.current?.flipPrev('top');
  }, []);

  const jumpToStory = useCallback((index) => {
    if (viewMode !== 'book') {
      setCurrentStoryIndex(index);
      return;
    }
    const targetPage = index * 2 + 1;
    pageFlipRef.current?.flip(targetPage, 'top');
    setCurrentStoryIndex(index);
  }, [viewMode]);

  const jumpToCover = useCallback(() => {
    pageFlipRef.current?.flip(0, 'top');
  }, []);

  const jumpToEnd = useCallback(() => {
    pageFlipRef.current?.flip(45, 'top');
  }, []);

  // Phím tắt bàn phím ← và →
  useEffect(() => {
    const handleKeyDown = (e) => {
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
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      setTimeout(() => {
        pageFlipRef.current?.update();
      }, 100);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Tiêu đề trạng thái hiển thị
  const getDisplayLocation = () => {
    if (currentPageNum === 0) {
      return 'Bìa Trước · ĐẶNG-VŨ PHẢ KÝ (鄧武譜記)';
    }
    if (currentPageNum >= 45 && currentPageNum <= 46) {
      return 'Hậu Từ · Lời Bạt & Xuất Bản Số Hóa';
    }
    if (currentPageNum >= 47) {
      return 'Bìa Sau · Vũ Tộc Đại Tôn Triện';
    }
    return `Hồi ${current.pageNumber} / ${totalStories}: ${current.title}`;
  };

  return (
    <section id="dang-vu-pha-ky" className="dangVuSection wrap" ref={bookContainerRef}>
      {/* Tiêu đề phân đoạn mang đậm bản sắc văn hiến */}
      <div className="sectionHeader" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div className="sectionBadge">
          <span>📜 CỔ THƯ VĂN HIẾN · 22 HỒI KHẢO LUẬN</span>
        </div>
        <h2 className="sectionTitle" style={{ fontSize: '2.1rem', color: '#8b2500', margin: '8px 0' }}>
          ĐẶNG-VŨ PHẢ KÝ (鄧武譜記)
        </h2>
        <p className="sectionSubTitle" style={{ color: '#555', maxWidth: '820px', margin: '0 auto' }}>
          Tác phẩm phả học kinh điển của <strong>GS. Đặng Phương-Nghi</strong> (Centre International d'Études Vietnamiennes, Paris) — 
          Khảo cứu cội nguồn phát tích từ Mộ Trạch (Hải Dương) đến đất học Hành Thiện (Nam Định).
        </p>
      </div>

      {/* Thanh điều khiển cuốn sách (Book Toolbar) */}
      <div className="bookToolbar">
        <div className="bookPageIndicator">
          <span className="pageCounter">
            {currentPageNum === 0 || currentPageNum >= 45 ? (
              <strong>{getDisplayLocation()}</strong>
            ) : (
              <>
                Trang <strong>{current.pageNumber}</strong> / {totalStories}
                <span className="chapterTag">· {getDisplayLocation()}</span>
              </>
            )}
          </span>
        </div>

        <div className="bookActions">
          {/* Lối tắt Về Bìa */}
          <button
            type="button"
            className="btn utilityBtn"
            onClick={jumpToCover}
            title="Về bìa trước của sách"
          >
            📕 Về Bìa
          </button>

          {/* Lối tắt Đến Hậu Từ */}
          <button
            type="button"
            className="btn utilityBtn"
            onClick={jumpToEnd}
            title="Xem Lời Bạt & Hậu Từ"
          >
            📜 Hậu Từ
          </button>

          {/* Nút Bật/Tắt âm thanh lật sách */}
          <button
            type="button"
            className={`btn utilityBtn ${soundEnabled ? 'activeSound' : ''}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Đang bật âm thanh lật trang' : 'Đã tắt âm thanh'}
          >
            {soundEnabled ? '🔊 Âm thanh: BẬT' : '🔇 Âm thanh: TẮT'}
          </button>

          {/* Chế độ xem: Sách lật hoặc Bản văn chi tiết */}
          <button
            type="button"
            className="btn utilityBtn"
            onClick={() => setViewMode(viewMode === 'book' ? 'fulltext' : 'book')}
            title="Chuyển đổi chế độ đọc"
          >
            {viewMode === 'book' ? '📑 Đọc Văn Bản Chi Tiết' : '📖 Chế Độ Sách Lật'}
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

      {/* GIAO DIỆN SÁCH LẬT CỔ */}
      {viewMode === 'book' ? (
        <div className="turnjsBookPerspectiveWrapper">
          <div className="turnjsBookStage">
            {/* Vùng gắn sách lật */}
            <div className="turnjsFlipMount" ref={flipMountRef} />

            {/* Nút lật sang trái nổi hai bên */}
            <button
              type="button"
              className="flipNavBtn prevBtn turnjsFloatingNav"
              onClick={goToPrevPage}
              title="Lật về trang trước (Phím mũi tên Trái)"
              aria-label="Trang trước"
            >
              ❮
            </button>

            {/* Nút lật sang phải nổi hai bên */}
            <button
              type="button"
              className="flipNavBtn nextBtn turnjsFloatingNav"
              onClick={goToNextPage}
              title="Lật sang trang sau (Phím mũi tên Phải)"
              aria-label="Trang sau"
            >
              ❯
            </button>
          </div>

          <div className="turnjsUsageHint">
            <span>💡 <em>Mẹo đọc:</em> Quý vị có thể lật trang bằng cách <strong>nhấp hoặc kéo mép sách</strong>, dùng phím mũi tên <strong>← / →</strong> trên bàn phím, hoặc chọn từng Hồi ở mục lục 22 trang bên dưới.</span>
          </div>
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
          <span>📚 Mục Lục 22 Trang (Nhấp để lật nhanh đến hồi):</span>
        </div>
        <div className="thumbList">
          {DANG_VU_PHA_KY_PAGES.map((page, idx) => (
            <button
              key={page.pageNumber}
              type="button"
              className={`thumbItem ${idx === currentStoryIndex ? 'activeThumb' : ''}`}
              onClick={() => jumpToStory(idx)}
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
