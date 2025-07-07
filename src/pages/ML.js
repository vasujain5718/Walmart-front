import React, { useEffect, useState } from 'react';
import ML_chart from '../components/ML_chart';
import RestockSuggestion from '../components/RestockSuggestion';
import Orb from '../components/Orb';
import Aurora from '../components/Aurora'; // <-- Import Aurora
import './ML.css';
const CARD_HEIGHT = 600;

const ML = () => {
  const [products, setProducts] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [restockData, setRestockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsAndPredictions = async () => {
      try {
        const productRes = await fetch('https://walmart-back.onrender.com/api/admin/products');
        const productData = await productRes.json();
        setProducts(productData);

        const restockCheck = [];
        const predictionMap = {};

        await Promise.all(
          productData.map(async (product) => {
            const res = await fetch(`https://walmart-back.onrender.com/api/predict/${product._id}`);
            const result = await res.json();
            predictionMap[product._id] = result;

            const projectedTotal = result.reduce((sum, p) => sum + p.predictedSales, 0);
            if (projectedTotal > product.stock) {
              restockCheck.push({ product, projectedTotal });
            }
          })
        );

        setPredictions(predictionMap);
        setRestockData(restockCheck);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching ML data:', err);
      }
    };

    fetchProductsAndPredictions();
  }, []);

  const handleRestock = async (productId, amount) => {
    try {
      const res = await fetch(`https://walmart-back.onrender.com/api/admin/restock/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      if (res.ok) {
        const updated = await res.json();
        const updatedStock = updated.updatedProduct.stock;

        setProducts((prev) =>
          prev.map((p) => (p._id === productId ? { ...p, stock: updatedStock } : p))
        );

        setRestockData((prev) =>
          prev
            .map((item) => {
              if (item.product._id === productId) {
                const newStock = item.product.stock + amount;
                return {
                  ...item,
                  product: {
                    ...item.product,
                    stock: newStock,
                  },
                };
              }
              return item;
            })
            .filter((item) => item.product.stock < item.projectedTotal)
        );
      }
    } catch (err) {
      console.error('Restock failed:', err);
    }
  };
  const isMobile = window.innerWidth < 900;
   return (
    <div
      style={{
        background: 'linear-gradient(135deg, #050505 60%, #1a2a2e 100%)',
        minHeight: '100vh',
        fontFamily: 'Poppins, Inter, sans-serif',
        padding: '0',
        margin: '0',
        position: 'relative', // Needed for absolute bg
        overflow: 'hidden',
      }}
    >
      {loading ? (
        <div className="loading-screen">
          <Orb
            hoverIntensity={5}
            rotateOnHover={true}
            hue={75}
            forceHoverState={false}
          />
          <p className="loading-message" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Please hold on while we fetch intelligent insights from your product data.
            In the meantime, hover over the orb to experience something cool.
          </p>
        </div>
      ) : (
        <>
          {/* Aurora background */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 0,
              pointerEvents: 'none',
            }}
          >
            <Aurora />
          </div>

          {/* Main content (zIndex: 1 to be above Aurora) */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                padding: '48px 0 10px 0',
                background: 'linear-gradient(90deg, #39E0C7 0%, #4079ff 100%)',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 800,
                fontSize: '2.6rem',
                letterSpacing: '1px',
                textShadow: '0 2px 24px #39E0C755',
                userSelect: 'none',
              }}
            >
              Walmart ML Insights
            </div>
            <p
              style={{
                textAlign: 'center',
                color: '#bbb',
                margin: '0 0 32px 0',
                fontSize: '1.15rem',
                fontWeight: 500,
                letterSpacing: '0.2px',
              }}
            >
              Unlock predictive analytics and smart restocking for your business.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: '40px',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: '60px 4vw 40px 4vw',
                minHeight: '100vh',
              }}
            >
              {/* Chart Card */}
              <div
                style={{
                  flex: 2,
                  background: 'rgba(20, 30, 40, 0.85)',
                  borderRadius: '32px',
                  boxShadow: '0 8px 40px 0 rgba(57,224,199,0.10), 0 1.5px 8px 0 rgba(57,224,199,0.10)',
                  padding: isMobile ? '24px 10px 24px 10px' : '36px 32px 32px 32px',
                  backdropFilter: 'blur(8px)',
                  border: '1.5px solid #39E0C7',
                  minWidth: isMobile ? '90vw' : '340px',
                  maxWidth: isMobile ? '98vw' : '950px',
                  marginBottom: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  overflowX: 'auto',
                  height: CARD_HEIGHT,
                  minHeight: CARD_HEIGHT,
                  maxHeight: CARD_HEIGHT,
                }}
              >
                <h2
                  style={{
                    color: '#39E0C7',
                    fontWeight: 700,
                    fontSize: '2rem',
                    marginBottom: '18px',
                    letterSpacing: '0.5px',
                    textShadow: '0 2px 16px #39E0C755',
                  }}
                >
                  📈 ML Sales Forecast
                </h2>
                <div style={{ width: '100%', minHeight: 350, flex: 1, boxSizing: 'border-box' }}>
                  <ML_chart products={products} predictions={predictions} />
                </div>
              </div>

              {/* Restock Suggestion Card */}
              <div
                style={{
                  flex: 1,
                  background: 'rgba(20, 30, 40, 0.85)',
                  borderRadius: '32px',
                  boxShadow: '0 8px 40px 0 rgba(57,224,199,0.10), 0 1.5px 8px 0 rgba(57,224,199,0.10)',
                  padding: isMobile ? '24px 10px 24px 10px' : '36px 32px 32px 32px',
                  backdropFilter: 'blur(8px)',
                  border: '1.5px solid #FFD700',
                  minWidth: isMobile ? '90vw' : '320px',
                  maxWidth: isMobile ? '98vw' : '420px',
                  marginBottom: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: CARD_HEIGHT,
                  minHeight: CARD_HEIGHT,
                  maxHeight: CARD_HEIGHT,
                  overflow: 'hidden',
                }}
              >
                <h2
                  style={{
                    color: '#FFD700',
                    fontWeight: 700,
                    fontSize: '2rem',
                    marginBottom: '18px',
                    letterSpacing: '0.5px',
                    textShadow: '0 2px 16px #FFD70055',
                  }}
                >
                  🛒 Restock Suggestions
                </h2>
                <div
                  className="restock-scroll"
                  style={{
                    width: '100%',
                    flex: 1,
                    overflowY: 'auto',
                    paddingRight: 8,
                  }}
                >
                  <RestockSuggestion restockData={restockData} refreshData={handleRestock} />
                </div>
              </div>
            </div>

            <div style={{
              width: '100%',
              textAlign: 'center',
              padding: '24px 0 12px 0',
              color: '#39E0C7',
              fontWeight: 500,
              fontSize: '1.1rem',
              letterSpacing: '0.5px',
              opacity: 0.7,
              borderTop: '1px solid #222',
              marginTop: 32,
            }}>
              © {new Date().getFullYear()} Walmart ML Dashboard &mdash; Powered by AI
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ML;