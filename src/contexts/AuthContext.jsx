import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { runtimeConfig, isSupabaseMode, isDemoRoleSwitcherAllowed } from '../runtimeConfig.js';
import {
  getCurrentSession,
  loadProfile,
  onAuthStateChange,
  signInWithEmail,
  signOut,
} from '../services/authService.js';

const AuthContext = createContext(null);

const DEMO_PROFILE = {
  id: 'static-demo-user',
  display_name: 'Static Demo',
  role: 'public',
  branch: '',
  person_id: null,
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(DEMO_PROFILE);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        if (!isSupabaseMode()) {
          const demoAllowed = isDemoRoleSwitcherAllowed();
          const savedRole = demoAllowed ? (localStorage.getItem('vu_hon_demo_role') || 'public') : 'public';
          const savedBranch = localStorage.getItem('vu_hon_demo_branch') || '';
          if (mounted) {
            setProfile({ ...DEMO_PROFILE, role: savedRole, branch: savedBranch });
            setNotice(demoAllowed ? 'Đang chạy static mode: role selector chỉ dùng để demo phân quyền.' : 'Production guard: demo role switcher bị tắt.');
          }
          return;
        }

        const currentSession = await getCurrentSession();
        if (!mounted) return;

        setSession(currentSession);
        if (currentSession?.user?.id) {
          const loadedProfile = await loadProfile(currentSession.user.id);
          if (mounted) {
            setProfile(loadedProfile || {
              id: currentSession.user.id,
              display_name: currentSession.user.email,
              role: 'family_member',
              branch: '',
              person_id: null,
            });
          }
        } else {
          setProfile(DEMO_PROFILE);
        }
      } catch (error) {
        console.error(error);
        if (mounted) setNotice(error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();

    const unsubscribe = onAuthStateChange(async (nextSession) => {
      setSession(nextSession);
      if (nextSession?.user?.id) {
        const loadedProfile = await loadProfile(nextSession.user.id);
        setProfile(loadedProfile || {
          id: nextSession.user.id,
          display_name: nextSession.user.email,
          role: 'family_member',
          branch: '',
          person_id: null,
        });
      } else {
        setProfile(DEMO_PROFILE);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  function setDemoRole(role) {
    if (isSupabaseMode() || !isDemoRoleSwitcherAllowed()) return;
    localStorage.setItem('vu_hon_demo_role', role);
    setProfile((current) => ({ ...current, role }));
  }

  function setDemoBranch(branch) {
    if (isSupabaseMode() || !isDemoRoleSwitcherAllowed()) return;
    localStorage.setItem('vu_hon_demo_branch', branch);
    setProfile((current) => ({ ...current, branch }));
  }

  async function login(email) {
    await signInWithEmail(email);
    setNotice('Đã gửi link đăng nhập vào email. Hãy kiểm tra hộp thư.');
  }

  async function logout() {
    await signOut();
    setSession(null);
    setProfile(DEMO_PROFILE);
  }

  const value = useMemo(() => ({
    session,
    profile,
    role: profile?.role || 'public',
    branch: profile?.branch || '',
    loading,
    notice,
    dataMode: runtimeConfig.dataMode,
    isSupabase: isSupabaseMode(),
    demoRoleSwitcherAllowed: isDemoRoleSwitcherAllowed(),
    setDemoRole,
    setDemoBranch,
    login,
    logout,
  }), [session, profile, loading, notice]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}
