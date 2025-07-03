import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './Summary.css';

const Summary = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const resp = await fetch('http://localhost:5000/api/admin/sales/summary', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const result = await resp.json();
        // console.log('Summary data:', result);
        setData(result);
        // console.log(result.categoryShare)
      } catch (err) {
        console.error('Failed to fetch summary', err);
      }
    };
    fetchSummary();
  }, []);

  if (!data) return <p style={{ color: 'white' }}>Loading summary...</p>;

  const pieColors = ['#39E0C7', '#2CC4B3', '#1FA89A', '#167C76', '#0F4F4C'];

  return (
    <div className="summary-container">
      <div className="stats-cards">
        <div className="card">
          <h3>Total Revenue</h3>
          <p>₹{data.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="card">
          <h3>Total Items Sold</h3>
          <p>{data.totalItemsSold}</p>
        </div>
        <div className="card">
          <h3>Avg. Order Value</h3>
          <p>₹{data.averageOrderValue.toFixed(2)}</p>
        </div>
        <div className="card growth">
          <h3>Monthly Growth</h3>
          <p>{data.monthComparison.percentageGrowth > 0 ? '+' : ''}{data.monthComparison.percentageGrowth}%</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-box">
          <h3>Top Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topProducts}>
              <XAxis dataKey="name" stroke="#ffffff" />
              <YAxis stroke="#ffffff" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', color: '#fff' }} />
              <Bar dataKey="unitsSold" fill="#39E0C7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart margin={{
              top: 20,
              right: 120,
              bottom: 20,
              left: 20
            }}>
              <Pie
                data={data.categoryShare}
                dataKey="revenue"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                labelLine={true}
                label={({ category, revenue }) => {
                  const label = `${category}`;
                  return label.length > 20 ? label.slice(0, 20) + '...' : label;
                }}

              >
                {data.categoryShare.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [`₹${Number(value).toLocaleString()}`, name]}
                contentStyle={{ backgroundColor: 'rgb(255,255,255,0.95)', border: 'none', color: '#fff' }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ color: 'white', fontSize: '14px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Summary;