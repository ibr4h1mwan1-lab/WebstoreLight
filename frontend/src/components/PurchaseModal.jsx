import React, { useState } from 'react';
import { X, User, CreditCard } from 'lucide-react';

const PurchaseModal = ({ rank, isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !rank) return null;

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Thank you! Your ${rank.name} rank purchase for ${username} is being processed.`);
      onClose();
      setUsername('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#16161b] border border-gray-800/50 rounded-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Header */}
        <div className="text-center mb-6">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${rank.color}20` }}
          >
            <CreditCard className="w-6 h-6" style={{ color: rank.color }} />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">
            Purchase {rank.name} Rank
          </h3>
          <p className="text-gray-400 text-sm">
            Complete your purchase for ₹{rank.price} {rank.currency}
          </p>
        </div>
        
        {/* Form */}
        <form onSubmit={handlePurchase}>
          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">
              Minecraft Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full bg-[#0f0f13] border border-gray-700/50 rounded-lg px-4 py-3 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-[#8B5CF6] transition-colors"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isProcessing || !username.trim()}
            className="w-full py-3 rounded-lg font-semibold transition-all duration-200 uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: rank.color,
              color: '#fff'
            }}
          >
            {isProcessing ? 'Processing...' : `Pay ₹${rank.price}`}
          </button>
        </form>
        
        {/* Test Mode Notice */}
        <p className="text-center text-gray-500 text-xs mt-4">
          Test Mode - No real payment will be processed
        </p>
      </div>
    </div>
  );
};

export default PurchaseModal;
