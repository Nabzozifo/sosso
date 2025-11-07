import React from 'react';

const AfricanPatterns = ({ patternType = 'kente', className = '', opacity = 0.1 }) => {
  const patterns = {
    kente: (
      <pattern id="kente-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect width="40" height="40" fill="#D97706"/>
        <rect x="0" y="0" width="20" height="20" fill="#DC2626"/>
        <rect x="20" y="20" width="20" height="20" fill="#DC2626"/>
        <rect x="10" y="10" width="20" height="20" fill="#FBBF24"/>
      </pattern>
    ),
    sankofa: (
      <pattern id="sankofa-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <rect width="60" height="60" fill="#FEF3C7"/>
        <g transform="translate(30,30)">
          <circle cx="0" cy="0" r="20" fill="none" stroke="#D97706" strokeWidth="3"/>
          <path d="M-15,-10 Q-20,-15 -10,-20 Q0,-15 10,-20 Q20,-15 15,-10" fill="none" stroke="#DC2626" strokeWidth="2"/>
          <circle cx="0" cy="-15" r="3" fill="#DC2626"/>
        </g>
      </pattern>
    ),
    dogon: (
      <pattern id="dogon-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
        <rect width="50" height="50" fill="#FED7AA"/>
        <polygon points="25,5 45,25 25,45 5,25" fill="#EA580C" stroke="#DC2626" strokeWidth="1"/>
        <polygon points="25,15 35,25 25,35 15,25" fill="#FBBF24"/>
        <circle cx="25" cy="25" r="3" fill="#DC2626"/>
      </pattern>
    ),
    bogolan: (
      <pattern id="bogolan-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <rect width="80" height="80" fill="#FEF3C7"/>
        <g stroke="#92400E" strokeWidth="2" fill="none">
          <path d="M10,10 Q40,30 70,10 Q40,50 10,70 Q40,50 70,70 Q40,30 10,10"/>
          <circle cx="20" cy="20" r="5" fill="#D97706"/>
          <circle cx="60" cy="60" r="5" fill="#D97706"/>
          <circle cx="60" cy="20" r="3" fill="#DC2626"/>
          <circle cx="20" cy="60" r="3" fill="#DC2626"/>
        </g>
      </pattern>
    ),
    wax: (
      <pattern id="wax-pattern" x="0" y="0" width="70" height="70" patternUnits="userSpaceOnUse">
        <rect width="70" height="70" fill="#FEF3C7"/>
        <g transform="translate(35,35)">
          <g stroke="#D97706" strokeWidth="3" fill="none">
            <circle cx="0" cy="0" r="25"/>
            <circle cx="0" cy="0" r="15"/>
            <circle cx="0" cy="0" r="8"/>
          </g>
          <g fill="#DC2626">
            <circle cx="0" cy="-20" r="2"/>
            <circle cx="14" cy="-14" r="2"/>
            <circle cx="20" cy="0" r="2"/>
            <circle cx="14" cy="14" r="2"/>
            <circle cx="0" cy="20" r="2"/>
            <circle cx="-14" cy="14" r="2"/>
            <circle cx="-20" cy="0" r="2"/>
            <circle cx="-14" cy="-14" r="2"/>
          </g>
        </g>
      </pattern>
    ),
    mask: (
      <pattern id="mask-pattern" x="0" y="0" width="100" height="60" patternUnits="userSpaceOnUse">
        <rect width="100" height="60" fill="#059669" />
        <g fill="#D97706">
          <path d="M20,10 Q10,30 20,50 Q30,30 20,10" />
          <path d="M40,10 Q30,30 40,50 Q50,30 40,10" />
          <rect x="15" y="5" width="10" height="5" fill="#000000" />
          <rect x="35" y="5" width="10" height="5" fill="#000000" />
        </g>
        <g transform="translate(60,0)" fill="#D97706">
          <path d="M20,10 Q10,30 20,50 Q30,30 20,10" />
          <path d="M40,10 Q30,30 40,50 Q50,30 40,10" />
          <rect x="15" y="5" width="10" height="5" fill="#000000" />
          <rect x="35" y="5" width="10" height="5" fill="#000000" />
        </g>
      </pattern>
    ),
    elements: (
      <pattern id="elements-pattern" x="0" y="0" width="120" height="80" patternUnits="userSpaceOnUse">
        <rect width="120" height="80" fill="#FBBF24" />
        <g fill="#059669">
          <path d="M20,60 Q10,40 20,20 Q30,40 20,60" /> {/* Tree */}
          <circle cx="20" cy="15" r="10" fill="#059669" />
        </g>
        <g fill="#EA580C">
          <path d="M60,70 L65,50 L70,70" /> {/* Pot */}
          <rect x="62" y="40" width="6" height="10" />
        </g>
        <g fill="#92400E">
          <path d="M100,60 Q90,30 100,10 Q110,30 100,60" /> {/* Giraffe */}
          <rect x="95" y="60" width="10" height="20" />
        </g>
      </pattern>
    ),
    geometric: (
      <pattern id="geometric-pattern" x="0" y="0" width="80" height="40" patternUnits="userSpaceOnUse">
        <rect width="80" height="40" fill="#7C3AED" />
        <g fill="#FBBF24">
          <polygon points="10,10 20,0 30,10" />
          <polygon points="40,10 50,0 60,10" />
          <polygon points="10,30 20,20 30,30" />
          <polygon points="40,30 50,20 60,30" />
        </g>
        <g fill="#EA580C">
          <circle cx="20" cy="15" r="5" />
          <circle cx="50" cy="15" r="5" />
          <circle cx="20" cy="35" r="5" />
          <circle cx="50" cy="35" r="5" />
        </g>
      </pattern>
    )
  };
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ opacity }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {patterns[patternType]}
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternType}-pattern)`} />
      </svg>
    </div>
  );
};

// Composant pour les symboles Adinkra individuels
export const AdinkraSymbol = ({ symbol = 'sankofa', size = 'w-12 h-12', color = 'text-orange-600' }) => {
  const symbols = {
    sankofa: (
      <svg viewBox="0 0 60 60" className={`${size} ${color} fill-current`}>
        <g transform="translate(30,30)">
          <circle cx="0" cy="0" r="20" fill="none" stroke="currentColor" strokeWidth="3"/>
          <path d="M-15,-10 Q-20,-15 -10,-20 Q0,-15 10,-20 Q20,-15 15,-10" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="0" cy="-15" r="3" fill="currentColor"/>
        </g>
      </svg>
    ),
    gye_nyame: (
      <svg viewBox="0 0 60 60" className={`${size} ${color} fill-current`}>
        <g transform="translate(30,30)">
          <circle cx="0" cy="0" r="18" fill="none" stroke="currentColor" strokeWidth="3"/>
          <path d="M0,-18 L0,18 M-18,0 L18,0" stroke="currentColor" strokeWidth="2"/>
          <circle cx="0" cy="0" r="6" fill="currentColor"/>
        </g>
      </svg>
    ),
    dwennimmen: (
      <svg viewBox="0 0 60 60" className={`${size} ${color} fill-current`}>
        <g transform="translate(30,30)">
          <path d="M-15,-15 Q0,-25 15,-15 Q25,0 15,15 Q0,25 -15,15 Q-25,0 -15,-15" fill="none" stroke="currentColor" strokeWidth="3"/>
          <circle cx="-8" cy="-8" r="3" fill="currentColor"/>
          <circle cx="8" cy="8" r="3" fill="currentColor"/>
        </g>
      </svg>
    )
  };

  return symbols[symbol] || symbols.sankofa;
};

export default AfricanPatterns;