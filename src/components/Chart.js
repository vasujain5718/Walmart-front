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

const RANGE_OPTIONS = [
  { label: '7 Days', value: 7 },
  { label: '1 Month', value: 30 },
  { label: '6 Months', value: 180 },
];

const HIGHLIGHT_COLOR = '#39E0C7';

const SalesAnalyticsChart = () => {
  const [range, setRange] = useState(7);
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [productOptions, setProductOptions] = useState(['all']);
  const [allChartData, setAllChartData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await fetch(`http://walmart-back.onrender.com/api/admin/sales/product-trends?range=180`);
        const json = await res.json();

        const products = new Set();
        json.forEach(day => {
          Object.keys(day).forEach(key => {
            if (key !== 'date') products.add(key);
          });
        });

        setProductOptions(['all', ...Array.from(products)]);
        setAllChartData(json);
      } catch (err) {
        console.error('Error fetching sales data:', err);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - range);

    const filtered = allChartData
      .filter(day => new Date(day.date) >= fromDate)
      .map(day => {
        if (selectedProduct === 'all') {
          let total = 0;
          for (let key in day) {
            if (key !== 'date') total += day[key];
          }
          return { date: day.date, value: total };
        } else {
          return { date: day.date, value: day[selectedProduct] || 0 };
        }
      });

    setFilteredData(filtered);
  }, [range, selectedProduct, allChartData]);

  return (
    <div style={{ backgroundColor: 'black', color: 'white', borderRadius: '20px', padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Sales Analytics</h2>
          <p style={{ fontSize: '14px', color: '#999' }}>Track your revenue performance over time</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {RANGE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: range === opt.value ? HIGHLIGHT_COLOR : '#222',
                color: range === opt.value ? 'black' : 'white',
                transition: '0.3s'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Select Product: </label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            backgroundColor: '#222',
            color: 'white',
            border: `1px solid ${HIGHLIGHT_COLOR}`,
            outline: 'none',
          }}
        >
          {productOptions.map(product => (
            <option key={product} value={product}>{product}</option>
          ))}
        </select>
      </div>

      <div style={{ width: '100%', height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
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
              dataKey="value"
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

export default SalesAnalyticsChart;
