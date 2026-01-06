import Button from "../Button/Button";

interface RemoveButtonProps {
  onClick: () => void;
}
function RemoveButton({ onClick }: RemoveButtonProps) {
  return (
    <div className="absolute bottom-3 right-3">
      <Button
        text="Remover"
        onClick={onClick}
        variant="secondary"
      />
    </div>
  );
}

export default RemoveButton;
