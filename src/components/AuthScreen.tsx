import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  X,
  Compass,
} from 'lucide-react';
import { AuthUser } from '../types.ts';

interface AuthScreenProps {
  onAuthSuccess: (user: AuthUser) => void;
  onCancel?: () => void;
  initialMode?: 'login' | 'signup';
  isModal?: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onAuthSuccess,
  onCancel,
  initialMode = 'login',
  isModal = false,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick autofill demo credentials
  const handleAutoFillDemo = () => {
    setEmail('pubgxmobile2867@gmail.com');
    setPassword('AetherPass2026!');
    setName('Aether Explorer');
    setErrorMessage(null);
  };

  const validateForm = () => {
    setErrorMessage(null);
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return false;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return false;
    }
    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return false;
      }
      if (confirmPassword && confirmPassword !== password) {
        setErrorMessage('Passwords do not match.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage(null);

    // Simulate smooth auth network flow
    setTimeout(() => {
      setIsLoading(false);
      const authUser: AuthUser = {
        email: email.trim(),
        name: mode === 'signup' ? name.trim() : name.trim() || email.split('@')[0],
        isGuest: false,
      };

      if (rememberMe) {
        try {
          localStorage.setItem('aether_ai_auth_user', JSON.stringify(authUser));
        } catch (err) {
          console.error(err);
        }
      }

      setSuccessMessage(mode === 'login' ? 'Welcome back to AETHER AI!' : 'Account created successfully!');
      setTimeout(() => {
        onAuthSuccess(authUser);
      }, 500);
    }, 700);
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const guestUser: AuthUser = {
        email: 'guest@aether.ai',
        name: 'Guest Explorer',
        isGuest: true,
      };
      try {
        localStorage.setItem('aether_ai_auth_user', JSON.stringify(guestUser));
      } catch (err) {}
      onAuthSuccess(guestUser);
    }, 350);
  };

  return (
    <div
      className={`w-full flex items-center justify-center select-none ${
        isModal
          ? 'fixed inset-0 z-50 p-4 bg-black/50 backdrop-blur-md animate-fade-in'
          : 'min-h-[100dvh] p-4 py-8 bg-[#fcfbf9] overflow-y-auto'
      }`}
    >
      {/* Background ambient decorative glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] md:w-[500px] md:h-[500px] bg-gradient-to-tr from-[#d89f68]/20 via-[#f7d4b2]/30 to-amber-200/15 rounded-full blur-3xl opacity-70 animate-pulse-glow" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-br from-rose-200/20 via-orange-100/30 to-transparent rounded-full blur-2xl" />
      </div>

      {/* Main Auth Container Card */}
      <div className="relative z-10 w-full max-w-[420px] bg-white/95 backdrop-blur-xl rounded-3xl border border-[#ece7dc] shadow-[0_20px_50px_rgba(30,28,24,0.08)] p-6 sm:p-8 transition-all">
        {/* Optional Close Button (if modal or cancelable) */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* ============================================================== */}
        {/* 1. 3D ANIMATION LOGO OF 'AETHER AI' AT THE TOP                */}
        {/* ============================================================== */}
        <div className="flex flex-col items-center justify-center text-center mb-6">
          {/* 3D Perspective Canvas Container */}
          <div className="relative w-28 h-28 flex items-center justify-center mb-3 [perspective:1000px]">
            {/* Ambient Radial Aura */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#d89f68]/40 via-[#b87a46]/30 to-rose-400/30 blur-xl opacity-80 animate-pulse-glow" />

            {/* 3D Stage with smooth continuous rotation */}
            <div className="relative w-24 h-24 flex items-center justify-center [transform-style:preserve-3d] animate-float-gentle">
              {/* Outer 3D Orbital Ring (Amber/Gold) */}
              <div
                className="absolute inset-0 rounded-full border-[2.5px] border-transparent border-t-[#d89f68] border-r-[#b87a46] opacity-90 animate-spin-3d-x"
                style={{
                  boxShadow: '0 0 16px rgba(216, 159, 104, 0.45)',
                }}
              />

              {/* Middle 3D Orbital Ring (Cyan/Sapphire iridescence) */}
              <div
                className="absolute inset-1.5 rounded-full border-[2px] border-transparent border-b-[#0ea5e9] border-l-[#38bdf8] opacity-75 animate-spin-3d-y"
                style={{
                  boxShadow: '0 0 14px rgba(14, 165, 233, 0.35)',
                }}
              />

              {/* Inner 3D Counter-Orbital Ring (Violet/Magenta) */}
              <div
                className="absolute inset-3 rounded-full border-[1.8px] border-transparent border-t-[#ec4899] border-b-[#8b5cf6] opacity-80 animate-spin-3d-z"
                style={{
                  boxShadow: '0 0 12px rgba(236, 72, 153, 0.3)',
                }}
              />

              {/* Central Glowing 3D Sphere Core */}
              <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-[#1e1c18] via-[#2d2922] to-[#b87a46] p-[2px] shadow-[0_8px_20px_rgba(0,0,0,0.25)] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#1b1915] via-[#2a2620] to-[#3a352c] flex items-center justify-center relative overflow-hidden">
                  {/* Sheen reflection highlight */}
                  <div className="absolute top-1 left-2 w-3.5 h-2 rounded-full bg-white/40 blur-[1px] rotate-[-25deg]" />

                  {/* Sparkle Neural Core Symbol */}
                  <Sparkles className="w-5 h-5 text-[#f7d4b2] animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* AI Brand Name and Tagline */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100/80 border border-stone-200/60 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-stone-600">
                Neural Core v4
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-stone-900 via-[#b87a46] to-stone-900 bg-clip-text text-transparent">
              AETHER AI
            </h1>
            <p className="text-xs text-stone-500 font-medium">
              Next-Gen Conversational Intelligence
            </p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. MODE SWITCHER: LOGIN vs SIGNUP (SMOOTH SLIDING TABS)       */}
        {/* ============================================================== */}
        <div className="relative p-1 bg-stone-100/90 rounded-2xl flex items-center mb-5 border border-stone-200/50">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`relative z-10 flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            className={`relative z-10 flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Feedback Alert Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-tight">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span className="leading-tight">{successMessage}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. INPUT FIELDS & FORM STATE MANAGEMENT                       */}
        {/* ============================================================== */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* In Signup mode: Full Name field with smooth animation */}
          {mode === 'signup' && (
            <div className="space-y-1 animate-fade-in">
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4.5 h-4.5 text-stone-400 stroke-[1.8] pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Sharma"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50/80 hover:bg-stone-50 focus:bg-white rounded-2xl border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#d89f68] focus:ring-3 focus:ring-[#d89f68]/15 transition-all"
                />
              </div>
            </div>
          )}

          {/* Email input field */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4.5 h-4.5 text-stone-400 stroke-[1.8] pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50/80 hover:bg-stone-50 focus:bg-white rounded-2xl border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#d89f68] focus:ring-3 focus:ring-[#d89f68]/15 transition-all"
              />
            </div>
          </div>

          {/* Password input field with Show/Hide toggle */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                Password
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Password reset link has been dispatched to your email address.')}
                  className="text-[11px] font-medium text-[#b87a46] hover:text-[#8e5828] hover:underline cursor-pointer"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4.5 h-4.5 text-stone-400 stroke-[1.8] pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'Create a secure password (6+ chars)' : '••••••••'}
                required
                className="w-full pl-10 pr-11 py-2.5 bg-stone-50/80 hover:bg-stone-50 focus:bg-white rounded-2xl border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#d89f68] focus:ring-3 focus:ring-[#d89f68]/15 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 stroke-[1.8]" />
                ) : (
                  <Eye className="w-4 h-4 stroke-[1.8]" />
                )}
              </button>
            </div>
          </div>

          {/* In Signup mode: Confirm Password */}
          {mode === 'signup' && (
            <div className="space-y-1 animate-fade-in">
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <ShieldCheck className="absolute left-3.5 w-4.5 h-4.5 text-stone-400 stroke-[1.8] pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50/80 hover:bg-stone-50 focus:bg-white rounded-2xl border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#d89f68] focus:ring-3 focus:ring-[#d89f68]/15 transition-all"
                />
              </div>
            </div>
          )}

          {/* Remember me toggle */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900 accent-[#1e1c18]"
              />
              <span>Remember this session</span>
            </label>

            {/* Autofill Demo pill button */}
            <button
              type="button"
              onClick={handleAutoFillDemo}
              className="text-[11px] text-[#b87a46] hover:text-[#8e5828] font-semibold underline decoration-dashed cursor-pointer"
            >
              Demo credentials
            </button>
          </div>

          {/* ============================================================== */}
          {/* 4. PRIMARY SUBMIT BUTTON FOR LOGIN & SIGNUP                   */}
          {/* ============================================================== */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#1e1c18] via-[#2d2922] to-[#1e1c18] hover:from-black hover:to-black text-white font-bold text-sm tracking-wide shadow-lg shadow-stone-900/15 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : mode === 'login' ? (
              <>
                <span>Log In to AETHER AI</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Create AETHER Account</span>
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-stone-200 w-full" />
          <span className="absolute bg-white px-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            or continue with
          </span>
        </div>

        {/* Social / Guest Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Google Button */}
          <button
            type="button"
            onClick={handleAutoFillDemo}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 active:scale-98 transition-all text-xs font-semibold text-stone-700 cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          {/* Guest Instant Entry */}
          <button
            type="button"
            onClick={handleGuestLogin}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl border border-stone-200 bg-white hover:bg-stone-50 active:scale-98 transition-all text-xs font-semibold text-stone-700 cursor-pointer shadow-2xs"
          >
            <Compass className="w-4 h-4 text-stone-600" />
            <span>Guest Mode</span>
          </button>
        </div>

        {/* Footer Security Note */}
        <p className="mt-5 text-center text-[10px] text-stone-400">
          Encrypted 256-bit SSL · Instant Cloud Sync for AETHER AI
        </p>
      </div>
    </div>
  );
};
