type ButtonProps = {
  text: string;
  link?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

function Button({ 
  text, 
  link, 
  onClick, 
  type = "button", 
  disabled = false,
  variant = "primary" 
}: ButtonProps) {
  const isInternal = link && link.startsWith("#");

  const baseStyles = `
    inline-block px-6 py-3 
    font-semibold rounded-2xl 
    shadow-md border
    transition duration-300 ease-in-out
    text-center cursor-pointer
  `;

  const variantStyles = variant === "primary" 
    ? "bg-[#B24C60] text-white hover:bg-[#CE6375] border-[#B24C60]"
    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300";

  const disabledStyles = disabled 
    ? "opacity-50 cursor-not-allowed hover:bg-[#B24C60]" 
    : "";

  const combinedStyles = `${baseStyles} ${variantStyles} ${disabledStyles}`;

  if (link) {
    return isInternal ? (
      <a href={link} className={combinedStyles}>
        {text}
      </a>
    ) : (
      <a
        href={link}
        className={combinedStyles}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    );
  }

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={combinedStyles}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button;
