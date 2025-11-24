import React from 'react';
import { Signer } from '../types';
import { Briefcase, MapPin, User, FileSignature } from 'lucide-react';

interface RecentSignaturesProps {
  signers: Signer[];
}

const RecentSignatures: React.FC<RecentSignaturesProps> = ({ signers }) => {
  return (
    <div id="updates" className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-200">
            Dukungan Terbaru
        </h2>
        
        <div className="space-y-6">
          {signers.length === 0 ? (
            <p className="text-slate-500 text-center italic">Belum ada dukungan. Jadilah yang pertama!</p>
          ) : (
            signers.slice().reverse().slice(0, 5).map((signer) => (
              <div key={signer.id} className="flex flex-col sm:flex-row gap-4 p-5 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-red-600 shadow-sm">
                    <User className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                    <h4 className="font-bold text-lg text-slate-900 truncate">{signer.name}</h4>
                    <span className="text-xs text-slate-400 whitespace-nowrap mt-1 sm:mt-0">
                        {new Date(signer.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-slate-700 font-medium mb-1">
                    <Briefcase className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="truncate">{signer.position}</span>
                  </div>

                  <div className="flex items-start gap-2 text-slate-500 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="line-clamp-2">{signer.address}</p>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 flex items-end sm:items-center">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-200">
                        <FileSignature className="w-3 h-3" />
                        <span>Tanda Tangan Terverifikasi</span>
                    </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentSignatures;