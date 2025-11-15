import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Register
 */
export default function Register() {
  /** Registration page */
  const { register } = useAuth() || {};
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [err, setErr] = React.useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      if (!email || !password || !username) { setErr('All fields are required'); return; }
      await register({ email, password, username });
      navigate('/login');
    } catch (error) {
      setErr(error.message || 'Registration failed');
    }
  }

  return (
    <div className="container" style={{ paddingTop: 24, maxWidth: 520 }}>
      <h1>Create your account</h1>
      {err && <div role="alert" style={{ color: 'var(--color-error)', marginBottom: 12 }}>{err}</div>}
      <form className="card" onSubmit={onSubmit} style={{ padding: 16, display: 'grid', gap: 12 }}>
        <Input id="username" label="Username" value={username} onChange={(e)=>setUsername(e.target.value)} required />
        <Input id="email" type="email" label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <Input id="password" type="password" label="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <Button type="submit">Register</Button>
      </form>
    </div>
  );
}
