import Icon from "./Icon";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ open, title, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-label={title} onMouseDown={onClose}>
      <div className="modalShell" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modalShellHeader">
          <div className="modalShellTitle">{title}</div>
          <button className="iconBtn" type="button" onClick={onClose} aria-label="Close">
            <Icon name="x" />
          </button>
        </div>

        <div className="modalShellBody">{children}</div>
      </div>
    </div>
  );
}