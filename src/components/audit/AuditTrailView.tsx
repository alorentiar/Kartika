import React, { useState } from 'react';
import { History, Shield, Download, Search, CheckCircle2, AlertTriangle } from 'lucide-react';
import { AuditTrailLog } from '../../types/kartika';

interface AuditTrailViewProps {
  logs: AuditTrailLog[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const filteredLogs = logs.filter((log) => {
    if (filterAction !== 'all' && log.aksi !== filterAction) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.nama_pengguna.toLowerCase().includes(q) ||
        log.detail.toLowerCase().includes(q) ||
        log.entitas.toLowerCase().includes(q) ||
        log.ip_address.includes(q)
      );
    }
    return true;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `kartika_audit_trail_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 tracking-tight">
            Jejak Audit Sistem (Immutable Audit Trail)
          </h2>
          <p className="text-xs text-slate-400">
            Pencatatan log aktivitas dan akses pengguna yang tidak dapat diubah untuk menjamin integritas pembuktian hukum
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" />
          <span>Ekspor Log JSON</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-[#0D1526] border border-slate-800 rounded-xl p-3 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari jejak audit berdasarkan nama pengguna, aksi, IP, atau detail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
        >
          <option value="all">Semua Tipe Aksi</option>
          <option value="EKSEKUSI_PINDAI">Eksekusi Pindai</option>
          <option value="SELESAI_PINDAI">Selesai Pindai</option>
          <option value="PEMETAAN_REGULASI">Pemetaan Regulasi</option>
          <option value="AKSES_LAPORAN">Akses Laporan</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#0D1526] border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/50 text-slate-400 font-medium">
                <th className="py-3 px-5">Waktu & Timestamp</th>
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">Aksi Audit</th>
                <th className="py-3 px-4">Entitas Sasaran</th>
                <th className="py-3 px-4">Detail Aktivitas</th>
                <th className="py-3 px-5">IP Asal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id_log}
                  className="hover:bg-slate-900/40 transition-colors"
                >
                  <td className="py-3.5 px-5 text-slate-400 tabular-nums">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 text-slate-200 font-sans font-medium">
                    <div>{log.nama_pengguna}</div>
                    <span className="text-[10px] text-slate-500 font-mono">[{log.peran.toUpperCase()}]</span>
                  </td>
                  <td className="py-3.5 px-4 text-blue-400 font-semibold">
                    {log.aksi}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-sans">
                    {log.entitas}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-sans max-w-sm">
                    {log.detail}
                  </td>
                  <td className="py-3.5 px-5 text-slate-500 tabular-nums">
                    {log.ip_address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
