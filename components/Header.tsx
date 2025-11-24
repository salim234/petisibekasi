import React from 'react';
import { ScrollText } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-2 rounded-lg">
              <ScrollText className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Suara<span className="text-red-600">Desa</span>Bekasi
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;