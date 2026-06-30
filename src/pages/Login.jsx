import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const { loginWithEmail, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
        alert('Account created successfully! You are now logged in.');
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-md mx-auto my-12 border border-border rounded-xl bg-card shadow-sm">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Welcome to Syncora</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {isSignUp ? 'Create an account to start tracking' : 'Sign in to your dashboard'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
            {errorMsg}
          </div>
        )}

        <div className="space-y-1">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.value || e.target.value)} // Safe fallback for customized inputs
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.value || e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <button
          type="button"
          className="text-primary underline hover:text-primary/80"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}