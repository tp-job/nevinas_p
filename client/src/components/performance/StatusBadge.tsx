import type { FC } from "react";
interface StatusBadgeProps {
  status: string;
}
const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
  const cls =
    status === "good"
      ? "bg-global-green/10 text-global-green"
      : status === "warning"
        ? "bg-global-yellow/10 text-global-yellow"
        : "bg-global-red/10 text-global-red";
  return (
    <span
      className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded-full ${cls}`}
    >
      {status}
    </span>
  );
};
export default StatusBadge;
