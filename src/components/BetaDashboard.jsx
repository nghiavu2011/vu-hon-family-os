
import { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  BETA_CHECKLIST,
  UAT_SCENARIOS,
  getBetaMetrics,
  loadChecklistState,
  saveChecklistState,
  summarizeChecklist,
} from '../lib/betaMetrics.js';
import {
  submitBetaChecklistSnapshot,
  submitBetaFeedback,
} from '../services/betaService.js';

const EMPTY_FEEDBACK = {
  feedbackType: 'bug',
  screen: 'Trang chủ',
  severity: 'medium',
  title: '',
  description: '',
  reporterName: '',
  reporterContact: '',
};

function MetricCard({ label, value, note }) {
  return (
    <div className="betaMetric">
      <b>{value}</b>
      <span>{label}</span>
      {note ? <small>{note}</small> : null}
    </div>
  );
}

function statusLabel(value) {
  if (value === 'pass') return 'PASS';
  if (value === 'fail') return 'FAIL';
  return 'PENDING';
}

export default function BetaDashboard({
  people = [],
  visiblePeople = [],
  events = [],
  graves = [],
}) {
  const auth = useAuth();
  const [checklistState, setChecklistState] = useState(() => loadChecklistState());
  const [feedback, setFeedback] = useState(EMPTY_FEEDBACK);
  const [message, setMessage] = useState('');

  const actor = { role: auth.role, branch: auth.branch, profile: auth.profile?.display_name };
  const metrics = useMemo(
    () => getBetaMetrics({ people, visiblePeople, events, graves }),
    [people, visiblePeople, events, graves]
  );
  const summary = useMemo(() => summarizeChecklist(checklistState), [checklistState]);

  function setChecklist(itemId, status) {
    const next = { ...checklistState, [itemId]: status };
    setChecklistState(next);
    saveChecklistState(next);
  }

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
    <section className="section wrap" id="beta">
      <div className="sectionHead">
        <div>
          <h2>V23 Beta nội tộc</h2>
          <p className="sub">
            Dashboard kiểm thử trước khi đưa cho 5–10 người trong họ dùng thử: checklist, số liệu dữ liệu, phản hồi lỗi và UAT script.
          </p>
        </div>
      </div>

      <div className="betaHero">
        <div>
          <h3>Trạng thái beta</h3>
          <p>
            PASS {summary.pass}/{summary.total} · FAIL {summary.fail} · PENDING {summary.pending}
          </p>
        </div>
        <button
          className="btn primary"
          type="button"
          onClick={() => run(
            async () => submitBetaChecklistSnapshot({ checklistState, metrics }, actor),
            'Đã lưu snapshot checklist / JSON patch.'
          )}
        >
          Xuất snapshot beta
        </button>
      </div>

      <div className="betaMetricsGrid">
        <MetricCard label="Hồ sơ tổng" value={metrics.totalPeople} />
        <MetricCard label="Đang hiển thị" value={metrics.visibleCount} note="sau privacy filter" />
        <MetricCard label="Đang ẩn" value={metrics.hiddenCount} note="theo quyền riêng tư" />
        <MetricCard label="Ngày giỗ" value={metrics.eventsCount} />
        <MetricCard label="Mộ phần" value={metrics.gravesCount} />
        <MetricCard label="Mộ có GPS" value={metrics.gravesWithGps} />
        <MetricCard label="Mộ thiếu GPS" value={metrics.gravesMissingGps} />
        <MetricCard label="Cần kiểm dữ liệu" value={metrics.needsReview} />
      </div>

      <div className="betaGrid">
        <div className="betaPanel">
          <h3>Checklist chức năng</h3>
          <div className="betaChecklist">
            {BETA_CHECKLIST.map((item) => {
              const status = checklistState[item.id] || 'pending';
              return (
                <div className={`betaCheckItem ${status}`} key={item.id}>
                  <div>
                    <b>{item.title}</b>
                    <span>{item.group} · {item.detail}</span>
                  </div>
                  <div className="betaCheckActions">
                    <em>{statusLabel(status)}</em>
                    <button type="button" onClick={() => setChecklist(item.id, 'pass')}>Pass</button>
                    <button type="button" onClick={() => setChecklist(item.id, 'fail')}>Fail</button>
                    <button type="button" onClick={() => setChecklist(item.id, 'pending')}>Reset</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="betaPanel">
          <h3>Feedback / Bug report</h3>
          {message ? <div className="betaStatus">{message}</div> : null}
          <form
            className="betaForm"
            onSubmit={(event) => {
              event.preventDefault();
              run(
                async () => submitBetaFeedback(feedback, actor),
                'Đã gửi feedback / JSON patch.'
              );
            }}
          >
            <label>
              <span>Loại</span>
              <select value={feedback.feedbackType} onChange={(event) => setFeedback({ ...feedback, feedbackType: event.target.value })}>
                <option value="bug">Lỗi</option>
                <option value="data_issue">Sai dữ liệu</option>
                <option value="privacy_issue">Vấn đề riêng tư</option>
                <option value="ux_feedback">Góp ý giao diện</option>
                <option value="feature_request">Đề xuất chức năng</option>
              </select>
            </label>
            <label>
              <span>Màn hình</span>
              <input value={feedback.screen} onChange={(event) => setFeedback({ ...feedback, screen: event.target.value })} />
            </label>
            <label>
              <span>Mức độ</span>
              <select value={feedback.severity} onChange={(event) => setFeedback({ ...feedback, severity: event.target.value })}>
                <option value="low">Nhẹ</option>
                <option value="medium">Trung bình</option>
                <option value="high">Nghiêm trọng</option>
                <option value="critical">Chặn sử dụng</option>
              </select>
            </label>
            <label>
              <span>Tiêu đề</span>
              <input value={feedback.title} onChange={(event) => setFeedback({ ...feedback, title: event.target.value })} />
            </label>
            <label>
              <span>Mô tả</span>
              <textarea value={feedback.description} onChange={(event) => setFeedback({ ...feedback, description: event.target.value })} required />
            </label>
            <label>
              <span>Người gửi</span>
              <input value={feedback.reporterName} onChange={(event) => setFeedback({ ...feedback, reporterName: event.target.value })} />
            </label>
            <label>
              <span>Liên hệ người gửi</span>
              <input value={feedback.reporterContact} onChange={(event) => setFeedback({ ...feedback, reporterContact: event.target.value })} />
            </label>
            <button className="btn primary" type="submit">Gửi feedback</button>
          </form>
        </div>
      </div>

      <div className="betaPanel betaUat">
        <h3>UAT Script cho 5–10 người trong họ</h3>
        <ol>
          {UAT_SCENARIOS.map((scenario) => (
            <li key={scenario}>{scenario}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
