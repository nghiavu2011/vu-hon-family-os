export default function HeritageVideoSection() {
  return (
    <section className="section wrap" id="heritage-video">
      <div className="sectionHead">
        <div>
          <h2>Thước Phim Di Sản · Nguồn Gốc Dòng Họ Vũ - Võ Tại Việt Nam</h2>
          <p className="sub">
            Tư liệu quý ghi chép lịch sử khởi thủy, công đức Đức Thủy tổ Vũ Hồn và cái nôi danh gia Mộ Trạch lưu truyền muôn đời con cháu.
          </p>
        </div>
        <div className="videoBadge">
          <span>🎬 Phim Tư Liệu Lịch Sử</span>
        </div>
      </div>

      <div className="videoCardShell">
        <div className="videoWrapper">
          <video
            controls
            preload="metadata"
            poster="/assets/hero-gate.png"
            className="heritageVideoPlayer"
          >
            <source src="/assets/video/nguon-goc-dong-ho-vu-vo.mp4" type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ phát video HTML5.
          </video>
        </div>

        <div className="videoInfoBox">
          <div className="videoSourceMeta">
            <span className="sourceTag">📜 Nguồn tư liệu: Việt Sử Toàn Thư · Hội đồng Dòng họ Vũ - Võ Việt Nam</span>
            <span className="sourceTag">🎙 Tác giả / Biên soạn: Vũ Hồng Chương</span>
          </div>
          <h3>Cội nguồn phát tích dòng họ Vũ - Võ ngàn năm văn hiến</h3>
          <p>
            Thước phim tái hiện tiến trình lịch sử từ thời Đức Thủy tổ <b>Vũ Hồn (804 – 853)</b>, danh nhân đỗ Tiến sĩ khoa Ất Mão thời Đường, được bổ nhiệm chức An Nam Đô hộ sứ. Ngài đã chọn đất lập trang ấp, khai sáng làng <b>Mộ Trạch (Hải Dương)</b> – vùng đất địa linh nhân kiệt nức tiếng thiên hạ với 36 vị Tiến sĩ thời phong kiến.
          </p>
          <div className="videoHighlights">
            <div className="vhItem">
              <b>🏛 Đức Thủy tổ Vũ Hồn</b>
              <span>Thành hoàng làng Mộ Trạch, Thủy tổ muôn nhánh họ Vũ - Võ.</span>
            </div>
            <div className="vhItem">
              <b>🏮 Lò tiến sĩ xứ Đông</b>
              <span>Truyền thống hiếu học, đỗ đạt đại khoa truyền thừa nghìn năm.</span>
            </div>
            <div className="vhItem">
              <b>🤝 Trao truyền muôn đời</b>
              <span>Con cháu đồng tâm gìn giữ cội nguồn, hướng về Tiên tổ.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
