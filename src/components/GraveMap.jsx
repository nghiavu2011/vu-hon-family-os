
import { useMemo, useState } from 'react';
import QrCodeBox from './QrCodeBox.jsx';
import GravePhotoUpload from './GravePhotoUpload.jsx';
import {
  getBounds,
  getGoogleMapsDirectionsUrl,
  getGraveSlug,
  getGraveUrl,
  hasCoordinates,
  mapMarkerPosition,
  normalizeGrave,
} from '../lib/graveUtils.js';

const CHECKLIST = [
  'Ảnh toàn cảnh khu mộ',
  'Ảnh bia mộ đọc rõ chữ',
  'Tọa độ GPS',
  'Google Maps URL',
  'Ghi chú đường đi',
  'Người xác nhận',
  'Ngày cập nhật gần nhất',
];

export default function GraveMap({ graves = [], people = [] }) {
  const normalizedGraves = useMemo(() => graves.map(normalizeGrave), [graves]);
  const bounds = useMemo(() => getBounds(normalizedGraves), [normalizedGraves]);
  const [selectedId, setSelectedId] = useState(normalizedGraves[0]?.id || '');

  const peopleById = useMemo(() => Object.fromEntries(people.map((person) => [person.id, person])), [people]);
  const selected = normalizedGraves.find((grave) => grave.id === selectedId) || normalizedGraves[0];
  const selectedPerson = selected?.personId ? peopleById[selected.personId] : null;
  const directionUrl = selected ? getGoogleMapsDirectionsUrl(selected) : '';
  const completedChecklist = selected ? [
    Boolean(selected.name),
    Boolean(selected.name),
    hasCoordinates(selected),
    Boolean(selected.googleMapsUrl) || hasCoordinates(selected),
    Boolean(selected.routeNote || selected.note),
    Boolean(selected.maintainerPersonId || selected.maintainerName),
    Boolean(selected.updatedAt || selected.lastVisitedAt),
  ] : [];

  return (
    <section className="section wrap" id="grave-map">
      <div className="sectionHead">
        <div>
          <h2>Bản đồ mộ phần & QR tưởng niệm</h2>
          <p className="sub">
            Tra cứu vị trí lăng mộ tổ tiên, định vị tọa độ Google Maps, quét mã QR tưởng niệm và hướng dẫn phụng vụ tảo mộ gia tiên.
          </p>
        </div>
      </div>

      <div className="graveMapShell">
        <div className="graveMapPanel">
          <div className="heritageMap">
            <img src="/assets/feature-clan-map.png" loading="lazy" alt="" />
            {normalizedGraves.filter(hasCoordinates).map((grave) => {
              const position = mapMarkerPosition(grave, bounds);
              return (
                <button
                  key={grave.id}
                  id={`grave-${getGraveSlug(grave)}`}
                  className={`graveMarker ${selected?.id === grave.id ? 'active' : ''}`}
                  style={position || undefined}
                  onClick={() => setSelectedId(grave.id)}
                  type="button"
                  title={grave.name}
                >
                  <span />
                </button>
              );
            })}
            {!normalizedGraves.some(hasCoordinates) ? (
              <div className="mapEmpty">
                Chưa có tọa độ GPS thật. Hãy nhập vĩ độ/kinh độ trong CMS hoặc data/grave-sites.json.
              </div>
            ) : null}
          </div>

          <div className="graveList">
            {normalizedGraves.map((grave) => (
              <button
                type="button"
                key={grave.id}
                className={selected?.id === grave.id ? 'active' : ''}
                onClick={() => setSelectedId(grave.id)}
              >
                <b>{grave.name}</b>
                <span>{hasCoordinates(grave) ? `${grave.lat}, ${grave.lng}` : 'Chưa có tọa độ'}</span>
              </button>
            ))}
          </div>
        </div>

        {selected ? (
          <aside className="graveDetail">
            <h3>{selected.name}</h3>
            <p className="sub">
              {selectedPerson ? <>Liên kết hồ sơ: <b>{selectedPerson.name}</b></> : 'Chưa liên kết nhân danh.'}
            </p>

            <div className="graveInfoGrid">
              <div><b>Tọa độ</b><span>{hasCoordinates(selected) ? `${selected.lat}, ${selected.lng}` : 'Chưa có'}</span></div>
              <div><b>Khu mộ</b><span>{selected.cemeteryName || selected.graveArea || 'Chưa có'}</span></div>
              <div><b>Trạng thái</b><span>{selected.status || 'needs_review'}</span></div>
              <div><b>Quyền</b><span>{selected.privacy || 'family'}</span></div>
            </div>

            <p className="sub">{selected.routeNote || selected.note || 'Chưa có ghi chú đường đi.'}</p>

            <div className="graveActions">
              {directionUrl ? (
                <a className="btn primary" href={directionUrl} target="_blank" rel="noreferrer">Chỉ đường Google Maps</a>
              ) : (
                <button className="btn primary" type="button" disabled>Chưa có tọa độ</button>
              )}
              <a className="btn" href={`#person-${selected.personId || ''}`}>Mở hồ sơ người</a>
            </div>

            <QrCodeBox value={getGraveUrl(selected)} label={`QR ${selected.name}`} />

            {/* Thư viện ảnh mộ phần thực địa */}
            {selected.photos && selected.photos.length > 0 && (
              <div className="gravePhotoGallery">
                <h4>📸 Ảnh chụp phần mộ thực địa ({selected.photos.length}):</h4>
                <div className="gravePhotoGrid">
                  {selected.photos.map((src, idx) => (
                    <a key={idx} href={src} target="_blank" rel="noopener noreferrer" className="gravePhotoItem" title="Bấm để xem ảnh phóng to">
                      <img src={src} alt={`${selected.name} - ảnh ${idx + 1}`} loading="lazy" />
                      <span>Ảnh mộ #{idx + 1} 🔍</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Thư viện ảnh đường vào */}
            {selected.routePhotos && selected.routePhotos.length > 0 && (
              <div className="gravePhotoGallery routeGallery">
                <h4>🚶 Ảnh chụp lối vào & đường đi ({selected.routePhotos.length}):</h4>
                <div className="gravePhotoGrid">
                  {selected.routePhotos.map((src, idx) => (
                    <a key={idx} href={src} target="_blank" rel="noopener noreferrer" className="gravePhotoItem" title="Bấm để xem ảnh phóng to">
                      <img src={src} alt={`${selected.name} - lối đi ${idx + 1}`} loading="lazy" />
                      <span>Lối vào #{idx + 1} 🔍</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <GravePhotoUpload grave={selected} />

            <div className="graveChecklist">
              <h3>Checklist tảo mộ</h3>
              {CHECKLIST.map((item, index) => (
                <label key={item}>
                  <input type="checkbox" checked={Boolean(completedChecklist[index])} readOnly />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </aside>
        ) : (
          <aside className="graveDetail">
            <h3>Chưa có dữ liệu mộ phần</h3>
            <p className="sub">Hãy nhập mộ phần trong CMS.</p>
          </aside>
        )}
      </div>
    </section>
  );
}
