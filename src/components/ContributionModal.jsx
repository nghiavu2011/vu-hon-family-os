import { useState } from 'react';

export default function ContributionModal({ people, targetPerson, onClose, onSubmitted }) {
  const [type, setType] = useState(targetPerson ? 'update' : 'new_child');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  const [parentName, setParentName] = useState(targetPerson?.name || '');
  const [branch, setBranch] = useState(targetPerson?.branch || 'Chi Vũ Văn Rũi');
  const [birthYear, setBirthYear] = useState('');
  const [lunarDeath, setLunarDeath] = useState('');
  const [career, setCareer] = useState('');
  const [notes, setNotes] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập họ và tên!');
      return;
    }

    const proposal = {
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString(),
      type,
      targetPersonId: targetPerson?.id || null,
      targetPersonName: targetPerson?.name || parentName,
      name: name.trim(),
      gender,
      parentName,
      branch,
      birthYear,
      lunarDeath,
      career,
      notes,
      contactName,
      contactPhone,
      status: 'pending', // pending, approved, rejected
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('family_proposals') || '[]');
    existing.unshift(proposal);
    localStorage.setItem('family_proposals', JSON.stringify(existing));

    if (onSubmitted) {
      onSubmitted(proposal);
    }

    setSuccessMsg('Đề xuất của bạn đã được gửi thành công đến Ban Biên tập & Hội đồng Gia tộc để thẩm định!');
    setTimeout(() => {
      if (onClose) onClose();
    }, 2000);
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalDialog pad panel" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <h3>📜 Đề xuất Cập nhật & Bổ sung Dữ liệu Gia phả</h3>
          <button className="closeBtn" onClick={onClose} type="button">✕</button>
        </div>

        {successMsg ? (
          <div className="successBanner">
            <b>{successMsg}</b>
            <p>Trưởng tộc / Ban thư ký sẽ kiểm tra chứng cứ và phê duyệt vào cây gia phả chính thức.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contributionForm">
            <p className="sub">
              Dành cho con cháu nội ngoại gửi thông tin: cháu mới sinh, bổ sung tiểu sử tiền nhân, cập nhật ngày giỗ, mộ phần hoặc thành tích học tập/công tác.
            </p>

            <div className="formRow">
              <label>Loại đề xuất:</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="new_child">Khai sinh con cháu mới trong họ</option>
                <option value="update">Bổ sung / Hiệu đính thông tin tiền nhân</option>
                <option value="grave">Bổ sung vị trí mộ phần / Ảnh bia mộ</option>
                <option value="career">Cập nhật thông tin Danh bạ Hướng nghiệp</option>
              </select>
            </div>

            <div className="formGrid2">
              <div className="formRow">
                <label>Họ và tên thành viên (*):</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Vũ Hoàng Nam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="formRow">
                <label>Giới tính:</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="male">Nam (Đinh)</option>
                  <option value="female">Nữ</option>
                </select>
              </div>
            </div>

            <div className="formGrid2">
              <div className="formRow">
                <label>Thân sinh (Cha / Mẹ):</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Vũ Hữu Dũng"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                />
              </div>

              <div className="formRow">
                <label>Chi phái / Nhánh họ:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Chi Vũ Văn Rũi"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                />
              </div>
            </div>

            <div className="formGrid2">
              <div className="formRow">
                <label>Năm sinh / Năm mất (nếu có):</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Sinh 2024 hoặc 1945 - 2020"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                />
              </div>

              <div className="formRow">
                <label>Ngày giỗ Âm lịch (nếu là tiền nhân):</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 15-08 âm lịch"
                  value={lunarDeath}
                  onChange={(e) => setLunarDeath(e.target.value)}
                />
              </div>
            </div>

            <div className="formRow">
              <label>Nghề nghiệp / Học vị / Chức vụ:</label>
              <input
                type="text"
                placeholder="Ví dụ: Kỹ sư Phần mềm / Bác sĩ / Cử nhân..."
                value={career}
                onChange={(e) => setCareer(e.target.value)}
              />
            </div>

            <div className="formRow">
              <label>Nội dung chi tiết & Nguồn tư liệu (Chứng cứ đối chiếu):</label>
              <textarea
                rows={3}
                placeholder="Ghi chú chi tiết, nguồn tư liệu đối chiếu (sổ hộ khẩu, giấy khai sinh, gia phả cũ, ảnh bia mộ...)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <fieldset className="contactFieldset">
              <legend>Thông tin người gửi đề xuất (để Hội đồng liên lạc xác minh)</legend>
              <div className="formGrid2">
                <div className="formRow">
                  <label>Họ tên bạn:</label>
                  <input
                    type="text"
                    required
                    placeholder="Tên người gửi"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div className="formRow">
                  <label>Số điện thoại / Zalo (*):</label>
                  <input
                    type="tel"
                    required
                    placeholder="0988xxxxxx"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>
              </div>
            </fieldset>

            <div className="formActions">
              <button type="button" className="btn" onClick={onClose}>Hủy bỏ</button>
              <button type="submit" className="btn primary">Gửi đề xuất tới Hội đồng Gia tộc ➜</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
