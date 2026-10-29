import React, { useState } from 'react';
import {
  Bug,
  Database,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  Terminal,
  ExternalLink,
  Filter,
  Search,
  Scale
} from 'lucide-react';
import { Temuan_Teknis, SeverityLevel, TemuanKategori } from '../../types/kartika';

interface FindingsViewProps {
  findings: Temuan_Teknis[];
  onUpdateStatus: (findingId: string, newStatus: Temuan_Teknis['status_remediasi']) => void;
  onNavigateToMatrix: () => void;
}

export const FindingsView: React.FC<FindingsViewProps> = ({
  findings,
  onUpdateStatus,
  onNavigateToMatrix,
}) => {
  const [selectedFinding, setSelectedFinding] = useState<Temuan_Teknis | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFindings = findings.filter((f) => {
    if (filterCategory !== 'all' && f.kategori !== filterCategory) return false;
    if (filterSeverity !== 'all' && f.tingkat_keparahan !== filterSeverity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        f.judul_temuan.toLowerCase().includes(q) ||
        f.target_nama.toLowerCase().includes(q) ||
        f.titik_kelemahan.toLowerCase().includes(q) ||
        (f.kode_owasp && f.kode_owasp.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getSeverityBadge = (level: SeverityLevel) => {
    switch (level) {
      case 'Kritis':
        return 'text-red-400 font-bold';
      case 'Tinggi':
        return 'text-orange-400 font-semibold';
      case 'Sedang':
        return 'text-amber-400 font-medium';
      case 'Rendah':
        return 'text-blue-400 font-medium';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 tracking-tight">
            Hasil Pindai Keamanan Teknis (DAST & PII)
          </h2>
          <p className="text-xs text-slate-400">
            Daftar terverifikasi celah OWASP Top 10 dan sampel eksposur data pribadi (PII) tanpa enkripsi
          </p>
        </div>

        <button
          onClick={onNavigateToMatrix}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Scale className="w-3.5 h-3.5 text-blue-400" />
          <span>Buka Pemetaan UU PDP</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0D1526] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari berdasarkan judul, target, endpoint, atau CVE/OWASP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented Filter: Category */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                filterCategory === 'all' ? 'bg-slate-800 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua ({findings.length})
            </button>
            <button
              onClick={() => setFilterCategory('OWASP')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                filterCategory === 'OWASP' ? 'bg-slate-800 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              DAST OWASP
            </button>
            <button
              onClick={() => setFilterCategory('PII')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                filterCategory === 'PII' ? 'bg-slate-800 text-slate-100 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Eksposur PII
            </button>
          </div>

          {/* Severity Selector */}
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Semua Keparahan</option>
            <option value="Kritis">Kritis</option>
            <option value="Tinggi">Tinggi</option>
            <option value="Sedang">Sedang</option>
            <option value="Rendah">Rendah</option>
          </select>
        </div>
      </div>

      {/* Findings Table */}
      <div className="bg-[#0D1526] border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/50 text-slate-400 font-medium">
                <th className="py-3 px-5">Temuan & Kategori</th>
                <th className="py-3 px-4">Target Sistem</th>
                <th className="py-3 px-4">Titik Kerentanan</th>
                <th className="py-3 px-4">Status Enkripsi</th>
                <th className="py-3 px-4">Remediasi</th>
                <th className="py-3 px-5 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredFindings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Tidak ada temuan yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredFindings.map((item) => {
                  return (
                    <tr
                      key={item.id_temuan}
                      className="hover:bg-slate-900/40 transition-colors"
                    >
                      {/* Judul & Kategori */}
                      <td className="py-3.5 px-5">
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-200">
                            {item.judul_temuan}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                            <span className={getSeverityBadge(item.tingkat_keparahan)}>
                              [{item.tingkat_keparahan} · CVSS {item.cvss_skor}]
                            </span>
                            <span aria-hidden="true" className="text-slate-600">·</span>
                            <span>{item.kode_owasp || item.kategori}</span>
                          </div>
                        </div>
                      </td>

                      {/* Target Sistem */}
                      <td className="py-3.5 px-4 text-slate-300">
                        {item.target_nama}
                      </td>

                      {/* Titik Kerentanan */}
                      <td className="py-3.5 px-4 font-mono text-slate-300 max-w-xs truncate">
                        {item.titik_kelemahan}
                      </td>

                      {/* Status Enkripsi */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          {item.status_enkripsi.includes('Plaintext') ? (
                            <span className="text-red-400 flex items-center gap-1">
                              <Unlock className="w-3.5 h-3.5 shrink-0" />
                              <span>{item.status_enkripsi}</span>
                            </span>
                          ) : item.status_enkripsi.includes('Terenkripsi') || item.status_enkripsi.includes('Argon2') ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5 shrink-0" />
                              <span>{item.status_enkripsi}</span>
                            </span>
                          ) : (
                            <span className="text-slate-500">{item.status_enkripsi}</span>
                          )}
                        </div>
                      </td>

                      {/* Status Remediasi */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[11px] font-medium ${
                            item.status_remediasi === 'Telah Diremediasi'
                              ? 'text-emerald-400'
                              : item.status_remediasi === 'Dalam Penanganan'
                              ? 'text-amber-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {item.status_remediasi}
                        </span>
                      </td>

                      {/* Aksi Detail */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => setSelectedFinding(item)}
                          className="px-2.5 py-1 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-950/40 hover:bg-blue-950/70 border border-blue-800/40 rounded transition-colors whitespace-nowrap"
                        >
                          Lihat Bukti
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer Modal */}
      {selectedFinding && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-slate-700 rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono mb-1">
                  <span className={getSeverityBadge(selectedFinding.tingkat_keparahan)}>
                    {selectedFinding.tingkat_keparahan} (CVSS {selectedFinding.cvss_skor})
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-400">{selectedFinding.kode_owasp || selectedFinding.kategori}</span>
                </div>
                <h3 className="text-base font-semibold text-slate-100">
                  {selectedFinding.judul_temuan}
                </h3>
              </div>
              <button
                onClick={() => setSelectedFinding(null)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Target & Titik Kelemahan */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Target Sistem:</span>
                  <span className="text-slate-200 font-bold">{selectedFinding.target_nama}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Titik Kelemahan:</span>
                  <span className="text-blue-400">{selectedFinding.titik_kelemahan}</span>
                </div>
                {selectedFinding.parameter_terdampak && (
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Parameter / Kolom:</span>
                    <span className="text-amber-400">{selectedFinding.parameter_terdampak}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-400">
                  <span>Status Enkripsi Kolom:</span>
                  <span className={selectedFinding.status_enkripsi.includes('Plaintext') ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                    {selectedFinding.status_enkripsi}
                  </span>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <h4 className="text-slate-300 font-semibold mb-1">Deskripsi Kerentanan:</h4>
                <p className="text-slate-400 leading-relaxed bg-slate-900/40 p-3 rounded border border-slate-800">
                  {selectedFinding.deskripsi}
                </p>
              </div>

              {/* Bukti Payload / Terminal Dump */}
              <div>
                <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
                  <span>Bukti Payload & Respon Anomali (Technical Proof):</span>
                  <span className="text-[10px] font-mono text-slate-500">Live Verification Log</span>
                </div>
                <pre className="p-3 bg-black/80 text-emerald-400 font-mono text-[11px] rounded-lg border border-slate-800 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {selectedFinding.bukti_payload}
                </pre>
              </div>

              {/* Langkah Remediasi */}
              <div>
                <h4 className="text-slate-300 font-semibold mb-1">Langkah Remediasi Teknis:</h4>
                <div className="p-3 bg-blue-950/20 text-blue-200 rounded-lg border border-blue-900/30 leading-relaxed">
                  {selectedFinding.langkah_remediasi}
                </div>
              </div>

              {/* Update Status Remediasi */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Ubah Status:</span>
                  <select
                    value={selectedFinding.status_remediasi}
                    onChange={(e) => {
                      const newStatus = e.target.value as Temuan_Teknis['status_remediasi'];
                      onUpdateStatus(selectedFinding.id_temuan, newStatus);
                      setSelectedFinding({
                        ...selectedFinding,
                        status_remediasi: newStatus,
                      });
                    }}
                    className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 focus:outline-none"
                  >
                    <option value="Terbuka (Open)">Terbuka (Open)</option>
                    <option value="Dalam Penanganan">Dalam Penanganan</option>
                    <option value="Telah Diremediasi">Telah Diremediasi</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setSelectedFinding(null);
                    onNavigateToMatrix();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Lihat Pelanggaran UU PDP Terkait →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
