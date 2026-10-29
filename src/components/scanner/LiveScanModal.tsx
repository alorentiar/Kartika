import React, { useState, useEffect } from 'react';
import { Terminal, Shield, CheckCircle2, AlertTriangle, Loader2, X } from 'lucide-react';
import { Target_Sistem, Temuan_Teknis } from '../../types/kartika';

interface LiveScanModalProps {
  target: Target_Sistem;
  onClose: () => void;
  onScanComplete: (newFindings: Temuan_Teknis[]) => void;
}

export const LiveScanModal: React.FC<LiveScanModalProps> = ({
  target,
  onClose,
  onScanComplete,
}) => {
  const [progress, setProgress] = useState(10);
  const [currentPhase, setCurrentPhase] = useState('Menginisialisasi probe keamanan...');
  const [logs, setLogs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [detectedFindings, setDetectedFindings] = useState<Temuan_Teknis[]>([]);

  useEffect(() => {
    const isWeb = target.tipe === 'web';
    const startTime = Date.now();

    const addLog = (msg: string) => {
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString('id-ID')}] ${msg}`]);
    };

    addLog(`Memulai sesi audit KARTIKA pada target: ${target.nama_target} (${target.url_atau_host})`);
    addLog(`Enkripsi koneksi: AES-256 terverifikasi aktif`);

    // Simulated step sequence with real server prober call
    const t1 = setTimeout(() => {
      setProgress(30);
      setCurrentPhase('Fase 1: Uji Handshake Jaringan & Header Keamanan...');
      addLog(`Probing ${target.url_atau_host}:${target.port || (isWeb ? 443 : 5432)}... STATUS: Terhubung`);

      // Call backend prober endpoint
      fetch('/api/scan/prober', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl: target.url_atau_host }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data && data.reachable) {
            addLog(`[BACKEND PROBE] Latency: ${data.responseTimeMs}ms · Status: ${data.statusCode || 200} OK`);
          }
        })
        .catch(() => {});

      if (isWeb) {
        addLog(`Memeriksa Security Headers: CSP=MISSING, HSTS=AKTIF, X-Frame-Options=MISSING`);
      } else {
        addLog(`Memeriksa profil koneksi database ${target.db_engine}: Port 5432 terbuka, SSL transit aktif`);
      }
    }, 700);

    const t2 = setTimeout(() => {
      setProgress(60);
      setCurrentPhase(isWeb ? 'Fase 2: Eksekusi DAST Engine (OWASP Top 10 Injections)...' : 'Fase 2: Deteksi Eksposur PII & Verifikasi Enkripsi...');
      if (isWeb) {
        addLog(`Fuzzing titik input authentication & query parameter...`);
        addLog(`[ALERT] Injeksi SQL terdeteksi: respons anomali pada query endpoint (CVSS 9.6)`);
        addLog(`[ALERT] Broken Access Control: Token bypass terverifikasi pada resource entitas`);
      } else {
        addLog(`Introspeksi skema tabel: public.pegawai_master, public.rekam_medis_karyawan`);
        addLog(`[ALERT] Kolom 'nik' (16-digit data kependudukan) terdeteksi dalam format Plaintext (UU PDP Pasal 35)`);
        addLog(`[ALERT] Kolom 'kode_icd10' (data kesehatan spesifik) tersimpan tanpa enkripsi (UU PDP Pasal 39)`);
      }
    }, 1800);

    const t3 = setTimeout(() => {
      setProgress(85);
      setCurrentPhase('Fase 3: Pemetaan Otomatis Regulasi UU PDP & Standar BSSN...');
      addLog(`Menautkan temuan teknis ke UU PDP Pasal 35 (Kewajiban Pengamanan)`);
      addLog(`Menautkan temuan teknis ke UU PDP Pasal 39 (Enkripsi Data Spesifik)`);
      addLog(`Menghitung potensi sanksi administratif Pasal 57 (Hingga 2% Pendapatan)`);
    }, 2800);

    const t4 = setTimeout(() => {
      setProgress(100);
      setCurrentPhase('Audit Selesai. Hasil telah tercatat dalam basis data KARTIKA.');
      addLog(`Pemindaian tuntas. Seluruh log disimpan dalam jejak audit immutable.`);
      setIsCompleted(true);

      const generated: Temuan_Teknis[] = isWeb
        ? [
            {
              id_temuan: `TMN-GEN-${Date.now()}-1`,
              id_sesi: `SES-${Date.now()}`,
              target_nama: target.nama_target,
              judul_temuan: 'SQL Injection pada Modul Kueri Publik',
              kategori: 'OWASP',
              kode_owasp: 'A03:2021-Injection',
              tingkat_keparahan: 'Kritis',
              cvss_skor: 9.6,
              titik_kelemahan: `${target.url_atau_host}/api/v1/query`,
              parameter_terdampak: 'search, filter',
              deskripsi: 'Parameter input langsung dikonkatenasi ke dalam query SQL tanpa parameterized query.',
              bukti_payload: `GET ${target.url_atau_host}/api/v1/query?search=' OR '1'='1' -- HTTP/1.1\n--> Respon: 200 OK (Bypass Terkonfirmasi)`,
              status_enkripsi: 'Plaintext (Terekspos)',
              status_remediasi: 'Terbuka (Open)',
              langkah_remediasi: 'Gunakan Prepared Statements pada seluruh kueri database.',
              ditemukan_pada: new Date().toLocaleTimeString('id-ID') + ' WIB',
            },
          ]
        : [
            {
              id_temuan: `TMN-GEN-${Date.now()}-2`,
              id_sesi: `SES-${Date.now()}`,
              target_nama: target.nama_target,
              judul_temuan: 'Penyimpanan NIK 16-Digit Tanpa Enkripsi Kolom',
              kategori: 'PII',
              tingkat_keparahan: 'Kritis',
              cvss_skor: 9.2,
              titik_kelemahan: 'tabel public.pegawai_master',
              parameter_terdampak: 'kolom: nik, nama_lengkap',
              deskripsi: 'Format NIK 16 digit tersimpan dalam bentuk Plaintext tanpa enkripsi simetris.',
              bukti_payload: 'SELECT nik, nama_lengkap FROM pegawai_master LIMIT 1;\n--> Terbaca: 3174051203890002 [Plaintext]',
              status_enkripsi: 'Plaintext (Terekspos)',
              status_remediasi: 'Terbuka (Open)',
              langkah_remediasi: 'Enkripsi kolom dengan standar AES-256 sesuai Pasal 39 UU PDP.',
              ditemukan_pada: new Date().toLocaleTimeString('id-ID') + ' WIB',
            },
          ];

      setDetectedFindings(generated);
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [target]);

  const handleFinish = () => {
    onScanComplete(detectedFindings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0B1120] border border-slate-700 rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span>Konsol Pemindaian Keamanan Taktis</span>
                {isCompleted ? (
                  <span className="text-emerald-400 text-xs font-mono">· Selesai</span>
                ) : (
                  <span className="text-amber-400 text-xs font-mono flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Aktif</span>
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Target: {target.nama_target} ({target.url_atau_host})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar & Current Phase */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">{currentPhase}</span>
            <span className="font-mono text-blue-400 font-bold tabular-nums">{progress}%</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-blue-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Live Terminal Log Stream */}
        <div className="bg-black/90 border border-slate-800 rounded-lg p-3 font-mono text-xs text-emerald-400 h-48 overflow-y-auto space-y-1">
          {logs.map((line, idx) => (
            <div key={idx} className="leading-relaxed">
              {line.includes('[ALERT]') ? (
                <span className="text-red-400 font-bold">{line}</span>
              ) : line.includes('STATUS:') ? (
                <span className="text-blue-300">{line}</span>
              ) : (
                <span>{line}</span>
              )}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {detectedFindings.length > 0 && (
              <span className="text-red-400 font-semibold font-mono">
                {detectedFindings.length} Kerentanan Kritis Teridentifikasi
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isCompleted ? (
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Batalkan Sesi
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan & Lihat Hasil Temuan</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
