import React, { useState } from 'react';
import { Flame, Sparkles, Clock, Star, ShieldCheck, ArrowRight, Pizza, Loader2 } from 'lucide-react';
import heroPizzaImg from '../assets/images/pipo_hero_pizza_1786284977229.jpg';

interface HeroProps {
  onOrderNow: () => void;
  onOpenBuilder: () => void;
  ovenStatus?: string;
}

export const Hero: React.FC<HeroProps> = ({ onOrderNow, onOpenBuilder, ovenStatus }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOrderClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      onOrderNow();
      setIsLoading(false);
    }, 450);
  };

  return (
    <section id="hero" className="relative bg-[#0F0E0D] text-white pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Brand Message & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Live Store Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/90 border border-orange-500/30 text-xs font-semibold text-amber-300 shadow-xl backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              <span>{ovenStatus || 'Horno de Piedra encendido a 450°C'}</span>
              <span className="hidden sm:inline text-stone-500">•</span>
              <span className="hidden sm:inline text-stone-300">Entrega en ~30 min</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight font-serif leading-[1.08]">
              La auténtica pasión por la <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-orange-400 via-red-500 to-amber-300 bg-clip-text text-transparent">
                buena pizza artesanal
              </span>
            </h1>

            {/* Description */}
            <p className="text-stone-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              En <strong className="text-amber-400 font-semibold">Pizzas Pipo</strong> fermentamos nuestra masa madre por 48 horas, usamos mozzarella 100% puro de rancho y horneamos a fuego de leña. ¡Prueba la diferencia hoy mismo!
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button
                onClick={handleOrderClick}
                disabled={isLoading}
                className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-500 hover:to-orange-500 text-white font-extrabold text-base rounded-2xl shadow-2xl shadow-red-900/60 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 group border border-orange-400/40 disabled:opacity-80"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 text-amber-300 animate-spin" />
                    <span>Cargando Menú...</span>
                  </>
                ) : (
                  <>
                    <Pizza className="w-5 h-5 text-amber-300 group-hover:rotate-45 transition-transform" />
                    <span>Ver Menú y Pedir</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <button
                onClick={onOpenBuilder}
                className="w-full sm:w-auto px-6 py-4 bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white font-bold text-base rounded-2xl border border-stone-800 shadow-xl transition-all duration-200 flex items-center justify-center gap-2.5 hover:border-orange-500/50"
              >
                <span>Arma tu Pizza</span>
              </button>
            </div>

            {/* Quick Metrics / Guarantees */}
            <div className="pt-6 border-t border-stone-900 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-1 text-amber-400 font-extrabold text-lg">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>4.9 / 5</span>
                </div>
                <p className="text-stone-400 text-xs mt-0.5">+2,500 Reseñas</p>
              </div>

              <div>
                <div className="flex items-center justify-center lg:justify-start gap-1 text-orange-400 font-extrabold text-lg">
                  <Clock className="w-4 h-4" />
                  <span>30 Min</span>
                </div>
                <p className="text-stone-400 text-xs mt-0.5">Promesa de Entrega</p>
              </div>

              <div>
                <div className="flex items-center justify-center lg:justify-start gap-1 text-emerald-400 font-extrabold text-lg">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Caliente</span>
                </div>
                <p className="text-stone-400 text-xs mt-0.5">Bolsa Térmica Pro</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Pizza Visual Display */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Main Pizza Card Container */}
            <div className="relative w-full max-w-md lg:max-w-none rounded-3xl p-3 bg-gradient-to-b from-stone-800/60 to-stone-900/90 border border-stone-800/80 shadow-2xl shadow-red-950/40 group">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-square">
                <img
                  src={heroPizzaImg}
                  alt="Pizza Pipo Suprema Recién Horneada"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Floating Tag 1: Quality Badge */}
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-orange-500/40 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>Masa Madre 48h</span>
                </div>

                {/* Floating Tag 2: Top Seller */}
                <div className="absolute bottom-4 left-4 right-4 bg-stone-950/85 backdrop-blur-md border border-stone-800 p-3.5 rounded-2xl shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Especialidad de la Casa</span>
                    <h3 className="text-sm font-bold text-white font-serif">Pizza Pipo Suprema</h3>
                    <p className="text-xs text-stone-300">Pepperoni, tocino & salchicha artesanal</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block line-through">$189</span>
                    <span className="text-lg font-black text-amber-400">$169</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
