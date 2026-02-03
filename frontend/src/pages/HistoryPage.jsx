import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Clock, User, Award, Search, Package } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getRankColor = (rankName) => {
  const colors = {
    'Prime': '#22c55e',
    'Elite': '#F59E0B',
    'Ace': '#8B5CF6',
    'Immortal': '#EC4899',
    'Supreme': '#EAB308'
  };
  return colors[rankName] || '#8B5CF6';
};

const PurchaseCard = ({ purchase }) => {
  const rankColor = getRankColor(purchase.rank_name);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-[#16161b] border border-gray-800/50 rounded-xl p-5 hover:border-gray-700/70 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${rankColor}20` }}
          >
            <Award className="w-6 h-6" style={{ color: rankColor }} />
          </div>
          <div>
            <h3 className="font-semibold text-white">{purchase.rank_name} Rank</h3>
            <p className="text-gray-500 text-sm">{formatDate(purchase.completed_at)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white font-semibold">₹{purchase.amount}</p>
          <span 
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${rankColor}20`, color: rankColor }}
          >
            Completed
          </span>
        </div>
      </div>
    </div>
  );
};

const HistoryPage = () => {
  const [username, setUsername] = useState('');
  const [searchedUsername, setSearchedUsername] = useState('');
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    setError('');
    setHasSearched(true);
    setSearchedUsername(username.trim());

    try {
      const response = await axios.get(`${API}/purchases/${encodeURIComponent(username.trim())}`);
      setPurchases(response.data);
    } catch (err) {
      console.error('Error fetching purchases:', err);
      setError('Failed to fetch purchase history. Please try again.');
      setPurchases([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#8B5CF6]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-[#8B5CF6]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Transaction <span className="text-[#8B5CF6]">History</span>
            </h1>
            <p className="text-gray-400">
              Enter your Minecraft username to view your purchase history
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="bg-[#16161b] border border-gray-800/50 rounded-xl p-4">
              <label className="block text-gray-400 text-sm mb-2">
                Minecraft Username
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full bg-[#0f0f13] border border-gray-700/50 rounded-lg px-4 py-3 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-[#8B5CF6] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !username.trim()}
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Results */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading purchase history...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {!isLoading && hasSearched && !error && (
            <>
              {purchases.length > 0 ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-[#8B5CF6]" />
                    <h2 className="text-white font-semibold">
                      Purchases for <span className="text-[#8B5CF6]">{searchedUsername}</span>
                    </h2>
                    <span className="bg-[#8B5CF6]/20 text-[#8B5CF6] px-2 py-0.5 rounded-full text-xs font-medium">
                      {purchases.length} {purchases.length === 1 ? 'purchase' : 'purchases'}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {purchases.map((purchase, index) => (
                      <PurchaseCard key={purchase.id || index} purchase={purchase} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-[#16161b] border border-gray-800/50 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">No purchases found</h3>
                  <p className="text-gray-400 text-sm">
                    No transaction history found for <span className="text-white">{searchedUsername}</span>.
                    <br />Make sure you entered the correct username.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Initial State */}
          {!hasSearched && !isLoading && (
            <div className="bg-[#16161b] border border-gray-800/50 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-[#8B5CF6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-[#8B5CF6]" />
              </div>
              <h3 className="text-white font-semibold mb-2">Search Your History</h3>
              <p className="text-gray-400 text-sm">
                Enter your Minecraft username above to view all your rank purchases and redeem codes.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HistoryPage;
