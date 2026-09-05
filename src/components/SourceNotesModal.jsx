const notes = [
  {
    page: 'Trang 26',
    title: 'Khởi đầu đại ngành Vũ Bá Oanh',
    text: 'Cụ Vũ Bá Oanh và cụ bà sinh sáu con trai, ba con gái; có ngày giỗ cụ bà 13/12 âm lịch hàng năm.',
    note: 'Trích từ bản scan trang 26 sổ phả chép tay truyền đời của gia tộc (tệp gia pha vu18052026102004.pdf).',
    image: '/assets/sources/trang-26.png',
  },
  {
    page: 'Trang 28',
    title: 'Phân chi cụ Thôn Rũi (Cụ bà Nguyễn Thị Nhài)',
    text: 'Chi cụ thôn Rũi (Vũ Văn Rũi) và cụ bà Nguyễn Thị Nhài gồm Vũ Ngọc Điền, Vũ Văn Đạc, Vũ Văn Quyến, Vũ Văn Rong, Vũ Văn Cừu...',
    note: 'Trích từ bản scan trang 28 sổ phả chép tay gia tộc.',
    image: '/assets/sources/trang-28.png',
  },
  {
    page: 'Trang 29',
    title: 'Đời thứ 3 & thứ 4 (Chi Vũ Điền)',
    text: 'Cụ Vũ Ngọc Điền, cụ bà Nguyễn Thị Hè, ông Vũ Điền tức Miền, bà Nguyễn Thị Cúc.',
    note: 'Trích từ bản scan trang 29 sổ phả chép tay gia tộc.',
    image: '/assets/sources/trang-29.png',
  },
  {
    page: 'Trang 30',
    title: 'Đời thứ 5 & thứ 6 (Kế nghiệp Hà Nội)',
    text: 'Vũ Việt Hồng tức Vũ Đức Mừng, Phùng Thị Thanh Hà, Vũ Quang, Vũ Thị Hồng Hạnh.',
    note: 'Trích từ bản scan trang 30 sổ phả chép tay gia tộc.',
    image: '/assets/sources/trang-30.png',
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
              <p>Tư liệu trích xuất trực tiếp từ bản scan sổ gia phả chép tay truyền đời của gia đình (tệp gia pha vu18052026102004.pdf).</p>
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
                  {item.image && (
                    <div style={{ marginTop: '8px' }}>
                      <a
                        href={item.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn smallBtn"
                        style={{ fontSize: '11px', display: 'inline-block' }}
                      >
                        🖼 Xem ảnh chụp bút tích gốc ({item.page})
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="sourceModalFooterNotice">
            <b>🛡 Tính xác thực của tư liệu:</b> Dữ liệu phả ký được trích xuất trung thực từ bút tích sổ tay gia phả chữ Quốc ngữ của gia đình, không suy diễn hoặc thêu dệt văn tự cổ.
          </div>
        </div>
      </div>
    </div>
  );
}
