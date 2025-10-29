// components/SocialLink.tsx

import React from 'react';

// NOTE: Please install react-icons if you haven't already: npm install react-icons
import { FaTwitter, FaTelegramPlane } from 'react-icons/fa';

interface SocialLinkProps {
  platform: 'twitter' | 'telegram';
  url: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ platform, url }) => {
  let IconComponent;
  let label: string;
  let baseClasses: string = 'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 border border-gray-600 hover:border-white text-white text-sm font-medium';
  
  // Platform ke hisaab se Icon aur Label set karein
  if (platform === 'twitter') {
    IconComponent = FaTwitter;
    label = 'X Twitter';
    baseClasses += ' hover:bg-gray-800'; // X/Twitter hover effect
  } else { // platform === 'telegram'
    IconComponent = FaTelegramPlane;
    label = 'Telegram';
    baseClasses += ' hover:bg-sky-900'; // Telegram hover effect
  }

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={baseClasses}
    >
      <IconComponent className="h-4 w-4" />
      <span>{label}</span>
    </a>
  );
};

export default SocialLink;