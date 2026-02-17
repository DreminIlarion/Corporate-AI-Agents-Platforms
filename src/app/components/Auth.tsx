import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';

export function AuthPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center p-6 overflow-hidden relative">
        
      <div className="z-0 absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full" />
      <div className="z-0 absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px] relative z-10"
      >
        {/* Логотип */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-red-800 rounded-2xl flex items-center justify-center mb-4">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-lg  tracking-[0.3em] uppercase text-white">
            AI-ДИО 
          </h1>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mt-2">
            Авторизация 
          </p>
        </div>

        {/* Форма */}
        <div className="bg-[#1c1c1c] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px]  uppercase tracking-[0.15em] text-slate-400 ml-1">
                Email:
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-red-800 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#141414] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-red-800/50 focus:ring-4 focus:ring-red-900/10 transition-all placeholder:text-slate-700"
                  placeholder="mail@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px]  uppercase tracking-[0.15em] text-slate-400 ml-1">
                Пароль:
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-red-800 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#141414] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-red-800/50 focus:ring-4 focus:ring-red-900/10 transition-all placeholder:text-slate-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              onClick={onLogin}
              className="w-full h-14 bg-red-800 hover:bg-red-700 text-white rounded-2xl  uppercase tracking-[0.2em] text-xs shadow-lg shadow-red-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              Войти в систему
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
              <ShieldCheck className="w-3 h-3 text-red-800" />
              2AUTH
            </div>
            <button className="text-[10px]  text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
              Забыли пароль?
            </button>
          </div>
        </div>

        
      </motion.div>
    </div>
  );
}