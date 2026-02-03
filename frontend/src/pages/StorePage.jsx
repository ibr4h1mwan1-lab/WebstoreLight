import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PurchaseModal from '../components/PurchaseModal';
import { Check } from 'lucide-react';
import { ranks } from '../data/mock';

const FeatureItem = ({ feature, color }) => (
  <div className="flex items-start gap-3">
    <div 
      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
      style={{ backgroundColor: `${color}30` }}
    >
      <Check className="w-3 h-3" style={{ color: color }} />
    </div>
    <span className="text-gray-400 text-sm">{feature}</span>
  </div>
);

const RankCard = ({ rank, onPurchase }) => (
  <div className="bg-[#16161b] border border-gray-800/50 rounded-xl p-6 hover:border-gray-700/70 transition-all duration-300 flex flex-col h-full">
    {/* Header with Image and Info */}
    <div className="flex items-center gap-4 mb-6">
      {/* Rank Image - Left Side */}
      <img 
        src={rank.image} 
        alt={`${rank.name} Rank`}
        className="w-24 h-24 object-contain flex-shrink-0"
      />
      
      {/* Rank Name & Price - Right Side */}
      <div className="flex-1">
        <div 
          className="w-12 h-1 rounded-full mb-3"
          style={{ backgroundColor: rank.color }}
        />
        <h3 
          className="text-2xl font-bold mb-1"
          style={{ color: rank.color }}
        >
          {rank.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">₹{rank.price}</span>
          <span className="text-gray-500 text-sm">{rank.currency}</span>
        </div>
      </div>
    </div>
    
    {/* Features List */}
    <div className="flex-1 space-y-3 mb-6">
      {rank.features.map((feature, idx) => (
        <FeatureItem key={idx} feature={feature} color={rank.color} />
      ))}
    </div>
    
    {/* Purchase Button */}
    <button
      onClick={() => onPurchase(rank)}
      className="w-full py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02] uppercase tracking-wider text-sm text-white"
      style={{ backgroundColor: rank.color }}
    >
      Purchase
    </button>
  </div>
);

const StorePage = () => {
  const [selectedRank, setSelectedRank] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePurchase = (rank) => {
    setSelectedRank(rank);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRank(null);
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Server <span className="text-[#F59E0B]">Ranks</span>
            </h1>
            <p className="text-gray-400">
              Unlock exclusive perks and commands
            </p>
          </div>

          {/* Top Row - 3 Ranks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {ranks.slice(0, 3).map((rank) => (
              <RankCard key={rank.id} rank={rank} onPurchase={handlePurchase} />
            ))}
          </div>

          {/* Bottom Row - 2 Ranks Centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {ranks.slice(3, 5).map((rank) => (
              <RankCard key={rank.id} rank={rank} onPurchase={handlePurchase} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
      
      <PurchaseModal
        rank={selectedRank}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default StorePage;
