import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { fetchRequestsApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle, XCircle, BookMarked, AlertCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        if (user) {
          const data = await fetchRequestsApi();
          setRequests(data);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, [user?.email]);

  const stats = {
    pending: requests.filter(r => r.status === 'Pending').length,
    approved: requests.filter(r => r.status.includes('Approved')).length,
    rejected: requests.filter(r => r.status === 'Rejected').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">My Library Activity</h2>
            <p className="text-slate-500 mt-1">Track your rentals, due dates, and pending requests.</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
            <Calendar size={18} className="text-primary" />
            <span className="font-semibold text-slate-700">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 border-l-4 border-l-yellow-500">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl"><Clock size={24} /></div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Pending Requests</p>
                <p className="text-2xl font-bold text-slate-800">{stats.pending}</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 border-l-4 border-l-secondary">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-50 text-secondary rounded-xl"><CheckCircle size={24} /></div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Approved / Active</p>
                <p className="text-2xl font-bold text-slate-800">{stats.approved}</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 border-l-4 border-l-red-500">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl"><XCircle size={24} /></div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Rejected</p>
                <p className="text-2xl font-bold text-slate-800">{stats.rejected}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* My Requests Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookMarked className="text-primary" /> Rental History
          </h3>

          <div className="glass-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-4 font-semibold text-slate-600">Book Name</th>
                    <th className="p-4 font-semibold text-slate-600">Duration</th>
                    <th className="p-4 font-semibold text-slate-600">Date Requested</th>
                    <th className="p-4 font-semibold text-slate-600">Status</th>
                    <th className="p-4 font-semibold text-slate-600">Actions / Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading your history...</td></tr>
                  ) : requests.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-12 text-center">
                        <AlertCircle size={40} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-slate-500">You haven't requested any books yet.</p>
                      </td>
                    </tr>
                  ) : (
                    requests.map(req => (
                      <tr key={req._id || req.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-800">{req.bookName}</td>
                        <td className="p-4 text-slate-600 font-medium">{req.rentalDays} Days</td>
                        <td className="p-4 text-slate-500">{new Date(req.requestDate).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            req.status.includes('Approved') ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {req.status === 'Pending' ? 'Pending Approval' : (req.status.includes('Approved') ? 'Approved' : 'Rejected')}
                          </span>
                        </td>
                        <td className="p-4">
                          {req.status.includes('Approved') ? (
                            <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-sm">
                              <p className="font-bold text-primary mb-1">Fee: ₹{req.approvedCost}</p>
                              <p className="text-xs text-slate-500 italic">Pay offline at Library Desk</p>
                            </div>
                          ) : req.status === 'Rejected' ? (
                            <p className="text-red-500 text-sm font-medium">{req.rejectionReason}</p>
                          ) : (
                            <span className="text-slate-400 text-sm italic">Under Review</span>
                          )}
                        </td>
                      </tr>
                    )).reverse()
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
