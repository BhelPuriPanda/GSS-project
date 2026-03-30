import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, AlertCircle, Shield, Fingerprint, Terminal, Crosshair, ArrowRight, Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const result = await register({ name, email, password });
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
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#05070a] selection:bg-[#cffd01]/30 selection:text-white coordinates">
      
      {/* Auth Interface - Asymmetric Left */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-20 relative order-2 lg:order-1">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[440px]"
        >
          <div className="mb-12 space-y-4">
             <motion.div variants={itemVariants} className="flex items-center gap-3">
               <div className="h-1.5 w-12 bg-[#cffd01]" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Clearance Enrollment</span>
             </motion.div>
             <motion.h3 variants={itemVariants} className="font-heading text-5xl font-black italic tracking-tighter text-white uppercase">
               Request <br/> <span className="text-[#cffd01]">Access</span>
             </motion.h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.div variants={itemVariants} className="space-y-3 group">
              <label className="text-[10px] font-black uppercase tracking-[0.4rem] text-slate-600 italic block pl-1 transition-colors group-focus-within:text-[#cffd01]">Agent Alias / Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="AGENT SMITH"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-white/[0.02] border border-white/5 py-5 pl-14 pr-6 text-sm font-bold text-white transition-all focus:bg-white/[0.05] focus:ring-0 focus:border-[#cffd01]/30 placeholder:text-slate-800 placeholder:italic italic"
                />
                <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-[#cffd01] transition-colors" />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3 group">
              <label className="text-[10px] font-black uppercase tracking-[0.4rem] text-slate-600 italic block pl-1 transition-colors group-focus-within:text-[#cffd01]">Comm Terminal / Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="AGENT_VAULT_REF"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/[0.02] border border-white/5 py-5 pl-14 pr-6 text-sm font-bold text-white transition-all focus:bg-white/[0.05] focus:ring-0 focus:border-[#cffd01]/30 placeholder:text-slate-800 placeholder:italic italic"
                />
                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-[#cffd01] transition-colors" />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3 group">
              <label className="text-[10px] font-black uppercase tracking-[0.4rem] text-slate-600 italic block pl-1 transition-colors group-focus-within:text-[#cffd01]">Secure Key</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/[0.02] border border-white/5 py-5 pl-14 pr-6 text-sm font-bold text-white transition-all focus:bg-white/[0.05] focus:ring-0 focus:border-[#cffd01]/30 placeholder:text-slate-800 placeholder:italic italic"
                />
                <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-[#cffd01] transition-colors" />
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
                  <p className="font-black uppercase tracking-widest leading-none">Enrollment Aborted</p>
                  <p className="text-slate-600">Verification sequence returned checksum error.</p>
                </div>
              </motion.div>
            )}

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isSubmitting}
              className="btn-cyber w-full italic bg-[#cffd01] text-black hover:bg-white"
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin text-black" />
              ) : (
                <>
                  <span>Initialize Enrollment</span>
                  <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
              <div className="btn-cyber-shine" />
            </motion.button>
          </form>

          <motion.div variants={itemVariants} className="mt-16 text-center text-[10px] border-t border-white/5 pt-12">
            <span className="text-slate-600 font-bold uppercase tracking-[0.2em] leading-relaxed italic">Already have clearance?</span>{' '}
            <Link to="/login" className="font-black text-[#cffd01] hover:text-white transition-colors ml-4 uppercase tracking-[0.3em] italic underline decoration-[#cffd01]/30 underline-offset-[12px]">
              Access Vault
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Visual Identity Section - Asymmetric Right */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-20 border-l border-white/5 relative bg-black/40 order-1 lg:order-2">
        <div className="absolute inset-0 scan-line opacity-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-end gap-4"
        >
          <div className="flex flex-col items-end">
            <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase leading-none">DAPS</h1>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#cffd01]">ENROLLMENT NODE</span>
          </div>
          <div className="h-10 w-10 flex items-center justify-center bg-[#cffd01] text-black italic">
            <Crosshair size={20} strokeWidth={3} />
          </div>
        </motion.div>

        <div className="space-y-8 relative z-10 text-right">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h2 className="font-heading text-8xl font-black tracking-tighter text-white italic leading-[0.85] uppercase mb-8">
              New <br/> 
              <span className="text-white/20">Clearance</span> <br/>
              Manifest
            </h2>
            <p className="max-w-md ml-auto text-sm font-medium leading-relaxed text-slate-500 italic">
              Generating secure identity hash for global enforcement access. <br/>
              Authority level 1 encryption standard applied.
            </p>
          </motion.div>
          
          <div className="flex items-center justify-end gap-12 pt-10 border-t border-white/5">
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
          className="text-[120px] font-black italic text-white/[0.02] pointer-events-none select-none uppercase tracking-tighter absolute -left-20 bottom-10"
        >
          ENROLL
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
