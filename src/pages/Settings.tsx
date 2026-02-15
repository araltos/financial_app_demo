import React from 'react';
import { getAuth, signOut } from "firebase/auth";

const Settings: React.FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // This will trigger the Auth listener in App.tsx and show the Login page
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
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Preferences</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Currency Display</label>
            <select style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', width: '200px' }}>
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>
        </div>

        {/* Notifications Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Notifications</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
            <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
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