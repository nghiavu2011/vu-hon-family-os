
import { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { submitContactRequest, saveContactProfileDraft } from '../services/networkCareerService.js';

const EMPTY_CONTACT_REQUEST = {
  fromPersonId: '',
  toPersonId: '',
  channel: 'zalo',
  reason: '',
  message: '',
};

const EMPTY_CONTACT_PROFILE = {
  personId: '',
  phone: '',
  zalo: '',
  facebook: '',
  linkedin: '',
  email: '',
  city: '',
  country: 'Việt Nam',
  phoneVisibility: 'private',
  socialVisibility: 'family',
  emailVisibility: 'private',
  allowContactRequest: true,
  consent: false,
};

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

function Field({ label, children }) {
  return (
    <label className="networkField">
      <span>{label}</span>
      {children}
    </label>
  );
}

export default function InternalNetwork({ people = [] }) {
  const auth = useAuth();
  const [tab, setTab] = useState('request');
  const [requestForm, setRequestForm] = useState(EMPTY_CONTACT_REQUEST);
  const [profileForm, setProfileForm] = useState(EMPTY_CONTACT_PROFILE);
  const [message, setMessage] = useState('');

  const livingPeople = useMemo(() => people.filter((person) => (person.gen || 0) >= 5), [people]);
  const actor = { role: auth.role, branch: auth.branch, profile: auth.profile?.display_name };

  async function run(action, success) {
    setMessage('Đang xử lý...');
    try {
      await action();
      setMessage(success);
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'Có lỗi khi xử lý.');
    }
  }

  return (
    <section className="section wrap" id="internal-network">
      <div className="sectionHead">
        <div>
          <h2>Kết nối nội tộc</h2>
          <p className="sub">
            Mạng lưới kết nối đồng tộc tin cậy, tôn trọng quyền riêng tư và bảo mật thông tin liên lạc con cháu.
          </p>
        </div>
      </div>

      <div className="networkShell">
        <aside className="networkInfo">
          <img src="/assets/feature-clan-map.png" loading="lazy" alt="" />
          <h3>Không public liên hệ cá nhân</h3>
          <p>
            Người trong họ có thể gửi yêu cầu kết nối. Người nhận đồng ý thì mới chia sẻ kênh liên hệ phù hợp.
          </p>
          <ul>
            <li>Số điện thoại: mặc định riêng tư</li>
            <li>Zalo/Facebook/LinkedIn: theo consent</li>
            <li>Email: mặc định riêng tư</li>
            <li>Trẻ nhỏ: không public hồ sơ liên hệ</li>
          </ul>
        </aside>

        <div className="networkPanel">
          <div className="networkTabs">
            <button className={tab === 'request' ? 'active' : ''} onClick={() => setTab('request')} type="button">Gửi yêu cầu kết nối</button>
            <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')} type="button">Hồ sơ liên hệ</button>
          </div>

          {message ? <div className="networkStatus">{message}</div> : null}

          {tab === 'request' && (
            <form
              className="networkForm"
              onSubmit={(event) => {
                event.preventDefault();
                run(
                  async () => submitContactRequest(requestForm, actor),
                  'Đã tạo yêu cầu kết nối / JSON patch.'
                );
              }}
            >
              <div className="networkGrid">
                <Field label="Người gửi">
                  <PersonSelect people={people} value={requestForm.fromPersonId} onChange={(value) => setRequestForm({ ...requestForm, fromPersonId: value })} />
                </Field>
                <Field label="Người muốn kết nối">
                  <PersonSelect people={livingPeople.length ? livingPeople : people} value={requestForm.toPersonId} onChange={(value) => setRequestForm({ ...requestForm, toPersonId: value })} />
                </Field>
                <Field label="Kênh muốn xin">
                  <select value={requestForm.channel} onChange={(event) => setRequestForm({ ...requestForm, channel: event.target.value })}>
                    <option value="zalo">Zalo</option>
                    <option value="phone">Số điện thoại</option>
                    <option value="email">Email</option>
                    <option value="facebook">Facebook</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </Field>
                <Field label="Lý do">
                  <input value={requestForm.reason} onChange={(event) => setRequestForm({ ...requestForm, reason: event.target.value })} placeholder="VD: hỏi thông tin gia phả, công việc, học tập..." />
                </Field>
                <Field label="Tin nhắn">
                  <textarea value={requestForm.message} onChange={(event) => setRequestForm({ ...requestForm, message: event.target.value })} required />
                </Field>
              </div>

              <button className="btn primary" type="submit">Gửi yêu cầu</button>
            </form>
          )}

          {tab === 'profile' && (
            <form
              className="networkForm"
              onSubmit={(event) => {
                event.preventDefault();
                run(
                  async () => saveContactProfileDraft(profileForm, actor),
                  'Đã lưu hồ sơ liên hệ / JSON patch.'
                );
              }}
            >
              <div className="networkGrid">
                <Field label="Người liên quan">
                  <PersonSelect people={people} value={profileForm.personId} onChange={(value) => setProfileForm({ ...profileForm, personId: value })} />
                </Field>
                <Field label="Thành phố">
                  <input value={profileForm.city} onChange={(event) => setProfileForm({ ...profileForm, city: event.target.value })} />
                </Field>
                <Field label="Số điện thoại">
                  <input value={profileForm.phone} onChange={(event) => setProfileForm({ ...profileForm, phone: event.target.value })} />
                </Field>
                <Field label="Quyền xem số điện thoại">
                  <select value={profileForm.phoneVisibility} onChange={(event) => setProfileForm({ ...profileForm, phoneVisibility: event.target.value })}>
                    <option value="private">Riêng tư</option>
                    <option value="family">Nội bộ</option>
                    <option value="same_branch">Cùng chi</option>
                  </select>
                </Field>
                <Field label="Zalo">
                  <input value={profileForm.zalo} onChange={(event) => setProfileForm({ ...profileForm, zalo: event.target.value })} />
                </Field>
                <Field label="Facebook">
                  <input value={profileForm.facebook} onChange={(event) => setProfileForm({ ...profileForm, facebook: event.target.value })} />
                </Field>
                <Field label="LinkedIn">
                  <input value={profileForm.linkedin} onChange={(event) => setProfileForm({ ...profileForm, linkedin: event.target.value })} />
                </Field>
                <Field label="Email">
                  <input value={profileForm.email} onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })} />
                </Field>
                <label className="networkCheck">
                  <input type="checkbox" checked={profileForm.allowContactRequest} onChange={(event) => setProfileForm({ ...profileForm, allowContactRequest: event.target.checked })} />
                  <span>Cho phép người trong họ gửi yêu cầu kết nối</span>
                </label>
                <label className="networkCheck">
                  <input type="checkbox" checked={profileForm.consent} onChange={(event) => setProfileForm({ ...profileForm, consent: event.target.checked })} />
                  <span>Tôi đồng ý lưu thông tin liên hệ theo quyền hiển thị đã chọn</span>
                </label>
              </div>

              <button className="btn primary" type="submit">Lưu hồ sơ liên hệ</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
