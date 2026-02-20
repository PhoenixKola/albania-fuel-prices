export default function ToastHost({ message }: { message: string | null }) {
  if (!message) return null;
  return <div className="toast">{message}</div>;
}