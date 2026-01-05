export function CeremonyDetails() {
  return (
    <div className="mt-16 w-full max-w-5xl">
      {/* Título da seção com decoração */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#FF69B4]"></div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#3A3A3A]">
            Cerimônia
          </h2>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#FF69B4]"></div>
        </div>
        <p className="text-gray-500 text-sm md:text-base">Celebre conosco este momento especial</p>
      </div>

      {/* Container principal */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Imagem da igreja */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-br from-pink-200 to-rose-300 rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity"></div>
            <div className="relative rounded-3xl w-72 h-72 md:w-80 md:h-80 bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200 shadow-2xl flex items-center justify-center p-8 border-4 border-white">
              <div className="text-center">
                <svg className="w-20 h-20 mx-auto mb-4 text-[#C71585]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-[#C71585] text-xl md:text-2xl font-serif font-semibold text-center leading-tight">
                  Matriz N. S. de Oliveira
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Informações */}
        <div className="flex justify-center md:justify-start">
          <div className="bg-white/90 backdrop-blur-lg shadow-xl px-8 py-10 rounded-3xl max-w-sm w-full border border-pink-100">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-rose-300 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#C71585]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Data</p>
                  <p className="text-lg text-gray-800 font-semibold mt-1">A definir</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-rose-300 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#C71585]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Horário</p>
                  <p className="text-lg text-gray-800 font-semibold mt-1">10:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-rose-300 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#C71585]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Local</p>
                  <p className="text-lg text-gray-800 font-semibold mt-1 leading-snug">
                    Matriz Nossa Senhora de Oliveira, Centro
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
