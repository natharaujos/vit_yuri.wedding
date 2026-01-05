export function MainPhotoFrame() {
  return (
    <div className="relative group">
      {/* Efeito de brilho ao redor */}
      <div className="absolute -inset-4 bg-gradient-to-r from-wedding-300 via-wedding-200 to-wedding-300 rounded-full opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-500"></div>
      
      {/* Frame principal */}
      <div className="relative p-3 rounded-full border-[6px] border-white shadow-2xl bg-gradient-to-br from-white to-wedding-50">
        {/* Borda decorativa interna */}
        <div className="p-2 rounded-full border-4 border-[#B24C60]/40 bg-white/60 backdrop-blur-sm">
          <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-[#CE6375] via-[#BF7078] to-[#B24C60] shadow-inner flex items-center justify-center overflow-hidden relative">
            {/* Overlay com padrão sutil */}
            <div className="absolute inset-0 bg-white/10"></div>
            
            {/* Texto dos noivos */}
            <div className="relative z-10 text-center">
              <div className="text-white text-4xl md:text-5xl font-serif tracking-wider mb-2">
                V & Y
              </div>
              <div className="text-white/90 text-sm md:text-base font-light tracking-[0.3em]">
                VITÓRIA & YURI
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
