import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';
import { fetchBooksApi, createBookApi, updateBookApi, deleteBookApi, fetchRequestsApi, updateRequestApi } from '../utils/api';
import { BookOpen, Users, Clock, AlertCircle, Plus, Layers, XCircle, Library } from 'lucide-react';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [requests, setRequests] = useState([]);
  
  // Modal states
  const [showBookModal, setShowBookModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  // Book Form State
  const [bookForm, setBookForm] = useState({
    title: '', author: '', quantity: 1, rentCost: 50, coverIcon: '📚'
  });

  // Approve Form State
  const [approveCost, setApproveCost] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [booksData, requestsData] = await Promise.all([
          fetchBooksApi(),
          fetchRequestsApi()
        ]);
        setBooks(booksData);
        setRequests(requestsData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  // --- Book Management ---
  const handleEditBook = (book) => {
    setEditingBook(book);
    setBookForm(book);
    setShowBookModal(true);
  };

  const handleAddBookClick = () => {
    setEditingBook(null);
    setBookForm({ title: '', author: '', quantity: 1, rentCost: 50, coverIcon: '📚' });
    setShowBookModal(true);
  };

  const saveBook = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        const updatedBook = await updateBookApi(editingBook._id || editingBook.id, bookForm);
        setBooks(books.map(b => (b._id || b.id) === (editingBook._id || editingBook.id) ? updatedBook : b));
      } else {
        const newBook = await createBookApi(bookForm);
        setBooks([...books, newBook]);
      }
      setShowBookModal(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving book');
    }
  };

  const deleteBook = async (id) => {
    if(window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBookApi(id);
        setBooks(books.filter(b => (b._id || b.id) !== id));
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting book');
      }
    }
  };

  // --- Request Management ---
  const openApproveModal = (req) => {
    const book = books.find(b => (b._id || b.id) === req.bookId);
    setSelectedRequest(req);
    const calculatedCost = req.rentalDays <= 15 ? 40 : 40 + (req.rentalDays - 15) * 5;
    setApproveCost(calculatedCost);
    setShowApproveModal(true);
  };

  const approveRequest = async (e) => {
    e.preventDefault();
    
    try {
      const updatedReq = await updateRequestApi(selectedRequest._id || selectedRequest.id, {
        status: 'Approved - Payment Pending Offline',
        approvedCost: approveCost
      });

      setRequests(requests.map(r => (r._id || r.id) === (updatedReq._id || updatedReq.id) ? updatedReq : r));

      // Decrease book quantity
      const updatedBooks = books.map(b => {
        if ((b._id || b.id) === selectedRequest.bookId && b.quantity > 0) {
          return { ...b, quantity: b.quantity - 1 };
        }
        return b;
      });
      setBooks(updatedBooks);
      setShowApproveModal(false);
    } catch (error) {
      alert('Error approving request');
    }
  };

  const rejectRequest = async (id) => {
    const reason = window.prompt("Enter reason for rejection:");
    if (reason === null) return; // Cancelled

    try {
      const updatedReq = await updateRequestApi(id, {
        status: 'Rejected',
        rejectionReason: reason || 'Not specified'
      });
      setRequests(requests.map(r => (r._id || r.id) === (updatedReq._id || updatedReq.id) ? updatedReq : r));
    } catch (error) {
      alert('Error rejecting request');
    }
  };

  // Stats
  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const totalBooks = books.reduce((acc, book) => acc + book.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 border-l-4 border-l-primary">
            <div className="p-2 sm:p-3 bg-sky-100 text-primary rounded-xl"><BookOpen size={20} className="sm:w-6 sm:h-6" /></div>
            <div className="text-center sm:text-left">
              <p className="text-[10px] sm:text-sm text-slate-500 font-medium uppercase tracking-wider">Total Books</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-800">{totalBooks}</p>
            </div>
          </div>
          <div className="glass-panel p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 border-l-4 border-l-secondary">
            <div className="p-2 sm:p-3 bg-teal-100 text-secondary rounded-xl"><Layers size={20} className="sm:w-6 sm:h-6" /></div>
            <div className="text-center sm:text-left">
              <p className="text-[10px] sm:text-sm text-slate-500 font-medium uppercase tracking-wider">Titles</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-800">{books.length}</p>
            </div>
          </div>
          <div className="glass-panel p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 border-l-4 border-l-yellow-500">
            <div className="p-2 sm:p-3 bg-yellow-100 text-yellow-600 rounded-xl"><AlertCircle size={20} className="sm:w-6 sm:h-6" /></div>
            <div className="text-center sm:text-left">
              <p className="text-[10px] sm:text-sm text-slate-500 font-medium uppercase tracking-wider">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-800">{pendingCount}</p>
            </div>
          </div>
          <div className="glass-panel p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 border-l-4 border-l-green-500">
            <div className="p-2 sm:p-3 bg-green-100 text-green-600 rounded-xl"><Users size={20} className="sm:w-6 sm:h-6" /></div>
            <div className="text-center sm:text-left">
              <p className="text-[10px] sm:text-sm text-slate-500 font-medium uppercase tracking-wider">Requests</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-800">{requests.length}</p>
            </div>
          </div>
        </div>

        {/* Requests Management */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Clock className="text-primary" /> Manage Rental Requests
          </h3>

          <div className="glass-panel overflow-hidden border-none sm:border">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-4 font-bold text-slate-600 text-xs uppercase tracking-widest whitespace-nowrap">Student Details</th>
                    <th className="p-4 font-bold text-slate-600 text-xs uppercase tracking-widest whitespace-nowrap">Book Info</th>
                    <th className="p-4 font-bold text-slate-600 text-xs uppercase tracking-widest whitespace-nowrap">Duration</th>
                    <th className="p-4 font-bold text-slate-600 text-xs uppercase tracking-widest whitespace-nowrap">Status</th>
                    <th className="p-4 font-bold text-slate-600 text-xs uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-slate-500 font-medium">No requests in the system.</td></tr>
                  ) : (
                    requests.map(req => (
                      <tr key={req._id || req.id} className="hover:bg-slate-50/50 group transition-colors">
                        <td className="p-4 min-w-[250px]">
                          <p className="font-bold text-slate-800 text-base leading-tight group-hover:text-primary transition-colors">{req.studentName}</p>
                          <div className="mt-1.5 space-y-1">
                            <div className="flex flex-wrap gap-1">
                              <span className="bg-primary/10 text-primary text-[10px] font-black px-1.5 py-0.5 rounded uppercase">{req.studentId}</span>
                              <span className="bg-secondary/10 text-secondary text-[10px] font-black px-1.5 py-0.5 rounded uppercase">Sem {req.studentSemester}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-bold leading-tight line-clamp-1">{req.studentCollege}</p>
                            <p className="text-[10px] text-slate-400 italic line-clamp-1">{req.studentEmail}</p>
                          </div>
                        </td>
                        <td className="p-4 min-w-[180px]">
                          <p className="font-bold text-slate-700 text-sm">{req.bookName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">ID: {req.bookId?.slice(-6).toUpperCase()}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-slate-400" />
                            <span className="text-sm font-bold text-slate-600">{req.rentalDays}d</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                            req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            req.status.includes('Approved') ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {req.status === 'Pending' ? 'Pending' : (req.status.includes('Approved') ? 'Approved' : 'Rejected')}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {req.status === 'Pending' ? (
                            <div className="flex flex-col sm:flex-row gap-2 justify-end">
                              <button onClick={() => openApproveModal(req)} className="px-3 py-1.5 bg-primary text-white rounded-lg text-[10px] font-black uppercase hover:bg-primary-hover transition-all shadow-sm">Approve</button>
                              <button onClick={() => rejectRequest(req._id || req.id)} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase hover:bg-red-50 hover:text-red-600 transition-all">Reject</button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Completed</span>
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

        {/* Books Management */}
        <div className="space-y-6 pt-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Library className="text-primary" /> Library Inventory
            </h3>
            <button 
              onClick={handleAddBookClick}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-sm"
            >
              <Plus size={18} /> Add Book
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map(book => (
              <div key={book._id || book.id} className="relative group">
                <BookCard book={book} isAdmin={true} onEdit={handleEditBook} />
                <button 
                  onClick={() => deleteBook(book._id || book.id)}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                >
                  <XCircle size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Approve Request Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Approve Request</h3>
            <p className="text-slate-500 mb-6 text-sm">Review and set final rental cost.</p>
            
            <div className="bg-slate-50 p-4 rounded-xl mb-6 space-y-2 border border-slate-100">
              <p className="text-sm"><span className="font-semibold">Student:</span> {selectedRequest?.studentName} ({selectedRequest?.studentId})</p>
              <p className="text-xs text-slate-500">{selectedRequest?.studentCollege} | {selectedRequest?.studentBranch} (Sem {selectedRequest?.studentSemester})</p>
              <div className="h-px bg-slate-200 my-2" />
              <p className="text-sm"><span className="font-semibold">Book:</span> {selectedRequest?.bookName}</p>
              <p className="text-sm"><span className="font-semibold">Duration:</span> {selectedRequest?.rentalDays} days</p>
            </div>

            <form onSubmit={approveRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Final Rental Cost (₹)</label>
                <input 
                  type="number" 
                  required 
                  min="0"
                  value={approveCost} 
                  onChange={e => setApproveCost(Number(e.target.value))} 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 text-lg font-bold text-green-700 bg-green-50" 
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowApproveModal(false)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200">
                  Confirm Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit/Add Book Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
            <form onSubmit={saveBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Book Title</label>
                <input type="text" required value={bookForm.title} onChange={e => setBookForm({...bookForm, title: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Author</label>
                <input type="text" required value={bookForm.author} onChange={e => setBookForm({...bookForm, author: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Quantity</label>
                  <input type="number" min="0" required value={bookForm.quantity} onChange={e => setBookForm({...bookForm, quantity: Number(e.target.value)})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Rent Cost/Day (₹)</label>
                  <input type="number" min="0" required value={bookForm.rentCost} onChange={e => setBookForm({...bookForm, rentCost: Number(e.target.value)})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Cover Icon (Emoji)</label>
                <input type="text" value={bookForm.coverIcon} onChange={e => setBookForm({...bookForm, coverIcon: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-xl" />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowBookModal(false)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20">
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
