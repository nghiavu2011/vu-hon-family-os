import { downloadJson } from '../lib/utils.js';

export default function GovernanceCenter({ people, events, graves }) {
  const high = people.filter((person) => person.confidence === 'high').length;
  const need = people.filter((person) => person.confidence !== 'high').length;
  const family = people.filter((person) => person.privacy === 'family').length;

  return (
    <section className="section wrap" id="governance">
      <div className="sectionHead">
        <div>
          <h2>Trung tâm hoàn thiện dữ liệu</h2>
          <p className="sub">Theo dõi phần đã chắc, phần cần kiểm và dữ liệu nội bộ.</p>
        </div>
      </div>

      <div className="auditGrid">
        <div className="auditCard"><b>{people.length}</b><span>nhân danh trong dữ liệu</span></div>
        <div className="auditCard"><b>{high}</b><span>mục tin cậy cao</span></div>
        <div className="auditCard"><b>{need}</b><span>mục cần đối chiếu / chữ khó đọc</span></div>
        <div className="auditCard"><b>{family}</b><span>mục dữ liệu nội bộ</span></div>
      </div>

      <div className="exportBar">
        <button className="btn" onClick={() => downloadJson('people.json', people)} type="button">Xuất people.json</button>
        <button className="btn" onClick={() => downloadJson('events.json', events)} type="button">Xuất events.json</button>
        <button className="btn" onClick={() => downloadJson('grave-sites.json', graves)} type="button">Xuất grave-sites.json</button>
      </div>
    </section>
  );
}
