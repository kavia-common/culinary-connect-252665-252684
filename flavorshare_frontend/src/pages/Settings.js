import React from 'react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { profileApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Settings
 */
export default function Settings() {
  /** Account settings page */
  const { user } = useAuth() || {};
  const [username, setUsername] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [msg, setMsg] = React.useState('');

  React.useEffect(() => {
    if (!user) return;
    profileApi.getProfile(user.id).then(p => {
      setUsername(p?.username || '');
      setBio(p?.bio || '');
    });
  }, [user]);

  async function onSave(e) {
    e.preventDefault();
    setMsg('');
    if (!user) return;
    try {
      await profileApi.updateProfile(user.id, { username, bio });
      setMsg('Saved');
    } catch (e) {
      setMsg(e.message || 'Save failed');
    }
  }

  return (
    <div className="container" style={{ paddingTop: 24, maxWidth: 720 }}>
      <h1>Settings</h1>
      {msg && <div role="status" style={{ color: 'var(--color-muted)', marginBottom: 12 }}>{msg}</div>}
      <form className="card" onSubmit={onSave} style={{ padding: 16, display: 'grid', gap: 12 }}>
        <Input id="username" label="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
        <label htmlFor="bio" style={{ fontWeight: 600 }}>Bio</label>
        <textarea id="bio" className="input" rows={4} value={bio} onChange={(e)=>setBio(e.target.value)} />
        <Button type="submit">Save</Button>
      </form>
    </div>
  );
}
