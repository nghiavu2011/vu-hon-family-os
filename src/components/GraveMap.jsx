import { useMemo, useState } from 'react';
import QrCodeBox from './QrCodeBox.jsx';
import GravePhotoUpload from './GravePhotoUpload.jsx';
import { formatLunar } from '../lib/utils.js';
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

export default function GraveMap({
  graves = [],
  people = [],
  onSelectPerson,
  onOpenContribution,
}) {
  const normalizedGraves = useMemo(() => graves.map(normalizeGrave), [graves]);
  const bounds = useMemo(() => getBounds(normalizedGraves), [normalizedGraves]);
  
  // Ưu tiên chọn mộ đã có GPS (Mộ cụ Vũ Thành & cụ bà Đặng Thị Thái) khi mới tải trang
  const [selectedId, setSelectedId] = useState(
    normalizedGraves.find(hasCoordinates)?.id || normalizedGraves[0]?.id || ''
  );
  const [isSmoking, setIsSmoking] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'photos' | 'checklist'

  const peopleById = useMemo(() => Object.fromEntries(people.map((person) => [person.id, person])), [people]);
  const selected = normalizedGraves.find((grave) => grave.id === selectedId) || normalizedGraves[0];
  const selectedPerson = selected?.personId ? peopleById[selected.personId] : null;
  const isVerified = hasCoordinates(selected);
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

  const completedCount = completedChecklist.filter(Boolean).length;

  const handleOfferIncense = () => {
    setIsSmoking(true);
    setTimeout(() => setIsSmoking(false), 3500);
  };

  return (
    <section className="section wrap" id="grave-map">
      <div className="sectionHead">
        <div>
          <h2>Bản đồ mộ phần & QR tưởng niệm</h2>
          <p className="sub">
            Định vị vệ tinh Google Maps, số hóa bia mộ thực địa và hướng dẫn phụng vụ tảo mộ gia tiên muôn đời.
          </p>
        </div>
      </div>

      <div className="graveMapShell">
        {/* Ô BÊN TRÁI: Bản đồ vệ tinh + Danh sách chọn nhanh các lăng mộ */}
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
                  onClick={() => {
                    setSelectedId(grave.id);
                    setActiveTab('overview');
                  }}
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

          {/* Danh sách các lăng mộ */}
          <div className="graveList">
            {normalizedGraves.map((grave) => {
              const isGraveWithGps = hasCoordinates(grave);
              return (
                <button
                  type="button"
                  key={grave.id}
                  className={`graveListItemBtn ${selected?.id === grave.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedId(grave.id);
                    setActiveTab('overview');
                  }}
                >
                  <div className="graveListTitle">
                    <b>{grave.name}</b>
                    <span className={`statusPill ${isGraveWithGps ? 'verified' : 'survey'}`}>
                      {isGraveWithGps ? '📍 Đã có GPS' : '🔍 Khảo sát'}
                    </span>
                  </div>
                  <span className="graveListSub">
                    {isGraveWithGps ? `GPS: ${grave.lat}, ${grave.lng}` : 'Đang số hóa tư liệu thực địa'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ô BÊN PHẢI: Chi tiết mộ phần (Đồng bộ kích thước 1:1, vừa khít không cuộn) */}
        {selected ? (
          <aside className="graveDetail">
            {!isVerified ? (
              /* ====================================================================
                 GIAO DIỆN TINH GỌN VỪA KHÍT 1 MÀN HÌNH CHO MỘ CỤ VŨ NGỌC ĐIỀN
                 (Không cuộn lên cuộn xuống, bố cục tôn nghiêm, tính năng thiết thực)
                 ==================================================================== */
              <div className="surveyGraveBox">
                <div className="surveyHeader">
                  <div className="surveyStatusTag">
                    <span>🔍 Hồ sơ khảo sát & xác thực thực địa</span>
                  </div>
                  <h3>{selected.name}</h3>
                  <p className="sub">
                    {selectedPerson?.aka?.length ? <>Tự danh: <b>{selectedPerson.aka.join(', ')}</b> · </> : null}
                    Đời {selectedPerson?.gen || 3} · {selectedPerson?.branch || 'Chi Vũ Văn Rũi'}
                  </p>
                </div>

                {/* Bảng phả ký & quan hệ thế thứ */}
                <div className="surveyGenealogyGrid">
                  <div className="sgItem">
                    <span className="sgLabel">📅 Năm sinh:</span>
                    <b className="sgVal">{selectedPerson?.birthYear ? `${selectedPerson.birthYear} (Đinh Hợi)` : '1887'}</b>
                  </div>
                  <div className="sgItem">
                    <span className="sgLabel">🕯 Ngày kỵ nhật:</span>
                    <b className="sgVal">{selectedPerson?.lunarDeath ? `${formatLunar(selectedPerson.lunarDeath)} Âm lịch` : '22/05 Âm'}</b>
                  </div>
                  <div className="sgItem">
                    <span className="sgLabel">💍 Phối ngẫu:</span>
                    <b className="sgVal">Cụ bà Nguyễn Thị Hè</b>
                  </div>
                  <div className="sgItem">
                    <span className="sgLabel">🌿 Thế thứ nối đời:</span>
                    <b className="sgVal">Thân phụ Cụ Vũ Thành & Cụ Vũ Điền</b>
                  </div>
                </div>

                {/* Khối Lời ngỏ & kêu gọi đóng góp */}
                <div className="surveyNoticeCard">
                  <div className="snTitle">
                    <b>📍 Tình trạng thực địa:</b> <span>Đang số hóa tọa độ & ảnh chụp bia mộ</span>
                  </div>
                  <p>
                    {selected.note || 'Ban liên lạc đang tập hợp tọa độ GPS và sơ đồ nghĩa trang của Cụ.'} Quý con cháu trong chi phái biết vị trí lăng mộ hoặc lưu giữ ảnh bia mộ, xin gửi tư liệu về hệ thống để hoàn thiện bản đồ phụng tự cho muôn đời con cháu.
                  </p>
                </div>

                {/* Thanh tiến độ số hóa dạng compact */}
                <div className="surveyProgressBarWrap">
                  <div className="spbHead">
                    <span>Tiến độ số hóa dữ liệu mộ phần:</span>
                    <b>{completedCount}/7 tiêu chí</b>
                  </div>
                  <div className="spbTrack">
                    <div className="spbFill" style={{ width: `${(completedCount / 7) * 100}%` }} />
                  </div>
                </div>

                {/* Cụm tính năng 1-chạm không cần cuộn */}
                <div className="surveyActions">
                  <button
                    type="button"
                    className="btn primary smallBtn"
                    onClick={() => onOpenContribution && onOpenContribution(selectedPerson || { name: selected.name })}
                  >
                    ✍️ Gửi Tọa Độ / Ảnh Mộ
                  </button>
                  {selectedPerson && (
                    <button
                      type="button"
                      className="btn smallBtn"
                      onClick={() => onSelectPerson && onSelectPerson(selectedPerson.id)}
                    >
                      📖 Xem Hồ Sơ Cụ
                    </button>
                  )}
                  <a
                    href="https://zalo.me/0985578385"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn smallBtn zaloGraveBtn"
                  >
                    💬 Báo Ban Liên Lạc (Zalo)
                  </a>
                  <button
                    type="button"
                    className="btn smallBtn incenseGraveBtn"
                    onClick={handleOfferIncense}
                  >
                    {isSmoking ? '✨ Đang dâng hương...' : '🪔 Thắp nén tâm hương'}
                  </button>
                </div>

                {isSmoking && (
                  <div className="smokeBanner">
                    <i>Khói trầm quyện tỏa, lòng thành kính hướng về Cụ Nhang Điền...</i>
                  </div>
                )}
              </div>
            ) : (
              /* ====================================================================
                 GIAO DIỆN CHO MỘ ĐÃ XÁC THỰC GPS (CỤ VŨ THÀNH & ÔNG VŨ CHÍ THIỆN)
                 (Có Tabs gọn gàng, vừa khít không cuộn thừa)
                 ==================================================================== */
              <div className="verifiedGraveBox">
                <div className="verifiedHead">
                  <div className="verifiedBadge">📍 Đã xác thực tọa độ GPS & Thực địa</div>
                  <h3>{selected.name}</h3>
                  <p className="sub">
                    {selectedPerson ? <>Nhân thân: <b>{selectedPerson.name}</b> · Đời {selectedPerson.gen || '?'}</> : selected.cemeteryName}
                  </p>
                </div>

                {/* Tab chuyển đổi thông tin gọn gàng */}
                <div className="graveTabsNav">
                  <button
                    type="button"
                    className={`gTabBtn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    🧭 Chỉ Đường & GPS
                  </button>
                  <button
                    type="button"
                    className={`gTabBtn ${activeTab === 'photos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('photos')}
                  >
                    📸 Ảnh Mộ ({selected.photos?.length || 0})
                  </button>
                  <button
                    type="button"
                    className={`gTabBtn ${activeTab === 'checklist' ? 'active' : ''}`}
                    onClick={() => setActiveTab('checklist')}
                  >
                    📋 Checklist ({completedCount}/7)
                  </button>
                </div>

                {/* Tab 1: Tổng quan chỉ đường Google Maps & QR */}
                {activeTab === 'overview' && (
                  <div className="tabContent tabOverview">
                    <div className="graveInfoGrid">
                      <div><b>Tọa độ GPS</b><span>{selected.lat}, {selected.lng}</span></div>
                      <div><b>Khu nghĩa trang</b><span>{selected.cemeteryName || 'Khu gia tộc'}</span></div>
                    </div>

                    <p className="graveRouteNote">
                      📍 {selected.routeNote || selected.note}
                    </p>

                    <div className="graveActionsRow">
                      <a className="btn primary" href={directionUrl} target="_blank" rel="noreferrer">
                        🗺 Chỉ đường Google Maps
                      </a>
                      {selectedPerson && (
                        <button
                          type="button"
                          className="btn"
                          onClick={() => onSelectPerson && onSelectPerson(selectedPerson.id)}
                        >
                          📖 Xem Hồ Sơ Gia Phả
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn incenseGraveBtn"
                        onClick={handleOfferIncense}
                      >
                        {isSmoking ? '✨ Đang dâng hương...' : '🪔 Thắp nén tâm hương'}
                      </button>
                    </div>

                    <QrCodeBox value={getGraveUrl(selected)} label={`QR ${selected.name}`} />

                    {isSmoking && (
                      <div className="smokeBanner">
                        <i>Khói trầm hương quyện tỏa, thành kính tưởng nhớ tiên tổ...</i>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Thư viện ảnh mộ phần thực địa */}
                {activeTab === 'photos' && (
                  <div className="tabContent tabPhotos">
                    {selected.photos && selected.photos.length > 0 ? (
                      <div className="gravePhotoGrid">
                        {selected.photos.map((src, idx) => (
                          <a key={idx} href={src} target="_blank" rel="noopener noreferrer" className="gravePhotoItem" title="Bấm xem ảnh to">
                            <img src={src} alt={`${selected.name} - ảnh ${idx + 1}`} loading="lazy" />
                            <span>Ảnh mộ #{idx + 1} 🔍</span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="empty">Chưa có ảnh mộ phần thực địa.</p>
                    )}

                    {selected.routePhotos && selected.routePhotos.length > 0 && (
                      <div className="routePhotoBlock">
                        <b>🚶 Ảnh lối vào khu lăng mộ:</b>
                        <div className="gravePhotoGrid mini">
                          {selected.routePhotos.map((src, idx) => (
                            <a key={idx} href={src} target="_blank" rel="noopener noreferrer" className="gravePhotoItem" title="Bấm xem ảnh to">
                              <img src={src} alt="Lối vào" loading="lazy" />
                              <span>Lối vào #{idx + 1} 🔍</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 3: Checklist số hóa & phụng vụ */}
                {activeTab === 'checklist' && (
                  <div className="tabContent tabChecklist">
                    <div className="checklistGrid">
                      {CHECKLIST.map((item, index) => (
                        <label key={item} className="checkItem">
                          <input type="checkbox" checked={Boolean(completedChecklist[index])} readOnly />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                    <GravePhotoUpload grave={selected} />
                  </div>
                )}
              </div>
            )}
          </aside>
        ) : (
          <aside className="graveDetail">
            <h3>Chưa có dữ liệu mộ phần</h3>
            <p className="sub">Hãy chọn một mộ phần ở danh sách bên trái.</p>
          </aside>
        )}
      </div>
    </section>
  );
}
