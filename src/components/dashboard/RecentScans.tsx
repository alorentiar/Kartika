import React from 'react';
import { FileDown, Eye, XCircle, Play, Globe, Database, Loader2 } from 'lucide-react';
import { Sesi_Audit, Target_Sistem } from '../../types/kartika';

interface RecentScansProps {
  sessions: Sesi_Audit[];
  targets: Target_Sistem[];
  onViewFindings: (session: Sesi_Audit) => void;
  onDownloadReport: (session: Sesi_Audit) => void;
  onCancelScan: (sessionId: string) => void;
  onStartScan: (target: Target_Sistem) => void;
}

export const RecentScans: React.FC<RecentScansProps> = ({
  sessions,
  targets,
  onViewFindings,
  onDownloadReport,
  onCancelScan,
  onStartScan,
}) => {
  return (
    <div className="bg-[#0D1526] border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            Aktivitas Audit Terakhir (Recent Scans)
          </h3>
          <p className="text-xs text-slate-400">
            Daftar sesi pengujian DAST dan inspeksi PII pada target sistem terdaftar
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-900/50 text-slate-400 font-medium">
              <th className="py-3 px-5">Target Sistem</th>
              <th className="py-3 px-4">Tipe Target</th>
              <th className="py-3 px-4">Waktu Audit</th>
              <th className="py-3 px-4">Status Audit</th>
              <th className="py-3 px-4">Temuan / PII</th>
              <th className="py-3 px-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {sessions.map((session) => {
              const target = targets.find((t) => t.id_target === session.id_target);
              const isRunning = session.status === 'Running';
              const isCompleted = session.status === 'Completed';

              return (
                <tr
                  key={session.id_sesi}
                  className="hover:bg-slate-900/40 transition-colors"
                >
                  {/* Target Sistem */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-300 shrink-0">
                        {session.target_tipe === 'web' ? (
                          <Globe className="w-3.5 h-3.5 text-blue-400" />
                        ) : (
                          <Database className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">
                          {session.target_nama}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 truncate max-w-xs">
                          {target?.url_atau_host || 'Target Terdaftar'}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Tipe Target */}
                  <td className="py-3.5 px-4 text-slate-300">
                    <span className="capitalize">{session.target_tipe === 'web' ? 'Aplikasi Web' : 'Basis Data'}</span>
                  </td>

                  {/* Waktu Audit */}
                  <td className="py-3.5 px-4 font-mono text-slate-400 tabular-nums">
                    {session.waktu_mulai}
                  </td>

                  {/* Status Audit */}
                  <td className="py-3.5 px-4">
                    {isRunning ? (
                      <div className="space-y-1.5 w-36">
                        <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                          <span>Memindai ({session.progres_persen}%)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${session.progres_persen}%` }}
                          />
                        </div>
                      </div>
                    ) : isCompleted ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>Selesai (Completed)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-slate-500" />
                        <span>Dibatalkan</span>
                      </div>
                    )}
                  </td>

                  {/* Temuan / PII */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2 font-mono tabular-nums text-slate-300">
                      <span>{session.total_temuan} Temuan</span>
                      {session.tabel_pii_terekspos > 0 && (
                        <>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className="text-amber-400 font-medium">
                            {session.tabel_pii_terekspos} Tabel PII
                          </span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Aksi matching Wireframe */}
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isRunning ? (
                        <button
                          onClick={() => onCancelScan(session.id_sesi)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/50 border border-red-800/40 rounded transition-colors whitespace-nowrap shrink-0"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Batalkan Sesi</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => onDownloadReport(session)}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-950/30 hover:bg-blue-950/50 border border-blue-800/40 rounded transition-colors whitespace-nowrap shrink-0"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                            <span>Unduh Laporan PDF</span>
                          </button>
                          <button
                            onClick={() => onViewFindings(session)}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors whitespace-nowrap shrink-0"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detail Temuan</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
