import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LayoutDashboard, AlertOctagon, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Violations', path: '/violations', icon: <AlertOctagon size={18} /> },
  ];

  return (
    <div className="sticky top-4 z-50 flex justify-center px-4">
      <nav className="glass glass-pill flex w-full max-w-5xl items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-indigo-500/20">
            <Shield size={20} fill="currentColor" fillOpacity={0.2} />
          </div>
          <span className="font-heading text-xl font-extrabold tracking-tighter">DAPS</span>
        </div>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                location.pathname === link.path 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-text-muted hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden h-10 items-center gap-2 rounded-full bg-white/5 pl-2 pr-4 md:flex">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-text-muted">
              <User size={14} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Admin Panel</span>
          </div>
          
          <button
            onClick={logout}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-500 transition-all hover:bg-red-500 hover:text-white"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
