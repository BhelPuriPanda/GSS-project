import { Search, Bell, User, LayoutDashboard, ShieldAlert, Settings, LogOut, Terminal, Activity, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.04] bg-[#030508]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-24 max-w-[1600px] items-center justify-between px-10 relative">
        
        {/* Identity Module - Asymmetric Left */}
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/')}>
             <div className="h-10 w-10 flex items-center justify-center bg-[#cffd01] text-black italic transition-transform group-hover:scale-110">
               <Terminal size={20} strokeWidth={3} />
             </div>
             <div className="flex flex-col">
               <span className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">DAPS</span>
               <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-[#cffd01] mt-1">VER_0.77.x</span>
             </div>
           </div>

           {/* Heartbeat Monitor - Masterpiece Detail */}
           <div className="hidden xl:flex items-center gap-6 border-l border-white/5 pl-8">
              <div className="flex flex-col gap-1">
                 <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest leading-none">Node Latency</span>
                 <div className="flex items-center gap-2">
                    <Activity size={10} className="text-[#cffd01] animate-pulse" />
                    <span className="mono text-[10px] font-black text-white italic">4.2ms</span>
                 </div>
              </div>
              <div className="flex flex-col gap-1">
                 <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest leading-none">Security Lvl</span>
                 <span className="text-[10px] font-black text-indigo-500 uppercase italic">ALPHA_CLEARANCE</span>
              </div>
           </div>
        </div>

        {/* Tactical Navigation Interface */}
        <div className="flex items-center gap-10">
          <nav className="hidden md:flex items-center gap-1 border-r border-white/5 pr-10">
            {[
              { path: '/', label: 'Registry', icon: <LayoutDashboard size={14} /> },
              { path: '/violations', label: 'Intelligence', icon: <ShieldAlert size={14} /> },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative group px-6 py-2.5 flex items-center gap-3 transition-all duration-500 ${
                  location.pathname === item.path ? 'text-white' : 'text-slate-600 hover:text-white'
                }`}
              >
                <span className={`transition-transform duration-500 ${location.pathname === item.path ? 'scale-110 text-[#cffd01]' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">{item.label}</span>
                {location.pathname === item.path && (
                  <motion.div layoutId="nav-active" className="absolute -bottom-[25px] left-0 right-0 h-[2px] bg-[#cffd01] shadow-[0_0_15px_rgba(207,253,1,0.5)]" />
                )}
              </button>
            ))}
          </nav>

          {/* User Module - Hardware Style */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-[10px] font-black text-white italic tracking-tight uppercase">{user?.name || 'OPERATOR'}</span>
              <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{user?.email || 'OFFLINE'}</span>
            </div>
            
            <div className="relative group">
               <button 
                 className="flex h-12 w-12 items-center justify-center bg-white/[0.02] border border-white/[0.05] text-slate-500 hover:text-[#cffd01] hover:border-[#cffd01]/30 transition-all active:scale-95"
                 style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }}
               >
                 <User size={18} strokeWidth={2.5} />
               </button>
               
               {/* Identity Dropdown - Masterpiece Noir */}
               <div className="absolute right-0 top-full mt-4 w-64 bg-[#0a0d12] border border-white/[0.05] p-2 opacity-0 pointer-events-none translate-y-4 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 transition-all duration-500 shadow-2xl z-[60]">
                  <div className="p-4 border-b border-white/[0.03] space-y-1">
                     <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Clearance Node</span>
                     <p className="text-[11px] font-bold text-white uppercase italic truncate">{user?.name}</p>
                  </div>
                  <div className="py-2">
                     <button className="flex w-full items-center gap-4 px-4 py-3 text-[10px] font-black text-slate-600 hover:text-[#cffd01] hover:bg-white/[0.02] transition-colors uppercase tracking-widest">
                        <Settings size={14} />
                        <span>Protocol Config</span>
                     </button>
                     <button 
                       onClick={handleLogout}
                       className="flex w-full items-center gap-4 px-4 py-3 text-[10px] font-black text-red-600 hover:text-white hover:bg-red-600 transition-all uppercase tracking-widest"
                     >
                        <LogOut size={14} />
                        <span>Terminate Link</span>
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Global HUD Scanning Sweep */}
        <div className="absolute inset-0 scan-line opacity-[0.02] pointer-events-none" />
      </div>
    </header>
  );
};

export default Header;
