import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Passport = () => {
  const { user } = useAuth();
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12 galaxy-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/30 shadow-xl"
          >
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-700 to-purple-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-white">
                  Your World Explorer Passport
                </h1>
                <p className="text-indigo-300">Collect stamps from your world adventures</p>
              </div>
            </div>

            <div className="text-center py-20 bg-indigo-900/20 rounded-xl border border-indigo-500/30">
              <h2 className="text-2xl font-semibold text-white mb-4">Passport Feature Coming Soon!</h2>
              <p className="text-indigo-300 max-w-md mx-auto">
                Soon you'll be able to collect digital stamps for each country you explore and quiz you complete!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Passport;