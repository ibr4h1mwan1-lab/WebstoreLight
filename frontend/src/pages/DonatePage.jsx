import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, CreditCard, Heart } from 'lucide-react';

const DonatePage = () => {
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const presetAmounts = [50, 100, 250, 500, 1000];

  const handleDonate = (e) => {
    e.preventDefault();
    if (!username.trim() || !amount) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Thank you ${username}! Your donation of ₹${amount} is being processed.`);
      setUsername('');
      setAmount('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#EC4899]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-[#EC4899]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Support <span className="text-[#EC4899]">SNOWY MC</span>
            </h1>
            <p className="text-gray-400">
              Help us keep the server running and improve the experience
            </p>
          </div>

          {/* Donation Form */}
          <div className="bg-[#16161b] border border-gray-800/50 rounded-2xl p-6">
            <form onSubmit={handleDonate}>
              {/* Username */}
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
                    className="w-full bg-[#0f0f13] border border-gray-700/50 rounded-lg px-4 py-3 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-[#EC4899] transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Amount Presets */}
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">
                  Select Amount
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {presetAmounts.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset.toString())}
                      className={`py-2 rounded-lg text-sm font-medium transition-all ${
                        amount === preset.toString()
                          ? 'bg-[#EC4899] text-white'
                          : 'bg-[#0f0f13] border border-gray-700/50 text-gray-400 hover:border-[#EC4899] hover:text-white'
                      }`}
                    >
                      ₹{preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-2">
                  Or Enter Custom Amount
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount in INR"
                    min="1"
                    className="w-full bg-[#0f0f13] border border-gray-700/50 rounded-lg px-4 py-3 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-[#EC4899] transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isProcessing || !username.trim() || !amount}
                className="w-full bg-[#EC4899] hover:bg-[#DB2777] text-white py-3 rounded-lg font-semibold transition-all duration-200 uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : `Donate ₹${amount || '0'}`}
              </button>
            </form>

            {/* Test Mode Notice */}
            <p className="text-center text-gray-500 text-xs mt-4">
              Test Mode - No real payment will be processed
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DonatePage;
