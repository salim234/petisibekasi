import React, { useState, useRef, useEffect } from 'react';
import { Signer } from '../types';
import { Send, MapPin, Briefcase, FileSignature, Eraser, AlertCircle, User, PenTool, Loader2, Building } from 'lucide-react';

interface PetitionFormProps {
  onSign: (signerData: Omit<Signer, 'id' | 'timestamp'>) => Promise<void>;
}

const KECAMATAN_BEKASI = [
  "Sukatani", "Babelan", "Bojongmangu", "Cabangbungin", "Cibarusah", "Cibitung",
  "Cikarang Barat", "Cikarang Pusat", "Cikarang Selatan", "Cikarang Timur", "Cikarang Utara",
  "Karangbahagia", "Kedungwaringin", "Muaragembong", "Pebayuran", "Serang Baru",
  "Setu", "Sukakarya", "Sukawangi", "Tambelang", "Tambun Selatan",
  "Tambun Utara", "Tarumajaya"
].sort();

const PetitionForm: React.FC<PetitionFormProps> = ({ onSign }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  
  // Address parts
  const [kecamatan, setKecamatan] = useState('');
  const [desa, setDesa] = useState('');
  const [alamatDetail, setAlamatDetail] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Signature Canvas State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Initialize Canvas Context settings
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';
      }
    }
  }, []);

  const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ('touches' in event.nativeEvent) {
      clientX = event.nativeEvent.touches[0].clientX;
      clientY = event.nativeEvent.touches[0].clientY;
    } else {
      clientX = (event.nativeEvent as MouseEvent).clientX;
      clientY = (event.nativeEvent as MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    if (e.type === 'touchmove') {
       // Prevent scrolling handled by CSS touch-action: none
    }
    
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
      if (!hasSignature) setHasSignature(true);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.closePath();
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000000';
    }
  };

  const getCompressedSignature = (canvas: HTMLCanvasElement): string | null => {
    const MAX_SIZE = 60 * 1024; 
    const getSize = (base64: string) => (base64.length - 22) * 0.75; 

    let data = canvas.toDataURL('image/jpeg', 0.7);
    if (getSize(data) <= MAX_SIZE) return data;

    data = canvas.toDataURL('image/jpeg', 0.5);
    if (getSize(data) <= MAX_SIZE) return data;

    data = canvas.toDataURL('image/jpeg', 0.3);
    if (getSize(data) <= MAX_SIZE) return data;

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hasSignature) {
      setError('Mohon bubuhkan tanda tangan digital Anda pada kolom yang tersedia.');
      return;
    }

    if (name && position && kecamatan && desa && alamatDetail) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      setIsSubmitting(true);

      const signatureData = getCompressedSignature(canvas);
      
      if (!signatureData) {
        setIsSubmitting(false);
        setError('Garis tanda tangan terlalu rumit. Mohon sederhanakan sedikit.');
        return;
      }

      // Combine address parts into a single string for the DB
      const fullAddress = `${alamatDetail}, Desa ${desa}, Kec. ${kecamatan}`;

      try {
        await onSign({
            name,
            position,
            address: fullAddress,
            signature: signatureData,
        });
        
        // Reset Form
        setName('');
        setPosition('');
        setKecamatan('');
        setDesa('');
        setAlamatDetail('');
        clearSignature();
        alert('Terima kasih! Dukungan Anda telah berhasil disimpan.');
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Gagal mengirim data. Silakan coba lagi.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div id="petition" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-red-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">Isi Petisi Dukungan</h2>
          <p className="text-red-100 mt-2">Lengkapi data diri dan jabatan Anda untuk validasi dukungan.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* Nama */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4" /> Nama Lengkap
            </label>
            <input 
              type="text" 
              required
              disabled={isSubmitting}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all disabled:bg-slate-100"
              placeholder="Nama sesuai KTP"
            />
          </div>

          {/* Jabatan */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Jabatan di Desa
            </label>
            <input 
              type="text" 
              required
              disabled={isSubmitting}
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all disabled:bg-slate-100"
              placeholder="Contoh: Sekretaris Desa, Kepala Dusun, Staff, dll"
            />
          </div>

          {/* Alamat Section */}
          <div className="p-4 bg-slate-50 rounded-xl space-y-4 border border-slate-100">
             <div className="flex items-center gap-2 text-slate-700 font-semibold border-b border-slate-200 pb-2 mb-2">
                <MapPin className="w-4 h-4" />
                <span>Alamat Lengkap</span>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">Kecamatan</label>
                    <div className="relative">
                        <select
                            required
                            disabled={isSubmitting}
                            value={kecamatan}
                            onChange={(e) => setKecamatan(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all disabled:bg-slate-100"
                        >
                            <option value="">Pilih Kecamatan</option>
                            {KECAMATAN_BEKASI.map(kec => (
                                <option key={kec} value={kec}>{kec}</option>
                            ))}
                        </select>
                        <Building className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">Desa / Kelurahan</label>
                    <input 
                        type="text" 
                        required
                        disabled={isSubmitting}
                        value={desa}
                        onChange={(e) => setDesa(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all disabled:bg-slate-100"
                        placeholder="Nama Desa"
                    />
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">Jalan / RT / RW</label>
                <input 
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={alamatDetail}
                    onChange={(e) => setAlamatDetail(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all disabled:bg-slate-100"
                    placeholder="Nama Jalan, Nomor Rumah, RT/RW..."
                />
             </div>
          </div>

          {/* Tanda Tangan */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-2"><FileSignature className="w-4 h-4" /> Tanda Tangan Digital</span>
              {hasSignature && !isSubmitting && (
                <button 
                  type="button" 
                  onClick={clearSignature}
                  className="text-xs text-red-500 flex items-center gap-1 hover:text-red-700"
                >
                  <Eraser className="w-3 h-3" /> Ulangi
                </button>
              )}
            </label>
            
            <div className={`border-2 border-slate-200 border-dashed rounded-lg overflow-hidden bg-slate-50 relative ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
              {!hasSignature && !isDrawing && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="text-slate-400 flex flex-col items-center">
                      <PenTool className="w-6 h-6 mb-1 opacity-50" />
                      <span className="text-sm">Goreskan tanda tangan di sini</span>
                   </div>
                </div>
              )}
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="w-full h-48 cursor-crosshair touch-none bg-white"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                style={{ touchAction: 'none' }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Pastikan tanda tangan terbaca jelas.</p>
            
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-1 bg-red-50 p-2 rounded">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-lg text-lg font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isSubmitting ? (
                <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Menyimpan Data...
                </>
            ) : (
                <>
                    <Send className="w-5 h-5 mr-2" />
                    Kirim Dukungan
                </>
            )}
          </button>

          <p className="text-xs text-center text-slate-400 mt-4">
            Dengan menandatangani ini, Anda menyatakan data yang diisi adalah benar dan mendukung petisi ini.
          </p>
        </form>
      </div>
    </div>
  );
};

export default PetitionForm;
