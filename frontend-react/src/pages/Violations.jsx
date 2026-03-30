import { useState, useEffect } from 'react';
import { AlertOctagon, TrendingDown, Clock, Search, Loader2, AlertCircle, ShieldCheck, Filter, ShieldAlert, Cpu, Activity, Zap, Terminal, Target, Brain, X, ChevronRight } from 'lucide-react';
import mediaService from '../services/mediaService';
import aiService from '../services/aiService';
import ViolationCard from '../components/ViolationCard';
import StatCard from '../components/StatCard';

const Violations = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [showSummaryPanel, setShowSummaryPanel] = useState(false);

  const fetchViolations = async () => {
    try {
      setLoading(true);
      const data = await mediaService.getViolations();
      if (data.status === 'success') {
        setViolations(data.data.violations || []);
      }
    } catch (err) {
      setError('Intelligence sync failed: Authority level 4 required or link unstable.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolations();
  }, []);

  const handleGenerateSummary = async () => {
    if (violations.length === 0) return;
    setLoadingSummary(true);
    setShowSummaryPanel(true);
    try {
      const result = await aiService.summarizeViolations(violations);
      setSummary(result.summary);
    } catch (err) {
      setSummary("FAILED TO AGGREGATE THREAT INTELLIGENCE. NODE TIMEOUT.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const filteredViolations = (violations || []).filter(v => 
    (v?.matchedWith?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v?.sourceUrl || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { title: 'Threat Instances', value: (violations?.length || 0), icon: <AlertOctagon size={18} />, trend: '+4' },
    { title: 'Confidence Avg', value: (violations?.length || 0) > 0 ? `${Math.round(violations.reduce((acc, v) => acc + (v.similarityScore || 0), 0) / violations.length * 100)}%` : '0%', icon: <TrendingDown size={18} />, trend: '+1.2%' },
    { title: 'Intelligence Latency', value: '4ms', icon: <Clock size={18} />, trend: 'Live' },
  ];

  return (
    <div className="space-y-24 py-12 relative">
      
      {/* Intelligence Control Header - Masterpiece Layout */}
      <div className="flex flex-col lg:flex-row gap-20 items-stretch justify-between border-b border-white/[0.04] pb-24">
        <div className="space-y-10 max-w-3xl flex-1">
          <div className="flex items-center gap-4">
             <div className="h-[2px] w-16 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-red-600 animate-pulse">Threat Identification Active</span>
          </div>
          <h1 className="font-heading text-8xl font-black tracking-tighter text-white italic leading-[0.8] mb-6 uppercase">
            Intel <br/> 
            <span className="text-red-600">Breach</span> <br/>
            <span className="text-white/10">Analysis</span>
          </h1>
          <p className="text-base font-bold leading-relaxed text-slate-600 max-w-xl italic uppercase tracking-tight">
            Monitoring distributed content topology across global surface nodes. <br/>
            Tracking unauthorized distribution of protected DAPS assets. <br/>
            Current Security Status: <span className="text-red-600 underline underline-offset-8 decoration-red-600/40">HIGH-LEVEL_ENFORCEMENT_PROTOCOL</span>
          </p>
        </div>

        {/* AI Aggregator Action Card */}
        <div className="lg:w-96 flex flex-col items-center justify-center p-10 bg-white/[0.01] border border-white/[0.05] relative overflow-hidden group">
           <div className="absolute inset-0 coordinates opacity-20" />
           <Target size={80} strokeWidth={0.5} className="text-red-600/20 group-hover:scale-110 group-hover:text-red-600/40 transition-all duration-1000 mb-8" />
           
           <button 
             onClick={handleGenerateSummary}
             disabled={loadingSummary || violations.length === 0}
             className="btn-cyber w-full !bg-white !text-black hover:!bg-[#cffd01] mb-6"
           >
             {loadingSummary ? <Loader2 size={18} className="animate-spin" /> : <Brain size={18} />}
             <span>AI Aggregator</span>
           </button>
           
           <div className="flex items-center gap-4 text-[9px] font-black text-slate-700 uppercase italic tracking-widest leading-none">
              <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
              Aggregate Data Analysis
           </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-6 w-full lg:w-auto self-end">
          <button 
            onClick={fetchViolations}
            disabled={loading}
            className="btn-cyber-outline min-w-[240px] !py-6 border-red-500/20 text-red-500 hover:bg-red-600 hover:text-white"
          >
            <Loader2 size={18} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
            <span>Resync Node</span>
          </button>
        </div>
      </div>

      {/* AI Summary Sidebar Panel */}
      {showSummaryPanel && (
        <div className="fixed top-0 right-0 h-screen w-full md:w-[600px] bg-[#05070a]/95 backdrop-blur-3xl border-l border-white/10 z-[100] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col animate-in slide-in-from-right duration-500">
           <div className="p-10 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-6">
                 <div className="h-12 w-12 flex items-center justify-center bg-[#cffd01] text-black italic">
                   <Brain size={24} strokeWidth={2.5} />
                 </div>
                 <div>
                   <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">Aggregator</h2>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#cffd01] mt-2">Threat Intel Summary</p>
                 </div>
              </div>
              <button 
                onClick={() => setShowSummaryPanel(false)}
                className="h-10 w-10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"
              >
                <X size={24} />
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-12 coordinates">
              {loadingSummary ? (
                 <div className="flex flex-col items-center justify-center h-full gap-10">
                    <div className="relative">
                       <div className="h-24 w-24 animate-spin border-4 border-white/5 border-t-[#cffd01]" />
                       <Cpu size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#cffd01] opacity-50" />
                    </div>
                    <div className="text-center space-y-4">
                       <p className="text-[12px] font-black uppercase tracking-[0.6em] text-white italic animate-pulse">Computing Aggregates...</p>
                       <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Processing {violations.length} breach vectors</p>
                    </div>
                 </div>
              ) : (
                <div className="space-y-12">
                   <div className="space-y-6">
                      <div className="flex items-center gap-4">
                         <div className="h-[1px] w-12 bg-[#cffd01]" />
                         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Executive Summary</span>
                      </div>
                      <div className="mono text-[13px] leading-relaxed text-slate-400 bg-white/[0.01] p-8 border border-white/[0.03] whitespace-pre-wrap">
                        {summary}
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 bg-red-600/5 border border-red-600/10">
                         <span className="text-[8px] font-black uppercase tracking-widest text-red-500 mb-2 block">Total Breaches</span>
                         <span className="text-4xl font-black italic text-white">{violations.length}</span>
                      </div>
                      <div className="p-6 bg-indigo-600/5 border border-indigo-600/10">
                         <span className="text-[8px] font-black uppercase tracking-widest text-indigo-500 mb-2 block">Avg Severity</span>
                         <span className="text-4xl font-black italic text-white tracking-tighter">HIGH</span>
                      </div>
                   </div>
                   
                   <button 
                     onClick={() => setShowSummaryPanel(false)}
                     className="btn-cyber-outline w-full !py-6"
                   >
                     <span>Protocol Return</span>
                     <ChevronRight size={18} />
                   </button>
                </div>
              )}
           </div>
           
           <div className="p-8 border-t border-white/[0.05] bg-black/20">
              <div className="flex items-center justify-between text-[8px] font-black text-slate-800 uppercase tracking-[0.5em] italic">
                 <span>Node: COGNITION_ALPHA</span>
                 <span>Clearance: LVL_04</span>
              </div>
           </div>
        </div>
      )}

      {/* System Readout Bar - Hardware Style Stats */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 bg-white/[0.01] border-y border-white/[0.03] p-10 relative overflow-hidden">
        <div className="absolute inset-0 coordinates opacity-30" />
        {stats.map((stat, i) => (
          <div key={i} className="relative z-10 flex items-start gap-8 group">
             <div className="h-14 w-14 flex items-center justify-center bg-white/[0.02] border border-white/[0.05] text-slate-700 group-hover:text-red-500 group-hover:border-red-500/20 transition-all duration-700 italic">
                {stat.icon}
             </div>
             <div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-700 mb-2 block">{stat.title}</span>
                <span className="text-5xl font-black italic tracking-tighter text-white uppercase group-hover:text-red-500 transition-colors">{stat.value}</span>
                <div className="flex items-center gap-3 mt-4">
                   <div className="h-[1px] w-8 bg-white/10" />
                   <span className="text-[8px] font-bold text-red-500 tracking-widest">{stat.trend} LOGLINE</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Intelligence Feed - Masterpiece Chronological Log */}
      <div className="space-y-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/[0.03] pb-10 gap-10">
          <div className="flex items-center gap-6">
            <div className="flex h-12 w-12 items-center justify-center bg-white/[0.01] border border-white/[0.04] italic">
              <ShieldAlert size={24} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-heading text-3xl font-black italic tracking-tight text-white uppercase">Breach Analysis</h3>
              <p className="mono text-[10px] font-bold text-slate-700 uppercase tracking-[0.4em] leading-none mt-2">
                ACTIVE_THREATS: {(violations?.length || 0)} / REF: DAPS-INTEL-04
              </p>
            </div>
          </div>

          <div className="relative group w-full md:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 transition-colors group-focus-within:text-red-500" size={18} />
            <input 
              type="text" 
              placeholder="FILTER REPORTS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-16 w-full rounded-none bg-white/[0.01] border border-white/[0.04] pl-16 pr-8 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-all focus:bg-white/[0.05] focus:ring-0 focus:border-red-600/30 placeholder:text-slate-800 placeholder:italic italic"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex h-[500px] flex-col items-center justify-center p-20 coordinates">
            <div className="relative mb-10">
              <div className="h-28 w-28 animate-spin border-t-red-600 border-4 border-white/5 shadow-[0_0_50px_rgba(220,38,38,0.1)]" />
              <ShieldAlert size={40} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-red-600 opacity-50" />
            </div>
            <p className="text-[12px] font-black uppercase tracking-[0.6em] text-slate-800 animate-pulse italic">Scanning Global Intelligence Surface...</p>
          </div>
        ) : error ? (
          <div className="module-card flex h-96 flex-col items-center justify-center p-16 text-red-600 border-red-500/10 shadow-2xl shadow-red-500/10 italic">
            <Zap size={64} className="mb-10 opacity-30 animate-pulse" />
            <div className="text-center">
              <p className="font-heading text-3xl font-black mb-10 uppercase italic tracking-tighter">{error}</p>
              <button 
                onClick={fetchViolations} 
                className="btn-cyber-outline w-full sm:w-auto hover:bg-red-600 hover:text-white"
              >
                <span>Initialize Emergency Resync</span>
              </button>
            </div>
          </div>
        ) : filteredViolations.length === 0 ? (
          <div className="module-card flex flex-col items-center justify-center py-56 text-center coordinates border-white/5 bg-transparent italic">
            <div className="mb-12 flex h-36 w-36 items-center justify-center bg-white/[0.01] border border-white/[0.04] italic text-slate-800">
              <ShieldCheck size={80} strokeWidth={0.5} />
            </div>
            <h2 className="font-heading text-5xl font-black text-white italic tracking-tighter uppercase mb-6">Threats Expunged</h2>
            <p className="max-w-md text-[13px] font-black leading-relaxed text-slate-800 uppercase tracking-[0.4em]">
              {searchTerm 
                ? `NO THREAT MATCHING: "${searchTerm}"` 
                : "Continuous surveillance indicates zero unauthorized asset distribution nodes detected."}
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredViolations.map((item) => (
              <ViolationCard key={item._id} violation={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Violations;
