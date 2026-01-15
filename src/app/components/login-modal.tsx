"use client";

import { useState } from 'react';
import { useAuth } from './auth-provider';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  if (!showLoginModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await login({ username, password, access: '', refresh: '' }); // access/refresh not needed for request
      } else {
        await register({ username, password, email, first_name: firstName, last_name: lastName });
        // After register, maybe switch to login or auto-login? 
        // For now let's switch to login view
        setIsLogin(true);
      }
    } catch (error) {
      // Error handled in auth provider
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card text-card-foreground w-full max-w-md p-6 rounded-xl shadow-2xl border border-border relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={() => setShowLoginModal(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Zaloguj się' : 'Zarejestruj się'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nazwa użytkownika</label>
            <input
              type="text"
              required
              className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-accent focus:border-accent outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {!isLogin && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  required
                  className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Imię (opcjonalne)</label>
                    <input
                    type="text"
                    className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Nazwisko (opcjonalne)</label>
                    <input
                    type="text"
                    className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Hasło</label>
            <input
              type="password"
              required
              className="w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-accent focus:border-accent outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white font-bold mt-4" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLogin ? 'Zaloguj' : 'Zarejestruj'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {isLogin ? (
            <>
              Nie masz konta?{' '}
              <button 
                onClick={() => setIsLogin(false)} 
                className="text-accent hover:underline font-medium"
              >
                Zarejestruj się
              </button>
            </>
          ) : (
            <>
              Masz już konto?{' '}
              <button 
                onClick={() => setIsLogin(true)} 
                className="text-accent hover:underline font-medium"
              >
                Zaloguj się
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
