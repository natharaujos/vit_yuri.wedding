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

        <div className="mt-8 bg-[#F4D4C1] rounded-lg p-6 w-full max-w-2xl">
          <p className="text-gray-700 mb-4">
            Por favor, confirme sua presença aqui no site e realize o pagamento
            até dia 10/10/25 para que possamos colocar seu nome na lista.
          </p>

          <div className="bg-white rounded-lg p-4 mb-6">
            <p className="font-medium text-gray-800">Chave pix:</p>
            <p className="text-[#3A3A3A]">37 99981-6852 (Magda Araujo)</p>
          </div>

          <div className="space-y-2 text-gray-700">
            <p className="font-medium">
              Enviar comprovante para um dos noivos:
            </p>
            <p>Magda: (37) 99981-6852</p>
            <p>Paulo Victor: (37) 99860-4508</p>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600 space-y-2">
          <p>Crianças até 7 anos não pagam</p>
          <p>Crianças de 8 a 12 anos pagam 40,00</p>
          <p>A partir de 13 anos, valor normal</p>
        </div>

        <p className="mt-8 text-lg font-medium text-gray-700">
          Contamos com a sua presença para celebrarmos juntos! 🎉
        </p>
      </div>
    </section>
  );
}

export default Reception;
