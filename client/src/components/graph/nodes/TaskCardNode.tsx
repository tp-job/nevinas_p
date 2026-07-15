import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import styles from "@/styles/module/GraphView.module.css";
import { langAbbr, langColor } from "@/components/graph/langColors";

export interface TaskCardNodeData {
  repoName: string;
  ownerLogin: string;
  description: string | null;
  languages: string[];
  htmlUrl: string;
}

function TaskCardNode({ data }: { data: TaskCardNodeData }) {
  return (
    <div
      className={`${styles.node} ${styles.taskCard}`}
      onClick={() => window.open(data.htmlUrl, "_blank", "noopener")}
    >
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <div className={styles.titleRow}>Task: Overview</div>
      <div className={styles.sub}>Maintained by {data.ownerLogin}</div>
      <div className={styles.desc}>
        {data.description || "No description provided."}
      </div>
      <div className={styles.techStack}>
        {data.languages.slice(0, 6).map((name) => (
          <span
            key={name}
            className={styles.stackIcon}
            title={name}
            style={{ background: langColor(name) }}
          >
            {langAbbr(name)}
          </span>
        ))}
      </div>
      <Handle type="source" position={Position.Bottom} className={styles.handle} />
    </div>
  );
}

export default memo(TaskCardNode);
