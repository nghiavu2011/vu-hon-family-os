import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadFamilyData } from './services/familyDataService.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import StatsBar from './components/StatsBar.jsx';
import QuickNavPills from './components/QuickNavPills.jsx';
import LineagePreview from './components/LineagePreview.jsx';
import ModuleCards from './components/ModuleCards.jsx';
import HeritageVideoSection from './components/HeritageVideoSection.jsx';
import FamilyTree from './components/FamilyTree.jsx';
import KinshipCalculator from './components/KinshipCalculator.jsx';
import PersonDrawer from './components/PersonDrawer.jsx';
import MemberDirectory from './components/MemberDirectory.jsx';
import EventList from './components/EventList.jsx';
import GraveMap from './components/GraveMap.jsx';
import GovernanceCenter from './components/GovernanceCenter.jsx';
import CareerSection from './components/CareerSection.jsx';
import InternalNetwork from './components/InternalNetwork.jsx';
import CareerMentor from './components/CareerMentor.jsx';
import VisitorAnalyticsDashboard from './components/VisitorAnalyticsDashboard.jsx';
import FloatingContact from './components/FloatingContact.jsx';
import BetaDashboard from './components/BetaDashboard.jsx';
import ProductionLaunch from './components/ProductionLaunch.jsx';
import ContributionModal from './components/ContributionModal.jsx';
import FamilyAiChatModal from './components/FamilyAiChatModal.jsx';
import SourceNotesModal from './components/SourceNotesModal.jsx';
import PrivacyModal from './components/PrivacyModal.jsx';
import PwaInstallBanner from './components/PwaInstallBanner.jsx';
import Footer from './components/Footer.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import AuthPanel from './components/AuthPanel.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { getBranches } from './lib/utils.js';
import { filterEventsByPrivacy, filterGravesByPrivacy, filterPeopleByPrivacy, summarizePrivacy } from './lib/privacy.js';

function canSeeAdmin(role) {
  return role === 'editor' || role === 'admin';
}

function FamilyOsApp() {
  const auth = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [selectedPersonId, setSelectedPersonId] = useState(null);

  // Senior mode (Chế độ Cụ Bô Lão / Chữ to)
  const [seniorMode, setSeniorMode] = useState(() => {
    return localStorage.getItem('family_senior_mode') === 'true';
  });

  // Modal states
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [contributionTarget, setContributionTarget] = useState(null);
  const [kinshipPreselectB, setKinshipPreselectB] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showSourceNotesModal, setShowSourceNotesModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  useEffect(() => {
    if (seniorMode) {
      document.body.classList.add('seniorMode');
    } else {
      document.body.classList.remove('seniorMode');
    }
    localStorage.setItem('family_senior_mode', seniorMode ? 'true' : 'false');
  }, [seniorMode]);

  useEffect(() => {
    let mounted = true;

    loadFamilyData()
      .then((loadedData) => {
        if (!mounted) return;
        setData(loadedData);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Lỗi tải dữ liệu.');
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSelectPerson = useCallback((id) => {
    setSelectedPersonId(id);
  }, []);

  const handleOpenKinshipForPerson = useCallback((personId) => {
    setKinshipPreselectB(personId);
    const el = document.getElementById('kinship');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleOpenContribution = useCallback((targetPerson) => {
    setContributionTarget(targetPerson || null);
    setShowContributionModal(true);
  }, []);

  const rawPeople = data?.people || [];
  const rawEvents = data?.events || [];
  const rawGraves = data?.graves || [];
  const rawPlaces = data?.places || [];

  const people = useMemo(() => filterPeopleByPrivacy(rawPeople, auth), [rawPeople, auth]);
  const events = useMemo(() => filterEventsByPrivacy(rawEvents, people), [rawEvents, people]);
  const graves = useMemo(() => filterGravesByPrivacy(rawGraves, people, auth), [rawGraves, people, auth]);

  const branches = useMemo(() => getBranches(rawPeople), [rawPeople]);
  const privacySummary = useMemo(() => summarizePrivacy(rawPeople, people), [rawPeople, people]);
  const showAdmin = canSeeAdmin(auth.role);

  if (error) {
    return (
      <main className="wrap errorState">
        <h2>Không thể khởi tạo Vũ Hồn Family OS</h2>
        <p>{error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="wrap loadingState">
        <p>Đang tải dữ liệu gia phả...</p>
      </main>
    );
  }

  return (
    <>
      <PwaInstallBanner />
      <Header
        seniorMode={seniorMode}
        onToggleSeniorMode={() => setSeniorMode((prev) => !prev)}
        onOpenKinship={() => {
          const el = document.getElementById('kinship');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenContribution={() => handleOpenContribution(null)}
        onOpenAi={() => setShowAiModal(true)}
        onOpenSources={() => setShowSourceNotesModal(true)}
        onOpenPrivacy={() => setShowPrivacyModal(true)}
      />

      {showAdmin ? <AuthPanel branches={branches} privacySummary={privacySummary} /> : null}

      <Hero />
      <StatsBar people={people} events={events} places={rawPlaces} />

      {/* Thanh Điều Hướng Nhanh 1-Chạm (Tối đa 3 lần click / lăn chuột) */}
      <QuickNavPills
        onOpenSources={() => setShowSourceNotesModal(true)}
        onOpenPrivacy={() => setShowPrivacyModal(true)}
      />

      {/* Trục Truyền Thừa Đa Phân Chi */}
      <LineagePreview onOpenContribution={() => handleOpenContribution(null)} />

      {/* Cổng Tiện Ích Khám Phá Nhanh */}
      <ModuleCards onOpenSources={() => setShowSourceNotesModal(true)} />

      {/* Thước Phim Di Sản: Nguồn Gốc Dòng Họ Vũ - Võ Tại Việt Nam */}
      <HeritageVideoSection />

      {/* Cây Phả Hệ Tộc Họ Trực Quan */}
      <FamilyTree people={people} onSelect={handleSelectPerson} />
      
      {/* Bộ Tra cứu Xưng hô & Quan hệ Họ tộc */}
      <KinshipCalculator
        people={people}
        preselectIdB={kinshipPreselectB}
      />

      {/* Danh bạ Thành viên */}
      <MemberDirectory people={people} onSelect={handleSelectPerson} />

      {/* Bản Đồ Mộ Phần & QR Tưởng Niệm (Có GPS Google Maps và ảnh thực địa) */}
      <GraveMap graves={graves} people={people} />

      {/* Lịch Giỗ Tổ & Lễ Tiết */}
      <EventList events={events} />

      {/* Hướng Nghiệp & Khuyến Học */}
      <CareerSection />
      {auth.role !== 'public' ? <InternalNetwork people={people} /> : null}
      {auth.role !== 'public' ? <CareerMentor people={people} /> : null}

      {/* Quản trị & CMS dành riêng cho Admin */}
      {showAdmin ? <GovernanceCenter people={people} events={events} graves={graves} /> : null}
      {showAdmin ? <AdminDashboard people={people} events={events} graves={graves} /> : null}
      {showAdmin ? <BetaDashboard people={rawPeople} visiblePeople={people} events={events} graves={graves} /> : null}
      {showAdmin ? <ProductionLaunch people={rawPeople} visiblePeople={people} events={events} places={rawPlaces} graves={graves} /> : null}

      {/* Thống Kê Truy Cập & Nhịp Sống Dòng Họ (Realtime) */}
      <VisitorAnalyticsDashboard />

      {/* Chân trang Di sản */}
      <Footer
        onOpenSources={() => setShowSourceNotesModal(true)}
        onOpenPrivacy={() => setShowPrivacyModal(true)}
      />

      {/* Nút Zalo / Hotline & Cụ Đồ Ảo AI nổi cạnh màn hình */}
      <FloatingContact onOpenAi={() => setShowAiModal(true)} />

      {/* Ngăn kéo Hồ sơ cá nhân */}
      <PersonDrawer
        personId={selectedPersonId}
        people={people}
        onClose={() => setSelectedPersonId(null)}
        onSelect={handleSelectPerson}
        onOpenKinship={handleOpenKinshipForPerson}
        onOpenContribution={handleOpenContribution}
      />

      {/* Modal Đề xuất bổ sung con cháu / sửa đổi phả hệ */}
      {showContributionModal && (
        <ContributionModal
          people={people}
          targetPerson={contributionTarget}
          onClose={() => {
            setShowContributionModal(false);
            setContributionTarget(null);
          }}
          onSubmitted={(prop) => {
            console.log('Submitted proposal:', prop);
          }}
        />
      )}

      {/* Trợ lý Gia tộc AI (Cụ Đồ Ảo) Modal */}
      {showAiModal && (
        <FamilyAiChatModal
          people={people}
          events={events}
          onClose={() => setShowAiModal(false)}
        />
      )}

      {/* Modal Tư Liệu Gốc & Thần Tích Mộ Trạch */}
      {showSourceNotesModal && (
        <SourceNotesModal
          onClose={() => setShowSourceNotesModal(false)}
        />
      )}

      {/* Modal Chính Sách Bảo Mật & Riêng Tư Nội Tộc */}
      {showPrivacyModal && (
        <PrivacyModal
          onClose={() => setShowPrivacyModal(false)}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FamilyOsApp />
    </AuthProvider>
  );
}
