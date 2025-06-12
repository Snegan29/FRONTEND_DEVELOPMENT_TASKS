import React, { useEffect, useState, useMemo } from 'react';
import './Dashboard.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock API
const fetchSalesData = async (startDate, endDate, category) => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const start = startDate ? new Date(startDate).getTime() : new Date('2023-01-01').getTime();
  const end = endDate ? new Date(endDate).getTime() : new Date().getTime();
  const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  const data = [];
  const categories = ['Electronics', 'Clothing', 'Food', 'Books'];
  const selected = category ? [category] : categories;

  for (let i = 0; i <= days; i++) {
    const date = new Date(start + i * 86400000);
    const dateStr = date.toISOString().split('T')[0];
    const entry = { date: dateStr };

    selected.forEach(cat => {
      const base = (date.getDay() + 1) * 100;
      const multiplier = categories.indexOf(cat) + 1;
      const factor = ((date.getDate() + categories.indexOf(cat)) % 3) * 0.2 + 0.8;
      entry[cat] = Math.round(base * multiplier * factor);
    });

    data.push(entry);
  }

  return data;
};

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cacheKey = `${startDate}-${endDate}-${category}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setData(JSON.parse(cached));
      } else {
        const result = await fetchSalesData(startDate, endDate, category);
        localStorage.setItem(cacheKey, JSON.stringify(result));
        setData(result);
      }
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, category]);

  const summary = useMemo(() => {
    if (!data.length) return {};
    const keys = Object.keys(data[0]).filter(k => k !== 'date');
    const sums = keys.reduce((acc, key) => {
      acc[key] = data.reduce((t, d) => t + d[key], 0);
      return acc;
    }, {});
    return sums;
  }, [data]);

  return (
    <div className="dashboard-container">
      <h1>Sales Dashboard</h1>

      {/* Filters */}
      <div className="filters">
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Food">Food</option>
          <option value="Books">Books</option>
        </select>
      </div>

      {/* Error & Loading */}
      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {category
            ? <Line type="monotone" dataKey={category} stroke="#8884d8" />
            : ['Electronics', 'Clothing', 'Food', 'Books'].map(cat => (
                <Line key={cat} type="monotone" dataKey={cat} stroke="#8884d8" />
              ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Summary */}
      <div className="summary">
        {Object.entries(summary).map(([key, value]) => (
          <div key={key} className="summary-item">
            <strong>{key}:</strong> {value}
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              {category
                ? <th>{category}</th>
                : ['Electronics', 'Clothing', 'Food', 'Books'].map(cat => <th key={cat}>{cat}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((entry, idx) => (
              <tr key={idx}>
                <td>{entry.date}</td>
                {category
                  ? <td>{entry[category]}</td>
                  : ['Electronics', 'Clothing', 'Food', 'Books'].map(cat => (
                      <td key={cat}>{entry[cat]}</td>
                    ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
