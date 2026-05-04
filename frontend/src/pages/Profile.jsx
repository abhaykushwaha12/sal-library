import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Save, UserCircle, Building, IdCard, GraduationCap, Phone, Hash } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  
  // Initialize state with user data
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    enrollmentNo: user?.enrollmentNo || '',
    branch: user?.branch || '',
    semester: user?.semester || '',
    phone: user?.phone || ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // In a real app, you'd call an API here to update the user in DB.
    setTimeout(() => {
      setIsSaving(false);
      setMessage('Profile updated successfully (Simulated)');
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  const colleges = [
    "SAL College Of Engineering",
    "SAL institute of technology and engineering research",
    "Sal Institute Of Diploma Studies",
    "sal engineering and technical institute"
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8"
        >
          <div className="flex flex-col items-center mb-10">
            <div className="p-1 bg-white rounded-full shadow-lg border-4 border-primary/20 mb-4 relative">
              <UserCircle size={100} className="text-primary" strokeWidth={1} />
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-sm" />
            </div>
            <h2 className="text-3xl font-black text-slate-800">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest border border-primary/10">
                {user?.role}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-200">
                Active
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Section */}
              <div className="md:col-span-2">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 border-b pb-2">Basic Information</h3>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 flex items-center gap-2">
                  <User size={16} className="text-primary" /> Full Name
                </label>
                <input 
                  type="text" name="name"
                  value={formData.name} onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 flex items-center gap-2">
                  <Mail size={16} className="text-primary" /> Email (Permanent)
                </label>
                <input 
                  type="email" 
                  value={user?.email}
                  disabled
                  className="w-full px-4 py-3 border border-slate-100 bg-slate-50 text-slate-400 rounded-xl cursor-not-allowed italic"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 flex items-center gap-2">
                  <Phone size={16} className="text-primary" /> Phone Number
                </label>
                <input 
                  type="tel" name="phone"
                  value={formData.phone} onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all shadow-sm"
                  required
                />
              </div>

              {/* Academic Section */}
              <div className="md:col-span-2 pt-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 border-b pb-2">Academic Details</h3>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-600 mb-2 flex items-center gap-2">
                  <Building size={16} className="text-primary" /> College Name
                </label>
                <select 
                  name="college"
                  value={formData.college} onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all bg-white shadow-sm"
                  required
                >
                  <option value="">Select College</option>
                  {colleges.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 flex items-center gap-2">
                  <IdCard size={16} className="text-primary" /> Enrollment Number
                </label>
                <input 
                  type="text" name="enrollmentNo"
                  value={formData.enrollmentNo} onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 flex items-center gap-2">
                  <GraduationCap size={16} className="text-primary" /> Branch Name
                </label>
                <input 
                  type="text" name="branch"
                  value={formData.branch} onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 flex items-center gap-2">
                  <Hash size={16} className="text-primary" /> Current Semester
                </label>
                <select 
                  name="semester"
                  value={formData.semester} onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all bg-white shadow-sm"
                  required
                >
                  <option value="">Select Semester</option>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2 flex items-center gap-2">
                  <Shield size={16} className="text-primary" /> Account Role
                </label>
                <input 
                  type="text" 
                  value={user?.role?.toUpperCase()}
                  disabled
                  className="w-full px-4 py-3 border border-slate-100 bg-slate-50 text-slate-400 rounded-xl cursor-not-allowed italic"
                />
              </div>
            </div>

            {message && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-green-600 text-sm font-bold text-center bg-green-50 py-3 rounded-xl border border-green-100">
                {message}
              </motion.p>
            )}

            <button 
              type="submit"
              disabled={isSaving}
              className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
            >
              <Save size={20} />
              {isSaving ? 'Updating Profile...' : 'Save Profile Changes'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
