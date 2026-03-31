import { ExternalLink, Trash2, Shield, Lock, FileText, Image as ImageIcon, Video, Cpu, Server, Terminal } from 'lucide-react';

const MediaCard = ({ media, onDelete, className }) => {
  const backendOrigin = (import.meta.env.VITE_API_BASE_URL || 'https://daps-backend-fg54.onrender.com/api').replace(/\/api\/?$/, '');
  const fullUrl = media.fileUrl?.startsWith('http') ? media.fileUrl : `${backendOrigin}${media.fileUrl}`;
  
  const getIcon = () => {
    if (media.type === 'image') return <ImageIcon size={20} />;
    if (media.type === 'video') return <Video size={20} />;
    return <FileText size={20} />;
  };

  // Fake Technical Metadata for "Masterpiece" Detail
  const entropy = (Math.random() * 8).toFixed(2);
  const hash = media._id ? media._id.slice(-12).toUpperCase() : 'TEMP_NODE_ID';

  return (
    <div className={`module-card group relative flex flex-col ${className}`}>
      {/* Brackets Header - Masterpiece Detail */}
      <div className="absolute top-0 left-0 w-full h-10 border-b border-white/[0.03] bg-white/[0.01] pointer-events-none flex items-center justify-between px-4">
         <div className="flex items-center gap-2">
           <div className="h-1 w-1 bg-[#cffd01] animate-blink" />
           <span className="mono text-[8px] font-black text-slate-500 uppercase tracking-widest">{media.type} // {hash}</span>
         </div>
         <div className="flex items-center gap-4 opacity-30 group-hover:opacity-100 transition-opacity">
           <span className="text-[7px] font-bold text-slate-700 uppercase">AES-256</span>
           <span className="text-[7px] font-bold text-[#cffd01]/50 uppercase italic">Active</span>
         </div>
      </div>

      {/* Media Source HUD - Asymmetric Image Area */}
      <div className="relative mt-10 h-64 overflow-hidden bg-black/50 coordinates border-b border-white/[0.03]">
        <div className="hud-scan opacity-30 group-hover:opacity-50" />
        <div className="absolute inset-0 scan-line z-20 opacity-10 group-hover:opacity-30" />
        
        {media.type === 'image' ? (
          <img 
            src={fullUrl} 
            alt={media.title} 
            className="h-full w-full object-cover opacity-80 transition-all duration-1000 group-hover:scale-105 group-hover:opacity-100 grayscale hover:grayscale-0" 
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-black/40 text-indigo-500/50 group-hover:text-[#cffd01] transition-all duration-1000">
            <Video size={48} strokeWidth={1} className={media.type === 'video' ? 'animate-pulse' : ''} />
          </div>
        )}
        
        {/* Hardware Data Overlay - Masterpiece Detail */}
        <div className="absolute left-4 top-14 space-y-2 pointer-events-none z-30">
           <div className="tech-badge bg-black/80 py-0.5 px-2 border-none">
             <Cpu size={10} className="text-[#cffd01]/40" />
             <span className="text-[7px]">BITRATE: 44.1k</span>
           </div>
           <div className="tech-badge bg-black/80 py-0.5 px-2 border-none">
             <Server size={10} className="text-indigo-500/40" />
             <span className="text-[7px]">NODE: {entropy}</span>
           </div>
        </div>

        {/* Tactical Actions - Industrial Style */}
        <div className="absolute inset-0 flex items-center justify-center gap-8 bg-[#030508]/90 opacity-0 transition-all duration-700 group-hover:opacity-100 backdrop-blur-xl scale-110 group-hover:scale-100">
           <a 
             href={fullUrl} 
             target="_blank" 
             rel="noopener noreferrer"
             className="flex h-16 w-16 items-center justify-center bg-white text-black hover:bg-[#cffd01] transition-all hover:scale-105 active:scale-95"
             style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }}
           >
             <ExternalLink size={24} strokeWidth={2.5} />
           </a>
           <button 
             onClick={() => onDelete(media._id)}
             className="flex h-16 w-16 items-center justify-center bg-red-600 text-white hover:bg-red-500 transition-all hover:scale-105 active:scale-95"
             style={{ clipPath: 'polygon(0 0, 80% 0, 100% 20%, 100% 100%, 20% 100%, 0 80%)' }}
           >
             <Trash2 size={24} strokeWidth={2.5} />
           </button>
        </div>
      </div>

      {/* Registry Identification Body */}
      <div className="p-8 flex-1 flex flex-col">
        <div className="brackets h-full relative p-4">
          <div className="space-y-4">
            <h3 className="line-clamp-1 font-heading text-2xl font-black italic tracking-tighter text-white uppercase group-hover:text-[#cffd01] transition-colors leading-none">
              {media.title}
            </h3>
            <p className="line-clamp-2 text-[11px] font-bold leading-relaxed text-slate-700 group-hover:text-slate-500 transition-all uppercase tracking-tight">
              {media.description || 'SURVEILLANCE IDENTIFIER UNLINKED. AUTO-GENERATED ENCRYPTION HASH APPLIED TO CORE REGISTRY PROTOCOL.'}
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-white/[0.04] pt-6">
            <div className="flex items-center gap-3">
               <div className="h-2 w-2 rounded-full bg-indigo-500/20 group-hover:bg-indigo-500 transition-colors" />
               <span className="mono text-[8px] font-bold text-slate-700 group-hover:text-slate-400">SRV_STABLE</span>
            </div>
            <div className="flex items-center gap-1.5 grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
               <Lock size={12} className="text-[#cffd01]" />
               <span className="text-[8px] font-black text-white italic tracking-widest">VERIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
