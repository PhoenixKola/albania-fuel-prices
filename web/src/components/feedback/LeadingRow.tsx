import type { TDict } from "../../locales";

type Props = {
  t: TDict;
};

export default function LoadingRow({ t }: Props) {
  return (
    <div className="skeletonWrap" aria-label={t.subtitleLoading}>
      <div className="skeletonLine" />
      <div className="skeletonLine short" />
    </div>
  );
}