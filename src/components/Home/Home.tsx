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
                 bg-gradient-to-b from-rose-50/30 via-white to-pink-50/30
                 overflow-hidden"
    >
      <DecorativeOrnament position="top" />

      <div className="relative max-w-6xl mx-auto flex flex-col items-center">
        {/* Foto principal */}
        <MainPhotoFrame />

        {/* Título principal com estilo mais elegante */}
        <h1 className="text-4xl md:text-6xl font-bold text-[#3A3A3A] mt-12 tracking-tight text-center">
          Bem-vindos ao nosso
          <span className="block text-[#FF69B4] mt-2">Casamento</span>
        </h1>

        {/* Mensagem de boas-vindas */}
        <WelcomeMessage />

        {/* Detalhes da cerimônia */}
        <CeremonyDetails />

        {/* Botões de ação com novo estilo */}
        <div className="mt-16 flex flex-col sm:flex-row gap-6 items-center justify-center">
          <Button text="Nossa História" link="#historia" />
          <Button text="Lista de Presentes" link="#presentes" />
          <Button text="Confirme Presença" onClick={() => setIsModalOpen(true)} />
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
