import { useState } from 'react';
import { X, Upload, FileText, Image as ImageIcon, Video, Loader2, CheckCircle, Shield, Terminal, ArrowRight } from 'lucide-react';
import mediaService from '../services/mediaService';

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) return;

    setUploading(true);
    const formData = new FormData();
    const mediaType = file.type.startsWith('video/') ? 'video' : 'image';

    formData.append('file', file);
    formData.append('title', title);
    formData.append('type', mediaType);
    formData.append('description', description);

    try {
      await mediaService.uploadMedia(formData);
      onUploadSuccess();
      onClose();
      // Reset
      setFile(null);
      setTitle('');
      setDescription('');
    } catch (err) {
      alert('Mount protocol failed: Resource already exists or connection unstable.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#05070a]/90 backdrop-blur-3xl coordinates">
      <div className="module-card relative w-full max-w-xl bg-[#0d1117] border-white/10 shadow-[0_0_100px_rgba(207,253,1,0.05)]">
        
        {/* Modal Header - Industrial */}
        <div className="flex items-center justify-between border-b border-white/[0.05] bg-white/[0.01] px-8 py-6 transition-all">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center bg-[#cffd01] text-black italic">
              <Terminal size={20} strokeWidth={3} />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-black italic tracking-tighter text-white uppercase leading-none">Mount Asset</h2>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-1 block">Surveillance Deployment Sequence</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          
          {/* Technical Drag & Drop Field */}
          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 block pl-1 italic">Source Input (BIN)</label>
             <div 
               onDragEnter={handleDrag}
               onDragLeave={handleDrag}
               onDragOver={handleDrag}
               onDrop={handleDrop}
               className={`
                 relative flex flex-col items-center justify-center p-12 transition-all duration-500 border-2 border-dashed
                 ${dragActive ? 'bg-[#cffd01]/[0.05] border-[#cffd01]' : 'bg-black/40 border-white/[0.05]'}
                 ${file ? 'border-[#cffd01]/30' : ''}
               `}
               style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 80%, 95% 100%, 0 100%, 0 20%)' }}
             >
               <input 
                 type="file" 
                 id="file-upload" 
                 className="hidden" 
                 onChange={(e) => setFile(e.target.files[0])} 
               />
               <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer text-center group w-full">
                  {file ? (
                    <div className="flex flex-col items-center gap-6 w-full">
                       {file.type.startsWith('image/') ? (
                         <div className="relative h-48 w-full overflow-hidden border border-[#cffd01]/30 bg-black/60">
                            <div className="hud-scan opacity-20" />
                            <img 
                              src={URL.createObjectURL(file)} 
                              alt="Preview" 
                              className="h-full w-full object-contain opacity-80"
                            />
                            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 border border-white/5 text-[7px] font-black text-[#cffd01] uppercase tracking-widest">
                               PREVIEW_READY
                            </div>
                         </div>
                       ) : (
                         <div className="mb-6 flex h-16 w-16 items-center justify-center bg-white/[0.02] border border-white/5 transition-all italic">
                           <FileText size={24} className="text-[#cffd01]" />
                         </div>
                       )}
                       <div className="space-y-2">
                         <p className="text-[11px] font-black italic text-white uppercase tracking-tight">{file.name}</p>
                         <p className="text-[8px] font-bold text-[#cffd01] uppercase tracking-[0.2em]">Manifest Captured / {(file.size / 1024).toFixed(1)} KB</p>
                       </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6 flex h-16 w-16 items-center justify-center bg-white/[0.02] border border-white/5 transition-all group-hover:bg-[#cffd01]/10 group-hover:border-[#cffd01]/30 italic">
                        <Upload size={24} className="text-slate-500 group-hover:text-white" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">Initialize Upload / Drop Manifest</p>
                    </>
                  )}
                </label>
             </div>
          </div>

          {/* Asset Metadata Fields */}
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-3 group">
              <label className="text-[10px] font-black uppercase tracking-[0.4rem] text-slate-600 italic block pl-1 transition-colors group-focus-within:text-[#cffd01]">Asset Title / ID</label>
              <input
                type="text"
                placeholder="MANIFEST_REF_01"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/5 py-5 px-6 text-sm font-bold text-white transition-all focus:bg-white/[0.02] focus:ring-0 focus:border-[#cffd01]/30 placeholder:text-slate-800 placeholder:italic italic"
              />
            </div>
            <div className="space-y-3 group">
              <label className="text-[10px] font-black uppercase tracking-[0.4rem] text-slate-600 italic block pl-1 transition-colors group-focus-within:text-[#cffd01]">Security Metadata</label>
              <textarea
                placeholder="ADDITIONAL SURVEILLANCE PARAMETERS..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="w-full bg-black/40 border border-white/5 py-5 px-6 text-sm font-bold text-white transition-all focus:bg-white/[0.02] focus:ring-0 focus:border-[#cffd01]/30 placeholder:text-slate-800 placeholder:italic italic"
              />
            </div>
          </div>

          {/* Action Interface */}
          <div className="flex items-center gap-6 pt-6 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.5em] text-slate-700 hover:text-white hover:bg-white/5 transition-all italic underline decoration-transparent hover:decoration-slate-800"
            >
              Abort
            </button>
            <button
              type="submit"
              disabled={uploading || !file || !title}
              className="btn-cyber flex-1 italic"
            >
              {uploading ? <Loader2 size={18} className="animate-spin text-black" /> : (
                <>
                  <span>Initialize Mount</span>
                  <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Scan Bar Animation for Modal */}
        <div className="absolute inset-0 scan-line z-10 pointer-events-none opacity-5 animate-scan-modal" />
      </div>
    </div>
  );
};

export default UploadModal;
