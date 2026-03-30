import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, Loader2, Shield, Fingerprint, Terminal, Activity, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#05070a] selection:bg-indigo-500/30 selection:text-white coordinates">
      
      {/* Visual Identity Section - Asymmetric Left */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-20 border-r border-white/5 relative bg-black/40">
        <div className="absolute inset-0 scan-line opacity-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="h-10 w-10 flex items-center justify-center bg-[#cffd01] text-black italic">
            <Terminal size={20} strokeWidth={3} />
          </div>
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase">DAPS</h1>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#cffd01]">Security Protocol 0.77.x</span>
          </div>
        </motion.div>

        <div className="space-y-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className="font-heading text-8xl font-black tracking-tighter text-white italic leading-[0.85] uppercase mb-8">
              Vault <br/> 
              <span className="text-white/20">Access</span> <br/>
              Node
            </h2>
            <p className="max-w-md text-sm font-medium leading-relaxed text-slate-500 italic">
              Authorized entrance to the Digital Asset Protection System. <br/>
              Monitoring for unauthorized distribution remains active.
            </p>
          </motion.div>
          
          <div className="flex items-center gap-12 pt-10 border-t border-white/5">
            <div className="flex flex-col gap-2">
               <span className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.3em]">Network status</span>
               <span className="flex items-center gap-2 text-[10px] font-black text-[#cffd01] uppercase italic">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#cffd01] animate-pulse" />
                  Stable / Encrypted
               </span>
            </div>
            <div className="flex flex-col gap-2">
               <span className="text-[8px] font-bold text-slate-700 uppercase tracking-[0.3em]">Surveillance</span>
               <span className="flex items-center gap-2 text-[10px] font-black text-white uppercase italic">
                  Node 04 Active
               </span>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1 }}
          className="text-[120px] font-black italic text-white/[0.02] pointer-events-none select-none uppercase tracking-tighter absolute -right-20 bottom-10"
        >
          LOGIN
        </motion.div>
      </div>

      {/* Auth Interface - Asymmetric Right */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-20 relative">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[440px]"
        >
          <div className="mb-12 space-y-4">
             <motion.div variants={itemVariants} className="flex items-center gap-3">
               <div className="h-1.5 w-12 bg-indigo-600" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Verification Interface</span>
             </motion.div>
             <motion.h3 variants={itemVariants} className="font-heading text-5xl font-black italic tracking-tighter text-white uppercase">
               Initialize <br/> <span className="text-indigo-600">Sync</span>
             </motion.h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <motion.div variants={itemVariants} className="space-y-3 group">
              <label className="text-[10px] font-black uppercase tracking-[0.4rem] text-slate-600 italic block pl-1 transition-colors group-focus-within:text-indigo-400">Registry ID / Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="INVESTIGATOR_REF"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/[0.02] border border-white/5 py-5 pl-14 pr-6 text-sm font-bold text-white transition-all focus:bg-white/[0.05] focus:ring-0 focus:border-indigo-600/30 placeholder:text-slate-800 placeholder:italic italic"
                />
                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-400 transition-colors" />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3 group">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.4rem] text-slate-600 italic block transition-colors group-focus-within:text-indigo-400">Security Key</label>
                <Link to="#" className="text-[9px] font-bold uppercase tracking-widest text-slate-800 hover:text-indigo-400 transition-colors">Emergency Recover</Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/[0.02] border border-white/5 py-5 pl-14 pr-6 text-sm font-bold text-white transition-all focus:bg-white/[0.05] focus:ring-0 focus:border-indigo-600/30 placeholder:text-slate-800 placeholder:italic italic"
                />
                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-400 transition-colors" />
              </div>
            </motion.div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 bg-red-600/5 border border-red-600/10 p-6 text-[11px] font-bold text-red-500 italic"
              >
                <AlertCircle size={20} className="shrink-0" />
                <div className="space-y-1">
                  <p className="font-black uppercase tracking-widest leading-none">Access Rejected</p>
                  <p className="text-slate-600">Verification sequence returned checksum error.</p>
                </div>
              </motion.div>
            )}

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isSubmitting}
              className="btn-cyber w-full italic"
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin text-black" />
              ) : (
                <>
                  <span>Initialize Protocol</span>
                  <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
              <div className="btn-cyber-shine" />
            </motion.button>
          </form>

          <motion.div variants={itemVariants} className="mt-16 text-center text-[10px] border-t border-white/5 pt-12">
            <span className="text-slate-600 font-bold uppercase tracking-[0.2em] leading-relaxed italic">No clearance level detected?</span>{' '}
            <Link to="/register" className="font-black text-indigo-400 hover:text-[#cffd01] transition-colors ml-4 uppercase tracking-[0.3em] italic underline decoration-indigo-600/30 underline-offset-[12px]">
              Enroll Sequence
            </Link>
          </motion.div>
        </motion.div>

        {/* Branding Footer Mobile */}
        <div className="absolute bottom-8 left-10 lg:hidden">
           <span className="text-[10px] font-black text-white italic tracking-tighter">DAPS / V0.77</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
