const rows = [
  ['Tổ tiên, người đã mất lâu đời', 'Công khai / nội bộ', 'Vẫn cần tôn trọng nguồn và kiểm chứng.'],
  ['Người còn sống', 'Nội bộ, có đăng nhập', 'Không public ngày sinh, liên hệ nếu chưa có đồng ý.'],
  ['SĐT, Zalo, Facebook, Email', 'Theo từng trường, có consent', 'Nên dùng “gửi yêu cầu kết nối”.'],
  ['Trẻ nhỏ', 'Ẩn hoặc chỉ cùng chi/quản trị', 'Không public hồ sơ chi tiết.'],
  ['CMND/CMT/CCCD', 'Không đưa vào web public', 'Chỉ lưu offline hoặc database private nếu thật cần.'],
  ['Tọa độ mộ phần', 'Nội bộ dòng họ', 'Có thể public một phần nếu gia đình đồng ý.'],
];

export default function PrivacyCenter() {
  return (
    <section className="section wrap" id="privacy">
      <div className="sectionHead">
        <div>
          <h2>Chính sách riêng tư nội tộc</h2>
          <p className="sub">Nguyên tắc hiển thị trước khi mở rộng danh bạ, social và hồ sơ thế hệ trẻ.</p>
        </div>
      </div>

      <div className="panel pad">
        <table className="privacyTable">
          <thead>
            <tr><th>Loại dữ liệu</th><th>Hiển thị đề xuất</th><th>Ghi chú</th></tr>
          </thead>
          <tbody>
            {rows.map(([type, visibility, note]) => (
              <tr key={type}><td>{type}</td><td>{visibility}</td><td>{note}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
