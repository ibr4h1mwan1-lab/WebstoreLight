import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-20 bg-[#0f0f13]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#16161b] border border-gray-800/50 rounded-2xl p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Join the Elite?
          </h2>
          <p className="text-gray-400 mb-8">
            Unlock exclusive perks, commands, and features with our premium ranks
          </p>
          <Link
            to="/store"
            className="inline-flex items-center justify-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 uppercase tracking-wider"
          >
            View Ranks
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
