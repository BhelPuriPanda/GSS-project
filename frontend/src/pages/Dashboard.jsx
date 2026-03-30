import { useState, useEffect } from 'react';
import { Plus, Shield, Globe, Lock, PlusCircle, AlertCircle, Search, Terminal, Cpu, Activity, Server, Zap } from 'lucide-react';
import mediaService from '../services/mediaService';
import MediaCard from '../components/MediaCard';
import StatCard from '../components/StatCard';
import UploadModal from '../components/UploadModal';

const Dashboard = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const data = await mediaService.getAllMedia();
      if (data.status === 'success') {
        setMedia(data.data.media);
      }
    } catch (err) {
      setError('System integrity check failed: Unable to synchronize assets.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to terminate protection for this asset?')) {
      try {
        await mediaService.deleteMedia(id);
        setMedia((media || []).filter(item => item._id !== id));
      } catch (err) {
        alert('Action failed: Authority level insufficient or connection lost.');
      }
    }
  };

  const filteredMedia = (media || []).filter(item => 
    (item?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item?.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { title: 'Secured Assets', value: (media?.length || 0), icon: <Shield size={18} />, color: 'text-[#cffd01]', trend: '+12' },
    { title: 'Active Monitors', value: (media?.length || 0) * 4, icon: <Globe size={18} />, color: 'text-indigo-400', trend: '+8' },
    { title: 'Safe Protocols', value: '100%', icon: <Lock size={18} />, color: 'text-emerald-500', trend: 'STABLE' },
  ];

  return (
    <div className="space-y-24 py-12">
      
      {/* Strategic Command Header - Asymmetric Layout */}
      <div className="flex flex-col lg:flex-row gap-16 items-start justify-between border-b border-white/[0.04] pb-20">
        <div className="space-y-10 max-w-3xl">
          <div className="flex items-center gap-4">
             <div className="h-[2px] w-16 bg-[#cffd01]" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#cffd01] animate-pulse">Master Surveillance Console</span>
          </div>
          <h1 className="font-heading text-8xl font-black tracking-tighter text-white italic leading-[0.8] mb-6 uppercase">
            Global <br/> 
            <span className="text-[#cffd01]">Registry</span> <br/>
            <span className="text-white/10">Protocol</span>
          </h1>
          <p className="text-base font-bold leading-relaxed text-slate-600 max-w-xl italic uppercase tracking-tight">
            Real-time enforcement node monitoring cross-platform distribution of protected assets. <br/>
            Status: <span className="text-white underline decoration-[#cffd01]/40 decoration-w-[2px] underline-offset-8">NODE_ALPHA_STABLE</span>
          </p>
        </div>

        {/* Tactical Search & Action HUD */}
        <div className="flex flex-col sm:flex-row items-stretch gap-6 w-full lg:w-auto">
          <div className="relative group w-full lg:w-80">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 transition-colors group-focus-within:text-[#cffd01]" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH REGISTRY..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-20 w-full rounded-none bg-white/[0.02] border border-white/[0.04] pl-16 pr-8 text-[12px] font-black uppercase tracking-[0.3em] text-white transition-all focus:bg-white/[0.05] focus:ring-0 focus:border-[#cffd01]/40 placeholder:text-slate-800 placeholder:italic italic"
            />
          </div>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="btn-cyber min-w-[280px]"
          >
            <Plus size={20} strokeWidth={3} />
            <span>Mount Core</span>
            <div className="btn-cyber-shine" />
          </button>
        </div>
      </div>

      {/* System Readout Bar - Hardware Style Stats */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 bg-white/[0.01] border-y border-white/[0.03] p-10 relative overflow-hidden">
        <div className="absolute inset-0 coordinates opacity-30" />
        {stats.map((stat, i) => (
          <div key={i} className="relative z-10 flex items-start gap-8 group">
             <div className="h-14 w-14 flex items-center justify-center bg-white/[0.02] border border-white/[0.05] text-slate-700 group-hover:text-[#cffd01] group-hover:border-[#cffd01]/20 transition-all duration-700 italic">
                {stat.icon}
             </div>
             <div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-700 mb-2 block">{stat.title}</span>
                <span className="text-5xl font-black italic tracking-tighter text-white uppercase group-hover:text-[#cffd01] transition-colors">{stat.value}</span>
                <div className="flex items-center gap-3 mt-4">
                   <div className="h-[1px] w-8 bg-white/10" />
                   <span className="text-[8px] font-bold text-[#cffd01] tracking-widest">{stat.trend} LOGLINE</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Masterpiece Gallery - Asymmetric Grid Presentation */}
      <div className="space-y-20">
        <div className="flex items-center justify-between border-b border-white/[0.03] pb-8">
          <div className="flex items-center gap-6">
            <div className="flex h-12 w-12 items-center justify-center bg-white/[0.01] border border-white/[0.04] italic">
              <Activity size={24} className="text-[#cffd01]" />
            </div>
            <div>
              <h3 className="font-heading text-3xl font-black italic tracking-tighter text-white uppercase">Protected Modules</h3>
              <p className="mono text-[10px] font-bold text-slate-700 uppercase tracking-[0.4em] leading-none mt-2">
                ACTIVE_NODE: GSX-HQ / {(media?.length || 0)} ENTITIES
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex h-[500px] flex-col items-center justify-center p-20 coordinates">
            <div className="relative mb-10">
              <div className="h-28 w-28 animate-spin border-4 border-white/5 border-t-[#cffd01] shadow-[0_0_50px_rgba(207,253,1,0.1)]" />
              <Terminal size={40} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#cffd01] opacity-50" />
            </div>
            <p className="text-[12px] font-black uppercase tracking-[0.6em] text-slate-800 animate-pulse italic">Negotiating Node Handshake...</p>
          </div>
        ) : error ? (
          <div className="module-card flex h-96 flex-col items-center justify-center p-16 text-red-600 border-red-500/10 shadow-2xl shadow-red-500/10 italic">
            <Zap size={64} className="mb-10 opacity-30 animate-pulse" />
            <div className="text-center">
              <p className="font-heading text-3xl font-black mb-10 uppercase italic tracking-tighter">{error}</p>
              <button 
                onClick={fetchMedia} 
                className="btn-cyber-outline w-full sm:w-auto"
              >
                <span>Initialize Emergency Resync</span>
              </button>
            </div>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="module-card flex flex-col items-center justify-center py-56 text-center coordinates border-white/5 bg-transparent italic">
            <div className="mb-12 flex h-36 w-36 items-center justify-center bg-white/[0.01] border border-white/[0.04] italic text-slate-800 shadow-inner">
              <Server size={72} strokeWidth={0.5} />
            </div>
            <h2 className="font-heading text-5xl font-black text-white italic tracking-tighter uppercase mb-6">Database Offline</h2>
            <p className="max-w-md text-[13px] font-black leading-relaxed text-slate-800 uppercase tracking-[0.4em]">
              {searchTerm 
                ? `NO MATCH FOR SEQUENCE: "${searchTerm}"` 
                : "Initialize surveillance node by mounting first asset core protocol."}
            </p>
            {!searchTerm && (
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="btn-cyber mt-16"
              >
                <span>Deploy Module</span>
                <div className="btn-cyber-shine" />
              </button>
            )}
          </div>
        ) : (
          /* Asymmetric Gallery Grid - Custom Spans */
          <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-12 md:gap-x-16">
            {filteredMedia.map((item, index) => {
              // Custom pattern: 1st card spans 5 cols, 2nd spans 7 cols, etc.
              const spans = [
                 'lg:col-span-12', 'lg:col-span-12', 'lg:col-span-12' // Initial list mode for classiness
              ];
              // Reset for gallery mode after first 3
              const gridSpan = index < 2 ? 'lg:col-span-6' : index % 3 === 0 ? 'lg:col-span-8' : 'lg:col-span-4';
              
              return (
                <MediaCard 
                  key={item._id} 
                  media={item} 
                  onDelete={handleDelete} 
                  className={gridSpan}
                />
              );
            })}
          </div>
        )}
      </div>

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onUploadSuccess={fetchMedia} 
      />
    </div>
  );
};

export default Dashboard;
