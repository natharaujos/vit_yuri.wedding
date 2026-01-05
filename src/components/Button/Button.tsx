type ButtonProps = {
  text: string;
  link?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

function Button({ text, link, onClick, type = "button" }: ButtonProps) {
  const isInternal = link && link.startsWith("#");

  const baseStyles = `
    inline-block px-6 py-3 
    bg-[#D4AF7F] text-white  
    font-semibold rounded-2xl 
    shadow-md hover:bg-[#F4D4C1] border-1 border-[#D4AF7F]
    transition duration-300 ease-in-out
    text-center
  `;

  if (link) {
    return isInternal ? (
      <a href={link} className={baseStyles}>
        {text}
      </a>
    ) : (
      <a
        href={link}
        className={baseStyles}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseStyles}>
      {text}
    </button>
  );
}

export default Button;
