export function WelcomeMessage() {
  return (
    <div className="mt-12 max-w-3xl">
      {/* Decoração superior */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#B24C60]/50"></div>
          <svg className="w-6 h-6 text-[#B24C60]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#B24C60]/50"></div>
        </div>
      </div>

      {/* Card da mensagem */}
      <div className="relative">
        {/* Sombra suave atrás */}
        <div className="absolute inset-0 bg-gradient-to-br from-wedding-100 to-wedding-100 rounded-3xl blur-xl opacity-40"></div>
        
        <div className="relative bg-white/80 backdrop-blur-lg shadow-xl px-8 py-10 md:px-12 md:py-12 rounded-3xl border border-wedding-100/50">
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light italic text-center">
            "Queridos amigos e familiares"
          </p>
          
          <div className="mt-6 pt-6 border-t border-wedding-200/50">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed text-center">
              O momento tão esperado está cada vez mais próximo e não poderíamos
              estar mais felizes em compartilhar essa jornada com vocês! 
            </p>
            <p className="text-base md:text-lg text-gray-700 mt-4 leading-relaxed text-center">
              Cada passo da nossa história de amor nos trouxe até aqui, e o nosso grande dia,
              escolhido por Deus para unir nossas vidas, já enche nossos corações de
              alegria e expectativa. ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
