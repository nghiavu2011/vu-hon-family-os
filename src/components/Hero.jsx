export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="wrap heroInner">
        <aside className="hanomRail">
          <div>武魂族譜</div>
        </aside>

        <div className="heroCopy">
          <span className="eyebrow">👑 Tộc Phả Số Di Sản · Làng Mộ Trạch</span>
          <h1>Gia phả họ Vũ Hồn</h1>
          <div className="hanTitle">武 魂 族 譜</div>
          <p>
            <b>Tìm về cội nguồn – Kết nối hiện tại – Trao truyền tương lai.</b>
          </p>
          <p>
            Gia phả không chỉ để biết người đã khuất, mà để người đang sống tìm nhau,
            giúp nhau và truyền lại giá trị cho con cháu.
          </p>

          <div className="heroActions">
            <a href="#tree" className="btn primary">Xem cây gia phả</a>
            <a href="#people" className="btn">Tra cứu thành viên</a>
            <a href="#governance" className="btn">Quản trị dữ liệu</a>
          </div>
        </div>

        <div className="heroVisual">
          <img className="sealWatermark" src="/assets/seal-vu.png" loading="lazy" alt="" />
          <img className="scroll" src="/assets/scroll-source.png" loading="lazy" alt="" />
          <img className="altar" src="/assets/incense-altar.png" loading="lazy" alt="" />
        </div>
      </div>
    </section>
  );
}
