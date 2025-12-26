import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const SignIn = () => {
  const [loginMode, setLoginMode] = useState('email'); // 'email' or 'mobile'
  const [step, setStep] = useState(1); // 1: Mobile input, 2: OTP input
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Resend OTP timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobile(value);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const resp = await api.signin({ email: formData.email, password: formData.password });

      // Clear any existing cookies from Google/OTP login since we're using localStorage token
      // This ensures email/password login uses Authorization header, not old cookies
      try {
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
      } catch (e) {
        console.warn('Failed to clear cookies:', e);
      }

      // Store token then redirect to intended page or home
      if (resp?.token) {
        localStorage.setItem('auth_token', resp.token);
        console.log('[Email Login] Token stored in localStorage');
      }
      if (resp?.user?.isAdmin) {
        localStorage.setItem('auth_is_admin', 'true');
      } else {
        try { localStorage.removeItem('auth_is_admin'); } catch { }
      }
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleMobileLoginClick = () => {
    setLoginMode('mobile');
    setStep(1);
    setError('');
    setSuccess('');
    setMobile('');
    setOtp('');
    setResendTimer(0);
  };

  const handleBackToEmail = () => {
    setLoginMode('email');
    setStep(1);
    setError('');
    setSuccess('');
    setMobile('');
    setOtp('');
    setResendTimer(0);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const data = await api.sendOtp(mobile);

      if (!data.success) {
        throw new Error(data?.message || 'Failed to send OTP');
      }

      setSuccess('OTP sent to your mobile number');
      setStep(2);
      setResendTimer(30);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const data = await api.verifyOtp({ mobile, otp });

      if (!data.success) {
        throw new Error(data?.message || 'Invalid OTP');
      }

      // Clear any existing cookies from Google login since OTP uses localStorage token
      try {
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
      } catch (e) {
        console.warn('Failed to clear cookies:', e);
      }

      // Store token and redirect
      if (data?.token) {
        localStorage.setItem('auth_token', data.token);
        console.log('[OTP Login] Token stored in localStorage');
      }
      if (data?.user?.isAdmin) {
        localStorage.setItem('auth_is_admin', 'true');
      } else {
        try { localStorage.removeItem('auth_is_admin'); } catch { }
      }
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setError('');
    setLoading(true);
    try {
      const data = await api.sendOtp(mobile);

      if (!data.success) {
        throw new Error(data?.message || 'Failed to resend OTP');
      }

      setSuccess('OTP resent to your mobile number');
      setResendTimer(30);
      setOtp('');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeMobile = () => {
    setStep(1);
    setOtp('');
    setError('');
    setSuccess('');
    setResendTimer(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-cyan-50/30 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="flex min-h-screen relative z-10">
        {/* Left Side - Logo */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-500/10 via-cyan-500/10 to-blue-500/10 backdrop-blur-sm items-center justify-center relative overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-32 h-32 border-2 border-teal-600 rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 border-2 border-cyan-600 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-blue-600 rounded-full"></div>
            <div className="absolute top-1/3 right-1/4 w-20 h-20 border-2 border-teal-500 rounded-full"></div>
          </div>
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'linear-gradient(teal 1px, transparent 1px), linear-gradient(90deg, teal 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
          <div className="text-center relative z-10">
            <Link to="/" className="inline-block mb-8 transform hover:scale-105 transition-transform duration-300">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
                TickNTrack
              </h1>
              <div className="mt-2 h-1 w-24 mx-auto bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full"></div>
            </Link>
            <p className="text-lg text-gray-700 max-w-sm mx-auto leading-relaxed font-medium">
              Your destination for premium shoes and watches. Step into style, track your time with elegance.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center py-8 px-4 min-h-screen bg-gradient-to-br from-teal-500/10 via-cyan-500/10 to-blue-500/10 backdrop-blur-sm relative overflow-hidden">
          {/* Decorative Pattern - Same as left side */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 right-20 w-32 h-32 border-2 border-teal-600 rounded-full"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 border-2 border-cyan-600 rounded-full"></div>
            <div className="absolute top-1/2 right-1/4 w-24 h-24 border-2 border-blue-600 rounded-full"></div>
            <div className="absolute top-1/3 left-1/3 w-20 h-20 border-2 border-teal-500 rounded-full"></div>
          </div>
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'linear-gradient(teal 1px, transparent 1px), linear-gradient(90deg, teal 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
          
          <div className="w-full max-w-sm relative z-10">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <Link to="/" className="inline-block mb-6 transform hover:scale-105 transition-transform duration-300">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  TickNTrack
                </h1>
                <div className="mt-2 h-1 w-16 mx-auto bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full"></div>
              </Link>
            </div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-gray-600 text-sm">
                Sign in to your account to continue shopping
              </p>
            </div>

            {/* Sign In Form */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-200/50 hover:shadow-teal-500/20 transition-all duration-300 relative">
              {/* Subtle glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl blur opacity-50 -z-10"></div>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2 animate-shake">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {success}
                </div>
              )}

              {loginMode === 'email' ? (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-gray-50 focus:bg-white"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-gray-50 focus:bg-white"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-teal-500/50 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(location.state?.from?.pathname || '/')}
                    className="w-full mt-3 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform active:scale-95"
                  >
                    Continue as Guest
                  </button>
                </form>
              ) : step === 1 ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors mb-2"
                  >
                    ← Back to email login
                  </button>
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={mobile}
                        onChange={handleMobileChange}
                        required
                        maxLength={10}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-gray-50 focus:bg-white"
                        placeholder="Enter your 10-digit mobile number"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || mobile.length !== 10}
                    className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-teal-500/50 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 transform active:scale-95"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(location.state?.from?.pathname || '/')}
                    className="w-full mt-2 border border-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
                  >
                    Continue as Guest
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors mb-2"
                  >
                    ← Back to email login
                  </button>
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                      Enter OTP
                    </label>
                    <div className="mb-2 text-center">
                      <p className="text-sm text-gray-600">
                        OTP sent to <span className="font-semibold text-gray-900 text-base">{mobile}</span>
                      </p>
                    </div>
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      value={otp}
                      onChange={handleOtpChange}
                      required
                      maxLength={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-center text-2xl tracking-[0.5em] font-semibold bg-gray-50 focus:bg-white"
                      placeholder="000000"
                    />
                  </div>

                  <div className="text-center">
                    {resendTimer > 0 ? (
                      <p className="text-sm text-gray-600">
                        Resend OTP in {resendTimer} sec
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-sm text-teal-600 hover:text-teal-700 transition-colors disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleChangeMobile}
                    className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Change mobile number
                  </button>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-teal-500/50 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 transform active:scale-95"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(location.state?.from?.pathname || '/')}
                    className="w-full mt-2 border border-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
                  >
                    Continue as Guest
                  </button>
                </form>
              )}

              {/* COMMENTED OUT: Google Sign-In - uncomment if needed in future */}
              {/* Divider */}
              {/* <div className="mt-8 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/80 text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>
              </div> */}

              {/* Social Login */}
              <div className="space-y-2 mt-3">
                {/* COMMENTED OUT: Google Sign-In button - uncomment if needed in future */}
                {/* <button
                  type="button"
                  onClick={() => {
                    let SERVER_BASE = import.meta.env.VITE_BACKEND_BASE || 'http://localhost:5000';
                    // Remove trailing slash if present
                    SERVER_BASE = SERVER_BASE.replace(/\/+$/, '');
                    window.location.href = `${SERVER_BASE}/api/auth/google`;


                  }}
                  className="flex items-center justify-center w-full px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform active:scale-95 font-medium"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </button> */}
                {loginMode === 'email' && (
                  <button
                    type="button"
                    onClick={handleMobileLoginClick}
                    className="flex items-center justify-center w-full px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform active:scale-95 font-medium"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Login with Mobile Number
                  </button>
                )}
              </div>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;