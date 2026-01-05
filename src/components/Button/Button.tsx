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
    bg-[#B24C60] text-white  
    font-semibold rounded-2xl 
    shadow-md hover:bg-[#CE6375] border border-[#B24C60]
    transition duration-300 ease-in-out
    text-center cursor-pointer
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
