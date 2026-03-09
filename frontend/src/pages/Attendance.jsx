import React, { useEffect, useState } from 'react';
import { getEmployees, getAttendance, markAttendance } from '../api';

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form State
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    date: today,
    status: 'Present'
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data);
      if (res.data.length > 0) {
        setSelectedEmployee(res.data[0].employee_id);
        fetchAttendance(res.data[0].employee_id);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch employees.');
    }
  };

  const fetchAttendance = async (empId) => {
    if (!empId) return;
    try {
      setLoading(true);
      const res = await getAttendance(empId);
      setAttendanceRecords(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch attendance records.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    setSelectedEmployee(empId);
    fetchAttendance(empId);
    setSuccess(null);
    setError(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      setError('Please select an employee.');
      return;
    }
    
    try {
      await markAttendance({
        employee_id: selectedEmployee,
        date: formData.date,
        status: formData.status
      });
      setSuccess(`Attendance marked as ${formData.status} for ${formData.date}`);
      setError(null);
      fetchAttendance(selectedEmployee); // Refresh records
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to mark attendance.');
      setSuccess(null);
    }
  };

  return (
    <div>
      <h1>Attendance</h1>
      
      {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
      {success && <div className="info-message" style={{ marginBottom: '1rem', color: 'var(--success)' }}>{success}</div>}

      <div className="card">
        <h2 className="card-title">Mark Attendance</h2>
        {employees.length === 0 ? (
          <div className="empty-state">No employees available. Add employees first.</div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label className="form-label">Select Employee</label>
              <select 
                value={selectedEmployee} 
                onChange={handleEmployeeChange} 
                className="form-control"
              >
                {employees.map(emp => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.full_name} ({emp.employee_id})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Date</label>
              <input 
                type="date" 
                name="date"
                value={formData.date} 
                onChange={handleInputChange} 
                className="form-control"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Status</label>
              <select 
                name="status"
                value={formData.status} 
                onChange={handleInputChange} 
                className="form-control"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
            
            <div className="form-group">
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                Save Record
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="card">
        <h2 className="card-title">Attendance History</h2>
        {loading ? (
          <div className="loading-state">Loading history...</div>
        ) : !selectedEmployee ? (
          <div className="empty-state">Select an employee to view history.</div>
        ) : attendanceRecords.length === 0 ? (
          <div className="empty-state">No attendance records found for this employee.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => (
                  <tr key={record._id}>
                    <td style={{ fontWeight: '500' }}>{record.date}</td>
                    <td>
                      <span className={`badge ${record.status === 'Present' ? 'badge-present' : 'badge-absent'}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;
