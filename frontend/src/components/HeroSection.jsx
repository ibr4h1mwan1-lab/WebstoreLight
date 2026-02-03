import React, { useState } from 'react';
import { Copy, MessageCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { serverInfo } from '../data/mock';

const HeroSection = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyIP = () => {
    navigator.clipboard.writeText(`${serverInfo.ip}:${serverInfo.port}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Minecraft Winter Village */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://customer-assets.emergentagent.com/job_738d00da-4805-4f07-8c67-42557f004421/artifacts/4xs2ej36_ChatGPT%20Image%20Feb%203%2C%202026%2C%2007_16_56%20PM.png')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1625]/60 via-[#1a1625]/40 to-[#0f0f13]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Welcome to <span className="text-[#8B5CF6]">SNOWY MC</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          The ultimate survival multiplayer experience with custom features,
          friendly community, and epic adventures
        </p>

        {/* Server IP Box */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <div className="bg-[#1a1a1f]/90 backdrop-blur-sm border border-gray-700/50 rounded-lg px-6 py-4">
            <div className="text-gray-400 text-sm mb-1">Server IP</div>
            <div className="text-white font-mono text-lg tracking-wider">
              {serverInfo.ip}:{serverInfo.port}
            </div>
          </div>
          
          <button
            onClick={handleCopyIP}
            className="flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 uppercase tracking-wider text-sm"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy IP
              </>
            )}
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/store"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 uppercase tracking-wider min-w-[160px]"
          >
            Buy Ranks
          </Link>
          
          <Link
            to="/donate"
            className="flex items-center justify-center gap-2 bg-[#1a1a1f]/90 hover:bg-[#252530] border border-gray-600/50 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 uppercase tracking-wider min-w-[160px]"
          >
            Donate
          </Link>
          
          <a
            href={serverInfo.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105 uppercase tracking-wider min-w-[160px]"
          >
            <MessageCircle className="w-5 h-5" />
            Discord
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
