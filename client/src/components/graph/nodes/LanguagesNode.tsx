import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import styles from "@/styles/module/GraphView.module.css";
import { TOOL_ICONS } from "@/components/graph/techIcons";

export interface LanguagesNodeData {
  languages: { name: string; percentage: number; color: string }[];
  repoName: string;
}

function LanguagesNode({ data }: { data: LanguagesNodeData }) {
  return (
    <div className={styles.subnodeCard}>
      <Handle type="target" position={Position.Top} className={styles.subnodeHandle} />
      <div className={styles.subnodeHeader}>
        <span className={styles.subnodeBadge} style={{ background: "rgba(229, 192, 123, 0.1)" }}>
          <TOOL_ICONS.languages.Icon size={14} color="#e5c07b" />
        </span>
        <div className={styles.subnodeHeaderText}>
          <div className={styles.subnodeEyebrow}>Details</div>
          <div className={styles.subnodeTitle}>Languages</div>
        </div>
      </div>

      <div className={styles.subnodeDivider} />

      <div className={styles.languagesRow}>
        {data.languages.length === 0 ? (
          <span className={styles.emptyText}>No languages detected</span>
        ) : (
          data.languages.slice(0, 4).map((lang, idx) => (
            <div key={idx} className={styles.langItem}>
              <div className={styles.langMeta}>
                <span className={styles.langDot} style={{ backgroundColor: lang.color }} />
                <span className={styles.langName}>{lang.name}</span>
                <span className={styles.langPct}>{lang.percentage}%</span>
              </div>
              <div className={styles.langBar}>
                <div className={styles.langBarFill} style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default memo(LanguagesNode);
