import React from 'react';
import { Flame, Download, Code2, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  const handleDownloadZip = () => {
    window.open('/api/download-zip', '_blank');
  };

  return (
    <footer className="bg-[#090808] border-t border-stone-900 text-stone-400 text-xs py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl">🍕</span>
            <span className="font-serif font-black text-white text-lg tracking-tight">PIZZAS PIPO</span>
            <span className="text-stone-600">|</span>
            <span className="text-stone-400">Horno de Piedra Artesanal</span>
          </div>

          {/* Social / Info Links */}
          <div className="flex items-center gap-6 text-stone-400 font-medium">
            <a href="#menu" className="hover:text-amber-400 transition-colors">Menú</a>
            <a href="#builder" className="hover:text-amber-400 transition-colors">Arma tu Pizza</a>
            <a href="#ai-chef" className="hover:text-amber-400 transition-colors">Pipo AI Chef</a>
            <a href="#contacto" className="hover:text-amber-400 transition-colors">Contacto</a>
          </div>

          {/* Direct ZIP Download button */}
          <div>
            <a
              href="/api/download-zip"
              download="pizzas-pipo-fuente.zip"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 hover:text-white font-extrabold text-xs rounded-xl border border-stone-800 transition-all shadow-md flex items-center gap-2 active:scale-95 inline-flex"
              title="Descargar todos los archivos fuente del proyecto en un .ZIP"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Descargar Proyecto (.ZIP)</span>
            </a>
          </div>

        </div>

        <div className="pt-6 border-t border-stone-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500">
          <p>© {new Date().getFullYear()} Pizzas Pipo S.A. de C.V. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Hecho con</span>
            <Flame className="w-3.5 h-3.5 text-orange-500 inline fill-orange-500" />
            <span>y masa madre recién horneada.</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
