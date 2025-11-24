import React from 'react';
import { ArrowRight, FileWarning } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-slate-900 py-16 sm:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-slate-900 mix-blend-multiply" />
        <img 
            src="https://picsum.photos/1920/1080?blur=5" 
            alt="Background Kantor Desa" 
            className="w-full h-full object-cover"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="lg:w-2/3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold mb-6">
            <FileWarning className="w-4 h-4" />
            <span>Darurat Regulasi Desa</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Desak Penerbitan Perbup <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              SOTK & Perangkat Desa
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl">
            Ketidakpastian hukum menghambat pelayanan publik di desa-desa Kabupaten Bekasi. 
            Dukung perangkat desa mendapatkan kepastian status melalui petisi ini.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#petition" className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-all shadow-lg shadow-red-600/30">
              Tanda Tangani Petisi
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;