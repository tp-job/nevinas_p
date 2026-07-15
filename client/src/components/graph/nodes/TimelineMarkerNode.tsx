import { memo } from "react";
import styles from "@/styles/module/GraphView.module.css";

export interface TimelineMarkerNodeData {
  label: string;
}

function TimelineMarkerNode({ data }: { data: TimelineMarkerNodeData }) {
  return <div className={styles.timelineMarker}>{data.label}</div>;
}

export default memo(TimelineMarkerNode);
