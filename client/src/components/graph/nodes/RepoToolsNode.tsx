import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { FaCode } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import styles from "@/styles/module/RepoInfoCard.module.css";
import { TOOL_ICONS, type IconMeta } from "@/components/graph/techIcons";

type IconMetaLite = { label: string; color: string; Icon: IconMeta["Icon"] };

export interface RepoToolsNodeData {
  repoName: string;
  htmlUrl: string;
}

function IconChip({ item, size = 15 }: { item: IconMetaLite; size?: number }) {
  const { Icon, color, label } = item;
  return (
    <span
      className={styles.chip}
      title={label}
      style={{ background: `${color}1f`, borderColor: `${color}55` }}
    >
      <Icon size={size} color={color} />
    </span>
  );
}

function RepoToolsNode({ data }: { data: RepoToolsNodeData }) {
  const openRepo = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    window.open(data.htmlUrl, "_blank", "noopener");
  };

  return (
    <div
      className={`${styles.card} ${styles.themeTools}`}
      onClick={() => openRepo()}
      title={`Open ${data.repoName} on GitHub`}
    >
      <Handle type="target" position={Position.Top} className={styles.handle} />

      <div className={styles.head}>
        <div className={styles.headLeft}>
          <span className={styles.iconOrb}>
            <FaCode size={17} color="#7a90ff" />
          </span>
          <div className={styles.titleGroup}>
            <div className={styles.eyebrow}>Workflow</div>
            <div className={styles.title}>Tools</div>
            <div className={styles.subtitle}>{data.repoName}</div>
          </div>
        </div>
        <div className={styles.headMeta}>
          <span className={styles.stepBadge}>01</span>
          <a
            href={data.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkChip}
            onClick={(e) => e.stopPropagation()}
            aria-label="Open repository on GitHub"
          >
            Repo <FiArrowUpRight size={12} />
          </a>
        </div>
      </div>

      <div className={styles.rowStack}>
        <div className={styles.subRow}>
          <span className={styles.subLabel}>Code</span>
          <IconChip item={TOOL_ICONS.code} />
        </div>
        <div className={styles.subRow}>
          <span className={styles.subLabel}>UX / UI</span>
          <IconChip item={TOOL_ICONS.uxui} />
        </div>
        <div className={styles.subRow}>
          <span className={styles.subLabel}>Rendering</span>
          <IconChip item={TOOL_ICONS.rendering} />
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className={styles.handle} />
    </div>
  );
}

export default memo(RepoToolsNode);
