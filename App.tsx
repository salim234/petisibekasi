import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import StatsSection from './components/StatsSection';
import PetitionForm from './components/PetitionForm';
import RecentSignatures from './components/RecentSignatures';
import { Signer } from './types';
import { supabase } from './services/supabaseClient';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [signers, setSigners] = useState<Signer[]>([]);
  const [totalSignatures, setTotalSignatures] = useState(0);
  const [uniqueDesa, setUniqueDesa] = useState(0);
  const [uniqueKecamatan, setUniqueKecamatan] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setDbError(null);
    try {
      // 1. Get all data needed for stats (address) and count
      // Note: For very large datasets, this should be optimized via RPC or separate tables.
      // Current approach is fine for thousands of records.
      const { data: allData, error: countError } = await supabase
        .from('signatures')
        .select('address');

      if (countError) {
        console.error('Supabase Count Error:', countError);
        setDbError('Gagal terhubung ke database.');
      } else if (allData) {
        setTotalSignatures(allData.length);

        // Calculate unique stats client-side by parsing the address string
        // Format: "... , Desa [Name], Kec. [Name]"
        const desaSet = new Set<string>();
        const kecSet = new Set<string>();

        allData.forEach(item => {
            if (item.address) {
                // Split by specific separators used in PetitionForm
                const desaParts = item.address.split(', Desa ');
                if (desaParts.length > 1) {
                    const locationPart = desaParts[1]; // "Name, Kec. Name"
                    const kecParts = locationPart.split(', Kec. ');
                    
                    if (kecParts.length > 0) {
                        const desaName = kecParts[0].trim().toLowerCase();
                        if (desaName) desaSet.add(desaName);
                    }
                    
                    if (kecParts.length > 1) {
                        const kecName = kecParts[1].trim().toLowerCase();
                        if (kecName) kecSet.add(kecName);
                    }
                }
            }
        });

        setUniqueDesa(desaSet.size);
        setUniqueKecamatan(kecSet.size);
      }

      // 2. Get recent signatures (limit 5)
      const { data, error: dataError } = await supabase
        .from('signatures')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (dataError) {
        console.error('Supabase Data Error:', dataError);
      } else if (data) {
        const formattedSigners: Signer[] = data.map((item: any) => ({
          id: item.id?.toString() || Math.random().toString(),
          name: item.name || 'Tanpa Nama',
          position: item.position || '-',
          address: item.address || '-',
          signature: item.signature || '',
          timestamp: item.created_at ? new Date(item.created_at) : new Date(),
        }));
        setSigners(formattedSigners);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setDbError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('signatures_updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'signatures' },
        (payload) => {
          // Update stats logic:
          // To keep unique stats accurate without re-fetching everything on every insert,
          // we simply increment total count here. 
          // Ideally, we fetch full stats periodically or simply rely on the next page load for precise unique counts.
          setTotalSignatures((prev) => prev + 1);
          
          // Add new signer to the top of the list
          const newSigner: Signer = {
            id: payload.new.id.toString(),
            name: payload.new.name,
            position: payload.new.position,
            address: payload.new.address,
            signature: payload.new.signature,
            timestamp: new Date(payload.new.created_at),
          };

          setSigners((prev) => [newSigner, ...prev].slice(0, 5));
          
          // Optional: Check if this new address adds a unique location locally
          if (payload.new.address) {
             const parts = payload.new.address.split(', Desa ');
             if (parts.length > 1) {
                 // Simple heuristic: If we just added one, we *might* check distincts, 
                 // but for simplicity we'll just let the total counter go up
                 // and let unique counts update on refresh to be 100% accurate.
             }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleNewSignature = async (data: Omit<Signer, 'id' | 'timestamp'>) => {
    // Insert to Supabase
    const { error } = await supabase
      .from('signatures')
      .insert([
        {
          name: data.name,
          position: data.position,
          address: data.address,
          signature: data.signature,
        },
      ]);

    if (error) {
      console.error('Insert Error:', error);
      throw new Error('Gagal menyimpan data ke server. Silakan coba lagi.');
    }
    
    // No need to call fetchData() here because the Realtime subscription will handle the update
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main>
        <Hero />
        
        {dbError && (
            <div className="max-w-7xl mx-auto px-4 mt-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center gap-2" role="alert">
                    <AlertCircle className="w-5 h-5" />
                    <span className="block sm:inline font-medium">{dbError}</span>
                </div>
            </div>
        )}

        <StatsSection 
            totalSignatures={totalSignatures} 
            uniqueDesa={uniqueDesa}
            uniqueKecamatan={uniqueKecamatan}
        />
        <PetitionForm onSign={handleNewSignature} />
        <RecentSignatures signers={signers} />
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-2">&copy; {new Date().getFullYear()} Suara Desa Bekasi. Inisiatif Warga untuk Tata Kelola Pemerintahan yang Lebih Baik.</p>
          <p className="text-sm">Platform ini independen dan tidak terafiliasi resmi dengan Pemkab Bekasi.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;