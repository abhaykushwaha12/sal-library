import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { MapPin, GraduationCap, Building2, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 text-center"
        >
          <img 
            src="/WhatsApp Image 2026-05-03 at 6.27.39 PM.jpeg" 
            alt="SAL Logo" 
            className="h-32 mx-auto mb-6 object-contain"
          />
          <h2 className="text-4xl font-bold text-slate-800 mb-4">SAL Education Campus</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Established in 2009 and administered by the Adarsh Foundation, SAL Education is a premier multi-disciplinary 
            educational campus in Ahmedabad, dedicated to excellence in professional and technical education.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <Building2 size={24} />
              <h3 className="text-xl font-bold">Campus Infrastructure</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Spread across a sprawling 25-acre modern campus, we provide state-of-the-art laboratories, 
              advanced research centers, and an innovation-friendly environment for our students.
            </p>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center gap-3 text-secondary">
              <GraduationCap size={24} />
              <h3 className="text-xl font-bold">Academic Excellence</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Affiliated with Gujarat Technological University (GTU), we offer diverse programs in 
              Engineering, Architecture, Pharmacy, Management, and Medicine.
            </p>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <MapPin size={24} />
              <h3 className="text-xl font-bold">Our Location</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Opposite Science City, Sola Bhadaj Road, Ahmedabad, Gujarat - 380060.
              Ideally located for accessibility and industry connection.
            </p>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center gap-3 text-secondary">
              <Globe size={24} />
              <h3 className="text-xl font-bold">Official Portal</h3>
            </div>
            <a 
              href="https://www.sal.edu.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-2 font-semibold"
            >
              Visit www.sal.edu.in <Globe size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
