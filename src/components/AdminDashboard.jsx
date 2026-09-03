
import { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getBranches } from '../lib/utils.js';
import {
  saveEventDraft,
  saveGraveDraft,
  savePersonDraft,
  saveRelationshipDraft,
  submitFamilyRequest,
  approveRequest,
} from '../services/adminCmsService.js';

const EMPTY_PERSON = {
  name: '',
  gender: 'unknown',
  gen: '',
  branch: '',
  fatherId: '',
  motherId: '',
  birthDate: '',
  birthYear: '',
  deathDate: '',
  deathYear: '',
  lunarDeath: '',
  place: '',
  confidence: 'medium',
  privacy: 'family',
  status: 'draft',
  source: 'Admin CMS',
  note: '',
};

const EMPTY_RELATION = {
  personId: '',
  relatedPersonId: '',
  relationType: 'child',
  confidence: 'medium',
  note: '',
};

const EMPTY_EVENT = {
  personId: '',
  title: '',
  eventType: 'death_anniversary',
  dateLunar: '',
  dateSolar: '',
  branch: '',
  privacy: 'family',
  note: '',
};

const EMPTY_GRAVE = {
  personId: '',
  name: '',
  cemeteryName: '',
  graveArea: '',
  graveRow: '',
  graveNumber: '',
  lat: '',
  lng: '',
  googleMapsUrl: '',
  routeNote: '',
  epitaphText: '',
  privacy: 'family',
};

const EMPTY_REQUEST = {
  requestType: 'data_correction',
  fromPersonId: '',
  toPersonId: '',
  message: '',
};

function canUseAdmin(role) {
  return role === 'editor' || role === 'admin';
}

function Field({ label, children }) {
  return (
    <label className="cmsField">
      <span>{label}</span>
      {children}
    </label>
  );
}

function PersonSelect({ people, value, onChange, placeholder = 'Chọn người' }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">{placeholder}</option>
      {people.map((person) => (
        <option key={person.id} value={person.id}>
          {person.name} · Đời {person.gen || '?'} · {person.branch || 'Chưa rõ chi'}
        </option>
      ))}
    </select>
  );
}

function StatusBox({ message }) {
  if (!message) return null;
  return <div className="cmsStatus">{message}</div>;
}

export default function AdminDashboard({ people, events, graves }) {
  const auth = useAuth();
  const [tab, setTab] = useState('person');
  const [personForm, setPersonForm] = useState(EMPTY_PERSON);
  const [relationForm, setRelationForm] = useState(EMPTY_RELATION);
  const [eventForm, setEventForm] = useState(EMPTY_EVENT);
  const [graveForm, setGraveForm] = useState(EMPTY_GRAVE);
  const [requestForm, setRequestForm] = useState(EMPTY_REQUEST);
  const [reviewRequestId, setReviewRequestId] = useState('');
  const [message, setMessage] = useState('');

  const branches = useMemo(() => getBranches(people), [people]);
  const actor = { role: auth.role, branch: auth.branch, profile: auth.profile?.display_name };

  async function run(action, successMessage) {
    setMessage('Đang xử lý...');
    try {
      await action();
      setMessage(successMessage);
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'Có lỗi khi xử lý.');
    }
  }

  if (!canUseAdmin(auth.role)) {
    return (
      <section className="section wrap" id="admin-cms">
        <div className="panel pad">
          <h2>Admin CMS</h2>
          <p className="sub">
            Khu vực nhập/sửa dữ liệu chỉ mở cho vai trò <b>editor</b> hoặc <b>admin</b>.
          </p>
          <div className="empty">
            Vai trò hiện tại của bạn là <b>{auth.role}</b>. Hãy đổi role ở khu Đăng nhập & phân quyền để test CMS trong static mode.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section wrap" id="admin-cms">
      <div className="sectionHead">
        <div>
          <h2>Admin CMS</h2>
          <p className="sub">
            Nhập/sửa dữ liệu gia phả, quan hệ, ngày giỗ, mộ phần và góp ý. Static mode sẽ xuất JSON patch; Supabase mode sẽ ghi database.
          </p>
        </div>
      </div>

      <div className="cmsShell">
        <aside className="cmsTabs">
          <button className={tab === 'person' ? 'active' : ''} onClick={() => setTab('person')}>Thêm người</button>
          <button className={tab === 'proposals' ? 'active' : ''} onClick={() => setTab('proposals')}>📬 Hộp thư Đề xuất</button>
          <button className={tab === 'relation' ? 'active' : ''} onClick={() => setTab('relation')}>Quan hệ</button>
          <button className={tab === 'event' ? 'active' : ''} onClick={() => setTab('event')}>Ngày giỗ</button>
          <button className={tab === 'grave' ? 'active' : ''} onClick={() => setTab('grave')}>Mộ phần</button>
          <button className={tab === 'request' ? 'active' : ''} onClick={() => setTab('request')}>Góp ý</button>
          <button className={tab === 'review' ? 'active' : ''} onClick={() => setTab('review')}>Duyệt</button>
        </aside>

        <div className="cmsPanel">
          <StatusBox message={message} />

          {tab === 'person' && (
            <form
              className="cmsForm"
              onSubmit={(event) => {
                event.preventDefault();
                run(async () => savePersonDraft(personForm, actor), 'Đã tạo person draft / JSON patch.');
              }}
            >
              <h3>Thêm hồ sơ nhân danh</h3>
              <div className="cmsGrid">
                <Field label="Họ tên">
                  <input value={personForm.name} onChange={(e) => setPersonForm({ ...personForm, name: e.target.value })} required />
                </Field>
                <Field label="Giới tính">
                  <select value={personForm.gender} onChange={(e) => setPersonForm({ ...personForm, gender: e.target.value })}>
                    <option value="unknown">Chưa rõ</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </Field>
                <Field label="Đời">
                  <input value={personForm.gen} onChange={(e) => setPersonForm({ ...personForm, gen: e.target.value })} placeholder="VD: 5" />
                </Field>
                <Field label="Chi">
                  <input list="branch-list" value={personForm.branch} onChange={(e) => setPersonForm({ ...personForm, branch: e.target.value })} />
                </Field>
                <Field label="Cha">
                  <PersonSelect people={people} value={personForm.fatherId} onChange={(value) => setPersonForm({ ...personForm, fatherId: value })} />
                </Field>
                <Field label="Mẹ">
                  <PersonSelect people={people} value={personForm.motherId} onChange={(value) => setPersonForm({ ...personForm, motherId: value })} />
                </Field>
                <Field label="Ngày sinh">
                  <input type="date" value={personForm.birthDate} onChange={(e) => setPersonForm({ ...personForm, birthDate: e.target.value })} />
                </Field>
                <Field label="Năm sinh nếu chưa rõ ngày">
                  <input value={personForm.birthYear} onChange={(e) => setPersonForm({ ...personForm, birthYear: e.target.value })} />
                </Field>
                <Field label="Ngày mất">
                  <input type="date" value={personForm.deathDate} onChange={(e) => setPersonForm({ ...personForm, deathDate: e.target.value })} />
                </Field>
                <Field label="Ngày giỗ âm lịch">
                  <input value={personForm.lunarDeath} onChange={(e) => setPersonForm({ ...personForm, lunarDeath: e.target.value })} placeholder="VD: 22-05" />
                </Field>
                <Field label="Độ tin cậy">
                  <select value={personForm.confidence} onChange={(e) => setPersonForm({ ...personForm, confidence: e.target.value })}>
                    <option value="high">Tin cậy cao</option>
                    <option value="medium">Cần đối chiếu</option>
                    <option value="low">Chữ khó đọc</option>
                  </select>
                </Field>
                <Field label="Quyền hiển thị">
                  <select value={personForm.privacy} onChange={(e) => setPersonForm({ ...personForm, privacy: e.target.value })}>
                    <option value="public">Công khai</option>
                    <option value="family">Nội bộ</option>
                    <option value="same_branch">Cùng chi</option>
                    <option value="private">Riêng tư</option>
                  </select>
                </Field>
                <Field label="Địa danh">
                  <input value={personForm.place} onChange={(e) => setPersonForm({ ...personForm, place: e.target.value })} />
                </Field>
                <Field label="Nguồn">
                  <input value={personForm.source} onChange={(e) => setPersonForm({ ...personForm, source: e.target.value })} />
                </Field>
                <Field label="Ghi chú">
                  <textarea value={personForm.note} onChange={(e) => setPersonForm({ ...personForm, note: e.target.value })} />
                </Field>
              </div>
              <div className="cmsActions">
                <button className="btn primary" type="submit">Lưu draft</button>
                <button className="btn" type="button" onClick={() => setPersonForm(EMPTY_PERSON)}>Xóa form</button>
              </div>
            </form>
          )}

          {tab === 'proposals' && (
            <div className="cmsForm">
              <h3>📬 Hộp thư Thẩm định & Đóng góp Phả hệ từ Con cháu</h3>
              <p className="sub">
                Hội đồng Gia tộc / Ban Biên tập xem xét các yêu cầu khai sinh cháu mới, hiệu đính ngày giỗ hoặc bổ sung mộ phần do con cháu gửi lên.
              </p>
              {(() => {
                const proposals = JSON.parse(localStorage.getItem('family_proposals') || '[]');
                if (proposals.length === 0) {
                  return <div className="empty">Hiện chưa có đề xuất mới nào từ con cháu trong họ.</div>;
                }
                return (
                  <div className="proposalList">
                    {proposals.map((item) => (
                      <div className={`proposalCard ${item.status || 'pending'}`} key={item.id}>
                        <div className="proposalTop">
                          <span className="proposalBadge">
                            {item.type === 'new_child' ? '👶 Khai sinh con cháu mới' : item.type === 'grave' ? '🪦 Mộ phần & bia mộ' : '📝 Hiệu đính tư liệu'}
                          </span>
                          <span className="proposalDate">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="proposalBody">
                          <h4>{item.name} ({item.gender === 'female' ? 'Nữ' : 'Nam'})</h4>
                          <p><b>Thân sinh / Gốc:</b> {item.parentName || 'Chưa rõ'} · <b>Chi:</b> {item.branch || 'Chưa rõ'}</p>
                          {item.birthYear && <p><b>Năm sinh/mất:</b> {item.birthYear}</p>}
                          {item.lunarDeath && <p><b>Ngày giỗ:</b> {item.lunarDeath}</p>}
                          {item.career && <p><b>Nghề nghiệp:</b> {item.career}</p>}
                          {item.notes && <p className="proposalNote"><b>Ghi chú/Nguồn:</b> {item.notes}</p>}
                          <div className="proposalContact">
                            👤 Người gửi: <b>{item.contactName}</b> - 📞 SĐT/Zalo: <b>{item.contactPhone}</b>
                          </div>
                        </div>
                        <div className="proposalActions">
                          <button
                            type="button"
                            className="btn primary smallBtn"
                            onClick={() => {
                              const updated = proposals.map((p) => p.id === item.id ? { ...p, status: 'approved' } : p);
                              localStorage.setItem('family_proposals', JSON.stringify(updated));
                              setMessage(`Đã phê duyệt đề xuất cho ${item.name}! Dữ liệu đã lưu vào hệ thống.`);
                            }}
                          >
                            ✅ Phê duyệt vào Phả hệ
                          </button>
                          <button
                            type="button"
                            className="btn smallBtn"
                            onClick={() => {
                              const updated = proposals.filter((p) => p.id !== item.id);
                              localStorage.setItem('family_proposals', JSON.stringify(updated));
                              setMessage(`Đã xóa đề xuất của ${item.name}.`);
                            }}
                          >
                            ✕ Bác bỏ / Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {tab === 'relation' && (
            <form
              className="cmsForm"
              onSubmit={(event) => {
                event.preventDefault();
                run(async () => saveRelationshipDraft(relationForm, actor), 'Đã tạo relationship draft / JSON patch.');
              }}
            >
              <h3>Thêm quan hệ</h3>
              <div className="cmsGrid">
                <Field label="Người gốc">
                  <PersonSelect people={people} value={relationForm.personId} onChange={(value) => setRelationForm({ ...relationForm, personId: value })} />
                </Field>
                <Field label="Người liên quan">
                  <PersonSelect people={people} value={relationForm.relatedPersonId} onChange={(value) => setRelationForm({ ...relationForm, relatedPersonId: value })} />
                </Field>
                <Field label="Loại quan hệ">
                  <select value={relationForm.relationType} onChange={(e) => setRelationForm({ ...relationForm, relationType: e.target.value })}>
                    <option value="child">Con</option>
                    <option value="parent">Cha/mẹ</option>
                    <option value="spouse">Vợ/chồng</option>
                    <option value="sibling">Anh/chị/em</option>
                    <option value="unknown">Chưa rõ</option>
                  </select>
                </Field>
                <Field label="Độ tin cậy">
                  <select value={relationForm.confidence} onChange={(e) => setRelationForm({ ...relationForm, confidence: e.target.value })}>
                    <option value="high">Tin cậy cao</option>
                    <option value="medium">Cần đối chiếu</option>
                    <option value="low">Chữ khó đọc</option>
                  </select>
                </Field>
                <Field label="Ghi chú">
                  <textarea value={relationForm.note} onChange={(e) => setRelationForm({ ...relationForm, note: e.target.value })} />
                </Field>
              </div>
              <button className="btn primary" type="submit">Lưu quan hệ</button>
            </form>
          )}

          {tab === 'event' && (
            <form
              className="cmsForm"
              onSubmit={(event) => {
                event.preventDefault();
                run(async () => saveEventDraft(eventForm, actor), 'Đã tạo event draft / JSON patch.');
              }}
            >
              <h3>Thêm ngày giỗ / sự kiện</h3>
              <div className="cmsGrid">
                <Field label="Người liên quan">
                  <PersonSelect people={people} value={eventForm.personId} onChange={(value) => setEventForm({ ...eventForm, personId: value })} />
                </Field>
                <Field label="Tiêu đề">
                  <input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required />
                </Field>
                <Field label="Ngày âm lịch">
                  <input value={eventForm.dateLunar} onChange={(e) => setEventForm({ ...eventForm, dateLunar: e.target.value })} placeholder="VD: 22-05" />
                </Field>
                <Field label="Ngày dương lịch">
                  <input type="date" value={eventForm.dateSolar} onChange={(e) => setEventForm({ ...eventForm, dateSolar: e.target.value })} />
                </Field>
                <Field label="Chi">
                  <input list="branch-list" value={eventForm.branch} onChange={(e) => setEventForm({ ...eventForm, branch: e.target.value })} />
                </Field>
                <Field label="Quyền hiển thị">
                  <select value={eventForm.privacy} onChange={(e) => setEventForm({ ...eventForm, privacy: e.target.value })}>
                    <option value="public">Công khai</option>
                    <option value="family">Nội bộ</option>
                    <option value="same_branch">Cùng chi</option>
                  </select>
                </Field>
                <Field label="Ghi chú">
                  <textarea value={eventForm.note} onChange={(e) => setEventForm({ ...eventForm, note: e.target.value })} />
                </Field>
              </div>
              <button className="btn primary" type="submit">Lưu ngày giỗ</button>
            </form>
          )}

          {tab === 'grave' && (
            <form
              className="cmsForm"
              onSubmit={(event) => {
                event.preventDefault();
                run(async () => saveGraveDraft(graveForm, actor), 'Đã tạo grave draft / JSON patch.');
              }}
            >
              <h3>Thêm mộ phần</h3>
              <div className="cmsGrid">
                <Field label="Người liên quan">
                  <PersonSelect people={people} value={graveForm.personId} onChange={(value) => setGraveForm({ ...graveForm, personId: value })} />
                </Field>
                <Field label="Tên mộ">
                  <input value={graveForm.name} onChange={(e) => setGraveForm({ ...graveForm, name: e.target.value })} required />
                </Field>
                <Field label="Nghĩa trang / khu mộ">
                  <input value={graveForm.cemeteryName} onChange={(e) => setGraveForm({ ...graveForm, cemeteryName: e.target.value })} />
                </Field>
                <Field label="Khu / hàng / số mộ">
                  <input value={graveForm.graveArea} onChange={(e) => setGraveForm({ ...graveForm, graveArea: e.target.value })} placeholder="VD: Khu A, hàng 3, số 12" />
                </Field>
                <Field label="Vĩ độ">
                  <input value={graveForm.lat} onChange={(e) => setGraveForm({ ...graveForm, lat: e.target.value })} />
                </Field>
                <Field label="Kinh độ">
                  <input value={graveForm.lng} onChange={(e) => setGraveForm({ ...graveForm, lng: e.target.value })} />
                </Field>
                <Field label="Google Maps URL">
                  <input value={graveForm.googleMapsUrl} onChange={(e) => setGraveForm({ ...graveForm, googleMapsUrl: e.target.value })} />
                </Field>
                <Field label="Quyền hiển thị">
                  <select value={graveForm.privacy} onChange={(e) => setGraveForm({ ...graveForm, privacy: e.target.value })}>
                    <option value="family">Nội bộ</option>
                    <option value="same_branch">Cùng chi</option>
                    <option value="public">Công khai</option>
                  </select>
                </Field>
                <Field label="Ghi chú đường đi">
                  <textarea value={graveForm.routeNote} onChange={(e) => setGraveForm({ ...graveForm, routeNote: e.target.value })} />
                </Field>
                <Field label="Văn bia">
                  <textarea value={graveForm.epitaphText} onChange={(e) => setGraveForm({ ...graveForm, epitaphText: e.target.value })} />
                </Field>
              </div>
              <button className="btn primary" type="submit">Lưu mộ phần</button>
            </form>
          )}

          {tab === 'request' && (
            <form
              className="cmsForm"
              onSubmit={(event) => {
                event.preventDefault();
                run(async () => submitFamilyRequest(requestForm, actor), 'Đã tạo family request / JSON patch.');
              }}
            >
              <h3>Gửi góp ý / yêu cầu chỉnh sửa</h3>
              <div className="cmsGrid">
                <Field label="Loại yêu cầu">
                  <select value={requestForm.requestType} onChange={(e) => setRequestForm({ ...requestForm, requestType: e.target.value })}>
                    <option value="data_correction">Sửa dữ liệu</option>
                    <option value="grave_location_update">Cập nhật mộ phần</option>
                    <option value="source_upload">Gửi tư liệu</option>
                    <option value="contact_request">Yêu cầu kết nối</option>
                    <option value="mentorship_request">Yêu cầu mentor</option>
                  </select>
                </Field>
                <Field label="Người liên quan">
                  <PersonSelect people={people} value={requestForm.toPersonId} onChange={(value) => setRequestForm({ ...requestForm, toPersonId: value })} />
                </Field>
                <Field label="Nội dung">
                  <textarea value={requestForm.message} onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })} required />
                </Field>
              </div>
              <button className="btn primary" type="submit">Gửi góp ý</button>
            </form>
          )}

          {tab === 'review' && (
            <div className="cmsForm">
              <h3>Duyệt yêu cầu</h3>
              <p className="sub">Ở static mode, thao tác này xuất JSON patch. Ở Supabase mode, hệ thống cập nhật trạng thái request.</p>
              <div className="cmsGrid">
                <Field label="Request ID">
                  <input value={reviewRequestId} onChange={(e) => setReviewRequestId(e.target.value)} placeholder="Nhập request id" />
                </Field>
              </div>
              <button
                className="btn primary"
                type="button"
                onClick={() => run(async () => approveRequest(reviewRequestId, actor), 'Đã tạo approve patch / cập nhật request.')}
              >
                Duyệt request
              </button>
            </div>
          )}

          <datalist id="branch-list">
            {branches.map((branch) => <option key={branch} value={branch} />)}
          </datalist>
        </div>
      </div>

      <div className="cmsNote">
        <b>Nguyên tắc an toàn:</b> CMS không có trường CMND/CMT/CCCD. Người còn sống, trẻ nhỏ, liên hệ cá nhân và tọa độ mộ mặc định nên để nội bộ.
      </div>
    </section>
  );
}
