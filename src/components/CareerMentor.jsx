
import { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  saveCareerProfileDraft,
  saveYoungProfileDraft,
  submitMentorshipRequest,
} from '../services/networkCareerService.js';

const EMPTY_CAREER = {
  personId: '',
  industry: '',
  occupation: '',
  company: '',
  city: '',
  country: 'Việt Nam',
  skills: '',
  education: '',
  canMentor: false,
  canOfferInternship: false,
  canReviewCv: false,
  canReferJob: false,
  publicBio: '',
  visibility: 'family',
};

const EMPTY_MENTORSHIP = {
  fromPersonId: '',
  toPersonId: '',
  topic: '',
  goal: '',
  studentInfo: '',
  preferredContact: '',
};

const EMPTY_YOUNG = {
  personId: '',
  school: '',
  className: '',
  strengths: '',
  interests: '',
  targetMajor: '',
  supportNeeded: '',
  portfolioUrl: '',
  visibility: 'family',
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

export default function CareerMentor({ people = [] }) {
  const auth = useAuth();
  const [tab, setTab] = useState('career');
  const [careerForm, setCareerForm] = useState(EMPTY_CAREER);
  const [mentorForm, setMentorForm] = useState(EMPTY_MENTORSHIP);
  const [youngForm, setYoungForm] = useState(EMPTY_YOUNG);
  const [message, setMessage] = useState('');

  const possibleMentors = useMemo(() => people.filter((person) => (person.gen || 0) >= 5), [people]);
  const youngPeople = useMemo(() => people.filter((person) => (person.gen || 0) >= 6), [people]);
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
    <section className="section wrap" id="career-mentor">
      <div className="sectionHead">
        <div>
          <h2>Hướng nghiệp & Mentor nội tộc</h2>
          <p className="sub">
            Tiếp nối truyền thống hiếu học Mộ Trạch: Hỗ trợ học tập, tư vấn nghề nghiệp và kết nối người đi trước nâng bước thế hệ trẻ họ Vũ.
          </p>
        </div>
      </div>

      <div className="mentorShell">
        <aside className="mentorHero">
          <img src="/assets/feature-career.png" loading="lazy" alt="" />
          <div>
            <h3>Gia phả sống cho tương lai</h3>
            <p>
              Người đi trước có thể để lại kinh nghiệm, mở cửa thực tập, định hướng ngành nghề và hỗ trợ con cháu.
            </p>
          </div>
        </aside>

        <div className="networkPanel">
          <div className="networkTabs">
            <button className={tab === 'career' ? 'active' : ''} onClick={() => setTab('career')} type="button">Hồ sơ nghề nghiệp</button>
            <button className={tab === 'mentor' ? 'active' : ''} onClick={() => setTab('mentor')} type="button">Yêu cầu mentor</button>
            <button className={tab === 'young' ? 'active' : ''} onClick={() => setTab('young')} type="button">Thế hệ trẻ</button>
          </div>

          {message ? <div className="networkStatus">{message}</div> : null}

          {tab === 'career' && (
            <form
              className="networkForm"
              onSubmit={(event) => {
                event.preventDefault();
                run(async () => saveCareerProfileDraft(careerForm, actor), 'Đã lưu hồ sơ nghề nghiệp / JSON patch.');
              }}
            >
              <div className="networkGrid">
                <Field label="Người liên quan">
                  <PersonSelect people={possibleMentors.length ? possibleMentors : people} value={careerForm.personId} onChange={(value) => setCareerForm({ ...careerForm, personId: value })} />
                </Field>
                <Field label="Ngành nghề">
                  <input value={careerForm.industry} onChange={(event) => setCareerForm({ ...careerForm, industry: event.target.value })} placeholder="VD: Kiến trúc, AI, tài chính..." />
                </Field>
                <Field label="Chức danh / nghề nghiệp">
                  <input value={careerForm.occupation} onChange={(event) => setCareerForm({ ...careerForm, occupation: event.target.value })} />
                </Field>
                <Field label="Công ty / tổ chức">
                  <input value={careerForm.company} onChange={(event) => setCareerForm({ ...careerForm, company: event.target.value })} />
                </Field>
                <Field label="Kỹ năng">
                  <input value={careerForm.skills} onChange={(event) => setCareerForm({ ...careerForm, skills: event.target.value })} placeholder="Cách nhau bằng dấu phẩy" />
                </Field>
                <Field label="Học vấn">
                  <input value={careerForm.education} onChange={(event) => setCareerForm({ ...careerForm, education: event.target.value })} />
                </Field>
                <Field label="Tiểu sử nghề nghiệp ngắn">
                  <textarea value={careerForm.publicBio} onChange={(event) => setCareerForm({ ...careerForm, publicBio: event.target.value })} />
                </Field>
                <div className="mentorChecks">
                  <label><input type="checkbox" checked={careerForm.canMentor} onChange={(event) => setCareerForm({ ...careerForm, canMentor: event.target.checked })} /> Có thể mentor</label>
                  <label><input type="checkbox" checked={careerForm.canOfferInternship} onChange={(event) => setCareerForm({ ...careerForm, canOfferInternship: event.target.checked })} /> Có thể nhận thực tập</label>
                  <label><input type="checkbox" checked={careerForm.canReviewCv} onChange={(event) => setCareerForm({ ...careerForm, canReviewCv: event.target.checked })} /> Có thể review CV</label>
                  <label><input type="checkbox" checked={careerForm.canReferJob} onChange={(event) => setCareerForm({ ...careerForm, canReferJob: event.target.checked })} /> Có thể giới thiệu việc</label>
                </div>
              </div>

              <button className="btn primary" type="submit">Lưu hồ sơ nghề nghiệp</button>
            </form>
          )}

          {tab === 'mentor' && (
            <form
              className="networkForm"
              onSubmit={(event) => {
                event.preventDefault();
                run(async () => submitMentorshipRequest(mentorForm, actor), 'Đã gửi yêu cầu mentor / JSON patch.');
              }}
            >
              <div className="networkGrid">
                <Field label="Người cần hỗ trợ">
                  <PersonSelect people={youngPeople.length ? youngPeople : people} value={mentorForm.fromPersonId} onChange={(value) => setMentorForm({ ...mentorForm, fromPersonId: value })} />
                </Field>
                <Field label="Người muốn xin mentor">
                  <PersonSelect people={possibleMentors.length ? possibleMentors : people} value={mentorForm.toPersonId} onChange={(value) => setMentorForm({ ...mentorForm, toPersonId: value })} />
                </Field>
                <Field label="Chủ đề">
                  <input value={mentorForm.topic} onChange={(event) => setMentorForm({ ...mentorForm, topic: event.target.value })} placeholder="VD: chọn ngành, CV, thực tập, AI..." />
                </Field>
                <Field label="Kênh liên hệ mong muốn">
                  <input value={mentorForm.preferredContact} onChange={(event) => setMentorForm({ ...mentorForm, preferredContact: event.target.value })} />
                </Field>
                <Field label="Thông tin học sinh/sinh viên">
                  <textarea value={mentorForm.studentInfo} onChange={(event) => setMentorForm({ ...mentorForm, studentInfo: event.target.value })} />
                </Field>
                <Field label="Mục tiêu cần hỗ trợ">
                  <textarea value={mentorForm.goal} onChange={(event) => setMentorForm({ ...mentorForm, goal: event.target.value })} required />
                </Field>
              </div>

              <button className="btn primary" type="submit">Gửi yêu cầu mentor</button>
            </form>
          )}

          {tab === 'young' && (
            <form
              className="networkForm"
              onSubmit={(event) => {
                event.preventDefault();
                run(async () => saveYoungProfileDraft(youngForm, actor), 'Đã lưu hồ sơ thế hệ trẻ / JSON patch.');
              }}
            >
              <div className="networkGrid">
                <Field label="Người liên quan">
                  <PersonSelect people={youngPeople.length ? youngPeople : people} value={youngForm.personId} onChange={(value) => setYoungForm({ ...youngForm, personId: value })} />
                </Field>
                <Field label="Trường">
                  <input value={youngForm.school} onChange={(event) => setYoungForm({ ...youngForm, school: event.target.value })} />
                </Field>
                <Field label="Lớp / khóa">
                  <input value={youngForm.className} onChange={(event) => setYoungForm({ ...youngForm, className: event.target.value })} />
                </Field>
                <Field label="Môn mạnh / thế mạnh">
                  <input value={youngForm.strengths} onChange={(event) => setYoungForm({ ...youngForm, strengths: event.target.value })} />
                </Field>
                <Field label="Sở thích">
                  <input value={youngForm.interests} onChange={(event) => setYoungForm({ ...youngForm, interests: event.target.value })} />
                </Field>
                <Field label="Ngành quan tâm">
                  <input value={youngForm.targetMajor} onChange={(event) => setYoungForm({ ...youngForm, targetMajor: event.target.value })} />
                </Field>
                <Field label="Portfolio / thành tích">
                  <input value={youngForm.portfolioUrl} onChange={(event) => setYoungForm({ ...youngForm, portfolioUrl: event.target.value })} />
                </Field>
                <Field label="Cần hỗ trợ gì">
                  <textarea value={youngForm.supportNeeded} onChange={(event) => setYoungForm({ ...youngForm, supportNeeded: event.target.value })} />
                </Field>
              </div>

              <button className="btn primary" type="submit">Lưu hồ sơ thế hệ trẻ</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
