import React from 'react';
import {
  LayoutDashboard,
  Server,
  Bug,
  Scale,
  FileText,
  History,
  ShieldCheck,
  User,
  LogOut
} from 'lucide-react';
import { ViewTab, Pengguna } from '../../types/kartika';

interface SidebarProps {
  activeTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  currentUser: Pengguna;
  findingsCount: number;
  targetsCount: number;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  findingsCount,
  targetsCount,
  onLogout,
}) => {
  const menuItems: { id: ViewTab; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { id: 'dashboard', label: 'Beranda / Dasbor', icon: LayoutDashboard },
    { id: 'targets', label: 'Manajemen Target', icon: Server, count: targetsCount },
    { id: 'findings', label: 'Hasil Pindai (Teknis)', icon: Bug, count: findingsCount },
    { id: 'matrix', label: 'Pemetaan Regulasi', icon: Scale },
    { id: 'report', label: 'Generator Laporan', icon: FileText },
    { id: 'audit_trail', label: 'Jejak Audit (Log)', icon: History },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-[#0B1120] flex flex-col justify-between shrink-0 no-print">
      <div className="p-4 space-y-6">
        {/* Navigation list */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Navigasi Utama
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Security & Regulatory Standards notice */}
        <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-lg space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Kepatuhan Regulasi</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Engine memverifikasi kewajiban enkripsi Pasal 35 & 39 UU PDP serta standar uji penetrasi BSSN.
          </p>
        </div>
      </div>

      {/* User profile & persona card at footer with Log Out */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/40 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-slate-200 truncate">
              {currentUser.nama}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {currentUser.jabatan}
            </div>
            <div className="text-[10px] text-slate-500 truncate mt-0.5">
              {currentUser.instansi}
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-red-300 hover:bg-red-950/30 border border-slate-800 hover:border-red-800/40 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar Sistem (Log Out)</span>
        </button>
      </div>
    </aside>
  );
};
