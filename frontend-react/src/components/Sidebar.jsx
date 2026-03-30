import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  ShieldAlert, 
  Settings, 
  LogOut, 
  X, 
  Cpu, 
  Globe, 
  Activity,
  Terminal,
  Crosshair,
  Beaker
} from 'lucide-react';
import { useEffect, useState } from 'react';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const [time, setTime] = useState(new Date().toUTCString());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { name: 'Core Registry', path: '/dashboard', icon: <Cpu size={18} /> },
    { name: 'Intelligence', path: '/violations', icon: <ShieldAlert size={18} /> },
    { name: 'ML Sandbox', path: '/sandbox', icon: <Beaker size={18} /> },
    { name: 'Node Config', path: '/settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-[60] w-80 transform border-r border-white/[0.04] bg-[#030508] transition-all duration-700 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full shadow-[20px_0_60px_rgba(0,0,0,0.8)]'}`}>
      <div className="flex h-full flex-col p-8 coordinates relative">
        <div className="hud-scan opacity-10" />
        
        {/* Mobile Close Button */}
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-700 hover:text-white md:hidden z-20">
          <X size={24} />
        </button>

        {/* Brand Module - Masterpiece Header */}
        <div className="mb-16 mt-6 px-2">
          <div className="flex items-center gap-5 group cursor-pointer">
            <div className="relative flex h-12 w-12 items-center justify-center bg-[#cffd01] text-black italic transition-transform group-hover:scale-110">
              <Terminal size={24} strokeWidth={3} />
              <div className="absolute -right-2 -top-2 h-4 w-4 border-4 border-[#030508] bg-red-600 animate-blink" />
            </div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter text-white leading-none uppercase">DAPS</h1>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#cffd01] mt-2 block">NODE_ALPHA_O4</span>
            </div>
          </div>
        </div>

        {/* Live HUD Metadata - Masterpiece Detail */}
        <div className="mb-12 space-y-6 bg-white/[0.01] border border-white/[0.05] p-6 mono relative group">
          <div className="absolute top-0 right-0 p-2 opacity-5 text-[8px] font-black text-white">HUD_V3</div>
          <div className="space-y-4">
             <div className="flex items-center justify-between">
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">Sync_Time</span>
               <span className="text-[10px] font-black text-white italic">{time}</span>
             </div>
             <div className="flex items-center justify-between">
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">Node_Status</span>
               <span className="flex items-center gap-2.5 text-[10px] font-black text-[#cffd01] italic">
                 <div className="h-1.5 w-1.5 rounded-full bg-[#cffd01] animate-pulse" />
                 LINKED
               </span>
             </div>
             <div className="flex items-center justify-between border-t border-white/[0.04] pt-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">Identifier</span>
                <span className="text-[10px] font-black text-white uppercase italic truncate max-w-[120px]">{user?.name || 'OPERATOR'}</span>
             </div>
          </div>
        </div>

        {/* Strategic Navigation */}
        <nav className="flex-1 space-y-3">
          <p className="mb-6 ml-2 text-[10px] font-black uppercase tracking-[0.5em] text-slate-800 italic">Primary Uplinks</p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 768 && onClose()}
              className={({ isActive }) => `
                group relative flex items-center justify-between px-6 py-5 transition-all duration-500
                ${isActive ? 'bg-[#cffd01] text-black italic' : 'text-slate-600 hover:bg-white/[0.02] hover:text-white'}
              `}
              style={({ isActive }) => ({
                clipPath: isActive ? 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' : 'none'
              })}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-5">
                    <span className={`transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                    <span className="text-[12px] font-black uppercase tracking-[0.3em] font-heading">{item.name}</span>
                  </div>
                  <Crosshair size={14} className={`opacity-0 transition-opacity group-hover:opacity-100 duration-500`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Industrial Exit Control */}
        <div className="mt-auto pt-10 border-t border-white/[0.04]">
          <button
            onClick={logout}
            className="group flex w-full items-center justify-between px-6 py-6 text-slate-700 transition-all hover:bg-red-600 hover:text-white outline-none italic"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 65%, 90% 100%, 0 100%)' }}
          >
            <div className="flex items-center gap-5">
              <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
              <span className="text-[12px] font-black uppercase tracking-[0.3em]">Terminate Link</span>
            </div>
            <Activity size={16} className="opacity-20 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
