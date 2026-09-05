import { useState, useEffect } from 'react';

export default function MobileBottomNav({ onOpenMenu }) {
  const [activeTab, setActiveTab] = useState('tree');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const sections = [
        { id: 'tree', key: 'tree' },
        { id: 'kinship', key: 'kinship' },
        { id: 'events', key: 'events' },
        { id: 'grave-map', key: 'grave-map' },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveTab(sections[i].key);
          return;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id, tabKey) => {
    setActiveTab(tabKey);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="mobileBottomNav" aria-label="Thanh điều hướng di động 1 chạm">
      <div className="mobileBottomNavInner">
        <button
          type="button"
          className={`mbNavItem ${activeTab === 'tree' ? 'active' : ''}`}
          onClick={() => scrollTo('tree', 'tree')}
        >
          <span className="mbIcon">🌳</span>
          <span className="mbLabel">Phả Hệ</span>
        </button>

        <button
          type="button"
          className={`mbNavItem ${activeTab === 'kinship' ? 'active' : ''}`}
          onClick={() => scrollTo('kinship', 'kinship')}
        >
          <span className="mbIcon">🧭</span>
          <span className="mbLabel">Xưng Hô</span>
        </button>

        <button
          type="button"
          className={`mbNavItem ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => scrollTo('events', 'events')}
        >
          <span className="mbIcon">📜</span>
          <span className="mbLabel">Lịch Giỗ</span>
        </button>

        <button
          type="button"
          className={`mbNavItem ${activeTab === 'grave-map' ? 'active' : ''}`}
          onClick={() => scrollTo('grave-map', 'grave-map')}
        >
          <span className="mbIcon">🪦</span>
          <span className="mbLabel">Lăng Mộ</span>
        </button>

        <button
          type="button"
          className="mbNavItem mbMenuBtn"
          onClick={onOpenMenu}
        >
          <span className="mbIcon">☰</span>
          <span className="mbLabel">Menu</span>
        </button>
      </div>
    </nav>
  );
}
