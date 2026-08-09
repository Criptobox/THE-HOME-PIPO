import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  MessageSquarePlus,
  MapPin,
  Phone,
  Clock,
  ChevronDown,
  CheckCircle2,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Quote,
  ThumbsUp,
  Play,
  Pause,
  Sparkles,
  X,
  Pizza,
  Check
} from 'lucide-react';
import { Review, MenuItem } from '../types';
import { REVIEWS, MENU_ITEMS } from '../data/menu';

interface ReviewsAndContactProps {
  storeInfo?: {
    name: string;
    address: string;
    phone: string;
    schedule: string;
    tickerMessage: string;
    ovenStatus: string;
  };
  reviews?: Review[];
  onSaveReviews?: (reviews: Review[]) => void;
  menuItems?: MenuItem[];
}

export const ReviewsAndContact: React.FC<ReviewsAndContactProps> = ({
  storeInfo,
  reviews,
  onSaveReviews,
  menuItems,
}) => {
  const currentReviews = reviews || REVIEWS;
  const currentMenuItems = menuItems || MENU_ITEMS;

  // Carousel State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [helpfulVotes, setHelpfulVotes] = useState<{ [id: string]: number }>(() => {
    try {
      const saved = localStorage.getItem('pipo_helpful_votes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [authorInput, setAuthorInput] = useState('');
  const [ratingInput, setRatingInput] = useState(5);
  const [pizzaInput, setPizzaInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Auto-play interval timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAutoplay && currentReviews.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % currentReviews.length);
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoplay, currentReviews.length]);

  const handleNextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % currentReviews.length);
  };

  const handlePrevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + currentReviews.length) % currentReviews.length);
  };

  const handleToggleHelpful = (reviewId: string) => {
    const updated = {
      ...helpfulVotes,
      [reviewId]: (helpfulVotes[reviewId] || 0) + 1,
    };
    setHelpfulVotes(updated);
    try {
      localStorage.setItem('pipo_helpful_votes', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorInput.trim() || !commentInput.trim()) return;

    const newRev: Review = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      author: authorInput.trim(),
      rating: ratingInput,
      comment: commentInput.trim(),
      date: 'Reciente',
      pizzaName: pizzaInput.trim() || undefined,
    };

    const updatedReviewsList = [newRev, ...currentReviews];
    if (onSaveReviews) {
      onSaveReviews(updatedReviewsList);
    }

    setAuthorInput('');
    setPizzaInput('');
    setCommentInput('');
    setRatingInput(5);
    setShowReviewModal(false);

    // Jump to newly added review card at index 0
    setCurrentIndex(0);

    // Toast confirmation
    setToastMessage('¡Muchas gracias! Tu opinión ha sido publicada y sincronizada en tiempo real.');
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Helper avatar background colors
  const avatarGradients = [
    'from-red-600 to-orange-500',
    'from-amber-500 to-yellow-600',
    'from-orange-600 to-red-500',
    'from-emerald-600 to-teal-500',
    'from-rose-600 to-pink-500',
  ];

  const faqs = [
    {
      q: '¿Cuál es el tiempo promedio de entrega de Pizzas Pipo?',
      a: 'Nuestro tiempo de entrega es de 30 a 40 minutos en la zona metropolitana. Mantenemos las pizzas en bolsas térmicas con piedra volcánica sellada para que lleguen recién salidas del horno.',
    },
    {
      q: '¿Puedo pedir la pizza con dos especialidades diferentes en mitades?',
      a: '¡Por supuesto! En nuestro creador "Arma tu Pizza" o seleccionando cualquier especialidad puedes personalizar cada mitad con tus ingredientes preferidos.',
    },
    {
      q: '¿Qué métodos de pago aceptan?',
      a: 'Aceptamos pago en efectivo al entregador, tarjeta de crédito/débito mediante terminal inalámbrica en la puerta de tu casa, o transferencia SPEI.',
    },
    {
      q: '¿Las salsas especiales y aderezos vienen por separado?',
      a: 'Sí, la famosa Salsa Diabla Pipo, el Aderezo Ranch Artesanal y las Especias Italianas se empacan en contenedores herméticos individuales.',
    },
  ];

  // Calculate average rating
  const avgRating = (
    currentReviews.reduce((sum, r) => sum + r.rating, 0) / (currentReviews.length || 1)
  ).toFixed(1);

  return (
    <section id="contacto" className="py-16 bg-[#0E0D0C] text-stone-100 border-t border-stone-800 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-400 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* CUSTOMER TESTIMONIALS CAROUSEL SECTION */}
        <div className="space-y-8">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-2 border-b border-stone-800/80">
            <div className="text-center md:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300 text-xs font-extrabold tracking-wider uppercase">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Testimonios Reales de Clientes</span>
                <span className="text-stone-400">({avgRating} ★)</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight">
                Opiniones y Experiencias Pipo
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 max-w-xl">
                Desliza nuestro carrusel de reseñas para conocer por qué miles de clientes eligen el sabor crujiente de nuestras pizzas a la piedra.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-5 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-red-950/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border border-orange-400/30"
              >
                <MessageSquarePlus className="w-4 h-4 text-amber-300" />
                <span>Escribir Mi Opinión</span>
              </button>
            </div>
          </div>

          {/* Carousel Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141210] p-4 rounded-2xl border border-stone-800">
            {/* Auto-play toggle & Status */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAutoplay(!isAutoplay)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  isAutoplay
                    ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                    : 'bg-stone-800 text-stone-400 border-stone-700'
                }`}
                title={isAutoplay ? 'Pausar auto-desplazamiento' : 'Activar auto-desplazamiento'}
              >
                {isAutoplay ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                    <span>Auto-desplazamiento On</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-stone-400" />
                    <span>Pausado</span>
                  </>
                )}
              </button>

              <span className="text-xs font-semibold text-stone-400 hidden sm:inline">
                Tarjeta <strong className="text-white">{currentIndex + 1}</strong> de{' '}
                <strong className="text-white">{currentReviews.length}</strong>
              </span>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5">
              {currentReviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'w-7 bg-gradient-to-r from-red-500 to-orange-500 shadow-md shadow-orange-900/50'
                      : 'w-2 bg-stone-800 hover:bg-stone-700'
                  }`}
                  aria-label={`Ir a tarjeta de opinión ${idx + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrow Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevSlide}
                className="p-2.5 bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-orange-400 rounded-xl border border-stone-800 transition-all active:scale-90"
                aria-label="Anterior testimonio"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNextSlide}
                className="p-2.5 bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-orange-400 rounded-xl border border-stone-800 transition-all active:scale-90"
                aria-label="Siguiente testimonio"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SLIDABLE CAROUSEL CONTAINER */}
          <div className="relative overflow-hidden pt-2 pb-4">
            
            {/* Desktop & Mobile Responsive Grid/Carousel Track */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ease-out">
              {/* Display 3 cards relative to currentIndex */}
              {[0, 1, 2].map((offset) => {
                const itemIndex = (currentIndex + offset) % currentReviews.length;
                const rev = currentReviews[itemIndex];
                if (!rev) return null;

                const isMainSpotlight = offset === 0;
                const grad = avatarGradients[itemIndex % avatarGradients.length];
                const votes = helpfulVotes[rev.id] || 0;

                return (
                  <div
                    key={`${rev.id}_${offset}`}
                    className={`relative bg-[#161412] p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between group ${
                      isMainSpotlight
                        ? 'border-amber-500/70 shadow-2xl shadow-amber-950/40 ring-1 ring-amber-500/30 scale-[1.02] bg-gradient-to-b from-[#1c1916] to-[#141210]'
                        : 'border-stone-800/90 hover:border-stone-700 opacity-95 hover:opacity-100'
                    }`}
                  >
                    {/* Top Card Badge */}
                    <div className="space-y-4">
                      
                      {/* User Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Avatar Circle */}
                          <div
                            className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${grad} flex items-center justify-center font-black text-white text-base shadow-lg shadow-black/40 flex-shrink-0 border border-white/20`}
                          >
                            {rev.author.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-sm text-white tracking-wide">
                                {rev.author}
                              </span>
                              <CheckCircle2
                                className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0"
                                title="Cliente Verificado"
                              />
                            </div>

                            <span className="text-[11px] font-semibold text-stone-500 block">
                              {rev.date || 'Cliente Verificado'}
                            </span>
                          </div>
                        </div>

                        {/* Star Rating Badge */}
                        <div className="flex items-center gap-1 bg-amber-950/50 border border-amber-800/40 px-2.5 py-1 rounded-xl text-amber-300 font-extrabold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{rev.rating}.0</span>
                        </div>
                      </div>

                      {/* Review Comment Box */}
                      <div className="relative pt-1">
                        <Quote className="w-8 h-8 text-stone-800/60 absolute -top-2 right-0 pointer-events-none" />
                        <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-normal relative z-10 italic">
                          "{rev.comment}"
                        </p>
                      </div>
                    </div>

                    {/* Footer Info & Engagement */}
                    <div className="pt-5 mt-4 border-t border-stone-800/80 flex items-center justify-between gap-2">
                      {rev.pizzaName ? (
                        <span className="text-[11px] text-orange-400 font-bold bg-orange-950/40 px-3 py-1 rounded-xl border border-orange-800/40 inline-flex items-center gap-1 truncate max-w-[170px]">
                          <Pizza className="w-3 h-3 text-orange-400 flex-shrink-0" />
                          <span className="truncate">{rev.pizzaName}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-stone-500 font-semibold inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Cliente Pipo</span>
                        </span>
                      )}

                      <button
                        onClick={() => handleToggleHelpful(rev.id)}
                        className="px-2.5 py-1 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-amber-300 border border-stone-800 text-[11px] font-bold transition-all flex items-center gap-1.5 active:scale-95"
                        title="Marcar opinión como útil"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Útil ({votes})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* STORE LOCATION & CONTACT & FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-10 border-t border-stone-800">
          
          {/* Store Location & Phone Info (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase font-extrabold text-orange-400 tracking-wider">
              Ubicación y Sucursal
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-serif text-white">
              {storeInfo?.name || 'Pizzería Pizzas Pipo'}
            </h3>

            <div className="space-y-3.5 text-xs text-stone-300">
              <div className="flex items-start gap-3 bg-[#161412] p-4 rounded-2xl border border-stone-800">
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Ubicación Sucursal Matriz</span>
                  <p className="text-stone-400 mt-0.5">
                    {storeInfo?.address || 'Av. de los Hornos #450, Col. Centro Histórico, Ciudad de México.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#161412] p-4 rounded-2xl border border-stone-800">
                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Horarios de Horno Encendido</span>
                  <p className="text-stone-400 mt-0.5">
                    {storeInfo?.schedule || 'Lunes a Domingo: 12:00 PM – 11:00 PM (Servicio continuo).'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#161412] p-4 rounded-2xl border border-stone-800">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Atención Telefónica Directa</span>
                  <p className="text-stone-400 mt-0.5">
                    {storeInfo?.phone || '555-PIPO-PIZZA (555-747-6749)'}
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp Link */}
            <a
              href={`https://wa.me/${(storeInfo?.phone || '525551234567').replace(/[^0-9]/g, '')}?text=Hola%20Pizzas%20Pipo!%20Quiero%20hacer%20un%20pedido`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Pedir por WhatsApp Directo</span>
            </a>
          </div>

          {/* FAQ Accordion (6 cols) */}
          <div className="lg:col-span-6 bg-[#161412] p-6 sm:p-8 rounded-3xl border border-stone-800 space-y-4">
            <h3 className="text-xl font-bold font-serif text-white">
              Preguntas Frecuentes (FAQ)
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-stone-800 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-4 bg-stone-900/60 hover:bg-stone-900 text-left text-xs font-bold text-white flex items-center justify-between gap-2"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-orange-400 transform transition-transform ${
                        openFaq === i ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {openFaq === i && (
                    <div className="p-4 bg-stone-950 text-xs text-stone-300 leading-relaxed border-t border-stone-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* WRITE REVIEW MODAL (Real Client Form) */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#181614] border border-stone-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg space-y-5 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-white rounded-full bg-stone-900 border border-stone-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-extrabold uppercase text-amber-400 tracking-wider">
                Comparte tu Experiencia
              </span>
              <h3 className="text-2xl font-black font-serif text-white">
                Publicar Reseña en Pizzas Pipo
              </h3>
              <p className="text-xs text-stone-400">
                Tu opinión aparecerá en tiempo real en nuestro carrusel de testimonios para otros clientes.
              </p>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              
              {/* Author Input */}
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">
                  Tu Nombre o Apodo <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sofía Morales, Juan Perez..."
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Rating Selector */}
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">
                  Calificación general
                </label>
                <div className="flex items-center gap-2 bg-stone-900/80 p-3 rounded-2xl border border-stone-800">
                  <div className="flex gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingInput(star)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= ratingInput
                              ? 'fill-amber-400 text-amber-400 filter drop-shadow'
                              : 'text-stone-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-extrabold text-amber-300 ml-2">
                    {ratingInput} / 5 Estrellas
                  </span>
                </div>
              </div>

              {/* Pizza Selection (Optional) */}
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">
                  ¿Qué pizza o combo ordenaste? <span className="text-stone-500">(Opcional)</span>
                </label>
                <select
                  value={pizzaInput}
                  onChange={(e) => setPizzaInput(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">-- Selecciona una especialidad o combo --</option>
                  {currentMenuItems.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name} (${item.basePrice})
                    </option>
                  ))}
                  <option value="Pizza Personalizada Armadas Pipo">Pizza Personalizada Pipo</option>
                </select>
              </div>

              {/* Comment Textarea */}
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">
                  Tu Reseña / Testimonio <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="¿Qué te pareció el crujiente de la masa, el sazón de la salsa y el servicio de entrega?"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-950/50 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Publicar Reseña Real</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
