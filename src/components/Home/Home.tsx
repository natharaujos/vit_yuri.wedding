import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";
import { savePresenceConfirmation } from "../../services/savePresenceConfirmation";
import Button from "../Button/Button";
import { ConfirmPresenceModal } from "../ConfirmPresence";
import { DecorativeOrnament } from "./DecorativeOrnament";
import { MainPhotoFrame } from "./MainPhotoFrame";
import { WelcomeMessage } from "./WelcomeMessage";
import { CeremonyDetails } from "./CeremonyDetails";

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
      className="relative min-h-screen pt-16 pb-12 px-4 sm:px-6 md:px-8 
                 bg-gradient-to-b from-wedding-50/30 via-white to-wedding-50/30
                 overflow-hidden"
    >
      <DecorativeOrnament position="top" />

      <div className="relative max-w-6xl mx-auto">
        {/* Título principal no topo */}
        <h1 className="text-4xl md:text-6xl font-bold text-[#3A3A3A] mb-16 tracking-tight text-center">
          Bem-vindos ao nosso
          <span className="block text-[#B24C60] mt-2">Casamento</span>
        </h1>

        {/* Container com foto à esquerda e mensagem à direita */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 mb-16">
          {/* Foto principal à esquerda */}
          <div className="flex-shrink-0">
            <MainPhotoFrame />
          </div>

          {/* Mensagem de boas-vindas à direita */}
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
            <Button text="Confirme Presença" onClick={() => setIsModalOpen(true)} />
          </div>
        </div>
      </div>

      <DecorativeOrnament position="bottom" />

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
