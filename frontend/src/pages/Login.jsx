import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUserGraduate, FaUserShield, FaBuilding, FaIdCard, FaPhone, FaEnvelope, FaLock, FaHashtag } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Login = () => {
  const [role, setRole] = useState('student');
  const [isRegistering, setIsRegistering] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    enrollmentNo: '',
    branch: '',
    semester: '',
    phone: ''
  });

  const { login, register, sendOtp } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        if (role !== 'student') throw new Error('Only students can register');
        if (!otpSent) {
          await sendOtp(formData.email);
          setOtpSent(true);
        } else {
          await register({ ...formData, otp });
        }
      } else {
        await login(formData.email, formData.password, role);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
  };

  const colleges = [
    "SAL College Of Engineering",
    "SAL institute of technology and engineering research",
    "Sal Institute Of Diploma Studies",
    "sal engineering and technical institute"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-sky-50 to-teal-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full ${isRegistering ? 'max-w-2xl' : 'max-w-md'} glass-panel p-8 transition-all duration-300`}
      >
        <div className="text-center mb-8">
          <div className="mb-4">
            <img 
              src="/WhatsApp Image 2026-05-03 at 6.27.39 PM.jpeg" 
              alt="SAL Education Logo" 
              className="h-20 mx-auto object-contain"
              onError={(e) => e.target.src = "https://via.placeholder.com/150?text=SAL+Logo"} 
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Sal Education</h1>
          <p className="text-slate-500 font-medium mt-1">Digital Library Management</p>
        </div>

        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-6 max-w-md mx-auto">
          <button 
            type="button"
            onClick={() => { setRole('student'); setError(''); setOtpSent(false); }}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${role === 'student' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <FaUserGraduate /> Student
          </button>
          <button 
            type="button"
            onClick={() => { setRole('admin'); setIsRegistering(false); setError(''); setOtpSent(false); }}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${role === 'admin' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <FaUserShield /> Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && role === 'student' && !otpSent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-600 mb-1 flex items-center gap-2">
                  <FaBuilding className="text-primary" /> College Name
                </label>
                <select 
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all bg-white"
                  required
                >
                  <option value="">Select Your College</option>
                  {colleges.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1 flex items-center gap-2">
                  <FaIdCard className="text-primary" /> Full Name
                </label>
                <input 
                  type="text" name="name"
                  value={formData.name} onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1 flex items-center gap-2">
                  <FaHashtag className="text-primary" /> Enrollment Number
                </label>
                <input 
                  type="text" name="enrollmentNo"
                  value={formData.enrollmentNo} onChange={handleChange}
                  placeholder="Enter enrollment no"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1 flex items-center gap-2">
                  <FaBuilding className="text-primary" /> Branch Name
                </label>
                <input 
                  type="text" name="branch"
                  value={formData.branch} onChange={handleChange}
                  placeholder="e.g. Computer Engineering"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1 flex items-center gap-2">
                  <FaHashtag className="text-primary" /> Current Semester
                </label>
                <select 
                  name="semester"
                  value={formData.semester} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all bg-white"
                  required
                >
                  <option value="">Select Semester</option>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1 flex items-center gap-2">
                  <FaEnvelope className="text-primary" /> Email Address
                </label>
                <input 
                  type="email" name="email"
                  value={formData.email} onChange={handleChange}
                  placeholder="email@sal.edu"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1 flex items-center gap-2">
                  <FaPhone className="text-primary" /> Phone Number
                </label>
                <input 
                  type="tel" name="phone"
                  value={formData.phone} onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-600 mb-1 flex items-center gap-2">
                  <FaLock className="text-primary" /> Create Password
                </label>
                <input 
                  type="password" name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-4">
              {isRegistering && otpSent && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Verification OTP</label>
                  <input 
                    type="text" value={otp} onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all text-center text-2xl tracking-[1em]"
                    maxLength={6} required
                  />
                  <p className="text-xs text-slate-400 mt-2 text-center">We've sent an OTP to {formData.email}</p>
                </motion.div>
              )}

              {!otpSent && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Email Address</label>
                    <input 
                      type="email" name="email"
                      value={formData.email} onChange={handleChange}
                      placeholder={role === 'student' ? "student@sal.edu" : "admin@sal.edu"}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Password</label>
                    <input 
                      type="password" name="password"
                      value={formData.password} onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all"
                      required
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm font-bold text-center bg-red-50 py-2 rounded-lg border border-red-100 max-w-md mx-auto">
              {error}
            </p>
          )}

          <div className="max-w-md mx-auto">
            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              {isRegistering ? (otpSent ? 'Complete Registration' : 'Send Verification OTP') : `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </button>
          </div>
        </form>

        {role === 'student' && (
          <div className="mt-6 text-center">
            <button 
              type="button" 
              onClick={() => { setIsRegistering(!isRegistering); setOtpSent(false); }}
              className="text-sm text-primary hover:text-primary-hover font-bold transition-colors underline underline-offset-4"
            >
              {isRegistering ? 'Already have an account? Login here' : "New student? Create your account"}
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black mb-3">Demo Access</p>
          <div className="text-xs text-slate-500 bg-slate-50 py-2 rounded-lg inline-block px-6 border border-slate-100">
            {role === 'student' ? (
              <span><span className="font-bold">ID:</span> student@sal.edu | <span className="font-bold">Pass:</span> student123</span>
            ) : (
              <span><span className="font-bold">ID:</span> admin@sal.edu | <span className="font-bold">Pass:</span> admin123</span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
