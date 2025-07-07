import Spline from '@splinetool/react-spline';
import Gradtext from './Gradtext'
const Hero = () => {
  const handleGetStarted = () => {
    const chartSection = document.getElementById('chart-section');
    if (chartSection) {
      chartSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Spline scene="https://prod.spline.design/zDdzaiK9AU8isUO6/scene.splinecode" />
      <button
  onClick={handleGetStarted}
  style={{
    position: 'absolute',
    left: '50%',
    top: '80%',
    transform: 'translate(-50%, 0)',
    padding: '1rem 2.5rem',
    fontSize: '1.2rem',
    background: 'rgba(10, 20, 30, 0.92)', // dark, semi-transparent
    border: '2px solid #39E0C7',          // teal border
    borderRadius: '2rem',
    cursor: 'pointer',
    fontWeight: 600,
    boxShadow: '0 4px 24px #39E0C770',
    transition: 'background 0.2s, border 0.2s',
    color: '#39E0C7',
  }}
>
  <Gradtext
    colors={[
      "#39E0C7", // teal
      "#40ffaa", // light green
      "#4079ff", // blue
      "#39E0C7", // teal
      "#40ffaa"  // light green
    ]}
    animationSpeed={3}
    showBorder={false}
    className="custom-class"
  >
    Get Started
  </Gradtext>
</button>
    </div>
  );
};

export default Hero;