import React, { useState, useRef } from 'react';
import QrScanner from 'react-qr-scanner';
import jsQR from 'jsqr';
import { X, QrCode, Loader2, Camera, Upload, Image as ImageIcon } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose, isLoading }) => {
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = (data: any) => {
    if (data && data.text) {
      onScan(data.text);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    setError("Could not access camera. Please check permissions.");
  };

  // [MODULE-A]: Testing Helper - Parse QR from uploaded screenshot/image
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;
        
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          onScan(code.data);
        } else {
          setError("No QR Code found in this image. Please upload a clear ID Card screenshot.");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
      <div className="bg-slate-900 w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl border border-white/10 relative">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 flex items-center justify-center">
              <QrCode className="text-blue-500" size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold tracking-tight">QR Entry Scanner</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                {mode === 'camera' ? 'Scanning via camera...' : 'Upload ID screenshot'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="p-4 flex gap-2 bg-white/5">
          <button 
            onClick={() => { setMode('camera'); setError(null); }}
            className={`flex-1 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${mode === 'camera' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400'}`}
          >
            <Camera size={14} /> Camera
          </button>
          <button 
            onClick={() => { setMode('upload'); setError(null); }}
            className={`flex-1 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${mode === 'upload' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400'}`}
          >
            <Upload size={14} /> Upload Screenshot
          </button>
        </div>

        {/* Scanner Area */}
        <div className="relative aspect-square bg-black flex items-center justify-center overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="text-blue-500 animate-spin" size={40} />
              <p className="text-blue-500 font-bold text-sm tracking-widest uppercase">Processing...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-rose-500 font-bold mb-4">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="bg-white/10 text-white px-6 py-2 rounded-xl text-sm font-bold"
              >
                Try Again
              </button>
            </div>
          ) : mode === 'camera' ? (
            <>
              <QrScanner
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                constraints={{ video: { facingMode: 'environment' } }}
              />
              <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
                 <div className="w-full h-full border-2 border-blue-50/50 rounded-3xl relative">
                    <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
                    <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
                    <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />
                    <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.8)] animate-scan-line" />
                 </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-800">
               <div className="w-20 h-20 rounded-[30px] bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                  <ImageIcon size={32} className="text-blue-500" />
               </div>
               <h4 className="text-white font-bold mb-2">Upload ID Card Photo</h4>
               <p className="text-xs text-slate-400 mb-8 px-4 italic">For testing: Take a screenshot of the ID Card and upload it here to mark entry.</p>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*" 
                 onChange={handleFileUpload}
               />
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
               >
                 Select Image File
               </button>
            </div>
          )}
        </div>

        {/* Footer Instruction */}
        <div className="p-8 text-center bg-white/5">
           <div className="flex items-center justify-center gap-2 mb-2">
              <Camera size={16} className="text-slate-400" />
              <p className="text-slate-300 text-sm font-medium">
                {mode === 'camera' ? 'Position the QR code inside the frame' : 'Attendance will be marked automatically'}
              </p>
           </div>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Module A: Contactless Security Flow</p>
        </div>
      </div>

      <style>{`
        @keyframes scan-line {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .animate-scan-line {
          animation: scan-line 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default QRScanner;
