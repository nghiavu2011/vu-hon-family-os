export default function Footer({ onOpenSources, onOpenPrivacy }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="siteFooter">
      {/* Khối Hoành phi / Câu đối Làng Mộ Trạch */}
      <div className="footerCoupletBanner">
        <div className="wrap coupletInner">
          <div className="coupletLine">
            <b>« Mộ Trạch danh gia thiên hạ hữu »</b>
          </div>
          <div className="coupletDivider">🏮</div>
          <div className="coupletLine">
            <b>« Thi thư kế thế cổ kim truyền »</b>
          </div>
        </div>
      </div>

      <div className="wrap footerMain">
        <div className="footerGrid4">
          {/* Cột 1: Cội nguồn & Thần tích */}
          <div className="footerCol">
            <div className="footerBrand">
              <img src="/assets/seal-vu.png" alt="Triện Vũ" className="footerSeal" />
              <div>
                <h4>DÒNG HỌ VŨ - VÕ VIỆT NAM</h4>
                <p className="footerSubtitle">Vọng tộc Mộ Trạch · Hải Dương</p>
              </div>
            </div>
            <p className="footerAboutText">
              Phụng thờ Đức Thủy tổ <b>Vũ Hồn (804 – 853)</b>, Thành hoàng làng Mộ Trạch – cái nôi "Lò tiến sĩ" lừng danh đất Việt với 36 vị đại khoa thời phong kiến. Nền tảng số hóa gìn giữ muôn đời cho con cháu.
            </p>
            <div className="footerMotto">
              <i>"Uống nước nhớ nguồn – Trao truyền đạo hiếu"</i>
            </div>
          </div>

          {/* Cột 2: Cổng Tra cứu Nhanh */}
          <div className="footerCol">
            <h4 className="footerColTitle">🏛 Tra Cứu & Di Sản Số</h4>
            <ul className="footerLinks">
              <li><a href="#tree">🌳 Cây Gia phả Tương tác</a></li>
              <li><a href="#kinship">🧭 Bộ Tra cứu Xưng hô Họ tộc</a></li>
              <li><a href="#events">📜 Lịch Giỗ Tổ & Văn khấn Nôm</a></li>
              <li><a href="#grave-map">🪦 Định vị Lăng mộ & Tọa độ GPS</a></li>
              <li><a href="#people">📖 Danh bạ Thành viên Toàn họ</a></li>
              <li>
                <button type="button" className="footerTextActionBtn" onClick={onOpenSources}>
                  📜 Tư liệu gốc & Ghi chú văn thư
                </button>
              </li>
              <li>
                <button type="button" className="footerTextActionBtn" onClick={onOpenPrivacy}>
                  🔒 Chính sách riêng tư nội tộc
                </button>
              </li>
              <li><a href="#analytics">📊 Thống kê Truy cập Realtime</a></li>
            </ul>
          </div>

          {/* Cột 3: Địa chỉ Từ đường & Hành hương */}
          <div className="footerCol">
            <h4 className="footerColTitle">📍 Từ Đường & Lễ Hội</h4>
            <div className="footerContactItem">
              <b>🏛 Từ đường Thủy tổ Vũ Hồn:</b>
              <span>Thôn Mộ Trạch, xã Tân Hồng, huyện Bình Giang, tỉnh Hải Dương.</span>
            </div>
            <div className="footerContactItem">
              <b>🏮 Đại lễ Giỗ Tổ Dòng họ:</b>
              <span>Mùng 8 tháng Giêng Âm lịch hàng năm (Hàng vạn con cháu muôn phương tụ hội).</span>
            </div>
            <div className="footerContactItem">
              <b>🤝 Quỹ Khuyến học Vũ Hồn:</b>
              <span>Vinh danh hiền tài, trao học bổng cho con cháu học giỏi vượt khó.</span>
            </div>
          </div>

          {/* Cột 4: Thường trực Ban Liên Lạc */}
          <div className="footerCol">
            <h4 className="footerColTitle">📞 Thường Trực Ban Liên Lạc</h4>
            <p className="footerContactDesc">
              Tiếp nhận khai sinh cháu mới, đính chính tư liệu gia phả và trợ duyên con cháu về nguồn 24/7:
            </p>
            <div className="footerHotlineCard">
              <span className="hotlineLabel">Hotline & Zalo Trực Tiếp:</span>
              <a href="https://zalo.me/0985578385" target="_blank" rel="noopener noreferrer" className="footerHotlineLink">
                💬 0985.578.385
              </a>
              <a href="tel:0985578385" className="footerCallBtn">
                📞 Gọi điện: 0985.578.385
              </a>
            </div>
            <div className="footerEmailText">
              ✉️ Email: <span>nghiavu2011@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Thanh Bản quyền & Cam kết Bảo mật */}
        <div className="footerBottomBar">
          <div className="footerCopyright">
            <span>© {currentYear} <b>Vũ Hồn Family OS (v24.1)</b> · Bản quyền di sản số thuộc Hội đồng Dòng họ Vũ - Võ Việt Nam.</span>
          </div>
          <div className="footerBadges">
            <button type="button" className="footerBadgeBtn" onClick={onOpenPrivacy}>
              🔒 Bảo vệ Quyền riêng tư RLS
            </button>
            <button type="button" className="footerBadgeBtn" onClick={onOpenSources}>
              📜 Liêm chính Sử liệu Mộ Trạch
            </button>
            <span className="footerBadge">⚡ PWA Offline Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
