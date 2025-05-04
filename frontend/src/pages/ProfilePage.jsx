import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUserQuizResults } from '../services/quizService';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const results = await getUserQuizResults();
        setQuizResults(results);
      } catch (err) {
        setError('Failed to load your quiz results');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
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
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-white">
                {user?.username || "Explorer"}'s Profile
              </h1>
              <p className="text-indigo-300">View your quiz performance</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-indigo-300">Loading your quiz results...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-400">{error}</p>
            </div>
          ) : quizResults.length === 0 ? (
            <div className="text-center py-10 bg-indigo-900/30 rounded-lg">
              <p className="text-indigo-300">You haven't taken any quizzes yet!</p>
              <motion.div
                className="mt-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a href="/quiz" className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg">
                  Take a Quiz Now
                </a>
              </motion.div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Your Quiz History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-black/40 rounded-lg overflow-hidden">
                  <thead className="bg-indigo-900/70">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-800">
                    {quizResults.map((result, index) => (
                      <tr key={index} className="hover:bg-indigo-900/30">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-300">
                          {formatDate(result.quizDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-indigo-800 text-indigo-100">
                            {result.score} / {result.totalQuestions}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                              <div
                                className={`h-2.5 rounded-full ${
                                  (result.score / result.totalQuestions) >= 0.8
                                    ? 'bg-green-500'
                                    : (result.score / result.totalQuestions) >= 0.6
                                    ? 'bg-blue-500'
                                    : (result.score / result.totalQuestions) >= 0.4
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${(result.score / result.totalQuestions) * 100}%` }}
                              ></div>
                            </div>
                            <span className="ml-3 text-sm text-indigo-300">
                              {Math.round((result.score / result.totalQuestions) * 100)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;