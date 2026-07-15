import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import styles from "@/styles/module/GraphView.module.css";

export interface RepoHeaderNodeData {
  name: string;
  avatarUrl: string;
  createdAt: string;
  htmlUrl: string;
}

function RepoHeaderNode({ data }: { data: RepoHeaderNodeData }) {
  const date = new Date(data.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <div
      className={`${styles.node} ${styles.clientCard}`}
      onClick={() => window.open(data.htmlUrl, "_blank", "noopener")}
    >
      <Handle type="target" position={Position.Left} className={styles.handle} />
      <div
        className={styles.clientBadge}
        style={{ backgroundImage: `url(${data.avatarUrl})` }}
      />
      <div className={styles.meta}>
        <div className={styles.titleRow}>
          Repo: <span style={{ fontWeight: 800 }}>{data.name}</span>
        </div>
        <div className={styles.onboard}>Created: {date}</div>
      </div>
      <Handle type="source" position={Position.Right} className={styles.handle} />
      <Handle
        id="down"
        type="source"
        position={Position.Bottom}
        className={styles.handle}
      />
    </div>
  );
}

export default memo(RepoHeaderNode);
