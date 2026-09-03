const notes = [
  ['Trang 26', 'Cụ Vũ Bá Oanh và cụ bà sinh sáu con trai, ba con gái; có ngày giỗ cụ bà 13/12 âm lịch.'],
  ['Trang 28', 'Chi cụ thôn Rùi gồm Vũ Ngọc Điền, Vũ Văn Đạc, Vũ Văn Quyến, Vũ Văn Rong, Vũ Văn Cừu...'],
  ['Trang 29', 'Cụ Vũ Ngọc Điền, cụ bà Nguyễn Thị Hè, ông Vũ Điền tức Miền, bà Nguyễn Thị Cúc.'],
  ['Trang 30', 'Vũ Việt Hồng tức Vũ Đức Mừng, Phùng Thị Thanh Hà, Vũ Quang, Vũ Thị Hồng Hạnh.'],
];

export default function SourceNotes() {
  return (
    <section className="section wrap" id="sources">
      <div className="sectionHead">
        <div>
          <h2>Tư liệu gốc & ghi chú văn thư</h2>
          <p className="sub">Tách rõ dữ liệu từ PDF scan, gia đình bổ sung và điểm cần kiểm chứng.</p>
        </div>
      </div>

      <div className="sourceNotes">
        {notes.map(([title, text]) => (
          <div className="noteCard" key={title}>
            <img src="/assets/scroll-source.png" loading="lazy" alt="" />
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
