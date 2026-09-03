const privacyRows = [
  {
    type: 'Tiên tổ & Người đã mất lâu đời',
    visibility: 'Công khai / Nội bộ',
    rule: 'Hiển thị đầy đủ năm sinh, năm mất, ngày giỗ, mộ phần để con cháu chiêm bái và phụng vụ.',
  },
  {
    type: 'Người còn sống',
    visibility: 'Nội bộ gia tộc',
    rule: 'Bảo vệ quyền riêng tư, chỉ hiển thị họ tên và năm sinh nếu được cho phép, không lộ thông tin nhạy cảm.',
  },
  {
    type: 'Số điện thoại, Zalo, Email',
    visibility: 'Cơ chế Consent (Đồng thuận)',
    rule: 'Không công khai trực tiếp. Con cháu muốn liên lạc phải gửi yêu cầu kết nối để người nhận duyệt.',
  },
  {
    type: 'Trẻ nhỏ & Con cháu vị thành niên',
    visibility: 'Bảo mật gia đình',
    rule: 'Chỉ hiển thị thế thứ và tên gọi trong nội bộ chi phái, không chia sẻ thông tin học tập, địa chỉ.',
  },
  {
    type: 'CMND / CCCD / Định danh pháp lý',
    visibility: 'Nghiêm cấm lưu trữ',
    rule: 'Hệ thống tuyệt đối không lưu trữ hay yêu cầu số CCCD hay giấy tờ cá nhân.',
  },
  {
    type: 'Tọa độ GPS Lăng mộ & Nghĩa trang',
    visibility: 'Công khai cho con cháu',
    rule: 'Tạo mã QR và tích hợp Google Maps để mọi con cháu trong tộc tìm được mộ phần khi đi tảo mộ.',
  },
];

export default function PrivacyModal({ onClose }) {
  return (
    <div className="privacyModalOverlay" onClick={onClose}>
      <div className="privacyModalContent" onClick={(e) => e.stopPropagation()}>
        <div className="privacyModalHeader">
          <div className="privacyModalTitle">
            <span className="privacyIconBadge">🔒</span>
            <div>
              <h3>Chính Sách Bảo Mật & Quyền Riêng Tư Nội Tộc</h3>
              <p>Nguyên tắc phân quyền chuẩn mực, bảo vệ quyền riêng tư của con cháu theo chuẩn RLS.</p>
            </div>
          </div>
          <button type="button" className="closePrivacyModalBtn" onClick={onClose}>✕</button>
        </div>

        <div className="privacyModalBody">
          <div className="privacyTableShell">
            <table className="privacyModalTable">
              <thead>
                <tr>
                  <th>Hạng mục thông tin</th>
                  <th>Phạm vi hiển thị</th>
                  <th>Quy tắc bảo vệ</th>
                </tr>
              </thead>
              <tbody>
                {privacyRows.map((row) => (
                  <tr key={row.type}>
                    <td><b>{row.type}</b></td>
                    <td><span className="visibilityBadge">{row.visibility}</span></td>
                    <td>{row.rule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="privacyModalFooterNotice">
            <b>🛡 Cam kết của Ban Liên Lạc:</b> Dữ liệu gia phả được lưu giữ vì sự tôn nghiêm của tiên tổ và tương lai con cháu, tuyệt đối không thương mại hóa hay cung cấp cho bên thứ ba.
          </div>
        </div>
      </div>
    </div>
  );
}
