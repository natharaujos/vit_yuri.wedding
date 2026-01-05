import mt_1 from "../../assets/mt_1.jfif";
import mt_2 from "../../assets/mt_2.jfif";
import mt_3 from "../../assets/mt_3.jfif";
import mt_4 from "../../assets/mt_4.jfif";
import mt_5 from "../../assets/mt_5.jfif";

interface OurHistoryProps {
  title?: string;
  story?: string;
  images?: string[];
}

function OurHistory({
  images = [`${mt_1}`, `${mt_2}`, `${mt_3}`, `${mt_4}`, `${mt_5}`],
}: OurHistoryProps) {
  return (
    <section id="historia" className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
      <div className="flex flex-col items-center gap-8">
        {/* Imagens */}
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
      </div>
    </section>
  );
}

export default OurHistory;
