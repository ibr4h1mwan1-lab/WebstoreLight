import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RanksGrid from '../components/RanksGrid.js';
import PurchaseModal from '../components/PurchaseModal';

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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Server <span className="text-[#F59E0B]">Ranks</span>
            </h1>
            <p className="text-gray-400">
              Unlock exclusive perks and commands
            </p>
          </div>

          {/* Ranks Grid */}
          <RanksGrid onPurchase={handlePurchase} />
        </div>
      </main>

      <Footer />
      
      {/* Purchase Modal */}
      <PurchaseModal
        rank={selectedRank}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default StorePage;
