import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const HIGHLIGHT_COLOR = '#39E0C7';

const Chart = ({ products, predictions }) => {
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!products.length || !Object.keys(predictions).length) return;

    const merged = {};
    if (selectedProduct === 'all') {
      products.forEach(product => {
        const pred = predictions[product._id];
        if (!pred) return;
        pred.forEach(({ date, predictedSales }) => {
          if (!merged[date]) merged[date] = { date, total: 0 };
          merged[date].total += predictedSales;
        });
      });
      setChartData(Object.values(merged));
    } else {
      const product = products.find(p => p.name === selectedProduct);
      if (!product) return;
      const pred = predictions[product._id] || [];
      const formatted = pred.map(p => ({ date: p.date, [selectedProduct]: p.predictedSales }));
      setChartData(formatted);
    }
  }, [products, predictions, selectedProduct]);

  return (
    <div style={{ backgroundColor: 'black', color: 'white', borderRadius: '20px', padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Predicted Sales (7 Days)</h2>
          <p style={{ fontSize: '14px', color: '#999' }}>Forecasted trends based on ML analysis</p>
        </div>
        <div>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: '#222',
              color: 'white',
              border: `1px solid ${HIGHLIGHT_COLOR}`,
              outline: 'none'
            }}
          >
            <option value="all">All Products</option>
            {products.map(product => (
              <option key={product._id} value={product.name}>{product.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ width: '100%', height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="white" fontSize={12} />
            <YAxis stroke="white" fontSize={12} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }}
              labelStyle={{ color: 'white' }}
              itemStyle={{ color: HIGHLIGHT_COLOR }}
            />
            <Line
              type="monotone"
              dataKey={selectedProduct === 'all' ? 'total' : selectedProduct}
              stroke={HIGHLIGHT_COLOR}
              strokeWidth={3}
              dot={{ fill: 'white', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
