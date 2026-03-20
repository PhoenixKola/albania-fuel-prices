import type { ReactNode } from "react";

type Props = {
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
};

export default function Chip({ label, icon, active, onClick, onRemove }: Props) {
  return (
    <div className={`chip ${active ? "chipActive" : ""}`}>
      <button className="chipBtn" type="button" onClick={onClick}>
        {icon ? <>{icon}{" "}</> : null}{label}
      </button>
      {onRemove ? (
        <button className="chipX" type="button" onClick={onRemove} aria-label="Remove">
          ×
        </button>
      ) : null}
    </div>
  );
}