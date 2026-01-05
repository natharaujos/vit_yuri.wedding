import Button from "../Button/Button";

function Location() {
  return (
    <section id="localizacao" className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#3A3A3A] mb-4">Localização</h2>
        <p className="text-gray-600 mb-2">Paróquia Nossa Senhora Aparecida</p>
        <p className="text-gray-600 mb-4">
          Praça Miguel Madeira, 85 - Aparecida, Oliveira - MG, 35540-000
        </p>
        <Button
          link="https://maps.google.com/maps?q=Paróquia+Nossa+Senhora+Aparecida+oliveira+mg"
          text="Como chegar"
        />
      </div>

      <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg border-4 border-white">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.097188642424!2d-44.83357722383678!3d-20.70627766295234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa064e7752616b3%3A0x897dc8ded6f5fb6f!2sPar%C3%B3quia%20Nossa%20Senhora%20Aparecida!5e0!3m2!1spt-BR!2sbr!4v1756245810661!5m2!1spt-BR!2sbr"
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
        <p className="text-sm text-gray-500">
          Dica: Recomendamos chegar com 15 minutos de antecedência
        </p>
      </div>
    </section>
  );
}

export default Location;
