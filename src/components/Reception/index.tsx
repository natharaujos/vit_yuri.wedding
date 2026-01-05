function Reception() {
  return (
    <section id="recepcao" className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-[#3A3A3A] mb-8">
          Recepção
        </h2>

        <p className="text-lg md:text-xl text-gray-700 mt-4 max-w-xl">
          Esperamos vocês para celebrar esse momento conosco e tornar esse dia
          ainda mais inesquecível!
        </p>

        {/* <img
          src={ranchao}
          alt="Ranchão Saraiva"
          className="rounded-lg w-full max-w-2xl h-64 object-cover shadow-lg my-8"
        /> */}

        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mt-8">
          <h3 className="text-2xl font-bold text-[#3A3A3A] mb-4">
            Comanda Individual
          </h3>

          <p className="text-xl font-semibold text-gray-800 mb-6">
            Valor por pessoa: R$ 80,00
          </p>

          <div className="space-y-4 text-gray-700">
            <p className="font-medium">Cardápio:</p>
            <p>Entrada, almoço completo, cantinho mineiro e bebidas.</p>

            <div className="pt-4">
              <p>
                <strong>Local:</strong> Ranchão Saraiva
              </p>
              <p>
                <strong>Horário:</strong> Após a Cerimônia
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-[#FFE4E1] rounded-lg p-6 w-full max-w-2xl">
          <p className="text-gray-700 mb-4">
            Informações sobre a recepção serão divulgadas em breve.
          </p>
          <p className="text-gray-700">
            Por favor, acompanhe as atualizações neste site!
          </p>
        </div>

        <p className="mt-8 text-lg font-medium text-gray-700">
          Contamos com a sua presença para celebrarmos juntos! 🎉
        </p>
      </div>
    </section>
  );
}

export default Reception;
