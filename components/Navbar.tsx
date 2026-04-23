
import React from 'react';
import { View, ShopSettings, CustomPage } from '../types';

interface NavbarProps {
  cartCount: number;
  currentView: View;
  setView: (view: View) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  settings: ShopSettings;
  pages: CustomPage[];
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, currentView, setView, isLoggedIn, onLogout, settings, pages }) => {
  const menuPages = pages.filter(p => p.inMenu);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div 
            className="flex-shrink-0 cursor-pointer flex items-center space-x-2" 
            onClick={() => setView('shop')}
          >
            {settings.logoImage ? (
              <img src={settings.logoImage} alt={settings.logoText} className="h-12 w-auto object-contain" />
            ) : (
              <>
                <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-serif text-xl">{settings.logoText[0]}</span>
                </div>
                <span className="text-2xl font-bold text-stone-800 tracking-tight">
                  {settings.logoText}<span className="text-emerald-700">{settings.logoSubText}</span>
                </span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar mask-linear-fade pr-2 ml-8">
            <button 
              onClick={() => setView('shop')}
              className={`text-sm font-bold whitespace-nowrap transition-colors ${currentView === 'shop' ? 'text-emerald-700 underline underline-offset-8' : 'text-stone-600 hover:text-emerald-700'}`}
            >
              Shop
            </button>
            
            {menuPages.map(page => (
              <button 
                key={page.id}
                onClick={() => setView(page.slug)}
                className={`text-sm font-bold whitespace-nowrap transition-colors ${currentView === page.slug ? 'text-emerald-700 underline underline-offset-8' : 'text-stone-600 hover:text-emerald-700'}`}
              >
                {page.title}
              </button>
            ))}
            
            <div className="h-6 w-px bg-stone-200 mx-2 hidden md:block flex-shrink-0"></div>

            {isLoggedIn ? (
              <button onClick={() => setView('admin')} className="text-xs font-bold bg-stone-100 px-3 py-1 rounded-full text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 whitespace-nowrap">Admin</button>
            ) : null}
          </div>

          <div className="flex-shrink-0 ml-4">
            <button 
              onClick={() => setView('cart')}
              className="relative p-2 text-stone-600 hover:text-emerald-700 transition-colors bg-stone-50 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold leading-none text-white transform bg-emerald-600 rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
