interface DecorativeOrnamentProps {
  position: "top" | "bottom";
}

export function DecorativeOrnament({ position }: DecorativeOrnamentProps) {
  return (
    <div
      className={`absolute ${position}-0 left-0 w-full flex justify-center pointer-events-none ${
        position === "bottom" ? "rotate-180" : ""
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-64 h-24 ${
          position === "top" ? "text-[#B24C60]/40" : "text-[#B24C60]/30"
        }`}
        fill="none"
        viewBox="0 0 120 40"
        stroke="currentColor"
        strokeWidth="0.5"
      >
        <path d="M10 20c30-30 70-30 100 0" />
        <path d="M20 25c20-20 60-20 80 0" />
      </svg>
    </div>
  );
}
