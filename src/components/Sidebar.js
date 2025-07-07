import { ChartLine, Robot, Trophy, TrendUp } from "phosphor-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './Sidebar.css';

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

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

  // Custom handler for navigation and scrolling
  const handleNavClick = (item) => {
    if (item.id === 'ai-chatbot') {
      window.open('/ml', '_blank');
    } else if (item.id === 'top-products') {
      window.open('/prod', '_blank');
    } else if (item.id === 'sales-graph') {
      // Scroll to Chart section
      setTimeout(() => {
        document.getElementById('chart-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (item.id === 'stats-comparison') {
      // Scroll to Summary section
      setTimeout(() => {
        document.getElementById('summary-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const navItems = [
    { id: 'sales-graph', label: 'Sales Analytics', icon: TrendUp },
    { id: 'ai-chatbot', label: 'Predictions', icon: Robot },
    { id: 'top-products', label: 'See products', icon: Trophy },
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
                  onClick={() => handleNavClick(item)}
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
                onClick={() => handleNavClick(item)}
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