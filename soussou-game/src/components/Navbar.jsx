import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '../contexts/AuthContext';
import { User } from 'lucide-react';

const Navbar = ({ gameMode, setGameMode, openAuth }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);
  
  const navItems = [
    { id: 'home', label: t('home'), path: '/' },
    { id: 'menu', label: t('games'), path: '/jeu' },
    { id: 'lessons', label: t('lessons'), path: '/lessons' },
    { id: 'exploration', label: t('explanations'), path: '/exploration' }
  ];

  const handleNavigation = (item) => {
    // Only navigate if we're not already on the target path
    if (location.pathname !== item.path) {
      navigate(item.path);
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center cursor-pointer"
              onClick={() => handleNavigation({ id: 'home', path: '/' })}
            >
              <span className="text-2xl font-bold gradient-text">{t('siteName')}</span>
            </motion.div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation(item)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 touch-friendly ripple-effect focus-ring ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-600 animate-glow'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50'
                }`}
              >
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="flex items-center gap-3 px-2 py-1 rounded-full hover:bg-orange-50 focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center ring-1 ring-orange-200">
                    {user?.name ? (
                      <span className="font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <span className="hidden sm:block text-sm text-gray-700">{user.name || user.email}</span>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd" />
                  </svg>
                </button>
                {open && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-orange-100 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <button
                        onClick={() => { setOpen(false); navigate('/profile'); }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50"
                      >
                        Mon profil
                      </button>
                      <button
                        onClick={() => { setOpen(false); navigate('/dashboard'); }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50"
                      >
                        Tableau de bord
                      </button>
                      <div className="my-2 border-t border-orange-100" />
                      <button
                        onClick={() => { setOpen(false); logout(); }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={openAuth} className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">Se connecter</button>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-orange-600 p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;