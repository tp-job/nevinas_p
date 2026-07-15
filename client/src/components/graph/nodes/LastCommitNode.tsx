import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import styles from "@/styles/module/GraphView.module.css";
import { TOOL_ICONS } from "@/components/graph/techIcons";

export interface LastCommitNodeData {
  contributor: {
    login: string;
    avatarUrl: string;
    contributions: number;
    htmlUrl: string;
  } | null;
  repoName: string;
}

function LastCommitNode({ data }: { data: LastCommitNodeData }) {
  const { contributor } = data;
  return (
    <div className={styles.subnodeCard}>
      <Handle type="target" position={Position.Top} className={styles.subnodeHandle} />
      <div className={styles.subnodeHeader}>
        <span className={styles.subnodeBadge} style={{ background: "rgba(109, 230, 193, 0.1)" }}>
          <TOOL_ICONS.tasks.Icon size={14} color="#6de6c1" />
        </span>
        <div className={styles.subnodeHeaderText}>
          <div className={styles.subnodeEyebrow}>Activity</div>
          <div className={styles.subnodeTitle}>Top Contributor</div>
        </div>
      </div>

      <div className={styles.subnodeDivider} />

      {contributor ? (
        <div className={styles.contributorRow}>
          <div
            className={styles.contributorAvatar}
            style={{ backgroundImage: `url(${contributor.avatarUrl})` }}
          />
          <div className={styles.contributorMeta}>
            <a
              href={contributor.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contributorName}
              onClick={(e) => e.stopPropagation()}
            >
              {contributor.login}
            </a>
            <div className={styles.contributorSub}>
              {contributor.contributions} commits
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.emptyText}>No contributions found</div>
      )}
    </div>
  );
}

export default memo(LastCommitNode);
