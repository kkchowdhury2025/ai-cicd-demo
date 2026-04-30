import React, { useState } from 'react';
import LoginForm from './components/LoginForm';

function App() {
  const [user, setUser] = useState(null);

  if (user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>Welcome, {user.email}!</h2>
        <p style={{ color: '#555', marginTop: '0.5rem' }}>
          You are logged in as <strong>{user.role}</strong>.
        </p>
        <button
          onClick={() => setUser(null)}
          style={{
            marginTop: '1rem',
            padding: '8px 20px',
            cursor: 'pointer',
            borderRadius: '8px',
            border: '1px solid #ddd',
            background: '#f5f5f5',
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return <LoginForm onLoginSuccess={setUser} />;
}

export default App;
