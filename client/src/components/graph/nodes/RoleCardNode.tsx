import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import styles from "@/styles/module/GraphView.module.css";
import { fmtNum } from "@/components/graph/langColors";

export interface RoleCardNodeData {
  login: string;
  avatarUrl: string;
  contributions: number;
  htmlUrl: string;
  role: string;
}

function RoleCardNode({ data }: { data: RoleCardNodeData }) {
  return (
    <div
      className={`${styles.node} ${styles.roleCard} ${styles.rolePm}`}
      onClick={() => window.open(data.htmlUrl, "_blank", "noopener")}
    >
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <div className={styles.roleTop}>
        <div
          className={styles.roleAvatar}
          style={{ backgroundImage: `url(${data.avatarUrl})` }}
        ></div>
        <div>
          <div className={styles.roleName}>{data.login}</div>
          <div className={styles.roleDesc}>
            {data.role} · {fmtNum(data.contributions)} commits
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(RoleCardNode);
