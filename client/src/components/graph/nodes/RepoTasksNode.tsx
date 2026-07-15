import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { FaCheckSquare } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import styles from "@/styles/module/RepoInfoCard.module.css";

export interface RepoTasksNodeData {
  repoName: string;
  tasks: { label: string; done: boolean }[];
  htmlUrl: string;
}

function taskUrl(label: string, repoUrl: string): string {
  const l = label.toLowerCase();
  if (l.includes("open issue")) return `${repoUrl}/issues`;
  if (l.includes("release")) return `${repoUrl}/releases`;
  if (l.includes("ship") || l.includes("language module")) return `${repoUrl}`;
  if (l.includes("bootstrap")) return `${repoUrl}/commits`;
  return `${repoUrl}`;
}

function RepoTasksNode({ data }: { data: RepoTasksNodeData }) {
  const shown = data.tasks.slice(0, 6);
  const done = shown.filter((t) => t.done).length;
  const total = shown.length || 1;
  const pct = Math.round((done / total) * 100);
  const issuesUrl = `${data.htmlUrl}/issues`;

  return (
    <div
      className={`${styles.card} ${styles.themeTasks}`}
      onClick={() => window.open(issuesUrl, "_blank", "noopener")}
      title={`Open ${data.repoName} issues on GitHub`}
    >
      <Handle type="target" position={Position.Top} className={styles.handle} />

      <div className={styles.head}>
        <div className={styles.headLeft}>
          <span className={styles.iconOrb}>
            <FaCheckSquare size={15} color="#6de6c1" />
          </span>
          <div className={styles.titleGroup}>
            <div className={styles.eyebrow}>Milestones</div>
            <div className={styles.title}>Tasks</div>
            <div className={styles.subtitle}>{data.repoName}</div>
          </div>
        </div>
        <div className={styles.headMeta}>
          <span className={styles.stepBadge}>03</span>
          <a
            href={issuesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkChip}
            onClick={(e) => e.stopPropagation()}
            aria-label="Open issues on GitHub"
          >
            Issues <FiArrowUpRight size={12} />
          </a>
        </div>
      </div>

      <div className={styles.progressWrap}>
        <div
          className={styles.ring}
          style={{ ["--pct" as string]: pct }}
        >
          <span className={styles.ringText}>{pct}%</span>
        </div>
        <div className={styles.progressMeta}>
          <div className={styles.progressLabel}>
            {done} of {shown.length} complete
          </div>
          <div className={styles.progressSub}>Delivery progress</div>
        </div>
      </div>

      <ul className={styles.taskList}>
        {shown.map((t, i) => (
          <li key={i} className={styles.taskItem}>
            <span
              className={`${styles.taskBox} ${t.done ? styles.taskBoxDone : ""}`}
            >
              {t.done && "✓"}
            </span>
            <a
              href={taskUrl(t.label, data.htmlUrl)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`${styles.taskLabel} ${t.done ? styles.taskLabelDone : ""}`}
              style={{ textDecoration: "none" }}
              title={`Open “${t.label}” on GitHub`}
            >
              {t.label}
            </a>
            <span className={styles.rowLink}>
              <FiArrowUpRight size={11} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(RepoTasksNode);
