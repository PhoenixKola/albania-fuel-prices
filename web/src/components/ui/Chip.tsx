type Props = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
};

export default function Chip({ label, active, onClick, onRemove }: Props) {
  return (
    <div className={`chip ${active ? "chipActive" : ""}`}>
      <button className="chipBtn" type="button" onClick={onClick}>
        {label}
      </button>
      {onRemove ? (
        <button className="chipX" type="button" onClick={onRemove} aria-label="Remove">
          ×
        </button>
      ) : null}
    </div>
  );
}