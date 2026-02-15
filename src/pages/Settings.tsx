import { useEffect, useState } from 'react';
import { getAuth, signOut } from "firebase/auth";

const Settings: React.FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  // Load saved preferences or defaults
  const [currency, setCurrency] = useState(() => localStorage.getItem("currency") || "USD");
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const val = localStorage.getItem("notificationsEnabled");
    return val === null ? true : val === "true";
  });
  const [monthlyGoal, setMonthlyGoal] = useState(() => localStorage.getItem("monthly_goal") || "1000");

  // Save preferences on change
  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem("notificationsEnabled", notificationsEnabled.toString());
  }, [notificationsEnabled]);

  useEffect(() => {
    localStorage.setItem("monthly_goal", monthlyGoal);
  }, [monthlyGoal]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Settings</h1>
      
      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
        
        {/* Profile Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Account Profile</h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Logged in as {user?.email}</p>
          <hr style={{ margin: '16px 0', border: '0', borderTop: '1px solid #f3f4f6' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px' }}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
            ) : (
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
            )}
            <div>
              <div style={{ fontWeight: '600' }}>{user?.displayName || "User"}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Google Account Connected</div>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Preferences</h3>
          
          {/* Currency Display */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Currency Display</label>
            <select 
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', width: '200px' }}
              value={currency}
              onChange={e => setCurrency(e.target.value)}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          {/* Monthly Budget Goal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Monthly Budget Goal</label>
            <input 
              type="number" 
              value={monthlyGoal}
              onChange={e => setMonthlyGoal(e.target.value)}
              style={{ 
                padding: '8px', 
                borderRadius: '6px', 
                border: '1px solid #d1d5db', 
                width: '200px',
                fontSize: '14px'
              }}
              min="0"
              step="100"
              placeholder="Enter amount"
            />
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              Set your monthly spending limit to track budget progress
            </p>
          </div>
        </div>

        {/* Notifications Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Notifications</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
            <input 
              type="checkbox" 
              checked={notificationsEnabled} 
              onChange={e => setNotificationsEnabled(e.target.checked)} 
              style={{ width: '18px', height: '18px' }} 
            />
            <span style={{ fontSize: '14px' }}>Email me weekly financial summaries</span>
          </div>
        </div>

        {/* Logout Section */}
        <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #f3f4f6' }}>
          <button 
            onClick={handleLogout}
            style={{ 
              backgroundColor: '#ef4444', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '6px', 
              fontWeight: '600', 
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;