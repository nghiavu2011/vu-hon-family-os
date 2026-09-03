import { useState, useEffect } from 'react';
import { formatDate, formatLunar, buildPeopleIndex } from '../lib/utils.js';
import { playTempleBell } from '../services/heritageAudioService.js';

function PersonPill({ person, onSelect }) {
  if (!person) return <span>Chưa có thông tin</span>;
  return (
    <button className="pill" onClick={() => onSelect(person.id)} type="button">
      {person.name}
    </button>
  );
}

export default function PersonDrawer({
  personId,
  people,
  onClose,
  onSelect,
  onOpenKinship,
  onOpenContribution,
}) {
  const byId = buildPeopleIndex(people);
  const person = personId ? byId[personId] : null;

  const [incenseCount, setIncenseCount] = useState(0);
  const [isSmoking, setIsSmoking] = useState(false);

  useEffect(() => {
    if (personId) {
      const stored = localStorage.getItem(`incense_${personId}`);
      setIncenseCount(stored ? parseInt(stored, 10) : Math.floor(Math.random() * 8) + 12);
      setIsSmoking(false);
    }
  }, [personId]);

  if (!person) return null;

  const handleOfferIncense = () => {
    const newCount = incenseCount + 1;
    setIncenseCount(newCount);
    localStorage.setItem(`incense_${personId}`, newCount.toString());
    setIsSmoking(true);
    // Ngân một tiếng chuông khánh thiền trang nghiêm
    playTempleBell();
    setTimeout(() => {
      setIsSmoking(false);
    }, 4000);
  };

  const father = person.fatherId ? byId[person.fatherId] : null;
  const mother = person.motherId ? byId[person.motherId] : null;
  const spouses = (person.spouseIds || []).map((id) => byId[id]).filter(Boolean);
  const children = (person.childrenIds || []).map((id) => byId[id]).filter(Boolean);
  const isDeceased = Boolean(person.deathDate || person.deathYear || person.lunarDeath || person.gen <= 3);

  return (
    <aside className="drawer show">
      <div className="drawerHead">
        <button className="btn close" onClick={onClose} type="button">✕ Đóng</button>
        <h2>{person.name}</h2>
        <p className="sub">Đời {person.gen || '?'} · {person.branch || 'Chưa rõ chi'}</p>
      </div>

      <div className="drawerBody">
        <div className="profileTop">
          <img src="/assets/avatar-default.png" loading="lazy" alt="" />
          <div>
            <div className="nodeBadges">
              <em>{person.confidence === 'high' ? 'Xác tín cao' : person.confidence === 'low' ? 'Chữ khó đọc' : 'Cần đối chiếu'}</em>
              <em>{person.privacy === 'family' ? 'Nội bộ dòng họ' : 'Công khai'}</em>
            </div>
            <p className="sub">{person.note || 'Chưa có ghi chú tiểu sử.'}</p>
          </div>
        </div>

        {/* Action Bar: Xưng hô & Đóng góp */}
        <div className="drawerActions">
          <button
            type="button"
            className="btn smallBtn"
            onClick={() => onOpenKinship && onOpenKinship(person.id)}
            title="Xem tôi phải gọi vị này là gì"
          >
            🧭 Tra cứu Xưng hô
          </button>
          <button
            type="button"
            className="btn smallBtn"
            onClick={() => onOpenContribution && onOpenContribution(person)}
            title="Đề xuất bổ sung tư liệu, con cái, ảnh bia mộ"
          >
            ✍️ Bổ sung Tư liệu
          </button>
        </div>

        {/* Digital Incense Widget for deceased ancestors */}
        {isDeceased && (
          <div className={`incenseWidget ${isSmoking ? 'smokingActive' : ''}`}>
            <div className="incenseHeader">
              <span className="incenseTitle">🕯 Dâng Nén Tâm Hương Tưởng Niệm</span>
              <span className="incenseCount">Đã có <b>{incenseCount}</b> lượt hương khói</span>
            </div>
            <div className="incenseAction">
              <button
                type="button"
                className="btn primary incenseBtn"
                onClick={handleOfferIncense}
              >
                {isSmoking ? '✨ Đang dâng hương thành kính...' : '🪔 Kính dâng nén tâm hương'}
              </button>
            </div>
            {isSmoking && (
              <div className="smokeEffect">
                <i>Khói trầm quyện tỏa, lòng thành kính hướng về cội nguồn tiên tổ họ Vũ...</i>
              </div>
            )}
          </div>
        )}

        <div className="kv"><b>Tên gọi khác / Tên tự</b><span>{person.aka?.join(', ') || 'Chưa có thông tin'}</span></div>
        <div className="kv"><b>Năm sinh</b><span>{formatDate(person.birthDate || person.birthYear)}</span></div>
        <div className="kv"><b>Năm mất</b><span>{formatDate(person.deathDate || person.deathYear)}</span></div>
        <div className="kv"><b>Ngày kỵ nhật (Giỗ)</b><span>{formatLunar(person.lunarDeath)}</span></div>
        <div className="kv"><b>Địa bàn / Quê quán</b><span>{person.place || 'Mộ Trạch, Hải Dương'}</span></div>
        <div className="kv"><b>Thân phụ (Cha)</b><span><PersonPill person={father} onSelect={onSelect} /></span></div>
        <div className="kv"><b>Thân mẫu (Mẹ)</b><span><PersonPill person={mother} onSelect={onSelect} /></span></div>
        <div className="kv"><b>Phối ngẫu (Vợ/Chồng)</b><span>{spouses.length ? spouses.map((item) => <PersonPill key={item.id} person={item} onSelect={onSelect} />) : 'Chưa có thông tin'}</span></div>
        <div className="kv"><b>Hậu duệ (Con cái)</b><span>{children.length ? children.map((item) => <PersonPill key={item.id} person={item} onSelect={onSelect} />) : 'Chưa có thông tin'}</span></div>
        
        {/* Khối Gia tiên bên Ngoại đối với chị Nguyễn Sao Mai */}
        {person.id === 'nguyen-sao-mai' && (
          <div className="maternalAncestorsCard">
            <div className="maternalHead">
              <span>🌸 Gia Tiên Bên Ngoại (Đời 6 & 7 Chi Vũ Thành Phụng Tự)</span>
            </div>
            <p className="maternalIntro">
              Chị Nguyễn Sao Mai là con một duy nhất. Theo truyền thống đạo hiếu gia đình, ngày kỵ nhật của hai cụ được lưu truyền trong Chi Vũ Thành để các thế hệ con cháu đời 6 và đời 7 ghi nhớ, phụng tự chu tất:
            </p>
            <div className="maternalList">
              <button
                type="button"
                className="maternalItemBtn"
                onClick={() => onSelect && onSelect('nguyen-van-son')}
              >
                <div className="maternalItemTitle">
                  <b>👴 Thân phụ: Cụ Ông Nguyễn Văn Sơn</b>
                  <span className="maternalTag">1951 – 2026</span>
                </div>
                <div className="maternalItemInfo">
                  <span>🕯 Giỗ: <b>17/07 Âm lịch</b> (17/7 Bính Ngọ)</span>
                  <span>📍 An táng: Xã Lý Nhân, Ninh Bình 🔍 (Bấm xem)</span>
                </div>
              </button>

              <button
                type="button"
                className="maternalItemBtn"
                onClick={() => onSelect && onSelect('nguyen-thi-kim-lien')}
              >
                <div className="maternalItemTitle">
                  <b>👵 Thân mẫu: Cụ Bà Nguyễn Thị Kim Liên</b>
                  <span className="maternalTag">Mất 2013</span>
                </div>
                <div className="maternalItemInfo">
                  <span>🕯 Giỗ: <b>25/12 Âm lịch</b> (25/12 Nhâm Thìn)</span>
                  <span>📍 An táng: Quê chồng Xã Lý Nhân, Ninh Bình 🔍 (Bấm xem)</span>
                </div>
              </button>
            </div>
          </div>
        )}

        <div className="kv"><b>Nguồn trích dẫn phả ký</b><span>{person.source || 'Chưa ghi nguồn'}</span></div>
        
        {/* Ảnh mộ phần thực địa trong hồ sơ */}
        {person.gravePhotos && person.gravePhotos.length > 0 && (
          <div className="drawerGraveSection">
            <h4>📸 Ảnh chụp phần mộ & bia mộ thực địa:</h4>
            <div className="drawerGraveGallery">
              {person.gravePhotos.map((src, idx) => (
                <a key={idx} href={src} target="_blank" rel="noopener noreferrer" className="drawerGravePhotoLink" title="Bấm để xem ảnh phóng to">
                  <img src={src} alt={`${person.name} - ảnh mộ`} loading="lazy" />
                  <span>Ảnh thực địa #{idx + 1} 🔍</span>
                </a>
              ))}
            </div>
            {person.graveId && (
              <a href="#grave-map" className="btn smallBtn" onClick={onClose} style={{ marginTop: '8px', display: 'inline-block' }}>
                📍 Xem trên Bản đồ mộ phần dòng họ
              </a>
            )}
          </div>
        )}

        <div className="empty">
          🔒 Bản quyền dữ liệu thuộc Hội đồng Dòng họ Vũ - Võ. Dữ liệu nhân thân người đang sống được bảo vệ quyền riêng tư nghiêm ngặt.
        </div>
      </div>
    </aside>
  );
}
