import Icon from "../ui/Icon";

type Props = {
  label: string;
  onClick: () => void;
};

export default function SourceFab({ label, onClick }: Props) {
  return (
    <button className="fab" type="button" onClick={onClick} aria-label={label} title={label}>
      <Icon name="info" />
      <span className="fabText">{label}</span>
    </button>
  );
}