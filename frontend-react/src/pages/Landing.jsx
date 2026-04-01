import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Globe, Lock, Cpu, Activity, ArrowRight, Plus, Minus, Terminal, Database, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

// Interactive Mouse-Responsive Background Component
const TacticalGrid = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const gridRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={gridRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Coordinate Grid */}
      <div 
        className="absolute inset-0 coordinates opacity-[0.15]" 
        style={{
          transform: `translate(${(mousePos.x - window.innerWidth / 2) * 0.02}px, ${(mousePos.y - window.innerHeight / 2) * 0.02}px)`
        }}
      />
      
      {/* Interactive Scan Pulse following mouse */}
      <div 
        className="absolute h-[600px] w-[600px] rounded-full bg-[#cffd01]/[0.03] blur-[120px] transition-all duration-300 ease-out z-10"
        style={{
          left: mousePos.x - 300,
          top: mousePos.y - 300
        }}
      />

      <div className="hud-scan" />
      
      {/* Floating Mechanical Coordinates */}
      <div className="absolute top-10 left-10 mono text-[9px] text-[#cffd01]/20 uppercase tracking-[0.4em] select-none">
        X: {mousePos.x.toFixed(0)} <br/> Y: {mousePos.y.toFixed(0)} <br/> NODE_ALPHA_SURVEILLANCE
      </div>
    </div>
  );
};

const Landing = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const heroY = useTransform(springScroll, [0, 0.2], [0, -100]);
  const heroOpacity = useTransform(springScroll, [0, 0.15], [1, 0]);

  const features = [
    { title: "Tactical Visual Fingerprinting", icon: <Activity />, detail: "ENFORCEMENT_READY" },
    { title: "Neural Takedown Protocols", icon: <Zap />, detail: "AUTO_NEUTRALIZE" },
    { title: "Global Distribution Matrix", icon: <Globe />, detail: "SYNC_LATENCY: 12ms" },
    { title: "Authority Encryption", icon: <Lock />, detail: "RSA_OBSIDIAN" }
  ];

  const faqs = [
    { q: "HOW DOES DAPS INITIALIZE PROTECTION?", a: "Upon core mounting, the system generates a unique visual fingerprint for each asset. This signature is propagated through the global surveillance matrix." },
    { q: "WHAT IS THE TYPICAL RESPONSE LATENCY?", a: "Violation detection occurs within 120ms of distribution. Automated takedowns initialize within 12 seconds." },
    { q: "CAN NODES BE DEPLOYED PRIVATELY?", a: "Yes. DAPS supports private node infrastructure for high-security industrial deployments." }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030508] relative overflow-x-hidden selection:bg-[#cffd01] selection:text-black">
      <TacticalGrid />
      
      {/* Kinetic Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-8 z-10">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="text-center space-y-12 w-full mx-auto"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center gap-6"
          >
             <div className="h-[2px] w-24 bg-[#cffd01]" />
             <span className="text-[10px] font-black uppercase tracking-[0.8em] text-[#cffd01] animate-pulse">Global Security Standard Protocol</span>
          </motion.div>

          {/* Massive Kinetic Typography */}
          <div className="relative group">
             <motion.h1 
                initial={{ letterSpacing: "1em", opacity: 0 }}
                animate={{ letterSpacing: "-0.05em", opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="font-heading text-[10vw] lg:text-[9vw] font-black italic tracking-tighter text-white leading-[0.7] uppercase transition-all duration-700"
             >
                Global <br/>
                <span className="text-[#cffd01]">Enfo</span>rcement
             </motion.h1>
             
             {/* Dynamic Data Overlay */}
             <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#cffd01]/10 -translate-y-1/2 z-[-1]" />
             <div className="absolute top-[30%] right-10 mono text-[8px] text-slate-800 tracking-[0.5em] hidden lg:block select-none transform rotate-90">
                AUTHORITY_LEVEL_ALPHA_SECURED
             </div>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="max-w-2xl mx-auto text-xl font-bold italic leading-relaxed text-slate-600 uppercase tracking-tight"
          >
            Digital asset protection redefined for the industrial grid. 
            Automated monitoring, tactical neutralization, and global enforcement.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="flex flex-wrap items-center justify-center gap-8 pt-10"
          >
             <Link to="/#/register" className="btn-cyber">
                <span>Access Command Node</span>
                <ArrowRight size={20} />
                <div className="btn-cyber-shine" />
             </Link>
             <Link to="/#/login" className="btn-cyber-outline">
                <span>Terminal Access</span>
                <div className="btn-cyber-shine" />
             </Link>
          </motion.div>
        </motion.div>

        {/* Floating Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-12 flex items-center gap-6"
        >
           <div className="h-10 w-[1px] bg-white/20" />
           <span className="mono text-[8px] text-slate-700 uppercase tracking-[0.4em]">Initialize Scroll Handshake</span>
        </motion.div>
      </section>

      {/* Mechanical Feature Reveal Section */}
      <section className="relative py-40 px-8 max-w-[1400px] mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="sticky top-40 space-y-12">
            <div className="flex items-center gap-6">
              <div className="h-10 w-10 flex items-center justify-center bg-white/[0.01] border border-white/[0.04] italic">
                <Cpu size={20} className="text-[#cffd01]" />
              </div>
              <h2 className="font-heading text-6xl font-black italic tracking-tighter text-white uppercase leading-none">Tactical <br/> Node Core</h2>
            </div>
            <p className="max-w-sm text-base font-bold italic text-slate-600 uppercase tracking-tight leading-relaxed">
              DAPS is not a platform; it is a global enforcement node designed to maintain the integrity of protected assets.
            </p>
          </div>

          <div className="space-y-12">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="module-card p-12 group hover:bg-[#cffd01]/5"
              >
                <div className="brackets" />
                <div className="flex items-start justify-between mb-10">
                   <div className="h-16 w-16 flex items-center justify-center bg-white/[0.02] border border-white/[0.05] text-[#cffd01] group-hover:scale-110 transition-transform">
                      {feature.icon}
                   </div>
                   <span className="mono text-[8px] text-slate-800 tracking-[0.5em] group-hover:text-[#cffd01]/40">SEC: LEVEL_{i+1}</span>
                </div>
                <h3 className="font-heading text-3xl font-black italic tracking-tighter text-white uppercase mb-4">{feature.title}</h3>
                <p className="mono text-[10px] text-[#cffd01] tracking-[0.4em] uppercase">{feature.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Integrity Section */}
      <section className="relative py-40 px-8 z-10 border-t border-white/[0.03]">
        <div className="max-w-4xl mx-auto space-y-24">
          <div className="text-center">
             <span className="mono text-[10px] text-[#cffd01] tracking-[0.6em] animate-pulse">INTEGRITY_CHECK: PASS</span>
             <h2 className="font-heading text-7xl font-black italic tracking-tighter text-white uppercase mt-10">Deployment FAQ</h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="group cursor-pointer" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="flex items-center justify-between py-10 border-b border-white/[0.05] group-hover:border-[#cffd01]/20 transition-all">
                  <div className="flex items-center gap-10">
                    <span className="mono text-[9px] text-slate-800 italic">0{i+1}//</span>
                    <h4 className="font-heading text-2xl font-black italic tracking-tighter text-white uppercase group-hover:text-[#cffd01] transition-colors">{faq.q}</h4>
                  </div>
                  <motion.div 
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    className="text-[#cffd01]"
                  >
                    <Plus size={24} />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="py-10 text-[15px] font-bold italic text-slate-600 uppercase tracking-tight leading-relaxed pl-24 border-l border-[#cffd01]/10">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Data Readout Footer */}
      <footer className="relative py-20 px-8 z-10 border-t border-white/[0.03] overflow-hidden">
        <div className="absolute inset-0 coordinates opacity-10" />
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
           <div className="flex items-center gap-4">
              <span className="font-heading text-4xl font-black italic tracking-tighter text-white uppercase">DAPS<span className="text-[#cffd01] opacity-40 ml-1">ENFORCER</span></span>
              <div className="h-6 w-[1px] bg-white/10 hidden md:block" />
              <span className="mono text-[8px] text-slate-800 tracking-[0.5em] hidden lg:block">GSX_MAIN_FRAME_OS_STABLE</span>
           </div>

           <div className="flex flex-wrap items-center justify-center gap-10">
              {['Security Disclosure', 'Network Privacy', 'Authority Protocols'].map((link, i) => (
                <a key={i} href="#" className="mono text-[8px] text-slate-700 tracking-[0.4em] uppercase hover:text-[#cffd01] transition-colors">{link}</a>
              ))}
              <div className="tech-badge !text-white/20 border-white/5">
                 © 2026 AUTHORITY_PROTOCOL
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
