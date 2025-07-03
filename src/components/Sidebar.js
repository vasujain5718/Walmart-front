import { ChartLine, Robot, Trophy, TrendUp } from "phosphor-react";
import { useState, useEffect } from "react";
import './Sidebar.css'; // Make sure to create and import this

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    const timer = setTimeout(() => setIsVisible(true), 500);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      clearTimeout(timer);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { id: 'hero', label: 'Dashboard', icon: ChartLine },
    { id: 'sales-graph', label: 'Sales Analytics', icon: TrendUp },
    { id: 'ai-chatbot', label: 'AI Assistant', icon: Robot },
    { id: 'top-products', label: 'Top Products', icon: Trophy },
    { id: 'stats-comparison', label: 'Performance', icon: ChartLine },
  ];

  if (isMobile) {
    return (
      <div className="mobile-sidebar-wrapper">
        <div className="glass-card">
          <nav className="mobile-nav">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`nav-button ${isVisible ? 'fade-in' : ''}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon size={18} weight="light" />
                  <span className="label">{item.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    );
  }

  return (
    <div className={`sidebar ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="sidebar-inner">
        <div className="sidebar-header">
          <h2 className="sidebar-title">WALMART</h2>
          <p className="sidebar-subtitle">Analytics Dashboard</p>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`nav-link ${isVisible ? 'fade-in' : ''}`}
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <Icon size={20} weight="light" className="icon" />
                <span className="label">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
