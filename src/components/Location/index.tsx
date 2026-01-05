import Button from "../Button/Button";

function Location() {
  return (
    <section id="localizacao" className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#3A3A3A] mb-4">Localização</h2>
        <p className="text-gray-600 mb-2">Matriz Nossa Senhora de Oliveira</p>
        <p className="text-gray-600 mb-4">
          Centro, Oliveira - MG
        </p>
        <Button
          link="https://maps.google.com/maps?q=Matriz+Nossa+Senhora+de+Oliveira+oliveira+mg+centro"
          text="Como chegar"
        />
      </div>

      <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg border-4 border-white">
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
        <p className="text-sm text-gray-500">
          Dica: Recomendamos chegar com 15 minutos de antecedência
        </p>
      </div>
    </section>
  );
}

export default Location;
