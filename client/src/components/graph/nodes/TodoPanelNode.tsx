import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import styles from "@/styles/module/GraphView.module.css";
import { langColor, fmtNum } from "@/components/graph/langColors";

export interface TodoPanelNodeData {
  sizeKb: number;
  languageBytes: Record<string, number>;
}

function TodoPanelNode({ data }: { data: TodoPanelNodeData }) {
  const entries = Object.entries(data.languageBytes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const total = entries.reduce((s, [, b]) => s + b, 0) || 1;

  return (
    <div className={`${styles.node} ${styles.todoPanel}`}>
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <div className={styles.panelHead}>
        <div className={styles.panelHeadTitle}>Project To-Do's Overview</div>
        <div className={styles.panelStats}>
          <span>
            <i className="ri-file-list-3-line"></i> {entries.length}
          </span>
          <span>
            <i className="ri-hard-drive-2-line"></i> {fmtNum(data.sizeKb)}kb
          </span>
        </div>
      </div>
      <div>
        {entries.length === 0 && (
          <div className={styles.sub}>No language data.</div>
        )}
        {entries.map(([name, bytes]) => {
          const pct = Math.round((bytes / total) * 100);
          const color = langColor(name);
          return (
            <div key={name} className={styles.todoRow}>
              <span className={styles.dragHandle}>⠿</span>
              <span className={styles.rowLabel}>{name}</span>
              <div className={styles.rowProgress}>
                <span className={styles.rowPct}>{pct}%</span>
                <div className={styles.bar}>
                  <div
                    className={styles.barFill}
                    style={{ background: color, width: `${pct}%` }}
                  ></div>
                </div>
              </div>
              <span
                className={styles.statusPill}
                style={{ background: `${color}22`, color }}
              >
                {pct >= 25 ? "In Progress" : pct >= 5 ? "Active" : "To-Do"}
              </span>
            </div>
          );
        })}
      </div>
      <Handle type="source" position={Position.Bottom} className={styles.handle} />
    </div>
  );
}

export default memo(TodoPanelNode);
