import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Hero from '../components/Hero';
import Chart from '../components/Chart';
import Summary from '../components/Summary';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    setIsLoaded(true);

    // Scroll animation setup
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.scroll-fade-in');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
  const fadeTimer = setTimeout(() => {
    const alertEl = document.getElementById('startup-alert');
    if (alertEl) {
      alertEl.style.opacity = 0;
    }
  }, 6000); // Start fading at 6s

  const hideTimer = setTimeout(() => {
    setShowAlert(false);
  }, 7000); // Remove at 7s

  return () => {
    clearTimeout(fadeTimer);
    clearTimeout(hideTimer);
  };
}, []);


  return (
    <div
      style={{
        minHeight: '100vh',
        transition: 'opacity 1s ease',
        opacity: isLoaded ? 1 : 0,
        display: 'flex',
        backgroundColor: '#050505',
        fontFamily: "'Poppins', sans-serif"
      }}
    >
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '250px', position: 'relative' }}>
        {/* Alert */}
        {showAlert && (
  <div
    id="startup-alert"
    style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
      color: '#39E0C7',
      padding: '16px 24px',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      maxWidth: '420px',
      fontSize: '0.95rem',
      fontWeight: 500,
      lineHeight: '1.4',
      opacity: 1,
      transition: 'opacity 1s ease-in-out'
    }}
    className="startup-alert"
  >
    <div>
      <strong>⏳ Backend is initializing...</strong><br />
      Data may take up to <strong>20 seconds</strong> to appear. This is normal during startup — no errors here.
    </div>
    <button
      onClick={() => setShowAlert(false)}
      style={{
        background: 'transparent',
        border: 'none',
        color: '#39E0C7',
        fontSize: '1.4rem',
        cursor: 'pointer',
        lineHeight: '1',
        marginLeft: 'auto'
      }}
      aria-label="Dismiss alert"
    >
      &times;
    </button>
  </div>
)}


        {/* Hero section spans full width without container effect */}
        <div className="scroll-fade-in" style={{ height: '100vh' }}>
          <Hero />
        </div>

        {/* Chart and Summary Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '48px',
            padding: '32px 48px 80px',
            boxShadow: '0 0 120px 20px rgba(57, 224, 199, 0.13) inset'
          }}
        >
          <div className="scroll-fade-in" id="chart-section">
            <Chart />
          </div>
          <div className="scroll-fade-in" id="summary-section">
            <Summary />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
