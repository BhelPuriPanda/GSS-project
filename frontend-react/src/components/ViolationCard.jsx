import { useState } from 'react';
import { ExternalLink, ShieldAlert, Globe, Clock, Fingerprint, Trash2, ShieldCheck, Activity, MapPin, Brain, Mail, Loader2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import aiService from '../services/aiService';

const ViolationCard = ({ violation }) => {
  const [aiResult, setAiResult] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [resultType, setResultType] = useState(null); // 'strategy' or 'takedown'
  const [copied, setCopied] = useState(false);
  
  const hash = violation._id ? violation._id.slice(-12).toUpperCase() : 'TEMP_BREACH';
  
  let detectionTime = '00:00:00';
  try {
    if (violation.detectedAt) {
      detectionTime = new Date(violation.detectedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  } catch (e) {
    console.error("Date parsing failed", e);
  }

  let hostname = 'UNKNOWN';
  try {
    if (violation.sourceUrl) {
      hostname = new URL(violation.sourceUrl).hostname;
    }
  } catch (e) {
    hostname = violation.sourceUrl || 'INVALID_SOURCE';
  }

  const handleAiStrategy = async () => {
    setLoadingAI(true);
    setResultType('strategy');
    try {
      const result = await aiService.analyzeViolation(
        violation.matchedWith?.title || 'Unknown Title',
        violation.sourceUrl,
        violation.matchedWith?.title || 'Unknown Asset'
      );
      setAiResult(result.analysis || 'NO AI STRATEGY RETURNED FROM THE ENFORCEMENT NODE.');
    } catch (err) {
      setAiResult("FAILED TO INITIALIZE AI STRATEGY ENGINE. CONNECTION UNSTABLE.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleDraftTakedown = async () => {
    setLoadingAI(true);
    setResultType('takedown');
    try {
      const result = await aiService.draftTakedown(
        violation.matchedWith?.title || 'Unknown Asset',
        violation.sourceUrl,
        violation.similarityScore,
        'DAPS Enforcement Agent'
      );
      setAiResult(result.draft || 'NO TAKEDOWN DRAFT RETURNED FROM THE ENFORCEMENT NODE.');
    } catch (err) {
      setAiResult("FAILED TO GENERATE TAKEDOWN MANIFEST. CHECK AI NODE STATUS.");
    } finally {
      setLoadingAI(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(aiResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="module-card group relative flex flex-col border-white/[0.03] hover:border-red-500/30 overflow-hidden">
      
      <div className="flex flex-col lg:flex-row items-stretch">
        {/* Time-Node Sidebar - Masterpiece Log Detail */}
        <div className="w-full lg:w-32 bg-red-600/5 group-hover:bg-red-600/10 border-r border-white/5 flex flex-col items-center justify-center p-6 lg:p-0 transition-colors">
           <div className="flex flex-col items-center gap-2">
             <span className="mono text-[10px] font-black text-red-500 animate-pulse">{detectionTime}</span>
             <div className="h-10 w-[1px] bg-red-600/20" />
             <span className="text-[8px] font-bold text-slate-700 uppercase tracking-widest leading-none">UTC STAMP</span>
           </div>
        </div>

        {/* Main Content Readout */}
        <div className="flex-1 p-8 lg:p-10 space-y-8 relative">
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
               <span>SIMILARITY: {violation.similarityScore ? (violation.similarityScore * 100).toFixed(1) : '0'}%</span>
            </div>
          </div>

          {/* Breach Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             <div className="space-y-2">
                <span className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.4em]">Source Distribution</span>
                <div className="flex items-center gap-4 text-[11px] font-black text-white italic uppercase tracking-widest transition-colors group-hover:text-red-400">
                   <Globe size={14} className="opacity-40" />
                   <span className="truncate max-w-[200px]">{hostname}</span>
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

        {/* Action Interface - High Precision AI Control */}
        <div className="w-full lg:w-80 border-l border-white/5 flex flex-col items-stretch justify-center p-8 gap-4 bg-black/40">
           <a 
             href={violation.sourceUrl} 
             target="_blank" 
             rel="noopener noreferrer"
             className="btn-cyber-outline w-full bg-red-600/10 hover:bg-red-600 hover:text-white border-red-500/20 !py-4"
           >
             <ExternalLink size={16} strokeWidth={2.5} />
             <span>Enforce</span>
           </a>
           
           <button 
             onClick={handleAiStrategy}
             disabled={loadingAI}
             className="flex items-center justify-center gap-3 px-6 py-4 bg-white/[0.03] border border-white/[0.05] text-[10px] font-black text-slate-600 hover:text-white hover:border-[#cffd01]/30 transition-all uppercase tracking-[0.3em] italic"
           >
             {loadingAI && resultType === 'strategy' ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} className="text-[#cffd01]" />}
             <span>AI Strategy</span>
           </button>

           <button 
             onClick={handleDraftTakedown}
             disabled={loadingAI}
             className="flex items-center justify-center gap-3 px-6 py-4 bg-white/[0.03] border border-white/[0.05] text-[10px] font-black text-slate-600 hover:text-white hover:border-indigo-500/30 transition-all uppercase tracking-[0.3em] italic"
           >
             {loadingAI && resultType === 'takedown' ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} className="text-indigo-500" />}
             <span>Draft Notice</span>
           </button>
        </div>
      </div>

      {/* AI Result Section - Expandable Masterpiece Panel */}
      {(aiResult || loadingAI) && (
        <div className="border-t border-white/[0.05] bg-black/60 p-8 animate-in slide-in-from-top duration-500">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`h-8 w-8 flex items-center justify-center border ${resultType === 'strategy' ? 'bg-[#cffd01]/10 border-[#cffd01]/30 text-[#cffd01]' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-500'}`}>
                {resultType === 'strategy' ? <Brain size={16} /> : <Mail size={16} />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white italic">
                {resultType === 'strategy' ? 'STRATEGIC_ENFORCEMENT_PROTOCOL' : 'TAKEDOWN_MANIFEST_DRAFT'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={copyToClipboard}
                className="p-2 text-slate-700 hover:text-white transition-colors"
                title="Copy to terminal"
              >
                {copied ? <Check size={16} className="text-[#cffd01]" /> : <Copy size={16} />}
              </button>
              <button 
                onClick={() => setAiResult(null)}
                className="p-2 text-slate-700 hover:text-white transition-colors"
              >
                <ChevronUp size={16} />
              </button>
            </div>
          </div>
          
          <div className="mono text-[11px] leading-relaxed text-slate-400 whitespace-pre-wrap bg-white/[0.01] p-6 border border-white/[0.03]">
            {loadingAI ? (
               <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <Loader2 size={32} className="animate-spin text-[#cffd01] opacity-50" />
                  <span className="text-[9px] font-black text-slate-700 animate-pulse">INITIALIZING COGNITIVE_NODE_ALPHA...</span>
               </div>
            ) : aiResult}
          </div>
        </div>
      )}

      <div className="absolute inset-0 scan-line z-10 opacity-5 group-hover:opacity-20 pointer-events-none" />
    </div>
  );
};

export default ViolationCard;
