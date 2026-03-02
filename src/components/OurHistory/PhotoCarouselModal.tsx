import React from "react";
import { DecorativeOrnament } from "../Home/DecorativeOrnament";

interface PhotoCarouselModalProps {
  images: string[];
  isOpen: boolean;
  initialIndex?: number;
  onClose: () => void;
}

const PhotoCarouselModal: React.FC<PhotoCarouselModalProps> = ({ images, isOpen, initialIndex = 0, onClose }) => {
  const [current, setCurrent] = React.useState(initialIndex);

  React.useEffect(() => {
    setCurrent(initialIndex);
  }, [initialIndex, isOpen]);

  if (!isOpen) return null;

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-wedding-50/40 via-white/30 to-wedding-50/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-4 p-8 pb-12 flex flex-col items-center border-2 border-wedding-100 overflow-hidden">
        {/* Decoraciones ornamentales */}
        <div className="absolute top-0 left-0 pointer-events-none">
          <DecorativeOrnament position="top" />
        </div>
        
        {/* Ícone en la parte superior - DENTRO del modal */}
        <div className="relative z-10 mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-wedding-400 to-wedding-600 rounded-full shadow-xl flex items-center justify-center border-4 border-white">
            <span className="text-3xl">💍</span>
          </div>
        </div>
        
        <button
          className="absolute top-6 right-6 text-wedding-500 hover:text-wedding-700 text-3xl font-light transition-all duration-200 hover:scale-125 z-20"
          onClick={onClose}
          aria-label="Fechar"
        >
          &times;
        </button>
        <div className="flex items-center w-full justify-center gap-6 mt-4">
          <button 
            onClick={prev} 
            className="text-4xl text-wedding-500 hover:text-wedding-700 transition-all duration-200 p-3 hover:bg-gradient-to-br hover:from-wedding-100/60 hover:to-wedding-50/60 rounded-full hover:scale-125 hover:shadow-lg"
            aria-label="Foto anterior"
          >
            &#8592;
          </button>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-wedding-300 via-wedding-200 to-wedding-300 rounded-2xl opacity-30 blur-lg"></div>
            <img
              src={images[current]}
              alt={`Foto ${current + 1}`}
              className="relative max-h-[55vh] max-w-[50vw] rounded-2xl object-contain shadow-xl border-2 border-white/80"
            />
          </div>
          <button 
            onClick={next} 
            className="text-4xl text-wedding-500 hover:text-wedding-700 transition-all duration-200 p-3 hover:bg-gradient-to-br hover:from-wedding-100/60 hover:to-wedding-50/60 rounded-full hover:scale-125 hover:shadow-lg"
            aria-label="Próxima foto"
          >
            &#8594;
          </button>
        </div>
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === current 
                    ? 'w-10 bg-[#B24C60] shadow-lg' 
                    : 'w-3 bg-[#D4949F] hover:bg-[#C0808F]'
                }`}
                aria-label={`Ir para foto ${idx + 1}`}
              />
            ))}
          </div>
          <span className="text-wedding-600 font-medium text-sm">
            {current + 1} / {images.length}
          </span>
        </div>
        
        {/* Decoración inferior */}
        <div className="absolute bottom-8 left-0 pointer-events-none w-full">
          <DecorativeOrnament position="bottom" />
        </div>
      </div>
    </div>
  );
};

export default PhotoCarouselModal;
