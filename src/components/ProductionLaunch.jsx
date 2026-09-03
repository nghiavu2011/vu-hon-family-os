import { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { exportBackupBundle, exportProductionDataPack } from '../services/backupService.js';
import { hasCoordinates } from '../lib/graveUtils.js';

const LAUNCH_CHECKLIST = [
  ['build', 'Build production chạy được', 'npm run build không lỗi.'],
  ['privacy-public', 'Public không thấy dữ liệu nhạy cảm', 'Người sống, trẻ nhỏ, contact, mộ phần nội bộ bị ẩn.'],
  ['roles', 'Role kiểm tra đủ', 'public/family/editor/admin hoạt động đúng.'],
  ['cms', 'CMS tạo patch hoặc ghi Supabase', 'Editor/admin nhập person/event/grave/request được.'],
  ['grave', 'Mộ phần dùng được', 'Có checklist, QR, upload ảnh, Google Maps URL.'],
  ['backup', 'Backup/export sẵn sàng', 'Xuất bundle data trước khi launch.'],
  ['seo', 'SEO/meta/PWA cơ bản', 'Meta, manifest, robots đã thêm.'],
  ['mobile', 'Mobile QA', 'Header, tree, CMS, grave map dùng được trên điện thoại.'],
  ['docs', 'Tài liệu vận hành', 'Admin manual, privacy checklist, deploy guide có trong repo.'],
  ['uat', 'Beta đã test', 'Không còn lỗi critical/high trước khi mở rộng.'],
];

function Metric({ label, value, note }) {
  return (
    <div className="launchMetric">
      <b>{value}</b>
      <span>{label}</span>
      {note ? <small>{note}</small> : null}
    </div>
  );
}

export default function ProductionLaunch({ people = [], visiblePeople = [], events = [], places = [], graves = [] }) {
  const auth = useAuth();
  const [state, setState] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vu_hon_launch_checklist') || '{}'); }
    catch { return {}; }
  });

  const metrics = useMemo(() => {
    const gravesWithGps = graves.filter(hasCoordinates).length;
    return {
      people: people.length,
      visible: visiblePeople.length,
      hidden: Math.max(0, people.length - visiblePeople.length),
      events: events.length,
      places: places.length,
      graves: graves.length,
      gravesWithGps,
      gravesMissingGps: Math.max(0, graves.length - gravesWithGps),
    };
  }, [people, visiblePeople, events, places, graves]);

  const passed = LAUNCH_CHECKLIST.filter(([id]) => state[id] === true).length;

  function toggle(id) {
    const next = { ...state, [id]: !state[id] };
    setState(next);
    localStorage.setItem('vu_hon_launch_checklist', JSON.stringify(next));
  }

  return (
    <section className="section wrap" id="production-launch">
      <div className="sectionHead">
        <div>
          <h2>V24 Production Launch</h2>
          <p className="sub">
            Bản chuẩn bị deploy domain thật: checklist phát hành, backup/export, privacy launch và tài liệu vận hành.
          </p>
        </div>
      </div>

      <div className="launchHero">
        <div>
          <h3>Launch readiness</h3>
          <p>{passed}/{LAUNCH_CHECKLIST.length} hạng mục đã sẵn sàng · role hiện tại: <b>{auth.role}</b></p>
        </div>
        <div className="launchActions">
          <button className="btn primary" type="button" onClick={() => exportBackupBundle({ people, events, places, graves })}>
            Xuất backup bundle
          </button>
          <button className="btn" type="button" onClick={() => exportProductionDataPack({ people, events, places, graves })}>
            Xuất data pack
          </button>
        </div>
      </div>

      <div className="launchMetricsGrid">
        <Metric label="Hồ sơ tổng" value={metrics.people} />
        <Metric label="Đang hiển thị" value={metrics.visible} note="sau privacy filter" />
        <Metric label="Đang ẩn" value={metrics.hidden} note="theo quyền hiện tại" />
        <Metric label="Ngày giỗ" value={metrics.events} />
        <Metric label="Địa danh" value={metrics.places} />
        <Metric label="Mộ phần" value={metrics.graves} />
        <Metric label="Mộ có GPS" value={metrics.gravesWithGps} />
        <Metric label="Mộ thiếu GPS" value={metrics.gravesMissingGps} />
      </div>

      <div className="launchGrid">
        <div className="launchPanel">
          <h3>Production checklist</h3>
          {LAUNCH_CHECKLIST.map(([id, title, detail]) => (
            <label className={`launchCheck ${state[id] ? 'done' : ''}`} key={id}>
              <input type="checkbox" checked={Boolean(state[id])} onChange={() => toggle(id)} />
              <span>
                <b>{title}</b>
                <small>{detail}</small>
              </span>
            </label>
          ))}
        </div>

        <div className="launchPanel">
          <h3>Launch rule</h3>
          <div className="launchRule">
            <b>Không mở public rộng nếu chưa đạt đủ 4 điều kiện:</b>
            <ol>
              <li>Không còn lỗi critical/high từ V23 beta.</li>
              <li>Public không thấy contact, trẻ nhỏ, người sống và mộ phần nội bộ.</li>
              <li>Đã backup dữ liệu trước khi deploy.</li>
              <li>Đã có ít nhất 1 admin chịu trách nhiệm duyệt dữ liệu.</li>
            </ol>
          </div>

          <div className="launchRule">
            <b>Deploy đề xuất:</b>
            <p>Vercel hoặc Netlify cho frontend. Supabase cho database, auth, storage. Domain thật chỉ trỏ sau privacy review.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
