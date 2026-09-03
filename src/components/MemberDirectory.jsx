import { useMemo, useState } from 'react';
import { getBranches, getPersonSearchText, stripVietnamese, formatLunar } from '../lib/utils.js';

export default function MemberDirectory({ people, onSelect }) {
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('');
  const branches = useMemo(() => getBranches(people), [people]);

  const list = useMemo(() => {
    const q = stripVietnamese(search);
    return people
      .filter((person) => (!q || getPersonSearchText(person).includes(q)) && (!branch || person.branch === branch))
      .slice(0, 24);
  }, [people, search, branch]);

  return (
    <section className="section wrap" id="people">
      <div className="sectionHead">
        <div>
          <h2>Danh sách thành viên</h2>
          <p className="sub">Tra cứu theo tên, chi, tên thường gọi, ghi chú và nguồn dữ liệu.</p>
        </div>
      </div>

      <div className="toolbar directoryToolbar">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên, chi, ghi chú..." />
        <select value={branch} onChange={(event) => setBranch(event.target.value)}>
          <option value="">Tất cả chi nhánh</option>
          {branches.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      <div className="cardGrid">
        {list.map((person) => (
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
        ))}
      </div>
    </section>
  );
}
