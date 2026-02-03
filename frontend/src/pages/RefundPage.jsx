import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldX, AlertTriangle, Ban, FileText } from 'lucide-react';

const RefundPage = () => {
  return (
    <div className="min-h-screen bg-[#0f0f13] flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldX className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Refund <span className="text-red-500">Policy</span>
            </h1>
            <p className="text-gray-400">
              Please read our refund policy carefully before making a purchase
            </p>
          </div>

          {/* Main Policy Card */}
          <div className="bg-[#16161b] border border-gray-800/50 rounded-2xl p-8 mb-6">
            {/* No Refund Policy */}
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Ban className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Strict No Refund Policy
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  All purchases made on SNOWY MC are <span className="text-red-400 font-semibold">final and non-refundable</span>. 
                  Once a transaction is completed, we do not offer refunds, exchanges, or credits under any circumstances. 
                  By completing a purchase, you acknowledge and agree to this policy.
                </p>
              </div>
            </div>

            {/* Chargeback Warning */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-red-400 mb-2">
                    Chargeback Warning
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    Any attempts to initiate a chargeback or dispute a transaction with your payment provider 
                    will result in <span className="text-red-400 font-semibold">immediate and permanent ban</span> from:
                  </p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-center gap-2 text-gray-300">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      SNOWY MC Minecraft Server (SMP)
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      SNOWY MC Discord Server
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      All associated SNOWY MC services
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Terms */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#8B5CF6]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Additional Terms
                </h2>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-[#8B5CF6] mt-1">•</span>
                    All digital goods and rank purchases are delivered instantly upon successful payment.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8B5CF6] mt-1">•</span>
                    You are responsible for ensuring your Minecraft username is entered correctly during purchase.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8B5CF6] mt-1">•</span>
                    We reserve the right to revoke ranks or perks if obtained through fraudulent means.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8B5CF6] mt-1">•</span>
                    Server bans do not entitle you to a refund for purchased ranks or items.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8B5CF6] mt-1">•</span>
                    By making a purchase, you agree to all terms outlined in this policy.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-[#16161b] border border-gray-800/50 rounded-xl p-6 text-center">
            <p className="text-gray-400">
              If you have any questions about this policy, please contact us on our{' '}
              <a 
                href="https://discord.gg/snowymc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#8B5CF6] hover:text-[#A855F7] transition-colors"
              >
                Discord Server
              </a>
              {' '}before making a purchase.
            </p>
          </div>

          {/* Last Updated */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Last updated: February 2025
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RefundPage;
