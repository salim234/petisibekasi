import React from 'react';
import { Users, Building2, FileCheck } from 'lucide-react';

interface StatsSectionProps {
  totalSignatures: number;
  uniqueDesa: number;
  uniqueKecamatan: number;
}

const StatsSection: React.FC<StatsSectionProps> = ({ totalSignatures, uniqueDesa, uniqueKecamatan }) => {
  const target = 10000;
  const percentage = Math.min((totalSignatures / target) * 100, 100);

  return (
    <div className="bg-white py-12 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            {/* Total Count & Progress */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900">Total Dukungan</h3>
                    <p className="text-slate-500 text-sm mt-1">Update Real-time dari masyarakat</p>
                </div>
                <div className="text-right mt-4 md:mt-0">
                    <span className="text-5xl font-extrabold text-red-600 tracking-tight">{totalSignatures.toLocaleString()}</span>
                    <span className="text-slate-400 text-lg ml-2 font-medium">/ {target.toLocaleString()}</span>
                </div>
            </div>
            
            <div className="w-full bg-slate-200 rounded-full h-3 mb-10 overflow-hidden">
                <div 
                    className="bg-gradient-to-r from-red-500 to-red-700 h-3 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(220,38,38,0.5)]" 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow text-center group">
                    <div className="inline-flex p-3 rounded-full bg-blue-50 text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{uniqueDesa > 0 ? uniqueDesa : 1}</div>
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Desa Terlibat</div>
                </div>

                <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow text-center group">
                    <div className="inline-flex p-3 rounded-full bg-indigo-50 text-indigo-600 mb-3 group-hover:scale-110 transition-transform">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{uniqueKecamatan > 0 ? uniqueKecamatan : 1}</div>
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Kecamatan</div>
                </div>

                <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow text-center group">
                    <div className="inline-flex p-3 rounded-full bg-green-50 text-green-600 mb-3 group-hover:scale-110 transition-transform">
                        <FileCheck className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">Segera</div>
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Penerbitan Perbup</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;