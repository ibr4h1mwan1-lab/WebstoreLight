import React from 'react';
import { Zap, Users, LayoutGrid, TrendingUp, Heart } from 'lucide-react';
import { features } from '../data/mock';

const iconMap = {
  Zap: Zap,
  Users: Users,
  LayoutGrid: LayoutGrid,
  TrendingUp: TrendingUp,
  Heart: Heart,
};

const FeatureCard = ({ feature }) => {
  const IconComponent = iconMap[feature.icon];
  return (
    <div className="bg-[#16161b] border border-gray-800/50 rounded-xl p-6 hover:border-gray-700/70 transition-all duration-300 group">
      <div
        className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${feature.color}20` }}
      >
        <IconComponent
          className="w-7 h-7"
          style={{ color: feature.color }}
        />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">
        {feature.title}
      </h3>
      <p className="text-gray-400 text-sm">
        {feature.description}
      </p>
    </div>
  );
};

const FeaturesSection = () => {
  const topFeatures = features.slice(0, 3);
  const bottomFeatures = features.slice(3, 5);

  return (
    <section className="py-20 bg-[#0f0f13]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose <span className="text-[#8B5CF6]">SNOWY MC</span>?
          </h2>
          <p className="text-gray-400 text-lg">
            Experience the best Minecraft SMP server
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {topFeatures.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {bottomFeatures.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
