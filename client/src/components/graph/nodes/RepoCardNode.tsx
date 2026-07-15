import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import RepoCard from "@/components/card/RepoCard";

export interface RepoCardNodeData {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  updatedAt: string;
  url: string;
}

function RepoCardNode({ data }: { data: RepoCardNodeData }) {
  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: "10px",
          height: "10px",
          background: "#878CB4",
          border: "2px solid var(--color-bg-primary)",
        }}
      />
      <div className="w-[320px]">
        <RepoCard {...data} />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: "10px",
          height: "10px",
          background: "#878CB4",
          border: "2px solid var(--color-bg-primary)",
        }}
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        style={{
          width: "10px",
          height: "10px",
          background: "#878CB4",
          border: "2px solid var(--color-bg-primary)",
        }}
      />
    </div>
  );
}

export default memo(RepoCardNode);
