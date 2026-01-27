import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from './firebase';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Login from './pages/Login';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for login/logout changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => signOut(auth);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Inter' }}>
        Loading FinTrack...
      </div>
    );
  }

  return (
    <Router>
      {user ? (
        <>
          {/* Navigation Bar - Only shown when logged in */}
          <nav style={{ 
            padding: '0 40px', 
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            background: '#ffffff', 
            borderBottom: '1px solid #e5e7eb',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#111827', marginRight: '40px' }}>
              FinTrack <span style={{ color: '#3b82f6' }}>Demo</span>
            </div>
            <Link to="/" style={{ color: '#4b5563', marginRight: '24px', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
            <Link to="/upload" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: 500 }}>CSV Upload</Link>
            
            {/* User Profile & Logout */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>{user.email}</span>
              <button 
                onClick={handleLogout}
                style={{
                  padding: '6px 12px',
                  background: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Logout
              </button>
            </div>
          </nav>

          <main style={{ width: '100%' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </>
      ) : (
        /* If not logged in, only show the Login page */
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;