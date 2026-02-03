import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { donationHistory } from '../data/mock';
import { Clock, User, Award } from 'lucide-react';

const getRankColor = (rankName) => {
  const colors = {
    'Prime': '#22c55e',
    'Elite': '#F59E0B',
    'Ace': '#8B5CF6'
  };
  return colors[rankName] || '#8B5CF6';
};

const HistoryRow = ({ item }) => (
  <div className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-[#1a1a20] transition-colors">
    <div className="text-white font-medium">
      {item.username}
    </div>
    <div>
      <span 
        className="px-3 py-1 rounded-full text-xs font-medium"
        style={{ 
          backgroundColor: `${getRankColor(item.rank)}20`,
          color: getRankColor(item.rank)
        }}
      >
        {item.rank}
      </span>
    </div>
    <div className="text-gray-300">
      ₹{item.amount}
    </div>
    <div className="text-gray-500">
      {new Date(item.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })}
    </div>
  </div>
);

const HistoryPage = () => {
  return (
    <div className="min-h-screen bg-[#0f0f13] flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#8B5CF6]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-[#8B5CF6]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Recent <span className="text-[#8B5CF6]">Purchases</span>
            </h1>
            <p className="text-gray-400">
              See who recently supported the server
            </p>
          </div>

          <div className="bg-[#16161b] border border-gray-800/50 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-[#0f0f13] border-b border-gray-800/50">
              <div className="text-gray-400 text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </div>
              <div className="text-gray-400 text-sm font-medium flex items-center gap-2">
                <Award className="w-4 h-4" />
                Rank
              </div>
              <div className="text-gray-400 text-sm font-medium">
                Amount
              </div>
              <div className="text-gray-400 text-sm font-medium">
                Date
              </div>
            </div>

            <div className="divide-y divide-gray-800/50">
              {donationHistory.map((item) => (
                <HistoryRow key={item.id} item={item} />
              ))}
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Showing recent purchases. Thank you to all our supporters!
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HistoryPage;
