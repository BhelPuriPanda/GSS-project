import { useState } from 'react';
import axios from 'axios';
import { Upload, Loader2, X, Beaker, Shield, Activity, Cpu, Zap, ArrowRight, Image as ImageIcon, Binary } from 'lucide-react';

const PYTHON_API_BASE_URL = import.meta.env.VITE_PYTHON_API_BASE_URL || 'http://localhost:8000';

const MLSandbox = () => {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [previewA, setPreviewA] = useState('');
  const [previewB, setPreviewB] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileA = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileA(file);
      setPreviewA(URL.createObjectURL(file));
    }
  };

  const handleFileB = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileB(file);
      setPreviewB(URL.createObjectURL(file));
    }
  };

  const handleCompare = async () => {
    if (!fileA || !fileB) {
      setError('Select dual-node visual inputs before initializing comparison.');
      return;
    }

    setError('');
    setResult(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('file1', fileA);
    formData.append('file2', fileB);

    try {
      const response = await axios.post(`${PYTHON_API_BASE_URL}/compare/two-images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.success) {
        setResult(response.data.comparison || null);
      } else {
        setError(response.data?.detail || 'ML node returned an invalid response.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Connection to ML hardware dropped. Check Python backend status.');
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setFileA(null);
    setFileB(null);
    setPreviewA('');
    setPreviewB('');
    setResult(null);
    setError('');
  };

  return (
    <div className="space-y-16 py-12">
      
      {/* Sandbox Header - Asymmetric Masterpiece */}
      <div className="flex flex-col lg:flex-row gap-16 items-start justify-between border-b border-white/[0.04] pb-16">
        <div className="space-y-8 max-w-3xl">
          <div className="flex items-center gap-4">
             <div className="h-[2px] w-12 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500">Experimental Neural Environment</span>
          </div>
          <h1 className="font-heading text-7xl font-black tracking-tighter text-white italic leading-[0.85] mb-6 uppercase">
            ML <br/> 
            <span className="text-indigo-500">Sandbox</span> <br/>
            <span className="text-white/10 text-5xl">Diagnostic Node</span>
          </h1>
          <p className="text-sm font-bold leading-relaxed text-slate-600 max-w-xl italic uppercase tracking-tight">
            Perceptual hash analysis and vector embedding comparison via DAPS neural engine. <br/>
            Running diagnostic: <span className="text-white underline decoration-indigo-500/40 decoration-w-[2px] underline-offset-8">COGNITION_LINK_VERIFIED</span>
          </p>
        </div>

        <div className="flex items-center gap-8 self-end">
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest leading-none">Compute Node</span>
              <span className="text-[11px] font-black text-white italic uppercase tracking-tighter">DIAG_ALPHA_O4</span>
           </div>
           <div className="h-14 w-14 flex items-center justify-center bg-indigo-600 text-white italic shadow-[0_0_20px_rgba(99,102,241,0.3)]">
             <Beaker size={28} strokeWidth={2.5} />
           </div>
        </div>
      </div>

      {/* Upload Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Node A Input */}
        <div className="module-card group relative p-10 space-y-8 border-white/[0.05] hover:border-white/[0.1]">
           <div className="absolute top-0 right-0 p-4 opacity-5 text-[8px] font-black text-white">INPUT_NODE_01</div>
           <div className="flex items-center gap-4 border-b border-white/[0.03] pb-6">
              <div className="h-8 w-8 flex items-center justify-center bg-white/[0.02] border border-white/[0.05] text-slate-700 italic">
                 <Binary size={16} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Dual-Input Source / A</span>
           </div>
           
           <div className="relative h-64 w-full bg-black/40 coordinates transition-all duration-700 border border-white/[0.03] overflow-hidden group-hover:bg-black/60">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileA} 
                id="fileA"
                className="hidden"
              />
              <label htmlFor="fileA" className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center p-6 text-center z-20">
                {previewA ? (
                  <img src={previewA} alt="Preview A" className="h-full w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <>
                    <Upload size={32} className="text-slate-800 group-hover:text-white transition-colors mb-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 group-hover:text-slate-500">Mount Object Alpha</span>
                  </>
                )}
              </label>
              <div className="hud-scan opacity-10" />
           </div>
        </div>

        {/* Node B Input */}
        <div className="module-card group relative p-10 space-y-8 border-white/[0.05] hover:border-white/[0.1]">
           <div className="absolute top-0 left-0 p-4 opacity-5 text-[8px] font-black text-white">INPUT_NODE_02</div>
           <div className="flex items-center justify-between border-b border-white/[0.03] pb-6">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 flex items-center justify-center bg-white/[0.02] border border-white/[0.05] text-slate-700 italic">
                   <Binary size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Dual-Input Source / B</span>
              </div>
           </div>
           
           <div className="relative h-64 w-full bg-black/40 coordinates transition-all duration-700 border border-white/[0.03] overflow-hidden group-hover:bg-black/60">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileB} 
                id="fileB"
                className="hidden"
              />
              <label htmlFor="fileB" className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center p-6 text-center z-20">
                {previewB ? (
                  <img src={previewB} alt="Preview B" className="h-full w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <>
                    <Upload size={32} className="text-slate-800 group-hover:text-white transition-colors mb-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 group-hover:text-slate-500">Mount Object Beta</span>
                  </>
                )}
              </label>
              <div className="hud-scan opacity-10" />
           </div>
        </div>
      </div>

      {/* Comparison Actions */}
      <div className="flex flex-wrap items-center justify-center gap-8 py-10 border-y border-white/[0.03] px-10 bg-white/[0.01]">
        <button
          onClick={handleCompare}
          disabled={loading || !fileA || !fileB}
          className="btn-cyber min-w-[320px] !bg-indigo-600 !text-white hover:!bg-white hover:!text-black"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} strokeWidth={3} />}
          <span>Initialize Analysis</span>
          <ArrowRight size={18} />
          <div className="btn-cyber-shine" />
        </button>

        <button
          onClick={clear}
          className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.5em] text-slate-700 hover:text-white hover:bg-white/5 transition-all italic flex items-center gap-3"
        >
          <X size={16} />
          <span>Reset manifest</span>
        </button>
      </div>

      {/* Result Display Overlay */}
      {(result || error || loading) && (
        <div className="module-card p-12 bg-indigo-900/5 border-indigo-500/10 animate-in fade-in slide-in-from-bottom-10 duration-700 overflow-hidden relative">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-indigo-600/50 to-transparent" />
          
          {loading ? (
             <div className="flex flex-col items-center justify-center py-24 gap-8">
                <div className="relative">
                   <div className="h-24 w-24 border-4 border-white/5 border-t-indigo-600 animate-spin" />
                   <Cpu size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500 opacity-50" />
                </div>
                <div className="text-center space-y-4">
                  <span className="text-[12px] font-black uppercase tracking-[0.8em] text-white italic animate-pulse">Running Neural Diagnostics...</span>
                  <p className="text-[8px] font-black text-slate-800 uppercase tracking-widest">Processing vector cross-entropy and p-hash distance</p>
                </div>
             </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-red-500 gap-6">
               <Zap size={48} className="opacity-30 animate-pulse" />
               <p className="text-xl font-black uppercase italic tracking-widest">{error}</p>
            </div>
          ) : (
            <div className="space-y-12">
               <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/[0.04] pb-10">
                  <div className="flex items-center gap-6">
                     <div className="h-10 w-10 flex items-center justify-center bg-indigo-600 text-white italic">
                        <Activity size={20} />
                     </div>
                     <div>
                        <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">Diagnostic Result</h2>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 mt-2 block">Checksum Verification Sequence Complete</span>
                     </div>
                  </div>
                  
                  <div className={`px-10 py-5 text-[11px] font-black uppercase tracking-[0.4em] italic border ${result.match ? 'bg-red-600/10 border-red-500/30 text-red-500' : 'bg-emerald-600/10 border-emerald-500/30 text-emerald-500'}`}>
                     {result.match ? '!! BREACH DETECTED !!' : 'SECURE_MANIFEST_UNIQUE'}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="module-card p-10 bg-black/40 border-white/[0.03] space-y-6">
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">Cosine Similarity Vector</span>
                     <p className="text-6xl font-black italic tracking-tighter text-indigo-500 leading-none">
                        {(result.cosine_similarity * 100).toFixed(2)}%
                     </p>
                     <div className="h-[2px] w-full bg-white/5 relative">
                        <div className="absolute top-0 left-0 h-full bg-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: `${result.cosine_similarity * 100}%` }} />
                     </div>
                  </div>
                  
                  <div className="module-card p-10 bg-black/40 border-white/[0.03] space-y-6">
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">Hamming Distance Hash</span>
                     <p className="text-6xl font-black italic tracking-tighter text-[#cffd01] leading-none">
                        {result.hamming_distance}
                     </p>
                     <div className="flex items-center gap-4 text-[10px] font-black text-slate-800 uppercase italic">
                        <Shield size={12} />
                        Threshold: {result.thresholds?.hamming_threshold || 12}
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-white/[0.02] border border-white/[0.03] rounded-sm text-[11px] font-bold leading-relaxed text-slate-600 italic uppercase">
                  Assessment: Dual-node input indicates {result.match ? 'substantial visual overlap exceeding security thresholds. Potential copyright violation identified within neural embedding.' : 'unique visual signatures beyond perceptual duplicate thresholds. Objects are considered distinct for enforcement purposes.'}
               </div>

               <div className="absolute bottom-4 right-6 text-[80px] font-black text-white/[0.01] pointer-events-none select-none uppercase italic leading-none">
                  DONE
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MLSandbox;
