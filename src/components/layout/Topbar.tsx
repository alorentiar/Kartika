import React from 'react';
import { Shield, ShieldAlert, Scale, UserCheck, Activity } from 'lucide-react';
import { Pengguna, UserRole } from '../../types/kartika';

interface TopbarProps {
  currentUser: Pengguna;
  allUsers: Pengguna[];
  onSwitchRole: (user: Pengguna) => void;
  activeScanCount: number;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentUser,
  allUsers,
  onSwitchRole,
  activeScanCount,
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-[#0B1120] px-6 flex items-center justify-between gap-8 shrink-0 no-print">
      {/* Zone 1: Single text element wordmark with domain status */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <div className="text-base font-bold tracking-wider text-slate-100 flex items-center gap-2">
            <span>KARTIKA</span>
            <span className="text-[11px] font-mono font-normal text-slate-400 tracking-normal">
              v1.0-DEF
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate max-w-xs">
            Kepatuhan Audit Risiko & Keamanan Aplikasi
          </p>
        </div>
      </div>

      {/* Zone 2: Navigation telemetry & System State */}
      <div className="hidden lg:flex items-center gap-6 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Standar Acuan:</span>
          <span className="text-slate-200 font-medium">UU PDP No. 27/2022</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-200 font-medium">BSSN SPBE</span>
        </div>

        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-slate-600">/</span>
          <span className="text-slate-500">Enkripsi Kredensial:</span>
          <span className="text-blue-400 font-mono">AES-256 Aktif</span>
        </div>

        {activeScanCount > 0 && (
          <div className="flex items-center gap-2 text-amber-400 font-medium">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-mono tabular-nums">{activeScanCount} Sesi Memindai</span>
          </div>
        )}
      </div>

      {/* Zone 3: 1 Primary Action & Multi-Persona Role Switcher */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
          <span className="text-[11px] text-slate-400 px-2 font-medium">
            Peran:
          </span>
          <div className="flex items-center gap-1">
            {allUsers.map((user) => {
              const isActive = user.id_pengguna === currentUser.id_pengguna;
              let roleLabel = 'Auditor IT';
              let Icon = ShieldAlert;
              if (user.peran === 'legal') {
                roleLabel = 'Legal Officer';
                Icon = Scale;
              } else if (user.peran === 'commander') {
                roleLabel = 'Komandan';
                Icon = UserCheck;
              }

              return (
                <button
                  key={user.id_pengguna}
                  onClick={() => onSwitchRole(user)}
                  title={`${user.nama} (${user.jabatan})`}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{roleLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
