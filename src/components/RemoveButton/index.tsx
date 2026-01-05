interface RemoveButtonProps {
  onClick: () => void;
}
function RemoveButton({ onClick }: RemoveButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-3 right-3 px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors duration-200 cursor-pointer"
    >
      Remover
    </button>
  );
}

export default RemoveButton;
