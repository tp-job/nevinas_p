import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { SiReact } from "react-icons/si";
import styles from "@/styles/module/RepoInfoCard.module.css";
import {
  LANG_ICONS,
  TOOL_ICONS,
  type IconMeta,
} from "@/components/graph/techIcons";

type IconMetaLite = { label: string; color: string; Icon: IconMeta["Icon"] };

export interface RepoInfoCardNodeData {
  repoName: string;
  stack: IconMetaLite[];
  languages: string[];
  tasks: { label: string; done: boolean }[];
  htmlUrl: string;
}

function IconChip({ item, size = 14 }: { item: IconMetaLite; size?: number }) {
  const { Icon, color, label } = item;
  return (
    <span
      className={styles.chip}
      title={label}
      style={{ background: `${color}1a`, borderColor: `${color}55` }}
    >
      <Icon size={size} color={color} />
    </span>
  );
}

function RepoInfoCardNode({ data }: { data: RepoInfoCardNodeData }) {
  return (
    <div
      className={styles.card}
      onClick={() => window.open(data.htmlUrl, "_blank", "noopener")}
    >
      <Handle type="target" position={Position.Top} className={styles.handle} />

      <div className={styles.header}>
        <span className={styles.headerBadge}>
          <SiReact size={16} color="#61dafb" />
        </span>
        <div className={styles.headerText}>
          <div className={styles.headerLabel}>Repository</div>
          <div className={styles.headerName}>{data.repoName}</div>
        </div>
      </div>

      <div className={styles.divider} />

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <TOOL_ICONS.code.Icon size={11} color={TOOL_ICONS.code.color} />
          <span>Tools used</span>
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
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <TOOL_ICONS.languages.Icon size={11} color={TOOL_ICONS.languages.color} />
          <span>Languages used</span>
        </div>
        <div className={styles.chipRow}>
          {data.languages.length === 0 && (
            <span className={styles.emptyChip}>—</span>
          )}
          {data.languages.slice(0, 6).map((name) => {
            const meta = LANG_ICONS[name];
            if (!meta) {
              return (
                <span
                  key={name}
                  className={styles.chip}
                  style={{
                    background: "rgba(124, 91, 246, 0.1)",
                    borderColor: "rgba(124, 91, 246, 0.35)",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#c4b5fd",
                  }}
                  title={name}
                >
                  {name.slice(0, 2).toUpperCase()}
                </span>
              );
            }
            return <IconChip key={name} item={meta} />;
          })}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <TOOL_ICONS.tasks.Icon size={11} color={TOOL_ICONS.tasks.color} />
          <span>Tasks</span>
        </div>
        <ul className={styles.taskList}>
          {data.tasks.slice(0, 5).map((t, i) => (
            <li key={i} className={styles.taskItem}>
              <span
                className={`${styles.taskBox} ${t.done ? styles.taskBoxDone : ""}`}
              >
                {t.done && "✓"}
              </span>
              <span
                className={`${styles.taskLabel} ${t.done ? styles.taskLabelDone : ""}`}
              >
                {t.label}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default memo(RepoInfoCardNode);
