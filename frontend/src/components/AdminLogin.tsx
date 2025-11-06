import { useEffect, useState } from 'react';

const CRED_KEY = 'janseva_admin_credentials';

type Creds = { username: string; password: string } | null;

function loadCreds(): Creds {
  try {
    const raw = localStorage.getItem(CRED_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Creds;
  } catch {
    return null;
  }
}

function saveCreds(c: Creds) {
  if (!c) return localStorage.removeItem(CRED_KEY);
  localStorage.setItem(CRED_KEY, JSON.stringify(c));
}

export default function AdminLogin({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [stored, setStored] = useState<Creds>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  useEffect(() => {
    setStored(loadCreds());
    setIsRegisterMode(!loadCreds());
  }, [open]);

  if (!open) return null;

  const handleLogin = () => {
    setError('');
    const creds = loadCreds();
    if (!creds) {
      setError('No admin account set. Please register.');
      setIsRegisterMode(true);
      return;
    }

    if (username === creds.username && password === creds.password) {
      onSuccess();
      onClose();
      setUsername('');
      setPassword('');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleRegister = () => {
    if (!username.trim() || !password) {
      setError('Provide both username and password');
      return;
    }
    saveCreds({ username: username.trim(), password });
    setStored({ username: username.trim(), password });
    setError('');
    setIsRegisterMode(false);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold">Admin Login</h3>
            <button onClick={onClose} className="text-gray-600">✕</button>
          </div>

          <div className="p-4">
            {error && <div className="text-red-600 mb-2">{error}</div>}

            {isRegisterMode ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">No admin account found — create one now or use the default admin.</p>
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full px-3 py-2 border rounded text-gray-900 placeholder-gray-500" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full px-3 py-2 border rounded text-gray-900 placeholder-gray-500" />
                <div className="flex space-x-2 items-center">
                  <button onClick={handleRegister} className="bg-blue-600 text-white px-3 py-2 rounded">Create</button>
                  <button onClick={() => setIsRegisterMode(false)} className="px-3 py-2 border rounded">Cancel</button>
                  <button
                    onClick={() => {
                      // set default credentials and auto-login
                      saveCreds({ username: 'admin', password: 'admin123' });
                      localStorage.setItem('janseva_admin_authenticated', '1');
                      onSuccess();
                      onClose();
                    }}
                    className="ml-2 px-3 py-2 border rounded text-sm"
                  >
                    Use default admin (admin / admin123)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full px-3 py-2 border rounded text-gray-900 placeholder-gray-500" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full px-3 py-2 border rounded text-gray-900 placeholder-gray-500" />
                <div className="flex space-x-2">
                  <button onClick={handleLogin} className="bg-blue-600 text-white px-3 py-2 rounded">Login</button>
                  <button onClick={() => setIsRegisterMode(true)} className="px-3 py-2 border rounded">Register</button>
                </div>
                {stored && <div className="text-sm text-gray-500">Registered admin: <strong>{stored.username}</strong></div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
