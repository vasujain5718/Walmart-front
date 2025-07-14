import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Particles from '../components/Particles';

const HIGHLIGHT_COLOR = '#39E0C7';

const AnimatedItem = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay }}
      style={{ marginBottom: '16px' }}
    >
      {children}
    </motion.div>
  );
};

const Prod = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Background Particles */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
        }}
      >
        <Particles
          particleColors={['#39E0C7', '#00FFF7', '#FF6EC7', '#FFD700']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Foreground Content */}
      {isLoading ? (
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 20px',
            textAlign: 'center',
            color: '#ccc',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <div>
            <h2 style={{ color: HIGHLIGHT_COLOR, fontSize: '24px', marginBottom: '12px' }}>
              Fetching your product insights...
            </h2>
            <p style={{ color: '#aaa', fontSize: '16px' }}>
              In the meantime, explore and interact with the animated background ✨
            </p>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '40px 24px',
            fontFamily: 'Inter, sans-serif',
            color: 'white',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '30px', fontWeight: '700', color: HIGHLIGHT_COLOR }}>
              📦 Your Product Insights — Anywhere, Anytime
            </h1>
            <p style={{ color: '#aaa', maxWidth: '600px' }}>
              View and manage your inventory at a glance. Use the search below to find products quickly.
            </p>
          </div>

          {/* Search */}
          <div style={{ marginBottom: '30px' }}>
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '10px 14px',
                borderRadius: '8px',
                border: `1px solid ${HIGHLIGHT_COLOR}`,
                backgroundColor: '#111',
                color: 'white',
                fontSize: '16px',
              }}
            />
          </div>

          {/* Product List */}
          {filteredProducts.length === 0 ? (
            <p style={{ color: '#888' }}>No matching products found.</p>
          ) : (
            filteredProducts.map((product, index) => (
              <AnimatedItem key={product._id} delay={index * 0.08}>
                <div
                  style={{
                    backgroundColor: '#111',
                    border: `1px solid ${HIGHLIGHT_COLOR}`,
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <h3 style={{ color: 'white', margin: 0 }}>{product.name}</h3>
                  <p style={{ color: '#bbb', margin: 0 }}>
                    Category: <strong style={{ color: 'white' }}>{product.category}</strong>
                  </p>
                  <p style={{ color: '#bbb', margin: 0 }}>
                    Price: ₹<strong style={{ color: 'white' }}>{product.price.toFixed(2)}</strong>
                  </p>
                  <p style={{ color: '#bbb', margin: 0 }}>
                    Stock: <strong style={{ color: 'white' }}>{product.stock}</strong> units
                  </p>
                  <p style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
                    Added on: {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </AnimatedItem>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Prod;
