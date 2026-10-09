import React, { useState } from 'react';
import { Icons } from './Icons.jsx';
import { apiService } from '../api/apiService.js';

const ROLE_CONFIG = {
  patient: {
    label: 'Patient Portal',
    icon: 'User',
    gradient: 'from-teal-600 to-emerald-600',
    bg: 'from-teal-50 to-emerald-50',
    border: 'border-teal-200',
    ring: 'ring-teal-500',
    badge: 'bg-teal-100 text-teal-800',
    demoUser: 'tushar.tawar@example.com',
    demoPass: 'patient123',
    demoPhone: '+91 98765 43210',
    demoPin: '1234',
    tagline: 'Book appointments, track lab samples, view EHR & share medical records'
  },
  doctor: {
    label: 'Doctor Portal',
    icon: 'Stethoscope',
    gradient: 'from-sky-600 to-blue-600',
    bg: 'from-sky-50 to-blue-50',
    border: 'border-sky-200',
    ring: 'ring-sky-500',
    badge: 'bg-sky-100 text-sky-800',
    demoUser: 'dr.ananya@mediconnect.in',
    demoPass: 'doctor123',
    demoPhone: '+91 98111 88888',
    demoPin: '4321',
    tagline: 'Manage OPD queue, write digital prescriptions & review shared patient EHRs'
  },
  admin: {
    label: 'Admin Portal',
    icon: 'ShieldCheck',
    gradient: 'from-indigo-600 to-violet-600',
    bg: 'from-indigo-50 to-violet-50',
    border: 'border-indigo-200',
    ring: 'ring-indigo-500',
    badge: 'bg-indigo-100 text-indigo-800',
    demoUser: 'admin@mediconnect.in',
    demoPass: 'admin@hms',
    demoPhone: '+91 98999 00000',
    demoPin: '9999',
    tagline: 'Hospital KPI dashboard, doctor roster & operational analytics'
  },
  receptionist: {
    label: 'Receptionist Portal',
    icon: 'Users',
    gradient: 'from-fuchsia-600 to-pink-600',
    bg: 'from-fuchsia-50 to-pink-50',
    border: 'border-fuchsia-200',
    ring: 'ring-fuchsia-500',
    badge: 'bg-fuchsia-100 text-fuchsia-800',
    demoUser: 'receptionist@mediconnect.in',
    demoPass: 'desk123',
    demoPhone: '+91 98888 77777',
    demoPin: '7777',
    tagline: 'Manage OPD queue, book walk-in appointments & handle chat escalations'
  }
};

export function LoginPage({ onLogin }) {
  // Modes: 'login' | 'signup' | 'forgot'
  const [authMode, setAuthMode] = useState('login');
  const [selectedRole, setSelectedRole] = useState('patient');

  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Sign Up form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupSecurityPin, setSignupSecurityPin] = useState('');
  const [signupDept, setSignupDept] = useState('General Medicine');

  // Forgot Password state
  const [forgotStep, setForgotStep] = useState(1); // 1: enter email/phone, 2: enter OTP & PIN, 3: success
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('5821');
  const [forgotPin, setForgotPin] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');

  // Status states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const cfg = ROLE_CONFIG[selectedRole] || ROLE_CONFIG.patient;
  const IconComp = Icons[cfg.icon] || Icons.User;

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if ((role === 'admin' || role === 'receptionist') && authMode === 'signup') {
      setAuthMode('login');
    }
    setError('');
    setSuccess('');
  };

  const handleFillDemo = (type = 'email') => {
    if (type === 'email') setIdentifier(cfg.demoUser);
    else if (type === 'phone') setIdentifier(cfg.demoPhone);
    else setIdentifier(selectedRole === 'patient' ? 'aarav.sharma' : selectedRole === 'doctor' ? 'dr.ananya' : 'admin');
    setPassword(cfg.demoPass);
    setError('');
  };

  // ── Handle Login ──────────────────────────────────────────────────────────
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter your Email / Phone / Username and Password.');
      return;
    }
    setLoading(true);

    try {
      const res = await apiService.loginUser(identifier.trim(), password, selectedRole);
      if (res.success) {
        onLogin({ role: res.user.role, user: res.user });
      } else {
        setError(res.error || 'Invalid credentials. Please verify your details.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Handle Sign Up ────────────────────────────────────────────────────────
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');



    if (!signupName.trim()) {
      setError('Please enter your Full Name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setError('Please enter a valid Email Address.');
      return;
    }
    if (!signupPhone.trim() || signupPhone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit Mobile Phone Number.');
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!signupSecurityPin || signupSecurityPin.length !== 4) {
      setError('Please set a 4-digit Emergency Medical Security PIN.');
      return;
    }

    setLoading(true);
    try {
      const newUser = await apiService.registerUser({
        name: signupName.trim(),
        email: signupEmail.trim(),
        phone: signupPhone.trim(),
        password: signupPassword,
        securityPin: signupSecurityPin.trim(),
        role: selectedRole,
        dept: selectedRole === 'doctor' ? signupDept : undefined
      });

      setSuccess(selectedRole === 'doctor'
        ? `Account registered! Pending Admin verification.`
        : `Account registered successfully for ${newUser.name}! Logging you in...`
      );
      setTimeout(() => {
        if (selectedRole === 'doctor') {
          setAuthMode('login');
          setSuccess('');
        } else {
          onLogin({ role: selectedRole, user: newUser });
        }
      }, selectedRole === 'doctor' ? 3500 : 1200);
    } catch (err) {
      setError(err.message || 'Failed to create account.');
      setLoading(false);
    }
  };

  // ── Handle Forgot Password ────────────────────────────────────────────────
  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');
    if (!forgotIdentifier.trim()) {
      setError('Please enter your registered Email or Phone Number.');
      return;
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    setForgotStep(2);
    setSuccess(`OTP sent to ${forgotIdentifier}! (Simulated SMS OTP: ${otp})`);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (forgotOtp.trim() !== generatedOtp) {
      setError(`Invalid OTP code entered. Please enter ${generatedOtp}`);
      return;
    }
    if (!forgotPin.trim()) {
      setError('Please enter your 4-digit Security Key.');
      return;
    }
    if (!forgotNewPass || forgotNewPass.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.resetPassword(forgotIdentifier.trim(), forgotPin.trim(), forgotNewPass);
      if (res.success) {
        setForgotStep(3);
        setSuccess('Password updated successfully! You can now sign in.');
      } else {
        setError(res.error || 'Password reset failed.');
      }
    } catch (err) {
      setError('Error resetting password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* 24x7 Emergency National OPD Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-teal-900 text-white text-xs px-4 py-1.5 flex justify-between items-center shadow-md">
        <span className="flex items-center space-x-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>24x7 Emergency OPD:</span>
          <a href="tel:108" className="underline font-bold text-sky-200 hover:text-white">108</a>
          <span className="text-sky-400">|</span>
          <a href="tel:1800633422" className="underline font-semibold text-sky-200 hover:text-white">1800-MEDI-CONNECT</a>
        </span>
        <span className="hidden md:inline bg-teal-500/20 text-teal-200 px-2 py-0.5 rounded text-[11px] font-medium border border-teal-500/30">
          ABDM Integrated · Universal EHR Access Across India
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative">
        <div className="w-full max-w-md">
          {/* Main Logo & Title */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-sky-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
                <Icons.HeartPulse className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-black tracking-tight text-white">
                  Medi<span className="text-teal-400">Connect</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">Hospital Management System</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs">
              Universal EHR, Doctor OPD Consultation & Pan-India Health Record Sharing
            </p>
          </div>

          <div className="flex justify-center w-full">
            {/* Auth Card (Login / Sign Up / Forgot Password) */}
            <div className="w-full">
              <div className={`bg-gradient-to-br ${cfg.bg} rounded-3xl border-2 ${cfg.border} shadow-2xl overflow-hidden`}>
                {/* Header with Mode Switcher */}
                <div className={`bg-gradient-to-r ${cfg.gradient} px-6 pt-5 pb-4 text-white`}>
                  <div className="flex flex-col items-center mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-2">
                      <IconComp className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-center">
                      <h2 className="font-bold text-base">
                        {authMode === 'login' ? `Sign in to ${cfg.label}` : authMode === 'signup' ? `Create Account — ${cfg.label}` : 'Reset Password'}
                      </h2>
                      <p className="text-xs text-white/80">
                        {authMode === 'login' ? '' : authMode === 'signup' ? 'Register with 4-digit Security Key' : 'Verify identity with OTP & Security PIN'}
                      </p>
                    </div>
                  </div>



                  {selectedRole === 'admin' && (
                    <div className="mt-2.5 px-3 py-1.5 bg-black/30 border border-white/20 rounded-xl text-[11px] text-indigo-100 flex items-center space-x-2">
                      <Icons.ShieldCheck className="w-4 h-4 text-amber-300 flex-shrink-0" />
                      <span>Admin accounts are restricted to IT staff. Sign up is disabled for security.</span>
                    </div>
                  )}
                  {selectedRole === 'receptionist' && (
                    <div className="mt-2.5 px-3 py-1.5 bg-black/30 border border-white/20 rounded-xl text-[11px] text-fuchsia-100 flex items-center space-x-2">
                      <Icons.ShieldCheck className="w-4 h-4 text-amber-300 flex-shrink-0" />
                      <span>Receptionist accounts are created by Doctors. Sign up is disabled.</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* Role Switcher (Bullets) */}
                  <div className="flex justify-center items-center space-x-6 mb-5 bg-slate-50/50 p-3 rounded-xl border border-slate-200">
                    {['patient', 'doctor', 'admin', 'receptionist'].map((role) => (
                      <label key={role} className="flex items-center space-x-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="roleSwitch"
                          value={role}
                          checked={selectedRole === role}
                          onChange={() => handleRoleSelect(role)}
                          className={`w-4 h-4 cursor-pointer focus:ring-2 focus:ring-offset-1 ${role === 'patient' ? 'text-teal-600 focus:ring-teal-500' : role === 'doctor' ? 'text-sky-600 focus:ring-sky-500' : role === 'admin' ? 'text-indigo-600 focus:ring-indigo-500' : 'text-fuchsia-600 focus:ring-fuchsia-500'}`}
                        />
                        <span className={`text-xs font-bold capitalize transition-colors ${selectedRole === role ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{role}</span>
                      </label>
                    ))}
                  </div>

                  {/* Global Success / Error Feedback */}
                  {success && (
                    <div className="mb-4 flex items-center space-x-2 bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-xs text-emerald-800 font-bold animate-fadeIn">
                      <Icons.CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{success}</span>
                    </div>
                  )}

                  {error && (
                    <div className="mb-4 flex items-center space-x-2 bg-red-50 border border-red-300 rounded-xl p-3 text-xs text-red-800 font-bold animate-fadeIn">
                      <Icons.X className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* ─────────────────── LOGIN FORM ─────────────────── */}
                  {authMode === 'login' && (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      {/* Email / Phone / Username */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Email Address / Phone Number / Username
                        </label>
                        <div className="relative">
                          <Icons.User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={identifier}
                            onChange={e => { setIdentifier(e.target.value); setError(''); }}
                            placeholder="e.g. tushar@example.com or 9876543210"
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900 placeholder-slate-400 transition"
                            required
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-bold text-slate-700">Password</label>
                          <button
                            type="button"
                            onClick={() => { setAuthMode('forgot'); setForgotStep(1); setError(''); setSuccess(''); }}
                            className="text-[11px] font-bold text-teal-700 hover:underline"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative">
                          <Icons.Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type={showPass ? 'text' : 'password'}
                            value={password}
                            onChange={e => { setPassword(e.target.value); setError(''); }}
                            placeholder="Enter your password"
                            className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900 placeholder-slate-400 transition"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPass ? <Icons.X className="w-4 h-4" /> : <Icons.Activity className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-bold text-sm text-white transition-all shadow-lg ${
                          loading
                            ? 'opacity-70 cursor-not-allowed bg-slate-400'
                            : `bg-gradient-to-r ${cfg.gradient} hover:opacity-90 active:scale-[0.98]`
                        }`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center space-x-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>Verifying Credentials...</span>
                          </span>
                        ) : (
                          <span className="flex items-center justify-center space-x-2">
                            <IconComp className="w-4 h-4" />
                            <span>Sign in to {cfg.label}</span>
                          </span>
                        )}
                      </button>

                      {selectedRole !== 'admin' && selectedRole !== 'receptionist' && (
                        <div className="text-center pt-2">
                          <p className="text-xs text-slate-500">
                            Don't have an account?{' '}
                            <button
                              type="button"
                              onClick={() => { setAuthMode('signup'); setError(''); setSuccess(''); }}
                              className="font-bold text-teal-700 hover:underline"
                            >
                              Sign Up
                            </button>
                          </p>
                        </div>
                      )}

                    </form>
                  )}

                  {/* ─────────────────── SIGN UP FORM ─────────────────── */}
                  {authMode === 'signup' && (
                    <form onSubmit={handleSignupSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={signupName}
                          onChange={e => setSignupName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                          <input
                            type="email"
                            value={signupEmail}
                            onChange={e => setSignupEmail(e.target.value)}
                            placeholder="name@email.com"
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone (+91)</label>
                          <input
                            type="tel"
                            value={signupPhone}
                            onChange={e => setSignupPhone(e.target.value)}
                            placeholder="98765 43210"
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Create Password</label>
                          <input
                            type="password"
                            value={signupPassword}
                            onChange={e => setSignupPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
                            required
                          />
                        </div>

                        {/* 4-digit Security Key */}
                        <div>
                          <label className="block text-xs font-bold text-teal-800 mb-1">
                            4-Digit Security Key (PIN) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={signupSecurityPin}
                            onChange={e => setSignupSecurityPin(e.target.value.replace(/\D/g, ''))}
                            placeholder="4-digit PIN e.g. 1234"
                            className="w-full px-3 py-2 text-sm border-2 border-teal-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white text-slate-900 font-mono tracking-widest text-center font-bold"
                            required
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 italic">
                        * Security Key is used to authorize doctor record links and recover forgotten passwords.
                      </p>

                      {selectedRole === 'doctor' && (
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Medical Department</label>
                          <select
                            value={signupDept}
                            onChange={e => setSignupDept(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white text-slate-900"
                          >
                            <option value="General Medicine">General Medicine</option>
                            <option value="Cardiology">Cardiology</option>
                            <option value="Orthopedics">Orthopedics</option>
                            <option value="Neurology">Neurology</option>
                            <option value="Pediatrics">Pediatrics</option>
                            <option value="Dermatology">Dermatology</option>
                          </select>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-bold text-sm text-white transition-all shadow-lg mt-2 ${
                          loading
                            ? 'opacity-70 cursor-not-allowed bg-slate-400'
                            : `bg-gradient-to-r ${cfg.gradient} hover:opacity-90 active:scale-[0.98]`
                        }`}
                      >
                        {loading ? 'Creating Account...' : `Register & Enter as ${cfg.label}`}
                      </button>

                      <div className="text-center pt-2">
                        <p className="text-xs text-slate-500">
                          Already have an account?{' '}
                          <button
                            type="button"
                            onClick={() => { setAuthMode('login'); setError(''); setSuccess(''); }}
                            className="font-bold text-teal-700 hover:underline"
                          >
                            Sign In
                          </button>
                        </p>
                      </div>
                    </form>
                  )}

                  {/* ─────────────────── FORGOT PASSWORD ─────────────────── */}
                  {authMode === 'forgot' && (
                    <div className="space-y-4">
                      {forgotStep === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Enter Registered Email or Mobile Number
                            </label>
                            <input
                              type="text"
                              value={forgotIdentifier}
                              onChange={e => setForgotIdentifier(e.target.value)}
                              placeholder="e.g. tushar@example.com or 9876543210"
                              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
                              required
                            />
                            <p className="text-[11px] text-slate-500 mt-1">We will send a 4-digit verification code to this address.</p>
                          </div>
                          <button
                            type="submit"
                            className={`w-full py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${cfg.gradient} hover:opacity-90 shadow-md`}
                          >
                            Send Verification OTP
                          </button>
                        </form>
                      )}

                      {forgotStep === 2 && (
                        <form onSubmit={handleResetPassword} className="space-y-3">
                          <div className="bg-teal-50 border border-teal-200 p-2.5 rounded-xl text-xs text-teal-800">
                            Simulated SMS received: Your OTP code is <strong>{generatedOtp}</strong>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Enter 4-Digit OTP</label>
                            <input
                              type="text"
                              maxLength={6}
                              value={forgotOtp}
                              onChange={e => setForgotOtp(e.target.value)}
                              placeholder="e.g. 5821"
                              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono text-center tracking-widest font-bold bg-white"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-teal-800 mb-1">
                              Enter 4-Digit Security Key (PIN)
                            </label>
                            <input
                              type="password"
                              maxLength={4}
                              value={forgotPin}
                              onChange={e => setForgotPin(e.target.value)}
                              placeholder="Default PIN: 1234"
                              className="w-full px-3 py-2 text-sm border-2 border-teal-400 rounded-xl font-mono text-center tracking-widest font-bold bg-white"
                              required
                            />
                            <span className="text-[10px] text-slate-500">Hint: 1234 for patient, 4321 for doctor</span>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Set New Password</label>
                            <input
                              type="password"
                              value={forgotNewPass}
                              onChange={e => setForgotNewPass(e.target.value)}
                              placeholder="At least 6 characters"
                              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white"
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${cfg.gradient} hover:opacity-90 shadow-md`}
                          >
                            {loading ? 'Updating Password...' : 'Verify Key & Reset Password'}
                          </button>
                        </form>
                      )}

                      {forgotStep === 3 && (
                        <div className="text-center py-4 space-y-3">
                          <Icons.CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                          <p className="text-sm font-bold text-slate-800">Your password was reset successfully!</p>
                          <button
                            type="button"
                            onClick={() => { setAuthMode('login'); setForgotStep(1); }}
                            className={`w-full py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${cfg.gradient}`}
                          >
                            Proceed to Sign In
                          </button>
                        </div>
                      )}

                      {forgotStep !== 3 && (
                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={() => { setAuthMode('login'); setForgotStep(1); setError(''); setSuccess(''); }}
                            className="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
                          >
                            Back to Login
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-center text-xs text-slate-400 mt-4">
                MediConnect HMS
              </p>
            </div>
          </div>
        </div>

        {/* Floating Instant Demo */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-3 border border-slate-700 shadow-2xl flex flex-col space-y-2 hover:bg-slate-800 transition-colors">
            <div className="flex items-center space-x-2">
              <Icons.Activity className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Quick Access</span>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => { setIdentifier(ROLE_CONFIG.patient.demoUser); setPassword(ROLE_CONFIG.patient.demoPass); }}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-teal-300 rounded-lg transition"
                title="Patient Login"
              >
                <Icons.User className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => { setIdentifier(ROLE_CONFIG.doctor.demoUser); setPassword(ROLE_CONFIG.doctor.demoPass); }}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-sky-300 rounded-lg transition"
                title="Doctor Login"
              >
                <Icons.Stethoscope className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => { setIdentifier(ROLE_CONFIG.admin.demoUser); setPassword(ROLE_CONFIG.admin.demoPass); }}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-indigo-300 rounded-lg transition"
                title="Admin Login"
              >
                <Icons.ShieldCheck className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => { setIdentifier(ROLE_CONFIG.receptionist.demoUser); setPassword(ROLE_CONFIG.receptionist.demoPass); }}
                className="p-2 bg-slate-700 hover:bg-slate-600 text-fuchsia-300 rounded-lg transition"
                title="Receptionist Login"
              >
                <Icons.Users className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
