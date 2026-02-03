import React from 'react';
import { Check } from 'lucide-react';
import { ranks } from '../data/mock';

const RankCard = ({ rank, onPurchase }) => {
  return (
    <div className="bg-[#16161b] border border-gray-800/50 rounded-xl p-6 hover:border-gray-700/70 transition-all duration-300 flex flex-col h-full">
      {/* Top colored bar */}
      <div 
        className="w-16 h-1 rounded-full mb-6"
        style={{ backgroundColor: rank.color }}
      />
      
      {/* Rank Name */}
      <h3 
        className="text-2xl font-bold mb-2"
        style={{ color: rank.color }}
      >
        {rank.name}
      </h3>
      
      {/* Price */}
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-3xl font-bold text-white">₹{rank.price}</span>
        <span className="text-gray-500 text-sm">{rank.currency}</span>
      </div>
      
      {/* Features List */}
      <div className="flex-1 space-y-3 mb-6">
        {rank.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div 
              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: `${rank.color}30` }}
            >
              <Check className="w-3 h-3" style={{ color: rank.color }} />
            </div>
            <span className="text-gray-400 text-sm">{feature}</span>
          </div>
        ))}
      </div>
      
      {/* Purchase Button */}
      <button
        onClick={() => onPurchase(rank)}
        className="w-full py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02] uppercase tracking-wider text-sm"
        style={{ 
          backgroundColor: rank.color,
          color: '#fff'
        }}
      >
        Purchase
      </button>
    </div>
  );
};

const RanksGrid = ({ onPurchase }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {ranks.map((rank) => (
        <RankCard key={rank.id} rank={rank} onPurchase={onPurchase} />
      ))}
    </div>
  );
};

export default RanksGrid;
