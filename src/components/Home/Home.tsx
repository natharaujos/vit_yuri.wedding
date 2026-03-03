import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";
import { savePresenceConfirmation } from "../../services/savePresenceConfirmation";
import Button from "../Button/Button";
import { ConfirmPresenceModal } from "../ConfirmPresence";
import { WelcomeMessage } from "./WelcomeMessage";
import { CeremonyDetails, CeremonyMap } from "./CeremonyDetails";
import mainPicBackground from "../../assets/main_pic_background.jpeg";
import photoSessionMobile from "../../assets/photo_session_3.jpeg";

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
    <>
      {/* Seção com imagem de fundo - Hero + Mensagem + Cerimônia */}
      <section
        id="home-hero"
        className="relative px-4 sm:px-6 md:px-8"
      >
        {/* Background para Mobile */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
          style={{ backgroundImage: `url(${photoSessionMobile})` }}
        />
        
        {/* Background para Desktop */}
        <div 
          className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${mainPicBackground})` }}
        />
        
        {/* Overlay escuro para melhor legibilidade do texto */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        <div className="relative max-w-6xl mx-auto z-20 pt-32 pb-16">
          {/* Título principal no topo */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-16 tracking-tight text-center drop-shadow-lg">
            Bem-vindos ao nosso
            <span className="block text-[#FFB3C1] mt-2 drop-shadow-lg">Casamento</span>
          </h1>

          {/* Mensagem de boas-vindas */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 mb-16 pt-[40rem] md:pt-0">
            <div className="flex-1 flex items-center">
              <WelcomeMessage />
            </div>
          </div>

          {/* Detalhes da cerimônia */}
          <div className="flex flex-col items-center">
            <CeremonyDetails />
          </div>
        </div>
      </section>

      {/* Seção com fundo branco - Mapa e Botões de ação */}
      <section id="home" className="bg-white py-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Mapa da cerimônia */}
          <div className="mb-12">
            <CeremonyMap />
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            <Button text="Nossa História" link="#historia" />
            <Button text="Lista de Presentes" link="#presentes" />
            {/* <Button text="Confirme Presença" onClick={() => setIsModalOpen(true)} /> */}
          </div>
        </div>
      </section>

      <ConfirmPresenceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userEmail={user?.email || ""}
        onConfirm={handleConfirmPresence}
      />
    </>
  );
}

export default Home;
