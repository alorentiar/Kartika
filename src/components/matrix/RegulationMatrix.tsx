import React, { useState } from 'react';
import { Scale, BookOpen, AlertCircle, Calculator, FileText, Search, ArrowRight } from 'lucide-react';
import {
  Temuan_Teknis,
  Regulasi_Hukum,
  Pemetaan_Kepatuhan
} from '../../types/kartika';

interface RegulationMatrixProps {
  findings: Temuan_Teknis[];
  regulations: Regulasi_Hukum[];
  mappings: Pemetaan_Kepatuhan[];
  onGenerateReport: () => void;
}

export const RegulationMatrix: React.FC<RegulationMatrixProps> = ({
  findings,
  regulations,
  mappings,
  onGenerateReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [annualRevenue, setAnnualRevenue] = useState<number>(50000000000); // 50 Miliar IDR default
  const [showCalculator, setShowCalculator] = useState(false);

  // Cross-reference data
  const matrixRows = mappings.map((map) => {
    const finding = findings.find((f) => f.id_temuan === map.id_temuan);
    const regulation = regulations.find((r) => r.id_regulasi === map.id_regulasi);
    return {
      map,
      finding,
      regulation,
    };
  }).filter((item) => {
    if (!item.finding || !item.regulation) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.finding.judul_temuan.toLowerCase().includes(q) ||
        item.regulation.pasal.toLowerCase().includes(q) ||
        item.regulation.judul_pasal.toLowerCase().includes(q) ||
        item.map.analisis_pelanggaran.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const maxFine2Percent = annualRevenue * 0.02;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 tracking-tight">
            Mesin Pemetaan Regulasi & Analisis Hukum (Cross-Reference Matrix)
          </h2>
          <p className="text-xs text-slate-400">
            Penautan otomatis celah teknis sistem terhadap pasal kewajiban UU No. 27/2022 (UU PDP) dan pedoman teknis BSSN
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>Kalkulator Denda Pasal 57</span>
          </button>

          <button
            onClick={onGenerateReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ekspor Laporan PDF</span>
          </button>
        </div>
      </div>

      {/* Kalkulator Denda UU PDP Pasal 57 */}
      {showCalculator && (
        <div className="bg-[#0B1528] border border-blue-900/60 rounded-xl p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-blue-200 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-400" />
                <span>Simulasi Perhitungan Denda Administratif Maksimal (UU PDP Pasal 57 Ayat 2)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Regulator mengenakan sanksi denda administratif paling banyak 2% dari total pendapatan tahunan instansi/korporasi pengendali data.
              </p>
            </div>
            <button
              onClick={() => setShowCalculator(false)}
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              ✕ Tutup
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Estimasi Pendapatan / Penerimaan Tahunan Instansi (IDR)
              </label>
              <input
                type="number"
                step="1000000000"
                value={annualRevenue}
                onChange={(e) => setAnnualRevenue(Number(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Tercatat: {formatRupiah(annualRevenue)}
              </span>
            </div>

            <div className="p-4 bg-red-950/30 border border-red-900/40 rounded-xl">
              <span className="text-xs text-slate-400 block">Plafon Maksimal Sanksi Denda (2%):</span>
              <div className="text-2xl font-bold font-mono text-red-400 tabular-nums mt-1">
                {formatRupiah(maxFine2Percent)}
              </div>
              <span className="text-[11px] text-red-300/80 mt-1 block">
                Beserta sanksi penghentian sementara operasional dan pemberitahuan publik 3x24 jam (Pasal 46).
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="bg-[#0D1526] border border-slate-800 rounded-xl p-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pemetaan berdasarkan pasal UU PDP, BSSN, atau judul kerentanan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Cross-Reference Matrix Table */}
      <div className="bg-[#0D1526] border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/50 text-slate-400 font-medium">
                <th className="py-3 px-5">Temuan Teknis Sistem</th>
                <th className="py-3 px-4">Regulasi & Pasal Terkait</th>
                <th className="py-3 px-4">Tingkat Dampak</th>
                <th className="py-3 px-4">Analisis Pelanggaran Hukum</th>
                <th className="py-3 px-5">Ancaman Sanksi Spesifik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {matrixRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Tidak ada pemetaan regulasi yang ditemukan.
                  </td>
                </tr>
              ) : (
                matrixRows.map(({ map, finding, regulation }) => {
                  if (!finding || !regulation) return null;

                  return (
                    <tr
                      key={map.id_pemetaan}
                      className="hover:bg-slate-900/40 transition-colors"
                    >
                      {/* Temuan Teknis */}
                      <td className="py-3.5 px-5">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-200">
                            {finding.judul_temuan}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            {finding.target_nama} · {finding.titik_kelemahan}
                          </div>
                        </div>
                      </td>

                      {/* Regulasi & Pasal */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-blue-400">
                            {regulation.dasar_hukum}
                          </div>
                          <div className="text-slate-300 font-medium">
                            {regulation.pasal} {regulation.ayat || ''}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {regulation.judul_pasal}
                          </div>
                        </div>
                      </td>

                      {/* Tingkat Dampak */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-mono text-xs ${
                            map.tingkat_dampak === 'Kritis'
                              ? 'text-red-400 font-bold'
                              : 'text-amber-400 font-semibold'
                          }`}
                        >
                          [{map.tingkat_dampak}]
                        </span>
                      </td>

                      {/* Analisis Pelanggaran */}
                      <td className="py-3.5 px-4 max-w-sm text-slate-300 leading-relaxed">
                        {map.analisis_pelanggaran}
                      </td>

                      {/* Ancaman Sanksi */}
                      <td className="py-3.5 px-5 max-w-xs text-slate-400 leading-relaxed">
                        <div className="text-red-400/90 font-medium text-[11px]">
                          {regulation.sanksi_administratif}
                        </div>
                        {regulation.ancaman_denda_maksimal && (
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {regulation.ancaman_denda_maksimal}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
