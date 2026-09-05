import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import AudioAmbienceWidget from './AudioAmbienceWidget.jsx';

function canSeeAdmin(role) {
  return role === 'editor' || role === 'admin';
}

export default function Header({
  seniorMode,
  onToggleSeniorMode,
  onOpenKinship,
  onOpenContribution,
  onOpenAi,
  onOpenSources,
  onOpenPrivacy,
  onOpenQr,
  sidebarOpen: controlledSidebarOpen,
  onToggleSidebar,
}) {
  const auth = useAuth();
  const [internalSidebarOpen, setInternalSidebarOpen] = useState(false);
  const sidebarOpen = controlledSidebarOpen !== undefined ? controlledSidebarOpen : internalSidebarOpen;
  const setSidebarOpen = onToggleSidebar || setInternalSidebarOpen;
  const role = auth?.role || 'public';
  const showAdmin = canSeeAdmin(role);

  // Khóa scroll khi sidebar mở trên mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [sidebarOpen]);

  const handleLinkClick = (e, href) => {
    setSidebarOpen(false);
    if (href === '#kinship' && onOpenKinship) {
      onOpenKinship();
    }
  };

  const handlePrint = () => {
    setSidebarOpen(false);
    window.print();
  };

  return (
    <>
      <header className="siteHeader">
        <div className="wrap nav">
          {/* Logo Brand Tinh Tế Chuẩn Tỷ Lệ Vàng */}
          <a href="#" className="brand">
            <img src="/assets/seal-vu.png" alt="Triện Vũ" className="brandSeal" />
            <div className="brandTitles">
              <h2 className="brandMainTitle">GIA PHẢ HỌ VŨ · LÀNG MỘ TRẠCH</h2>
              <span className="brandSubTitle">Di sản Thủy tổ Vũ Hồn · Trao truyền muôn đời</span>
            </div>
          </a>

          {/* Quick Header Actions */}
          <div className="headerQuickActions">
            {/* Nhã Nhạc Di Sản & Chuông Khánh */}
            <AudioAmbienceWidget />

            {/* Nút Cụ Đồ Ảo AI */}
            {onOpenAi && (
              <button
                type="button"
                className="btn utilityBtn headerAiBtn"
                onClick={onOpenAi}
                title="Hỏi đáp cội nguồn và phả hệ với Cụ Đồ Ảo (Trợ lý Gia tộc AI)"
              >
                🧙 Cụ Đồ Ảo (AI)
              </button>
            )}

            <button
              type="button"
              className={`btn utilityBtn ${seniorMode ? 'activeSenior' : ''}`}
              onClick={onToggleSeniorMode}
              title="Phóng to chữ và tăng độ tương phản cho người cao niên"
            >
              {seniorMode ? '👓 Chữ chuẩn' : '👓 Chữ to (Bô lão)'}
            </button>

            <button
              type="button"
              className="btn utilityBtn contributionBtn"
              onClick={onOpenContribution}
              title="Đề xuất thêm con cháu mới sinh, sửa thông tin"
            >
              ✍️ Bổ sung phả hệ
            </button>

            <a
              href="https://zalo.me/0985578385"
              target="_blank"
              rel="noopener noreferrer"
              className="btn utilityBtn headerZaloBtn"
              title="Hotline/Zalo Ban liên lạc"
            >
              💬 Zalo: <b>0985.578.385</b>
            </a>

            {/* Nút Mã QR Web */}
            {onOpenQr && (
              <button
                type="button"
                className="btn utilityBtn headerQrBtn"
                onClick={onOpenQr}
                title="Mã QR quét bằng Zalo, Camera điện thoại để vào trang web và lưu vào màn hình chính"
              >
                📱 Mã QR Web
              </button>
            )}

            {/* Main Menu Button -> Mở Menu Trượt Bên Hông */}
            <button
              type="button"
              className="btn primary menuTriggerBtn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Mở danh mục gia tộc"
            >
              <span className="menuHamburgerIcon">☰</span>
              <span className="menuTriggerText">Menu Gia Tộc</span>
            </button>
          </div>
        </div>
      </header>

      {/* Off-canvas Navigation Drawer (Trượt từ bên hông sang) */}
      {sidebarOpen && (
        <div className="sidebarOverlay" onClick={() => setSidebarOpen(false)}>
          <aside
            className="sidebarDrawer"
            onClick={(e) => e.stopPropagation()}
            aria-label="Menu điều hướng gia tộc"
          >
            <div className="sidebarHeader">
              <div className="sidebarBrand">
                <img src="/assets/seal-vu.png" alt="" className="sidebarSeal" />
                <div>
                  <strong>Vũ Hồn Family OS</strong>
                  <span>Hệ thống Gia phả Di sản</span>
                </div>
              </div>
              <button
                type="button"
                className="sidebarCloseBtn"
                onClick={() => setSidebarOpen(false)}
                title="Đóng menu"
              >
                ✕
              </button>
            </div>

            <div className="sidebarBody">
              {/* Nhóm 1: Cội nguồn & Phả hệ */}
              <div className="navGroup">
                <div className="groupTitle">🏛 Cội Nguồn & Phả Hệ</div>
                <div className="groupLinks">
                  <a href="#home" onClick={(e) => handleLinkClick(e, '#home')}>
                    <span className="linkIcon">🏡</span> Trang chủ Từ đường
                  </a>
                  <a href="#tree" onClick={(e) => handleLinkClick(e, '#tree')}>
                    <span className="linkIcon">🌳</span> Cây Gia phả Tương tác
                  </a>
                  <a href="#kinship" onClick={(e) => handleLinkClick(e, '#kinship')}>
                    <span className="linkIcon">🧭</span> Bộ Tra cứu Xưng hô Họ tộc
                  </a>
                  <a href="#people" onClick={(e) => handleLinkClick(e, '#people')}>
                    <span className="linkIcon">📖</span> Danh bạ Thành viên Toàn họ
                  </a>
                </div>
              </div>

              {/* Nhóm 2: Tâm linh & Lễ tiết */}
              <div className="navGroup">
                <div className="groupTitle">🪔 Tâm Linh & Lễ Tiết</div>
                <div className="groupLinks">
                  <a href="#events" onClick={(e) => handleLinkClick(e, '#events')}>
                    <span className="linkIcon">📜</span> Lịch Giỗ Tổ & Văn khấn cúng Giỗ
                  </a>
                  <a href="#modules" onClick={(e) => handleLinkClick(e, '#modules')}>
                    <span className="linkIcon">🪦</span> Không gian Lăng mộ & Tọa độ GPS
                  </a>
                  {role !== 'public' && (
                    <a href="#grave-map" onClick={(e) => handleLinkClick(e, '#grave-map')}>
                      <span className="linkIcon">📍</span> Bản đồ Nghĩa trang Vệ tinh
                    </a>
                  )}
                </div>
              </div>

              {/* Nhóm 3: Đồng tộc & Khuyến học */}
              <div className="navGroup">
                <div className="groupTitle">🤝 Kết Nối & Khuyến Học</div>
                <div className="groupLinks">
                  <button
                    type="button"
                    className="sidebarNavActionBtn"
                    onClick={() => {
                      setSidebarOpen(false);
                      onOpenSources?.();
                    }}
                  >
                    <span className="linkIcon">📜</span> Tư Liệu Gốc & Thần Tích
                  </button>
                  <button
                    type="button"
                    className="sidebarNavActionBtn"
                    onClick={() => {
                      setSidebarOpen(false);
                      onOpenPrivacy?.();
                    }}
                  >
                    <span className="linkIcon">🔒</span> Chính Sách Riêng Tư
                  </button>
                  {onOpenQr && (
                    <button
                      type="button"
                      className="sidebarNavBtn qrSidebarNavBtn"
                      onClick={() => {
                        setSidebarOpen(false);
                        onOpenQr();
                      }}
                    >
                      <span className="linkIcon">📱</span> Mã QR Quét & Cài Ứng Dụng
                    </button>
                  )}
                  {role !== 'public' && (
                    <>
                      <a href="#internal-network" onClick={(e) => handleLinkClick(e, '#internal-network')}>
                        <span className="linkIcon">🌐</span> Mạng lưới Đồng tộc Toàn quốc
                      </a>
                      <a href="#career-mentor" onClick={(e) => handleLinkClick(e, '#career-mentor')}>
                        <span className="linkIcon">🎓</span> Hướng nghiệp & Cố vấn Thế hệ Trẻ
                      </a>
                    </>
                  )}
                  <a href="#analytics" onClick={(e) => handleLinkClick(e, '#analytics')}>
                    <span className="linkIcon">📊</span> Thống kê Truy cập Realtime
                  </a>
                </div>
              </div>

              {/* Nhóm 4: Hội đồng Gia tộc & Quản trị */}
              <div className="navGroup">
                <div className="groupTitle">⚙️ Quản Trị & Hội Đồng</div>
                <div className="groupLinks">
                  {showAdmin && (
                    <>
                      <a href="#governance" onClick={(e) => handleLinkClick(e, '#governance')}>
                        <span className="linkIcon">🏛</span> Hội đồng Gia tộc & Tộc biểu
                      </a>
                      <a href="#admin-cms" onClick={(e) => handleLinkClick(e, '#admin-cms')}>
                        <span className="linkIcon">✍️</span> Ban Biên tập CMS & Thẩm định
                      </a>
                    </>
                  )}
                  <a href="#auth" onClick={(e) => handleLinkClick(e, '#auth')}>
                    <span className="linkIcon">🔐</span> Đăng nhập & Phân quyền
                  </a>
                </div>
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="sidebarFooter">
              <div className="sidebarHotlineBox">
                <span>Hotline / Zalo Thường trực:</span>
                <a href="tel:0985578385" className="hotlineLink">📞 0985.578.385</a>
              </div>
              <button
                type="button"
                className="btn printSideBtn"
                onClick={handlePrint}
              >
                🖨 In Phả đồ / Xuất file giấy
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
