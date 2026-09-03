import { useMemo, useState } from 'react';
import { getBranches, getPersonSearchText, stripVietnamese, formatLunar } from '../lib/utils.js';

export default function MemberDirectory({ people, onSelect }) {
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const branches = useMemo(() => getBranches(people), [people]);

  const list = useMemo(() => {
    const q = stripVietnamese(search);
    if (!q && !branch && !showAll) return [];
    return people
      .filter((person) => (!q || getPersonSearchText(person).includes(q)) && (!branch || person.branch === branch))
      .slice(0, 36);
  }, [people, search, branch, showAll]);

  const scrollToTree = () => {
    const el = document.getElementById('tree');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const isSearching = Boolean(search.trim() || branch);

  return (
    <section className="section wrap" id="people">
      <div className="sectionHead">
        <div>
          <h2>Tra cứu Danh bạ Thành viên</h2>
          <p className="sub">
            Tìm nhanh theo tên, chi phái hoặc khám phá trực tiếp trên Cây Phả Hệ để thấy trọn vẹn thế thứ dòng họ.
          </p>
        </div>
        <div className="directoryHeadActions">
          <button type="button" className="btn smallBtn" onClick={scrollToTree}>
            🌳 Xem Cây Phả Hệ
          </button>
        </div>
      </div>

      <div className="toolbar directoryToolbar">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="🔍 Nhập tên, chi phái, ghi chú cần tìm (ví dụ: Vũ Thành, Nghĩa, Sơn)..."
          className="directorySearchInput"
        />
        <select value={branch} onChange={(event) => setBranch(event.target.value)} className="directorySelect">
          <option value="">Tất cả chi nhánh</option>
          {branches.map((item) => <option key={item}>{item}</option>)}
        </select>
        <button
          type="button"
          className="btn smallBtn toggleShowAllBtn"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? '▲ Thu gọn' : '📂 Xem tất cả (58 vị)'}
        </button>
      </div>

      {/* Hiển thị kết quả tìm kiếm hoặc danh sách khi người dùng yêu cầu */}
      {(isSearching || showAll) ? (
        <div className="cardGrid">
          {list.length > 0 ? (
            list.map((person) => (
              <button className="memberCard" key={person.id} onClick={() => onSelect(person.id)} type="button">
                <div className="nodeHead">
                  <img className="nodeAvatar" src="/assets/avatar-default.png" alt="" />
                  <div>
                    <h3>{person.name}</h3>
                    <p>Đời {person.gen || '?'} · {person.branch || 'Chưa rõ chi'}</p>
                    {person.lunarDeath ? <p>Giỗ: {formatLunar(person.lunarDeath)}</p> : null}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="directoryEmptySearch">
              Không tìm thấy thành viên nào phù hợp với từ khóa "{search}".
            </div>
          )}
        </div>
      ) : (
        <div className="directoryHintBox">
          <p>
            💡 <i>Toàn thể 58 vị tiền nhân và con cháu đã được kết nối trực quan trên Cây Phả Hệ.</i>
          </p>
          <div className="directoryHintButtons">
            <button type="button" className="btn primary smallBtn" onClick={scrollToTree}>
              🌳 Mở Cây Phả Hệ Tộc Họ
            </button>
            <button type="button" className="btn smallBtn" onClick={() => setShowAll(true)}>
              📂 Mở danh sách đầy đủ
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
