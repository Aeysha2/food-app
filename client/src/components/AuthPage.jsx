import React, { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, Sparkles, Loader2, ArrowRight, ShieldCheck, ShoppingBag, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage = ({ onContinueAsGuest }) => {
  const { login, register, quickDemoLogin, loading, authError, setAuthError } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  // Login & Register Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      await login(email, password);
    } else {
      await register({ name, email, password, phone, address });
    }
  };

  const handleDemo = async (role) => {
    await quickDemoLogin(role);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Subtle background glow */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Branding */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
            <span className="text-xl select-none">🍕</span>
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-100 flex items-center gap-1.5">
              Crave<span className="text-amber-400">Dash</span>
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Restaurant Gourmand & Gestion</span>
            </div>
          </div>
        </div>

        {onContinueAsGuest && (
          <button
            onClick={onContinueAsGuest}
            className="text-xs font-semibold text-slate-400 hover:text-slate-200 px-3.5 py-1.5 rounded-xl hover:bg-slate-800/80 transition-all border border-slate-800"
          >
            Explorer en invité &rarr;
          </button>
        )}
      </header>

      {/* Main Content: Split Hero & Auth Card */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Brand Presentation */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Plateforme Restaurant & Commandes</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
              Bienvenue sur <br />
              <span className="text-amber-400">
                CraveDash Food
              </span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
              Connectez-vous pour commander vos plats préférés ou accédez à l'espace gérant pour administrer la carte et éditer vos rapports financiers.
            </p>

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#131b2e] border border-slate-800/80">
                <ShoppingBag className="w-4 h-4 text-amber-400 mb-2" />
                <h4 className="text-xs font-bold text-slate-200">Commande Rapide</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Livraison en 30 min</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#131b2e] border border-slate-800/80">
                <Utensils className="w-4 h-4 text-amber-400 mb-2" />
                <h4 className="text-xs font-bold text-slate-200">Carte Artisanale</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Ingrédients du terroir</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#131b2e] border border-slate-800/80">
                <ShieldCheck className="w-4 h-4 text-amber-400 mb-2" />
                <h4 className="text-xs font-bold text-slate-200">Espace Gérant</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Rapports & Menu</p>
              </div>
            </div>
          </div>

          {/* Right Column: Refined Dark Authentication Card */}
          <div className="lg:col-span-6 max-w-md w-full mx-auto">
            <div className="bg-[#131b2e] rounded-3xl shadow-xl overflow-hidden border border-slate-800 text-slate-200">
              
              {/* Card Header */}
              <div className="p-6 bg-[#0f172a] border-b border-slate-800">
                <h2 className="text-xl font-black text-slate-100 tracking-tight">
                  {mode === 'login' ? 'Connexion à votre espace' : 'Créer un nouveau compte'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {mode === 'login'
                    ? 'Identifiez-vous pour accéder à vos commandes ou au dashboard'
                    : 'Remplissez vos coordonnées pour ouvrir un compte client'}
                </p>
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-slate-800 bg-[#0f172a]/60 text-xs font-bold text-center">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setAuthError(null); }}
                  className={`flex-1 py-3 border-b-2 transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'border-amber-400 text-amber-300 bg-[#131b2e] font-black'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Se connecter
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setAuthError(null); }}
                  className={`flex-1 py-3 border-b-2 transition-all cursor-pointer ${
                    mode === 'register'
                      ? 'border-amber-400 text-amber-300 bg-[#131b2e] font-black'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Créer un compte
                </button>
              </div>

              {/* Instant 1-Click Demo Logins */}
              <div className="p-4 bg-slate-900/60 border-b border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Accès Démo Instantané (1 Clic) :</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleDemo('user')}
                    type="button"
                    disabled={loading}
                    className="p-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-bold rounded-xl transition-all active:scale-95 text-left flex flex-col cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 text-slate-200 font-bold">
                      👤 Client Démo
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Commandes & Panier</span>
                  </button>

                  <button
                    onClick={() => handleDemo('admin')}
                    type="button"
                    disabled={loading}
                    className="p-2.5 bg-slate-900/90 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-xs font-bold rounded-xl transition-all active:scale-95 text-left flex flex-col cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                      🛡️ Admin Démo
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Sidebar & Rapports</span>
                  </button>
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {authError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium rounded-xl flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Nom complet <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Sarah Connor"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500/60 transition-all"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Adresse Email <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nom@exemple.com"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500/60 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Mot de passe <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500/60 transition-all"
                    />
                  </div>
                </div>

                {mode === 'register' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Numéro de téléphone
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+33 6 12 34 56 78"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500/60 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Adresse de livraison
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="123 Rue de Paris"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-100 outline-none focus:border-amber-500/60 transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  <span>
                    {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                  </span>
                </button>
              </form>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 text-center text-xs text-slate-400">
        <span>CraveDash Food Delivery Platform</span>
      </footer>

    </div>
  );
};
