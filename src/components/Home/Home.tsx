import Button from "../Button/Button";
import { useState } from "react";
import { ConfirmPresenceModal } from "../ConfirmPresence";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";
import { savePresenceConfirmation } from "../../services/savePresenceConfirmation";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user] = useAuthState(auth);

  return (
    <section
      id="home"
      className="relative min-h-screen pt-20 pb-6 px-4 sm:px-6 md:px-8 
                 bg-gradient-to-b from-white via-gray-50 to-white 
                 overflow-hidden"
    >
      {/* Ornamentos no topo */}
      <div className="absolute top-0 left-0 w-full flex justify-center pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-64 h-24 text-[#FF69B4]/40"
          fill="none"
          viewBox="0 0 120 40"
          stroke="currentColor"
          strokeWidth="0.5"
        >
          <path d="M10 20c30-30 70-30 100 0" />
          <path d="M20 25c20-20 60-20 80 0" />
        </svg>
      </div>

      <div className="relative max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Foto principal com moldura */}
        <div className="p-2 rounded-[2.5rem] border-4 border-[#FF69B4]/60 shadow-2xl bg-white/40 backdrop-blur-sm">
          <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-[500px] md:h-[500px] rounded-3xl bg-gradient-to-br from-[#FFB6C1] to-[#FF69B4] shadow-lg flex items-center justify-center">
            <span className="text-white text-2xl font-semibold">Vitória & Yuri</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-[#3A3A3A] mt-8 tracking-tight">
          Bem-vindos ao nosso casamento!
        </h1>

        {/* Mensagem de boas-vindas */}
        <div className="mt-6 bg-white/70 backdrop-blur-md shadow-lg px-6 py-6 rounded-2xl max-w-2xl">
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Queridos amigos e familiares,
          </p>
          <p className="text-lg md:text-xl text-gray-700 mt-4 leading-relaxed">
            O momento tão esperado está cada vez mais próximo e não poderíamos
            estar mais felizes em compartilhar essa jornada com vocês! Cada passo
            da nossa história de amor nos trouxe até aqui, e o nosso grande dia,
            escolhido por Deus para unir nossas vidas, já enche nossos corações de
            alegria e expectativa.
          </p>
        </div>

        {/* Bloco da cerimônia */}
        <h2 className="text-2xl md:text-4xl font-bold text-[#3A3A3A] mt-12">
          Cerimônia
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-6 mt-6">
          <div className="rounded-2xl w-56 h-56 md:w-80 md:h-80 bg-gradient-to-br from-pink-200 to-pink-400 shadow-xl flex items-center justify-center">
            <span className="text-[#C71585] text-lg font-semibold text-center px-4">Matriz N. S. de Oliveira</span>
          </div>

          <div className="bg-white/70 backdrop-blur-md shadow-lg px-6 py-6 rounded-2xl text-left max-w-sm">
            <p className="text-lg text-gray-800">
              <strong>Data:</strong> A definir
            </p>
            <p className="text-lg text-gray-800 mt-2">
              <strong>Horário:</strong> 10:00
            </p>
            <p className="text-lg text-gray-800 mt-2">
              <strong>Local:</strong> Matriz Nossa Senhora de Oliveira, Centro
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Button text="Nossa História" link="#historia" />
          <Button text="Lista de Presentes" link="#presentes" />
          <Button text="Confirme Presença" onClick={() => setIsModalOpen(true)} />
        </div>
      </div>

      {/* Ornamentos no rodapé */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center rotate-180 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-64 h-24 text-[#FF69B4]/30"
          fill="none"
          viewBox="0 0 120 40"
          stroke="currentColor"
          strokeWidth="0.5"
        >
          <path d="M10 20c30-30 70-30 100 0" />
          <path d="M20 25c20-20 60-20 80 0" />
        </svg>
      </div>

      {/* Modal */}
      <ConfirmPresenceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userEmail={user?.email || ""}
        onConfirm={(guests, guestNames) => {
          savePresenceConfirmation({
            userName: user?.displayName || "",
            userEmail: user?.email || "",
            guestsCount: guests,
            confirmedAt: new Date(),
            otherGuests: guestNames,
            status: "confirmed",
          });
        }}
      />
    </section>
  );
}

export default Home;
