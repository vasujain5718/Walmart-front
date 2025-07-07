import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Hero from '../components/Hero';
import Chart from '../components/Chart';
import Summary from '../components/Summary';
const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

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

  return (
    <div style={{
      minHeight: '100vh',
      transition: 'opacity 1s ease',
      opacity: isLoaded ? 1 : 0,
      display: 'flex',
      backgroundColor: '#050505'
    }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '250px' }}>
        {/* Hero section spans full width without container effect */}
        <div className="scroll-fade-in" style={{ height:'100vh' }}>
          <Hero />
        </div>

        {/* Chart section inside styled container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '48px',
            padding: '32px 48px 80px',
            boxShadow: '0 0 120px 20pxrgba(57, 224, 199, 0.13) inset'
          }}
        >
          <div className="scroll-fade-in" id="chart-section">
            <Chart />
          </div>
          <div className="scroll-fade-in" id="summary-section">
            <Summary/>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default Home;