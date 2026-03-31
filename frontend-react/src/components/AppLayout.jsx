import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#05070a] overflow-x-hidden coordinates selection:bg-[#cffd01] selection:text-black">
      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/80 backdrop-blur-md md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed Industrial Column */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area - Command Center */}
      <div className="flex-1 transition-all duration-500 md:ml-72 min-h-screen flex flex-col pt-24 md:pt-28">
        
        {/* Header - Fixed Technical Control */}
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Global Boundary Markers - Bespoke Detail */}
        <div className="fixed top-0 right-0 h-12 w-12 border-t border-r border-white/5 pointer-events-none" />
        <div className="fixed bottom-0 left-0 h-12 w-12 border-b border-l border-white/5 md:left-72 pointer-events-none" />
        
        {/* Main Feed Container */}
        <main className="flex-1 p-6 md:p-14 lg:p-20 relative">
          <div className="max-w-[1920px] mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700">
            {children}
          </div>
        </main>

        {/* Technical Footer Label - Bespoke Detail */}
        <footer className="mt-auto py-8 px-14 border-t border-white/[0.03] flex items-center justify-between text-[8px] font-black uppercase tracking-[0.5em] text-slate-800 italic select-none pointer-events-none bg-black/20">
          <div className="flex items-center gap-4">
             <span>Protocol: DAPS_V0.77.X</span>
             <span>Status: ENFORCEMENT_NODE_STABLE</span>
          </div>
          <div className="flex items-center gap-6">
             <span>Coord: 40.7128 N, 74.0060 W</span>
             <span>Ref: GSX-HQ-SURVEILLANCE</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;
