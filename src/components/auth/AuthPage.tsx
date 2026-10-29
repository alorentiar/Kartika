import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  Scale,
  UserCheck,
  Lock,
  Mail,
  User,
  Building,
  Briefcase,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { Pengguna, UserRole } from '../../types/kartika';

interface AuthPageProps {
  users: Pengguna[];
  onLogin: (user: Pengguna) => void;
  onRegister: (newUser: Pengguna) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  users,
  onLogin,
  onRegister,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('ahmad.fauzi@tni-ad.mil.id');
  const [loginPassword, setLoginPassword] = useState('KartikaSec#2026');

  // Register Form States
  const [regNama, setRegNama] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPeran, setRegPeran] = useState<UserRole>('security');
  const [regJabatan, setRegJabatan] = useState('');
  const [regInstansi, setRegInstansi] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Handle Manual Login
  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const user = users.find(
      (u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (!user) {
      setErrorMessage('Alamat email dinas tidak ditemukan dalam sistem otorisasi KARTIKA.');
      return;
    }

    if (user.password && user.password !== loginPassword) {
      setErrorMessage('Kata sandi yang Anda masukkan salah. Silakan periksa kembali.');
      return;
    }

    onLogin(user);
  };

  // Handle Quick Login Click
  const handleQuickLogin = (user: Pengguna) => {
    setErrorMessage(null);
    setLoginEmail(user.email);
    setLoginPassword(user.password || '');
    onLogin(user);
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (regPassword.length < 6) {
      setErrorMessage('Kata sandi minimal harus 6 karakter.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    const emailExists = users.some(
      (u) => u.email.toLowerCase() === regEmail.trim().toLowerCase()
    );

    if (emailExists) {
      setErrorMessage('Alamat email dinas tersebut sudah terdaftar.');
      return;
    }

    const newUser: Pengguna = {
      id_pengguna: `USR-${Date.now().toString().slice(-4)}`,
      nama: regNama.trim(),
      email: regEmail.trim(),
      peran: regPeran,
      jabatan: regJabatan.trim() || 'Auditor Keamanan Siber',
      instansi: regInstansi.trim() || 'Satuan Keamanan Informasi',
      password: regPassword,
    };

    onRegister(newUser);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-950/80 border border-blue-500/30 text-blue-400 mb-1">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-slate-100">
            KARTIKA
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Kepatuhan Audit Risiko & Teknologi Informasi Keamanan Aplikasi
            <span className="block text-[11px] font-mono text-slate-500 mt-0.5">
              Standar Regulasi UU PDP No. 27/2022 & Pedoman Teknis BSSN
            </span>
          </p>
        </div>

        {/* Auth Mode Segmented Tabs */}
        <div className="bg-slate-900/80 border border-slate-800 p-1 rounded-xl flex items-center">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors text-center ${
              authMode === 'login'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Masuk Sistem (Login)
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors text-center ${
              authMode === 'register'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Registrasi Personel Baru
          </button>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW: LOGIN MODE */}
        {/* ========================================================= */}
        {authMode === 'login' ? (
          <div className="space-y-6">
            {/* Quick Login Section (Dummy Credentials) */}
            <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kredensial Dummy Siap Pakai (Quick Login)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">1-Klik Masuk</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Pilih salah satu peran pengguna di bawah untuk menguji aplikasi dengan kredensial pra-konfigurasi:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {users.slice(0, 3).map((u) => {
                  let roleName = 'Auditor IT';
                  let Icon = ShieldAlert;
                  let borderHover = 'hover:border-blue-500/60';
                  if (u.peran === 'legal') {
                    roleName = 'Legal Officer';
                    Icon = Scale;
                    borderHover = 'hover:border-amber-500/60';
                  } else if (u.peran === 'commander') {
                    roleName = 'Komandan Satuan';
                    Icon = UserCheck;
                    borderHover = 'hover:border-emerald-500/60';
                  }

                  return (
                    <button
                      key={u.id_pengguna}
                      type="button"
                      onClick={() => handleQuickLogin(u)}
                      className={`p-3 bg-slate-900/90 border border-slate-800 ${borderHover} rounded-lg text-left transition-all group flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 group-hover:text-blue-300">
                          <Icon className="w-3.5 h-3.5" />
                          <span>{roleName}</span>
                        </div>
                        <div className="text-[11px] text-slate-300 truncate mt-1">
                          {u.nama}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 truncate">
                          {u.email}
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-blue-400 group-hover:underline">
                        <span>Masuk →</span>
                        <span className="font-mono text-slate-500">{u.password}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Manual Login Form */}
            <form onSubmit={handleManualLogin} className="bg-[#0B1120] border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="border-b border-slate-800/80 pb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Masuk Manual
                </h3>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Alamat Email Dinas
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="nama.personel@instansi.mil.id"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-9 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-500 hover:text-slate-300 absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Masuk ke Dasbor KARTIKA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* ========================================================= */
          /* VIEW: REGISTER MODE */
          /* ========================================================= */
          <form onSubmit={handleRegisterSubmit} className="bg-[#0B1120] border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="border-b border-slate-800/80 pb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Registrasi Personel Instansi Baru
              </h3>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Peran Pengguna (User Persona)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRegPeran('security')}
                  className={`p-2.5 rounded-lg border text-xs font-medium transition-colors flex flex-col items-center gap-1 ${
                    regPeran === 'security'
                      ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Auditor IT</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRegPeran('legal')}
                  className={`p-2.5 rounded-lg border text-xs font-medium transition-colors flex flex-col items-center gap-1 ${
                    regPeran === 'legal'
                      ? 'border-amber-500 bg-amber-600/20 text-amber-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                  <span>Legal Officer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRegPeran('commander')}
                  className={`p-2.5 rounded-lg border text-xs font-medium transition-colors flex flex-col items-center gap-1 ${
                    regPeran === 'commander'
                      ? 'border-emerald-500 bg-emerald-600/20 text-emerald-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Komandan</span>
                </button>
              </div>
            </div>

            {/* Nama & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Lengkap & Gelar
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Mayor Chb Rudi Hartono, S.T."
                    value={regNama}
                    onChange={(e) => setRegNama(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Dinas
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="rudi.hartono@kemhan.go.id"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Instansi & Jabatan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Instansi / Satuan Kerja
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Pusat Pertahanan Siber"
                    value={regInstansi}
                    onChange={(e) => setRegInstansi(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Jabatan Resmi
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Analis Kerentanan Aplikasi"
                    value={regJabatan}
                    onChange={(e) => setRegJabatan(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimal 6 karakter"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Konfirmasi Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Ketik ulang sandi"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Daftarkan Akun & Buka Dasbor</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
