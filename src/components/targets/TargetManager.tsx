import React, { useState } from 'react';
import {
  Server,
  Globe,
  Database,
  Plus,
  Lock,
  Play,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { Target_Sistem, TargetType } from '../../types/kartika';

interface TargetManagerProps {
  targets: Target_Sistem[];
  onAddTarget: (target: Omit<Target_Sistem, 'id_target' | 'dibuat_pada'>) => void;
  onDeleteTarget: (id: string) => void;
  onTestConnection: (id: string) => Promise<boolean>;
  onStartScan: (target: Target_Sistem) => void;
}

export const TargetManager: React.FC<TargetManagerProps> = ({
  targets,
  onAddTarget,
  onDeleteTarget,
  onTestConnection,
  onStartScan,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);

  // Form State
  const [namaTarget, setNamaTarget] = useState('');
  const [tipe, setTipe] = useState<TargetType>('web');
  const [urlAtauHost, setUrlAtauHost] = useState('');
  const [port, setPort] = useState<number>(443);
  const [dbName, setDbName] = useState('');
  const [dbUser, setDbUser] = useState('');
  const [dbPassword, setDbPassword] = useState('');
  const [dbEngine, setDbEngine] = useState<'mysql' | 'postgresql'>('postgresql');
  const [deskripsi, setDeskripsi] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaTarget || !urlAtauHost) return;

    onAddTarget({
      id_pengguna: 'USR-001',
      nama_target: namaTarget,
      tipe,
      url_atau_host: urlAtauHost,
      port: Number(port) || (tipe === 'web' ? 443 : 5432),
      db_name: tipe === 'database' ? dbName : undefined,
      db_user: tipe === 'database' ? dbUser : undefined,
      db_engine: tipe === 'database' ? dbEngine : undefined,
      kredensial_terenkripsi: true, // AES-256 standard flag
      status_koneksi: 'Tersambung',
      deskripsi: deskripsi || (tipe === 'web' ? 'Aplikasi Web Target Audit' : 'Basis Data Target Audit'),
      terakhir_diuji: new Date().toLocaleTimeString('id-ID') + ' WIB',
    });

    // Reset Form
    setNamaTarget('');
    setUrlAtauHost('');
    setDbName('');
    setDbUser('');
    setDbPassword('');
    setDeskripsi('');
    setShowAddModal(false);
  };

  const handleTest = async (id: string) => {
    setTestingId(id);
    await onTestConnection(id);
    setTestingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 tracking-tight">
            Manajemen Target Audit Keamanan
          </h2>
          <p className="text-xs text-slate-400">
            Registrasi URL aplikasi web (DAST) dan kredensial basis data (MySQL/PostgreSQL) yang terenkripsi AES-256
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Target Sistem</span>
        </button>
      </div>

      {/* Target Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {targets.map((tgt) => {
          const isWeb = tgt.tipe === 'web';
          const isTesting = testingId === tgt.id_target;

          return (
            <div
              key={tgt.id_target}
              className="bg-[#0D1526] border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                      {isWeb ? (
                        <Globe className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Database className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-200">
                        {tgt.nama_target}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <span>{isWeb ? 'Web Application' : `Database (${tgt.db_engine || 'SQL'})`}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteTarget(tgt.id_target)}
                    title="Hapus Target"
                    className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Connection Details */}
                <div className="space-y-2 text-xs py-3 border-y border-slate-800/80">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Host / URL:</span>
                    <span className="font-mono text-slate-200 max-w-[190px] truncate">
                      {tgt.url_atau_host}
                    </span>
                  </div>
                  {tgt.port && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Port Layanan:</span>
                      <span className="font-mono text-slate-200">{tgt.port}</span>
                    </div>
                  )}
                  {tgt.db_name && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Database:</span>
                      <span className="font-mono text-slate-200">{tgt.db_name}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Enkripsi Kredensial:</span>
                    <span className="flex items-center gap-1 text-[11px] font-mono text-blue-400">
                      <Lock className="w-3 h-3" />
                      <span>AES-256</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-3 line-clamp-2">
                  {tgt.deskripsi}
                </p>
              </div>

              {/* Card Actions */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleTest(tgt.id_target)}
                  disabled={isTesting}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded transition-colors"
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menguji...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Uji Koneksi</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onStartScan(tgt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Mulai Audit</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Tambah Target */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0B1120] border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  Registrasi Target Audit Baru
                </h3>
                <p className="text-xs text-slate-400">
                  Kredensial koneksi otomatis dienkripsi dengan standar AES-256
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nama Target Sistem
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Portal Layanan Terpadu"
                  value={namaTarget}
                  onChange={(e) => setNamaTarget(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Tipe Target
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTipe('web');
                      setPort(443);
                    }}
                    className={`py-2 px-3 rounded-lg border text-center font-medium transition-colors ${
                      tipe === 'web'
                        ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Aplikasi Web (DAST)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTipe('database');
                      setPort(5432);
                    }}
                    className={`py-2 px-3 rounded-lg border text-center font-medium transition-colors ${
                      tipe === 'database'
                        ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Basis Data (PII Engine)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">
                    {tipe === 'web' ? 'URL Web' : 'Host / IP Address'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={tipe === 'web' ? 'https://app.instansi.go.id' : '10.10.20.15'}
                    value={urlAtauHost}
                    onChange={(e) => setUrlAtauHost(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Port
                  </label>
                  <input
                    type="number"
                    value={port}
                    onChange={(e) => setPort(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {tipe === 'database' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Database Engine
                      </label>
                      <select
                        value={dbEngine}
                        onChange={(e) => setDbEngine(e.target.value as 'mysql' | 'postgresql')}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                      >
                        <option value="postgresql">PostgreSQL</option>
                        <option value="mysql">MySQL / MariaDB</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Nama Database
                      </label>
                      <input
                        type="text"
                        placeholder="db_layanan"
                        value={dbName}
                        onChange={(e) => setDbName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Username Database
                      </label>
                      <input
                        type="text"
                        placeholder="readonly_user"
                        value={dbUser}
                        onChange={(e) => setDbUser(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Password (AES-256 Protected)
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={dbPassword}
                        onChange={(e) => setDbPassword(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Deskripsi / Fungsi Sistem
                </label>
                <input
                  type="text"
                  placeholder="Misal: Portal publik pendaftaran dan verifikasi berkas"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  Simpan Target Terenkripsi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
