import React from 'react';
import { Flame } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-100 dark:bg-[#090808] border-t border-stone-200 dark:border-stone-900 text-stone-600 dark:text-stone-400 text-xs py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl">🍕</span>
            <span className="font-serif font-black text-stone-900 dark:text-white text-lg tracking-tight">THE HOME PIPO</span>
            <span className="text-stone-300 dark:text-stone-700">|</span>
            <span className="text-stone-600 dark:text-stone-400 font-medium">Horno de Gas sobre Piedra Volcánica</span>
          </div>

          {/* Social / Info Links */}
          <div className="flex flex-wrap items-center gap-6 text-stone-700 dark:text-stone-400 font-medium">
            <a href="#menu" className="hover:text-orange-600 dark:hover:text-amber-400 transition-colors">Menú</a>
            <a href="#builder" className="hover:text-orange-600 dark:hover:text-amber-400 transition-colors">Arma tu Pizza</a>
            <a href="#ai-chef" className="hover:text-orange-600 dark:hover:text-amber-400 transition-colors">Chef Pipo AI</a>
            <a href="#sucursal" className="hover:text-orange-600 dark:hover:text-amber-400 transition-colors">Sucursal</a>
            <a href="#contacto" className="hover:text-orange-600 dark:hover:text-amber-400 transition-colors">Contacto</a>
            <a
              href="/api/download-zip"
              download="THE-HOME-PIPO-fuente.zip"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-lg border border-emerald-500/30 transition-colors"
              title="Descargar código fuente completo en ZIP"
            >
              <span>📥 Descargar ZIP</span>
            </a>
          </div>

        </div>

        <div className="pt-6 border-t border-stone-200 dark:border-stone-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500">
          <p>© {new Date().getFullYear()} THE HOME PIPO. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Hecho con pasión</span>
            <Flame className="w-3.5 h-3.5 text-orange-500 inline fill-orange-500" />
            <span>y masa madre recién horneada al momento.</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

