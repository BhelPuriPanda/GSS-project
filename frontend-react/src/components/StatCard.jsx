import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, trend }) => {
  return (
    <div className="module-card group cursor-default p-6 hover:bg-[#cffd01]/[0.02]">
      {/* Corner Accents - Bespoke Detail */}
      <div className="absolute top-0 right-0 h-4 w-4 border-t border-r border-white/5 group-hover:border-[#cffd01]/50" />
      <div className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-white/5 group-hover:border-[#cffd01]/50" />
      
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center bg-white/[0.02] border border-white/[0.05] text-slate-400 group-hover:text-[#cffd01] group-hover:border-[#cffd01]/20 transition-all duration-500">
            {icon}
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 transition-colors group-hover:text-slate-300">
              {title}
            </h3>
            <p className="mt-2 text-4xl font-black italic tracking-tighter text-white">
              {value}
            </p>
          </div>
        </div>
        
        {/* Trend Indicator - Mechanical Style */}
        <div className="flex flex-col items-end gap-1">
          <div className={`text-[10px] font-black uppercase tracking-widest ${trend && trend.includes('+') ? 'text-[#cffd01]' : 'text-slate-600'}`}>
            {trend}
          </div>
          <div className="h-[2px] w-8 bg-white/5 group-hover:bg-[#cffd01]/20 transition-all" />
          <span className="text-[8px] font-bold text-slate-700 uppercase">Latency 2ms</span>
        </div>
      </div>
      
      {/* Background ID String - Bespoke Detail */}
      <div className="absolute -bottom-2 -right-2 text-[48px] font-black text-white/[0.01] pointer-events-none italic select-none uppercase">
        {title.slice(0, 4)}
      </div>
    </div>
  );
};

export default StatCard;
