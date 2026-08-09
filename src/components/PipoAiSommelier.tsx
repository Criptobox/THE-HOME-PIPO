import React, { useState } from 'react';
import { Sparkles, Bot, Send, Plus, Check, RefreshCw, Flame, AlertCircle } from 'lucide-react';
import { CartItem, AiRecommendationResponse } from '../types';

interface PipoAiSommelierProps {
  onAddToCart: (cartItem: CartItem) => void;
}

export const PipoAiSommelier: React.FC<PipoAiSommelierProps> = ({ onAddToCart }) => {
  const [prompt, setPrompt] = useState('');
  const [peopleCount, setPeopleCount] = useState<string>('3-4 personas');
  const [budget, setBudget] = useState<string>('350');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<AiRecommendationResponse | null>(null);

  const presetQueries = [
    'Somos 4 personas, nos gusta el pepperoni y queremos gastar poco',
    'Busco una pizza vegetariana deliciosa con vino o entrada',
    'Recomiéndame lo más picante e icónico de la casa para ver el juego',
    'Combo romántico para 2 personas con postre de Nutella',
  ];

  const handleConsultAi = async (customPrompt?: string) => {
    const queryToUse = customPrompt || prompt;
    if (!queryToUse.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryToUse,
          peopleCount,
          budget,
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo obtener la recomendación de Chef Pipo.');
      }

      const data: AiRecommendationResponse = await response.json();
      setRecommendation(data);
    } catch (err: any) {
      console.error('Error consulting AI:', err);
      setError(err.message || 'Ocurrió un error al consultar al Chef Pipo.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAiComboToCart = () => {
    if (!recommendation) return;

    recommendation.pizzas.forEach((p, idx) => {
      const cartItem: CartItem = {
        cartItemId: `ai_${Date.now()}_${idx}`,
        title: `${p.name} (${p.suggestedSize})`,
        detailsText: `Recomendado por Chef Pipo AI • ${p.description}`,
        sizeName: p.suggestedSize,
        unitPrice: p.estimatedPrice,
        quantity: 1,
      };
      onAddToCart(cartItem);
    });
  };

  return (
    <section id="ai-chef" className="py-16 bg-[#0E0D0C] text-stone-100 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-br from-stone-900 via-[#191614] to-stone-950 p-6 sm:p-10 rounded-3xl border border-purple-900/30 shadow-2xl relative overflow-hidden">
          
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Prompt Column */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-700/40 text-purple-300 text-xs font-bold uppercase tracking-wider">
                  <Bot className="w-4 h-4 text-amber-400" />
                  <span>Pipo AI Chef & Sommelier</span>
                </span>
                <h2 className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight">
                  ¿No sabes qué pedir hoy?
                </h2>
                <p className="text-stone-300 text-sm leading-relaxed">
                  Cuéntale al Chef Pipo tus antojos, número de invitados o presupuesto y nuestra inteligencia artificial diseñará la combinación perfecta para ti.
                </p>
              </div>

              {/* Quick Preset Chips */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-400 block">Sugerencias rápidas:</span>
                <div className="flex flex-wrap gap-2">
                  {presetQueries.map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setPrompt(preset);
                        handleConsultAi(preset);
                      }}
                      className="text-left text-xs bg-stone-800/90 hover:bg-stone-700 text-stone-200 px-3 py-2 rounded-xl border border-stone-700/80 transition-colors"
                    >
                      "{preset}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Controls */}
              <div className="space-y-3 bg-stone-950/80 p-4 rounded-2xl border border-stone-800">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                      Personas
                    </label>
                    <select
                      value={peopleCount}
                      onChange={(e) => setPeopleCount(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="1 persona">1 Persona</option>
                      <option value="2 personas">2 Personas (Pareja)</option>
                      <option value="3-4 personas">3-4 Personas</option>
                      <option value="5+ personas">5+ Personas (Fiesta)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                      Presupuesto aprox.
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="200">Hasta $200</option>
                      <option value="350">$350 aprox.</option>
                      <option value="500">$500 aprox.</option>
                      <option value="800">Sin límite ($800+)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-400 block mb-1">
                    Escribe tu antojo o restricciones
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ej: Nos gusta la carne, queremos masa delgada y algo dulce..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleConsultAi()}
                      className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={() => handleConsultAi()}
                      disabled={loading}
                      className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-xs rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Recommendation Result Column */}
            <div className="lg:col-span-7 bg-[#141210] p-6 rounded-2xl border border-stone-800 min-h-[380px] flex flex-col justify-between">
              
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="relative">
                    <Bot className="w-12 h-12 text-amber-400 animate-bounce" />
                    <Sparkles className="w-5 h-5 text-purple-400 absolute -top-1 -right-1 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-serif">Chef Pipo está pensando...</h3>
                    <p className="text-xs text-stone-400 mt-1">Consultando nuestras mejores recetas, hornos y combos para ti.</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 text-red-400">
                  <AlertCircle className="w-10 h-10" />
                  <p className="text-sm font-semibold">{error}</p>
                </div>
              ) : recommendation ? (
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* Title & Reason */}
                  <div className="border-b border-stone-800 pb-4">
                    <span className="text-[10px] uppercase font-extrabold text-amber-400 tracking-wider">
                      Recomendación de Chef Pipo
                    </span>
                    <h3 className="text-2xl font-black font-serif text-white mt-1">
                      {recommendation.recommendationTitle}
                    </h3>
                    <p className="text-stone-300 text-xs sm:text-sm mt-2 leading-relaxed">
                      "{recommendation.summaryReason}"
                    </p>
                  </div>

                  {/* Pizzas / Combos list */}
                  <div className="space-y-3">
                    {recommendation.pizzas.map((p, idx) => (
                      <div
                        key={idx}
                        className="bg-stone-900/80 p-3.5 rounded-xl border border-stone-800 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-white">{p.name}</h4>
                            <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800/50">
                              {p.suggestedSize}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5">{p.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-sm font-black text-amber-400">${p.estimatedPrice}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chef Tip */}
                  <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-800/40 text-xs text-purple-200 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span><strong>Tip Secreto del Chef:</strong> {recommendation.tipFromChef}</span>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-stone-400 block">Total del Combo AI</span>
                      <span className="text-2xl font-black text-amber-400">${recommendation.totalEstimated}</span>
                    </div>

                    <button
                      onClick={handleAddAiComboToCart}
                      className="px-5 py-3 bg-gradient-to-r from-purple-600 via-red-600 to-orange-600 hover:from-purple-500 hover:to-orange-500 text-white font-extrabold text-xs rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Añadir Combo AI al Carrito</span>
                    </button>
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <Bot className="w-12 h-12 text-stone-600" />
                  <p className="text-stone-400 text-sm">
                    Selecciona una sugerencia o escribe lo que tienes en mente para recibir la sugerencia perfecta del Chef Pipo.
                  </p>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
