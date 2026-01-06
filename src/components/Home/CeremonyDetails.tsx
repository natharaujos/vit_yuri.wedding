import churchImage from '../../assets/nsradeoliveira_catedral.jpg';
import Button from '../Button/Button';

export function CeremonyDetails() {
  return (
    <div className="mt-16 w-full max-w-5xl">
      {/* Título da seção com decoração */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#B24C60]"></div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#3A3A3A]">
            Cerimônia
          </h2>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#B24C60]"></div>
        </div>
        <p className="text-gray-500 text-sm md:text-base">Celebre conosco este momento especial</p>
      </div>

      {/* Container principal */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Imagem da igreja */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-br from-wedding-200 to-wedding-300 rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity"></div>
            <div className="relative rounded-3xl w-72 h-72 md:w-80 md:h-80 overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src={churchImage} 
                alt="Matriz Nossa Senhora de Oliveira" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Informações */}
        <div className="flex justify-center md:justify-start">
          <div className="bg-white/90 backdrop-blur-lg shadow-xl px-8 py-10 rounded-3xl max-w-sm w-full border border-wedding-100">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wedding-200 to-wedding-300 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#A03D52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Data</p>
                  <p className="text-lg text-gray-800 font-semibold mt-1">30/05/2026</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wedding-200 to-wedding-300 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#A03D52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Horário</p>
                  <p className="text-lg text-gray-800 font-semibold mt-1">10:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wedding-200 to-wedding-300 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#A03D52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Mapa e Como Chegar */}
      <div className="mt-12 w-full max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <Button
            link="https://maps.google.com/maps?q=Matriz+Nossa+Senhora+de+Oliveira+oliveira+mg+centro"
            text="Como chegar"
          />
        </div>

        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.4!2d-44.827!3d-20.697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDQxJzQ5LjIiUyA0NMKwNDknMzcuMiJX!5e0!3m2!1spt-BR!2sbr!4v1234567890!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização da Igreja"
            aria-label="Mapa mostrando a localização da Igreja"
          ></iframe>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 italic">
            💡 Dica: Recomendamos chegar com 15 minutos de antecedência
          </p>
        </div>
      </div>
    </div>
  );
}
