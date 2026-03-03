import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";
import { savePresenceConfirmation } from "../../services/savePresenceConfirmation";
import Button from "../Button/Button";
import { ConfirmPresenceModal } from "../ConfirmPresence";
import { WelcomeMessage } from "./WelcomeMessage";
import { CeremonyDetails } from "./CeremonyDetails";
import mainPicBackground from "../../assets/main_pic_background.jpeg";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user] = useAuthState(auth);

  const handleConfirmPresence = (guests: number, guestNames: string[]) => {
    savePresenceConfirmation({
      userName: user?.displayName || "",
      userEmail: user?.email || "",
      guestsCount: guests,
      confirmedAt: new Date(),
      otherGuests: guestNames,
      status: "confirmed",
    });
  };

  return (
    <section
      id="home"
      className="relative pb-12 px-4 sm:px-6 md:px-8 overflow-hidden"
      style={{
        backgroundImage: `url(${mainPicBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay escuro para melhor legibilidade do texto */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative max-w-6xl mx-auto z-10 pt-32 pb-32">
        {/* Título principal no topo */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-16 tracking-tight text-center drop-shadow-lg">
          Bem-vindos ao nosso
          <span className="block text-[#FFB3C1] mt-2 drop-shadow-lg">Casamento</span>
        </h1>

        {/* Container com foto à esquerda e mensagem à direita */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 mb-16">
          {/* Mensagem de boas-vindas */}
          <div className="flex-1 flex items-center">
            <WelcomeMessage />
          </div>
        </div>

        {/* Detalhes da cerimônia */}
        <div className="flex flex-col items-center">
          <CeremonyDetails />

          {/* Botões de ação */}
          <div className="mt-16 flex flex-col sm:flex-row gap-6 items-center justify-center">
            <Button text="Nossa História" link="#historia" />
            <Button text="Lista de Presentes" link="#presentes" />
            {/* <Button text="Confirme Presença" onClick={() => setIsModalOpen(true)} /> */}
          </div>
        </div>
      </div>

      <ConfirmPresenceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userEmail={user?.email || ""}
        onConfirm={handleConfirmPresence}
      />
    </section>
  );
}

export default Home;
