import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Save, UserCircle } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Student');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // In a real app, you'd call an API here. For now, we simulate success.
    setTimeout(() => {
      setIsSaving(false);
      setMessage('Profile updated successfully (Simulated)');
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <UserCircle size={80} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{user?.email}</h2>
            <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold uppercase tracking-wider mt-2">
              {user?.role}
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Email Address (Cannot be changed)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="email" 
                    value={user?.email}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-slate-100 bg-slate-50 text-slate-400 rounded-xl cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Account Role</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    value={user?.role?.toUpperCase()}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-slate-100 bg-slate-50 text-slate-400 rounded-xl cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {message && (
              <p className="text-green-600 text-sm font-bold text-center bg-green-50 py-2 rounded-lg border border-green-100">
                {message}
              </p>
            )}

            <button 
              type="submit"
              disabled={isSaving}
              className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
