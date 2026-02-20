import type { TDict } from "../../locales";

type Props = {
  t: TDict;
  message: string;
  onRetry: () => void;
};

export default function Notice({ t, message, onRetry }: Props) {
  return (
    <div className="alert">
      <div className="alertTop">
        <div className="alertTitle">{t.couldntLoad}</div>
        <button className="btn btn-primary" onClick={onRetry}>
          {t.tryAgain}
        </button>
      </div>
      <div className="alertText">{message}</div>
    </div>
  );
}