import React from 'react';
import { Printer, CheckCircle2 } from 'lucide-react';
import {
  Laporan_Kepatuhan,
  Temuan_Teknis,
  Regulasi_Hukum,
  Pemetaan_Kepatuhan,
  Pengguna
} from '../../types/kartika';

interface ComplianceReportProps {
  report: Laporan_Kepatuhan;
  findings: Temuan_Teknis[];
  regulations: Regulasi_Hukum[];
  mappings: Pemetaan_Kepatuhan[];
  currentUser: Pengguna;
}

export const ComplianceReport: React.FC<ComplianceReportProps> = ({
  report,
  findings,
  regulations,
  mappings,
  currentUser,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const criticalFindings = findings.filter((f) => f.tingkat_keparahan === 'Kritis');

  return (
    <div className="space-y-6">
      {/* Action Header (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 tracking-tight">
            Generator Laporan Kesiapan Kepatuhan (Compliance Readiness Report)
          </h2>
          <p className="text-xs text-slate-400">
            Dokumen resmi instansi yang memuat Ringkasan Eksekutif, Temuan Teknis OWASP/PII, Dampak Hukum UU PDP, dan Langkah Remediasi
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Unduh PDF Resmi</span>
          </button>
        </div>
      </div>

      {/* Official A4 Document Container */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-8 lg:p-12 text-slate-100 max-w-4xl mx-auto shadow-2xl print-container print:text-black print:bg-white">
        {/* Document Header / Kop Dokumen */}
        <div className="border-b-2 border-slate-700 print:border-black pb-6 mb-8 text-center space-y-1">
          <div className="text-[11px] font-mono tracking-widest uppercase text-slate-400 print:text-gray-600">
            KLASIFIKASI: RAHASIA / TERBATAS
          </div>
          <h1 className="text-xl font-bold tracking-wider text-slate-100 print:text-black uppercase">
            LAPORAN KESIAPAN KEPATUHAN KEAMANAN SIBER & REGULASI
          </h1>
          <div className="text-xs text-blue-400 print:text-blue-800 font-semibold uppercase tracking-wider">
            SISTEM AUDIT RISIKO KARTIKA · MANDAT UU NO. 27 TAHUN 2022 (UU PDP)
          </div>
          <div className="text-[11px] font-mono text-slate-400 print:text-gray-600 pt-2 flex items-center justify-center gap-4">
            <span>Nomor Dokumen: {report.nomor_dokumen}</span>
            <span aria-hidden="true">·</span>
            <span>Tanggal Pengesahan: {report.tanggal_dibuat}</span>
          </div>
        </div>

        {/* Section 1: Ringkasan Eksekutif */}
        <section className="mb-8 space-y-3">
          <h2 className="text-sm font-bold text-slate-200 print:text-black uppercase tracking-wider border-b border-slate-800 print:border-gray-300 pb-1 flex items-center gap-2">
            <span>1. Ringkasan Eksekutif (Executive Summary)</span>
          </h2>
          <div className="p-4 bg-slate-900/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 rounded-lg text-xs leading-relaxed print:text-black">
            {report.ringkasan_eksekutif}
          </div>

          <div className="grid grid-cols-3 gap-3 text-center pt-2">
            <div className="p-3 bg-slate-900/40 print:bg-gray-50 border border-slate-800 print:border-gray-300 rounded-lg">
              <span className="text-[11px] text-slate-400 print:text-gray-600 block">Skor Kepatuhan</span>
              <span className="text-2xl font-bold font-mono text-red-400 print:text-red-700 tabular-nums">
                {report.skor_kepatuhan}%
              </span>
              <span className="text-[10px] text-slate-500 block">Status: BERESIKO</span>
            </div>

            <div className="p-3 bg-slate-900/40 print:bg-gray-50 border border-slate-800 print:border-gray-300 rounded-lg">
              <span className="text-[11px] text-slate-400 print:text-gray-600 block">Kerentanan Kritis (OWASP)</span>
              <span className="text-2xl font-bold font-mono text-red-400 print:text-red-700 tabular-nums">
                {criticalFindings.length} Temuan
              </span>
              <span className="text-[10px] text-slate-500 block">Tingkat Risiko Tinggi</span>
            </div>

            <div className="p-3 bg-slate-900/40 print:bg-gray-50 border border-slate-800 print:border-gray-300 rounded-lg">
              <span className="text-[11px] text-slate-400 print:text-gray-600 block">Eksposur PII Basis Data</span>
              <span className="text-2xl font-bold font-mono text-amber-400 print:text-amber-700 tabular-nums">
                {report.total_pii_terekspos} Tabel
              </span>
              <span className="text-[10px] text-slate-500 block">Format Plaintext</span>
            </div>
          </div>
        </section>

        {/* Section 2: Temuan Teknis Kritis */}
        <section className="mb-8 space-y-3">
          <h2 className="text-sm font-bold text-slate-200 print:text-black uppercase tracking-wider border-b border-slate-800 print:border-gray-300 pb-1">
            2. Rincian Temuan Teknis Kritis (OWASP Top 10 & Eksposur PII)
          </h2>
          <div className="space-y-3 text-xs">
            {findings.map((finding, idx) => (
              <div
                key={finding.id_temuan}
                className="p-3.5 bg-slate-900/50 print:bg-gray-50 border border-slate-800 print:border-gray-300 rounded-lg space-y-2 print-card"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-slate-400 print:text-gray-600 text-[11px]">
                      2.{idx + 1}
                    </span>{' '}
                    <strong className="text-slate-100 print:text-black text-xs">
                      {finding.judul_temuan}
                    </strong>
                    <div className="text-[11px] font-mono text-slate-400 print:text-gray-600 mt-0.5">
                      Target: {finding.target_nama} · Lokasi: {finding.titik_kelemahan}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-red-400 print:text-red-700 text-xs">
                    [{finding.tingkat_keparahan} · CVSS {finding.cvss_skor}]
                  </span>
                </div>

                <p className="text-slate-300 print:text-gray-800 text-[11px] leading-relaxed">
                  {finding.deskripsi}
                </p>

                <div className="p-2 bg-black/60 print:bg-gray-100 text-[10px] font-mono text-emerald-400 print:text-emerald-900 rounded border border-slate-800 print:border-gray-300 overflow-x-auto whitespace-pre-wrap">
                  {finding.bukti_payload}
                </div>

                <div className="text-[11px] text-blue-300 print:text-blue-900 bg-blue-950/20 print:bg-blue-50 p-2 rounded border border-blue-900/30 print:border-blue-200">
                  <strong>Rekomendasi Teknis:</strong> {finding.langkah_remediasi}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Analisis Dampak Hukum & Ancaman Denda UU PDP */}
        <section className="mb-8 space-y-3">
          <h2 className="text-sm font-bold text-slate-200 print:text-black uppercase tracking-wider border-b border-slate-800 print:border-gray-300 pb-1">
            3. Analisis Dampak Hukum & Potensi Sanksi UU PDP No. 27/2022
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 print:border-gray-300">
              <thead>
                <tr className="bg-slate-900 print:bg-gray-200 text-slate-300 print:text-black font-semibold">
                  <th className="p-2.5 border-b border-slate-800 print:border-gray-300">Pasal UU PDP</th>
                  <th className="p-2.5 border-b border-slate-800 print:border-gray-300">Kewajiban Pengendali Data</th>
                  <th className="p-2.5 border-b border-slate-800 print:border-gray-300">Ancaman Sanksi & Denda</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-gray-300 text-[11px]">
                <tr>
                  <td className="p-2.5 font-bold text-blue-400 print:text-blue-900">Pasal 35</td>
                  <td className="p-2.5 text-slate-300 print:text-black">
                    Kewajiban menjamin keamanan pemrosesan, kerahasiaan, dan integritas data dari akses tidak sah.
                  </td>
                  <td className="p-2.5 text-red-400 print:text-red-700">
                    Penghentian sementara kegiatan dan penghapusan data.
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-blue-400 print:text-blue-900">Pasal 39</td>
                  <td className="p-2.5 text-slate-300 print:text-black">
                    Kewajiban penerapan enkripsi berstandar tinggi untuk data pribadi spesifik (kesehatan, rekam medis, keuangan).
                  </td>
                  <td className="p-2.5 text-red-400 print:text-red-700">
                    Sanksi denda administratif maksimal 2% pendapatan tahunan.
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-blue-400 print:text-blue-900">Pasal 46</td>
                  <td className="p-2.5 text-slate-300 print:text-black">
                    Kewajiban notifikasi tertulis insiden kebocoran data dalam waktu 3 x 24 jam kepada lembaga dan korban.
                  </td>
                  <td className="p-2.5 text-red-400 print:text-red-700">
                    Pemberitahuan publik dan penjatuhan sanksi administratif berat.
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-blue-400 print:text-blue-900">Pasal 57</td>
                  <td className="p-2.5 text-slate-300 print:text-black">
                    Penetapan besaran sanksi administratif dan denda finansial.
                  </td>
                  <td className="p-2.5 text-red-400 print:text-red-700 font-bold">
                    Denda hingga paling banyak 2% dari total pendapatan tahunan.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Rekomendasi Tindak Lanjut & Remediasi Terjadwal */}
        <section className="mb-10 space-y-3">
          <h2 className="text-sm font-bold text-slate-200 print:text-black uppercase tracking-wider border-b border-slate-800 print:border-gray-300 pb-1">
            4. Matriks Tindak Lanjut & Langkah Remediasi Prioritas
          </h2>
          <div className="space-y-2 text-xs">
            {report.rekomendasi_prioritas.map((rek, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 bg-slate-900/40 print:bg-gray-50 border border-slate-800 print:border-gray-300 rounded"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-emerald-700 shrink-0 mt-0.5" />
                <span className="text-slate-200 print:text-black text-[11px] leading-relaxed">
                  {rek}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Lembar Pengesahan & Tanda Tangan */}
        <div className="border-t-2 border-slate-800 print:border-gray-400 pt-8 mt-12 grid grid-cols-2 gap-8 text-xs text-center">
          <div>
            <div className="text-slate-400 print:text-gray-600 mb-16">
              Auditor Keamanan Siber (Pelaksana Pengujian),
            </div>
            <div className="font-bold text-slate-100 print:text-black underline">
              {report.auditor_nama}
            </div>
            <div className="text-[11px] text-slate-400 print:text-gray-600">
              Lead Cyber Security Auditor · ID USR-001
            </div>
          </div>

          <div>
            <div className="text-slate-400 print:text-gray-600 mb-16">
              Mengetahui / Mengesahkan (Pimpinan Instansi),
            </div>
            <div className="font-bold text-slate-100 print:text-black underline">
              {report.pemberi_otorisasi}
            </div>
            <div className="text-[11px] text-slate-400 print:text-gray-600">
              Komandan Satuan Siber · Komando Operasi Keamanan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
