const notes = [
  {
    page: 'Trang 26',
    title: 'Khởi đầu đại ngành Vũ Bá Oanh',
    text: 'Cụ Vũ Bá Oanh và cụ bà sinh sáu con trai, ba con gái; có ngày giỗ cụ bà 13/12 âm lịch hàng năm.',
    note: 'Đã đối soát với bản phả in chữ Nôm truyền đời tại bản quán làng Mộ Trạch.',
  },
  {
    page: 'Trang 28',
    title: 'Phân chi cụ Thôn Rùi',
    text: 'Chi cụ thôn Rùi gồm Vũ Ngọc Điền, Vũ Văn Đạc, Vũ Văn Quyến, Vũ Văn Rong, Vũ Văn Cừu...',
    note: 'Nguồn văn thư lưu giữ chi tiết thế thứ đời thứ 2 và thứ 3.',
  },
  {
    page: 'Trang 29',
    title: 'Đời thứ 3 & thứ 4 (Chi Vũ Điền)',
    text: 'Cụ Vũ Ngọc Điền, cụ bà Nguyễn Thị Hè, ông Vũ Điền tức Miền, bà Nguyễn Thị Cúc.',
    note: 'Tư liệu đối sánh ngày kỵ nhật và phần mộ thực địa.',
  },
  {
    page: 'Trang 30',
    title: 'Đời thứ 5 & thứ 6 (Kế nghiệp Hà Nội)',
    text: 'Vũ Việt Hồng tức Vũ Đức Mừng, Phùng Thị Thanh Hà, Vũ Quang, Vũ Thị Hồng Hạnh.',
    note: 'Đã cập nhật đầy đủ liên kết huyết thống và danh bạ gia đình.',
  },
];

export default function SourceNotesModal({ onClose }) {
  return (
    <div className="sourceModalOverlay" onClick={onClose}>
      <div className="sourceModalContent" onClick={(e) => e.stopPropagation()}>
        <div className="sourceModalHeader">
          <div className="sourceModalTitle">
            <img src="/assets/seal-vu.png" alt="" className="sourceSeal" />
            <div>
              <h3>📜 Kho Tư Liệu Gốc & Ghi Chú Văn Thư</h3>
              <p>Tách rõ dữ liệu từ bản scan mộc bản, gia đình cung cấp và tài liệu đối chiếu Mộ Trạch.</p>
            </div>
          </div>
          <button type="button" className="closeSourceModalBtn" onClick={onClose}>✕</button>
        </div>

        <div className="sourceModalBody">
          <div className="sourceNotesList">
            {notes.map((item) => (
              <div className="sourceModalCard" key={item.page}>
                <div className="sourceCardTag">{item.page}</div>
                <div className="sourceCardBody">
                  <h4>{item.title}</h4>
                  <p className="sourceText">"{item.text}"</p>
                  <small className="sourceMeta">🔍 {item.note}</small>
                </div>
              </div>
            ))}
          </div>

          <div className="sourceModalFooterNotice">
            <b>🛡 Cam kết tính xác thực:</b> Mọi dữ liệu nhân danh, ngày kỵ, tọa độ mộ và phân chi đều được thẩm định đa nguồn trước khi số hóa lên hệ thống Vũ Hồn Family OS.
          </div>
        </div>
      </div>
    </div>
  );
}
