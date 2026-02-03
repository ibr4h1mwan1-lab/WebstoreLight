import React from 'react';
import { MessageCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { serverInfo } from '../data/mock';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0d] border-t border-gray-800/50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#8B5CF6] rounded-md flex items-center justify-center font-bold text-white text-sm">
              S
            </div>
            <span className="text-white font-semibold tracking-wide">
              {serverInfo.name}
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a
              href={serverInfo.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Discord
            </a>
            <Link
              to="/refund"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <FileText className="w-4 h-4" />
              Refund Policy
            </Link>
            <span>© 2025 SNOWY MC. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
