import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';
import { fetchBooksApi, createRequestApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, Library, Book, X, Calendar, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showRentModal, setShowRentModal] = useState(false);
  const [rentalDays, setRentalDays] = useState(15);
  const [renting, setRenting] = useState(false);
  const [rentError, setRentError] = useState('');

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooksApi();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRentClick = (book) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedBook(book);
    setShowRentModal(true);
  };

  const calculateCost = (days) => {
    const baseDays = 15;
    const baseCost = 40;
    const penaltyPerDay = 5;
    
    if (days <= baseDays) return baseCost;
    return baseCost + (days - baseDays) * penaltyPerDay;
  };

  const handleRentSubmit = async () => {
    setRenting(true);
    setRentError('');
    try {
      await createRequestApi({
        studentId: user.enrollmentNo || 'N/A',
        studentName: user.name,
        studentEmail: user.email,
        studentPhone: user.phone || 'N/A',
        studentCollege: user.college || 'N/A',
        studentBranch: user.branch || 'N/A',
        studentSemester: user.semester || 'N/A',
        bookId: selectedBook._id || selectedBook.id,
        bookName: selectedBook.title,
        rentalDays: parseInt(rentalDays)
      });
      setShowRentModal(false);
      alert('Rental request submitted successfully! Visit dashboard to track status.');
    } catch (error) {
      setRentError(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setRenting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Section */}
        <div className="glass-panel p-12 bg-gradient-to-r from-primary to-secondary text-white border-none shadow-lg shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">Discover Your Next Great Read</h2>
            <p className="text-sky-100 max-w-2xl text-lg">
              Welcome to the SAL Education Digital Library. Access thousands of premium engineering, 
              management, and pharmacy resources at your fingertips.
            </p>
          </div>
          <Library className="absolute right-[-20px] bottom-[-20px] text-white/10 w-64 h-64 rotate-12" />
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Library className="text-primary" /> Browse Collection
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by title, author, or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-96 pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-64 bg-slate-200 rounded-2xl" />)}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="glass-panel p-12 text-center text-slate-500">
            <Book size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium">No books found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookCard key={book._id || book.id} book={book} isAdmin={false} onRent={handleRentClick} />
            ))}
          </div>
        )}
      </div>

      {/* Rent Modal */}
      <AnimatePresence>
        {showRentModal && selectedBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button onClick={() => setShowRentModal(false)} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-20 bg-primary/10 rounded-xl flex items-center justify-center text-3xl shadow-inner">
                  {selectedBook.coverIcon && selectedBook.coverIcon.includes('.') ? (
                    <img src={selectedBook.coverIcon} alt="" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <span>📚</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedBook.title}</h3>
                  <p className="text-slate-500 font-medium">{selectedBook.author}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100">
                  <div className="flex items-center gap-2 text-sky-700 font-bold mb-2">
                    <Info size={18} />
                    <span>Pricing Policy</span>
                  </div>
                  <ul className="text-sm text-sky-600 space-y-1">
                    <li>• ₹40 for the first 15 days</li>
                    <li>• ₹5 extra for each additional day</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-primary" /> Rental Duration (Days)
                  </label>
                  <input 
                    type="range" min="1" max="60" 
                    value={rentalDays} 
                    onChange={(e) => setRentalDays(e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between mt-2 text-sm font-bold text-slate-600">
                    <span>1 Day</span>
                    <span className="text-primary text-lg">{rentalDays} Days</span>
                    <span>60 Days</span>
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-slate-500 font-medium">Estimated Cost</span>
                  <span className="text-2xl font-black text-primary">₹{calculateCost(rentalDays)}</span>
                </div>

                {rentError && <p className="text-red-500 text-sm font-bold text-center">{rentError}</p>}

                <button 
                  onClick={handleRentSubmit}
                  disabled={renting}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 disabled:opacity-50"
                >
                  {renting ? 'Submitting Request...' : 'Confirm Rental Request'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
