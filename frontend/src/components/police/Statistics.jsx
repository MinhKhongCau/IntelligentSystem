import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const Statistics = () => {
  const [stats, setStats] = useState({ missingCount: 0, userCount: 0, reportCount: 0 });
  const [usersSeries, setUsersSeries] = useState({ labels: [], data: [] });
  const [missingSeries, setMissingSeries] = useState({ labels: [], data: [] });
  const [reportsSeries, setReportsSeries] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [sumRes, usersRes, missingRes, reportsRes] = await Promise.all([
          axios.get(`${API_BASE}/api/stats/summary`).catch(() => null),
          axios.get(`${API_BASE}/api/stats/users/daily`).catch(() => null),
          axios.get(`${API_BASE}/api/stats/missing/daily`).catch(() => null),
          axios.get(`${API_BASE}/api/stats/reports/daily`).catch(() => null),
        ]);

        if (sumRes && sumRes.data) setStats(sumRes.data);

        const toSeries = (rows) => {
          if (!rows || !Array.isArray(rows)) return { labels: [], data: [] };
          const labels = rows.map(r => r.date);
          const data = rows.map(r => r.count);
          return { labels, data };
        };

        if (usersRes && usersRes.data) setUsersSeries(toSeries(usersRes.data));
        if (missingRes && missingRes.data) setMissingSeries(toSeries(missingRes.data));
        if (reportsRes && reportsRes.data) setReportsSeries(toSeries(reportsRes.data));
      } catch (err) {
        console.error('Failed to load stats', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // prepare options and data for line charts
  const makeLineData = (series, label, color) => ({
    labels: series.labels,
    datasets: [
      {
        label,
        data: series.data,
        borderColor: color,
        backgroundColor: color + '33',
        tension: 0.2,
        fill: true,
        pointRadius: 3,
      }
    ]
  });

  const lineOptions = (title) => ({
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: title },
    },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">System Statistics</h1>

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <Line data={makeLineData(usersSeries, 'Users created', '#34D399')} options={lineOptions('Users per Day')} />
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <Line data={makeLineData(missingSeries, 'Missing reports', '#60A5FA')} options={lineOptions('Missing Cases per Day')} />
          </div>

          <div className="bg-white rounded-lg p-6 shadow">
            <Line data={makeLineData(reportsSeries, 'Volunteer reports', '#F472B6')} options={lineOptions('Volunteer Reports per Day')} />
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Notes</h2>
          <p className="text-sm text-gray-600">This page shows counts and a simple distribution chart. For time series or more advanced charts, I can add endpoints that return historical data and additional chart views.</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
