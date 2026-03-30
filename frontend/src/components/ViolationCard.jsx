import { ExternalLink, ShieldAlert, Globe, Clock, Fingerprint, Trash2, ShieldCheck, Activity, MapPin } from 'lucide-react';

const ViolationCard = ({ violation }) => {
  const hash = violation._id.slice(-12).toUpperCase();
  const detectionTime = new Date(violation.detectedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const hostname = new URL(violation.sourceUrl).hostname;

  return (
    <div className="module-card group relative flex flex-col lg:flex-row items-stretch border-white/[0.03] hover:border-red-500/30">
      
      {/* Time-Node Sidebar - Masterpiece Log Detail */}
      <div className="w-full lg:w-32 bg-red-600/5 group-hover:bg-red-600/10 border-r border-white/5 flex flex-col items-center justify-center p-6 lg:p-0 transition-colors">
         <div className="flex flex-col items-center gap-2">
           <span className="mono text-[10px] font-black text-red-500 animate-pulse">{detectionTime}</span>
           <div className="h-10 w-[1px] bg-red-600/20" />
           <span className="text-[8px] font-bold text-slate-700 uppercase tracking-widest leading-none">UTC STAMP</span>
         </div>
      </div>

      {/* Main Content Readout */}
      <div className="flex-1 p-8 lg:p-10 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none italic select-none">
           <span className="text-8xl font-black text-white uppercase italic tracking-tighter">BREACH</span>
        </div>

        {/* Intelligence Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/[0.04] pb-8">
          <div className="space-y-3">
             <div className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 bg-red-600 animate-blink rounded-full" />
                <span className="mono text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">INTEL_ID: {hash}</span>
             </div>
             <h3 className="font-heading text-3xl font-black italic tracking-tighter text-white uppercase group-hover:text-red-500 transition-colors">
               {violation.matchedWith?.title || 'CORRUPT_MANIFEST_ID'}
             </h3>
          </div>
          <div className="tech-badge bg-red-600/10 border-red-500/20 text-red-500">
             <Activity size={12} />
             <span>SIMILARITY: {(violation.similarityScore * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Breach Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           <div className="space-y-2">
              <span className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.4em]">Source Distribution</span>
              <div className="flex items-center gap-4 text-[11px] font-black text-white italic uppercase tracking-widest transition-colors group-hover:text-red-400">
                 <Globe size={14} className="opacity-40" />
                 <span>{hostname}</span>
              </div>
           </div>
           <div className="space-y-2">
              <span className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.4em]">Node Coordinates</span>
              <div className="flex items-center gap-4 text-[11px] font-black text-white italic uppercase tracking-widest">
                 <MapPin size={14} className="opacity-40" />
                 <span>COORD: 40.7 / -74.0 [REF_O4]</span>
              </div>
           </div>
           <div className="space-y-2">
              <span className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.4em]">Enforcement Chain</span>
              <div className="flex items-center gap-4 text-[11px] font-black text-[#cffd01] italic uppercase tracking-widest">
                 <ShieldCheck size={14} className="opacity-40" />
                 <span>VERIFIED BREACH</span>
              </div>
           </div>
        </div>
      </div>

      {/* Action Interface - High Precision */}
      <div className="w-full lg:w-80 border-l border-white/5 flex flex-col items-stretch justify-center p-8 gap-4 bg-black/40">
         <a 
           href={violation.sourceUrl} 
           target="_blank" 
           rel="noopener noreferrer"
           className="btn-cyber-outline w-full bg-red-600/10 hover:bg-red-600 hover:text-white border-red-500/20"
         >
           <ShieldAlert size={18} strokeWidth={2.5} />
           <span>Enforce Rights</span>
         </a>
         <button className="group flex items-center justify-center gap-3 px-8 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-slate-800 transition-all hover:text-white italic">
           <span>Takedown Notice</span>
         </button>
      </div>

      <div className="absolute inset-0 scan-line z-10 opacity-5 group-hover:opacity-20 pointer-events-none" />
    </div>
  );
};

export default ViolationCard;
