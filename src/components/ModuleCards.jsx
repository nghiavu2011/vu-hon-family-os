export default function ModuleCards({ onOpenSources }) {
  const modules = [
    {
      title: 'Cây gia phả',
      text: 'Truy vấn gốc tích, đời, chi, quan hệ huyết thống.',
      image: '/assets/feature-family-tree.png',
      href: '#tree',
    },
    {
      title: 'Mộ phần & bản đồ',
      text: 'Gắn tọa độ GPS, ảnh bia, chỉ đường Google Maps.',
      image: '/assets/feature-graves-map.png',
      href: '#grave-map',
    },
    {
      title: 'Tra cứu xưng hô',
      text: 'Tính toán vai vế, quan hệ và danh xưng chuẩn mực.',
      image: '/assets/feature-clan-map.png',
      href: '#kinship',
    },
    {
      title: 'Hướng nghiệp',
      text: 'Kết nối mentor, học bổng, thực tập và nghề nghiệp.',
      image: '/assets/feature-career.png',
      href: '#career',
    },
    {
      title: 'Tư liệu & Văn bia',
      text: 'Bản scan sổ phả chép tay gia tộc và tư liệu lịch sử dòng họ.',
      image: '/assets/feature-memory.png',
      onClick: onOpenSources,
    },
  ];

  return (
    <section className="section wrap" id="modules">
      <div className="sectionHead">
        <div>
          <h2>Vũ Hồn Family OS · Khám Phá Nhanh</h2>
          <p className="sub">Cổng tra cứu tiện ích số hóa gia phả, kết nối dòng họ và phụng thờ tiên tổ.</p>
        </div>
      </div>

      <div className="moduleGrid">
        {modules.map((item) => (
          item.onClick ? (
            <button
              type="button"
              className="moduleCard moduleCardBtn"
              onClick={item.onClick}
              key={item.title}
              title="Bấm để xem chi tiết"
            >
              <img src={item.image} loading="lazy" alt="" />
              <div className="txt">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </button>
          ) : (
            <a className="moduleCard" href={item.href} key={item.title}>
              <img src={item.image} loading="lazy" alt="" />
              <div className="txt">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </a>
          )
        ))}
      </div>
    </section>
  );
}
