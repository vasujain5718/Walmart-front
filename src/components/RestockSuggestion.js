import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const HIGHLIGHT_COLOR = '#39E0C7';

const AnimatedItem = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay }}
      style={{ marginBottom: '12px' }}
    >
      {children}
    </motion.div>
  );
};

const RestockSuggestion = ({ restockData, refreshData }) => {
  const [loadingId, setLoadingId] = useState(null);
  const [restockAmounts, setRestockAmounts] = useState({});

  const handleChange = (productId, value) => {
    setRestockAmounts((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleClick = async (productId) => {
    try {
      setLoadingId(productId);
      const amount = parseInt(restockAmounts[productId]);
      if (!amount || amount <= 0) return;

      await refreshData(productId, amount);
    } catch (err) {
      console.error('Error restocking product:', err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={{ marginTop: '40px', backgroundColor: '#111', padding: '20px', borderRadius: '16px' }}>
      <h3 style={{ color: 'white', fontSize: '20px', marginBottom: '10px' }}>Restock Suggestions</h3>

      {restockData.length === 0 ? (
        <p style={{ color: '#aaa' }}>All products are sufficiently stocked ✅</p>
      ) : (
        restockData.map(({ product, projectedTotal }, index) => {
          const amount = parseInt(restockAmounts[product._id]);
          const isDisabled = loadingId === product._id || !amount || amount <= 0;

          return (
            <AnimatedItem key={product._id} delay={index * 0.1}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  border: `1px solid ${HIGHLIGHT_COLOR}`,
                  borderRadius: '10px',
                  backgroundColor: '#1a1a1a',
                  gap: '10px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'white', margin: 0 }}>
                    <strong>{product.name}</strong> is projected to sell <strong>{Math.round(projectedTotal)}</strong> units but has only <strong>{product.stock}</strong> in stock.
                  </p>
                </div>

                <input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={restockAmounts[product._id] || ''}
                  onChange={(e) => handleChange(product._id, e.target.value)}
                  style={{
                    width: '70px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    border: `1px solid ${HIGHLIGHT_COLOR}`,
                    backgroundColor: '#222',
                    color: 'white',
                  }}
                />

                <button
                  onClick={() => handleClick(product._id)}
                  disabled={isDisabled}
                  style={{
                    backgroundColor: isDisabled ? '#444' : HIGHLIGHT_COLOR,
                    color: isDisabled ? '#999' : 'black',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loadingId === product._id ? 'Restocking...' : 'Restock'}
                </button>
              </div>
            </AnimatedItem>
          );
        })
      )}
    </div>
  );
};

export default RestockSuggestion;
