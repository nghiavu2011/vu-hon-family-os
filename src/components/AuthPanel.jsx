import { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { ROLE_LABELS, ROLES } from '../lib/privacy.js';

export default function AuthPanel({ branches = [], privacySummary }) {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const roleLabel = ROLE_LABELS[auth.role] || auth.role;
  const branchOptions = useMemo(() => [''].concat(branches), [branches]);

  async function handleLogin(event) {
    event.preventDefault();
    if (!email.trim()) return;

    setBusy(true);
    try {
      await auth.login(email.trim());
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="authPanel wrap" id="auth">
      <div className="authCard">
        <div>
          <h3>Đăng nhập & phân quyền</h3>
          <p>
            Vai trò hiện tại: <b>{roleLabel}</b>
            {auth.branch ? <> · Chi: <b>{auth.branch}</b></> : null}
          </p>
          {privacySummary ? (
            <p className="privacySummary">
              Đang hiển thị {privacySummary.visible}/{privacySummary.total} hồ sơ.
              {privacySummary.hidden > 0 ? ` Ẩn ${privacySummary.hidden} hồ sơ theo quyền riêng tư.` : ''}
            </p>
          ) : null}
          {auth.notice ? <p className="authNotice">{auth.notice}</p> : null}
        </div>

        {auth.isSupabase ? (
          auth.session ? (
            <button className="btn" type="button" onClick={auth.logout}>Đăng xuất</button>
          ) : (
            <form className="authForm" onSubmit={handleLogin}>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email người trong họ"
                type="email"
              />
              <button className="btn primary" type="submit" disabled={busy}>
                {busy ? 'Đang gửi...' : 'Gửi link đăng nhập'}
              </button>
            </form>
          )
        ) : auth.demoRoleSwitcherAllowed ? (
          <div className="authForm">
            <select value={auth.role} onChange={(event) => auth.setDemoRole(event.target.value)}>
              {ROLES.map((role) => (
                <option key={role} value={role}>{ROLE_LABELS[role]}</option>
              ))}
            </select>
            <select value={auth.branch} onChange={(event) => auth.setDemoBranch(event.target.value)}>
              {branchOptions.map((branch) => (
                <option key={branch || 'all'} value={branch}>
                  {branch || 'Không khóa theo chi'}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="authLocked">Demo role switcher đã tắt. Chỉ public được xem nếu chưa có Supabase Auth.</div>
        )}
      </div>
    </section>
  );
}
