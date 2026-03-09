import React, { useEffect, useState } from 'react';
import { getDashboardSummary } from '../api';

function Dashboard() {
  const [summary, setSummary] = useState({
    total_employees: 0,
    present_today: 0,
    absent_today: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const res = await getDashboardSummary();
      setSummary(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard summary.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading-state">Loading dashboard...</div>
      ) : (
        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-value">{summary.total_employees}</div>
            <div className="stat-label">Total Employees</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--success)' }}>{summary.present_today}</div>
            <div className="stat-label">Present Today</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--warning)' }}>{summary.absent_today}</div>
            <div className="stat-label">Absent Today</div>
          </div>
        </div>
      )}
      
      {/* <div className="card">
        <h2 className="card-title">Welcome to HRMS Lite</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage your employees and track daily attendance securely and efficiently.
        </p>
      </div> */}
    </div>
  );
}

export default Dashboard;
