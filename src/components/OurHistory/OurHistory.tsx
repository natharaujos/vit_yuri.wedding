interface OurHistoryProps {
  title?: string;
  story?: string;
  images?: string[];
}

function OurHistory({
  images = [],
}: OurHistoryProps) {
  return (
    <section id="historia" className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
      <div className="flex flex-col items-center gap-8">
        {/* Imagens */}
        {images.length > 0 ? (
          <div
            className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              md:grid-cols-3 
              lg:grid-cols-4 
              xl:grid-cols-5 
              gap-4
              w-full
            "
          >
            {images.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Nossa história imagem ${idx + 1}`}
                className="rounded-lg object-cover w-full h-56 sm:h-64 md:h-72 shadow-lg"
              />
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#FFB6C1] to-[#FF69B4] rounded-lg p-12 w-full max-w-2xl flex items-center justify-center">
            <p className="text-white text-xl text-center">Fotos em breve...</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default OurHistory;
