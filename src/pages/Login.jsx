import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrar autenticação real
    navigate('/');
  };

  return (
    <div className="min-h-screen gradient-burgundy flex items-center justify-center px-6 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-burgundy-light/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-rose-glass/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <span className="font-heading text-3xl font-light tracking-wider text-pearl">VELVET</span>
            <span className="font-heading text-3xl font-light tracking-wider text-rose-glass">·</span>
            <span className="font-heading text-base font-light tracking-widest text-rose-glass/70 uppercase">Atelier</span>
          </Link>
          <h1 className="font-heading text-4xl font-light text-pearl mb-2">Bem-vinda</h1>
          <p className="font-body text-sm text-pearl/40">Entre na sua conta para continuar</p>
        </div>

        <div className="glass rounded-3xl p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-body text-xs text-pearl/40 tracking-wider uppercase mb-2 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pearl/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full glass-subtle rounded-xl pl-11 pr-4 py-3.5 font-body text-sm text-pearl placeholder:text-pearl/20 outline-none border border-pearl/5 focus:border-rose-glass/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="font-body text-xs text-pearl/40 tracking-wider uppercase mb-2 block">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pearl/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full glass-subtle rounded-xl pl-11 pr-11 py-3.5 font-body text-sm text-pearl placeholder:text-pearl/20 outline-none border border-pearl/5 focus:border-rose-glass/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-pearl/30 hover:text-pearl/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full glass-strong rounded-xl py-4 font-body text-sm tracking-widest uppercase text-pearl hover:bg-white/10 transition-all duration-300 mt-2"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-body text-xs text-pearl/30">
              Não tem uma conta?{' '}
              <Link to="/" className="text-rose-glass/70 hover:text-rose-glass transition-colors">
                Entre em contato
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}