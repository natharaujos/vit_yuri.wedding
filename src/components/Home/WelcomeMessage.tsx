export function WelcomeMessage() {
  return (
    <div className="w-full">
      {/* Card da mensagem */}
      <div className="relative">
        {/* Sombra suave atrás */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/20 rounded-3xl blur-xl opacity-40"></div>
        
        <div className="relative bg-white/10 backdrop-blur-lg shadow-xl px-8 py-10 rounded-3xl border border-white/30">
          <p className="text-lg md:text-xl text-white leading-relaxed font-light italic drop-shadow-lg">
            "Queridos amigos e familiares"
          </p>
          
          <div className="mt-6 pt-6 border-t border-white/30">
            <p className="text-base md:text-lg text-white leading-relaxed drop-shadow-lg">
              O momento tão esperado está cada vez mais próximo e não poderíamos
              estar mais felizes em compartilhar essa jornada com vocês! 
            </p>
            <p className="text-base md:text-lg text-white mt-4 leading-relaxed drop-shadow-lg">
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
