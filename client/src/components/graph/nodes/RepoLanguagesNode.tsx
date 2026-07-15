import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { FaCube } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import styles from "@/styles/module/RepoInfoCard.module.css";
import { LANG_ICONS } from "@/components/graph/techIcons";

export interface RepoLanguagesNodeData {
  repoName: string;
  languages: string[];
  htmlUrl: string;
}

function RepoLanguagesNode({ data }: { data: RepoLanguagesNodeData }) {
  const shown = data.languages.slice(0, 8);
  const searchUrl = `${data.htmlUrl}/search?l=`;

  return (
    <div
      className={`${styles.card} ${styles.themeLangs}`}
      onClick={() => window.open(data.htmlUrl, "_blank", "noopener")}
      title={`Open ${data.repoName} on GitHub`}
    >
      <Handle type="target" position={Position.Top} className={styles.handle} />

      <div className={styles.head}>
        <div className={styles.headLeft}>
          <span className={styles.iconOrb}>
            <FaCube size={16} color="#e5c07b" />
          </span>
          <div className={styles.titleGroup}>
            <div className={styles.eyebrow}>Stack</div>
            <div className={styles.title}>Languages</div>
            <div className={styles.subtitle}>{data.repoName}</div>
          </div>
        </div>
        <div className={styles.headMeta}>
          <span className={styles.stepBadge}>02</span>
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

      {shown.length === 0 && <div className={styles.emptyState}>— no language data —</div>}

      {shown.length > 0 && (
        <div className={styles.langGrid}>
          {shown.map((name) => {
            const meta = LANG_ICONS[name];
            const href = `${searchUrl}${encodeURIComponent(name)}`;
            const commonProps = {
              key: name,
              href,
              target: "_blank" as const,
              rel: "noopener noreferrer",
              onClick: (e: React.MouseEvent) => e.stopPropagation(),
              className: styles.langCell,
            };
            if (!meta) {
              return (
                <a
                  {...commonProps}
                  style={{
                    background: "rgba(124, 91, 246, 0.12)",
                    borderColor: "rgba(124, 91, 246, 0.35)",
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#c4b5fd",
                    letterSpacing: "0.04em",
                    textDecoration: "none",
                  }}
                  title={`View ${name} files`}
                >
                  {name.slice(0, 2).toUpperCase()}
                </a>
              );
            }
            const { Icon, color, label } = meta;
            return (
              <a
                {...commonProps}
                title={`View ${label} files`}
                style={{
                  background: `${color}1f`,
                  borderColor: `${color}55`,
                  textDecoration: "none",
                }}
              >
                <Icon size={22} color={color} />
              </a>
            );
          })}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className={styles.handle} />
    </div>
  );
}

export default memo(RepoLanguagesNode);
