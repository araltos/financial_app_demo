import React from 'react';

const Settings: React.FC = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Settings</h1>
      
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Profile Settings</h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Manage your public profile and account details.</p>
          <hr style={{ margin: '16px 0', border: '0', borderTop: '1px solid #f3f4f6' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Currency Display</label>
            <select style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Notifications</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" defaultChecked />
            <span style={{ fontSize: '14px' }}>Email me weekly financial summaries</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;