import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import styles from "@/styles/module/GraphView.module.css";
import { TOOL_ICONS } from "@/components/graph/techIcons";

export interface TechStackNodeData {
  stack: { label: string; color: string; Icon: any }[];
  repoName: string;
}

function TechStackNode({ data }: { data: TechStackNodeData }) {
  return (
    <div className={styles.subnodeCard}>
      <Handle type="target" position={Position.Top} className={styles.subnodeHandle} />
      <div className={styles.subnodeHeader}>
        <span className={styles.subnodeBadge} style={{ background: "rgba(122, 144, 255, 0.1)" }}>
          <TOOL_ICONS.code.Icon size={14} color="#7a90ff" />
        </span>
        <div className={styles.subnodeHeaderText}>
          <div className={styles.subnodeEyebrow}>Stack</div>
          <div className={styles.subnodeTitle}>Tech Stack</div>
        </div>
      </div>

      <div className={styles.subnodeDivider} />

      <div className={styles.techStackRow}>
        {data.stack.length === 0 ? (
          <span className={styles.emptyText}>No stack inferred</span>
        ) : (
          data.stack.map((item, idx) => {
            const { Icon, color, label } = item;
            return (
              <span
                key={idx}
                className={styles.stackChip}
                title={label}
                style={{ backgroundColor: `${color}15`, borderColor: `${color}40` }}
              >
                <Icon size={15} color={color} />
                <span className={styles.stackLabel} style={{ color }}>{label}</span>
              </span>
            );
          })
        )}
      </div>
    </div>
  );
}

export default memo(TechStackNode);
