import React, { useEffect, useState } from 'react';
import { getEmployees, addEmployee, deleteEmployee } from '../api';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: 'Engineering'
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getEmployees();
      setEmployees(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch employees.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEmployee(formData);
      setFormData({ employee_id: '', full_name: '', email: '', department: 'Engineering' });
      fetchEmployees();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add employee. Make sure ID is unique.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete employee ${id}?`)) {
      try {
        await deleteEmployee(id);
        fetchEmployees();
      } catch (err) {
        setError('Failed to delete employee.');
      }
    }
  };

  return (
    <div>
      <h1>Employees</h1>
      
      {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div className="card">
        <h2 className="card-title">Add New Employee</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Employee ID<span style={{ color: 'var(--danger)' }}>*</span></label>
            <input 
              type="text" 
              name="employee_id" 
              value={formData.employee_id} 
              onChange={handleInputChange} 
              className="form-control" 
              required 
              placeholder="e.g. EMP001"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Full Name<span style={{ color: 'var(--danger)' }}>*</span></label>
            <input 
              type="text" 
              name="full_name" 
              value={formData.full_name} 
              onChange={handleInputChange} 
              className="form-control" 
              required 
              placeholder="John Doe"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email<span style={{ color: 'var(--danger)' }}>*</span></label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              className="form-control" 
              required 
              placeholder="john@example.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Department<span style={{ color: 'var(--danger)' }}>*</span></label>
            <select 
              name="department" 
              value={formData.department} 
              onChange={handleInputChange} 
              className="form-control"
            >
              <option value="Engineering">Engineering</option>
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary">Add Employee</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="card-title">Employee Directory</h2>
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : employees.length === 0 ? (
          <div className="empty-state">No employees found. Add one above.</div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.employee_id}>
                    <td style={{ fontWeight: '500' }}>{emp.employee_id}</td>
                    <td>{emp.full_name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.department}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(emp.employee_id)}
                        className="btn btn-danger btn-small"
                      >
                        Delete
                      </button>
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

export default Employees;
