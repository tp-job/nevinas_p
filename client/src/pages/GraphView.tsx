import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type NodeTypes,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import styles from "@/styles/module/GraphView.module.css";
import {
  githubApi,
  UPSTREAM_TIMEOUT_MS,
  type GitHubProfile,
  type GitHubRepo,
} from "@/utils/api";
import Loading from "@/components/common/loading/Loading";
import Error from "@/components/common/server-error/Error";
import RepoCardNode from "@/components/graph/nodes/RepoCardNode";
import TimelineMarkerNode from "@/components/graph/nodes/TimelineMarkerNode";
import TechStackNode from "@/components/graph/nodes/TechStackNode";
import LanguagesNode from "@/components/graph/nodes/LanguagesNode";
import LastCommitNode from "@/components/graph/nodes/LastCommitNode";
import { buildFlow, type RepoDetails } from "@/components/graph/buildFlow";

const nodeTypes: NodeTypes = {
  repoCard: RepoCardNode,
  marker: TimelineMarkerNode,
  techStack: TechStackNode,
  languages: LanguagesNode,
  lastCommit: LastCommitNode,
};

interface GhContributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

const GraphView: FC = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [details, setDetails] = useState<Record<string, RepoDetails>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const [repoData, profileData] = await Promise.all([
          githubApi.getRepos(),
          githubApi.getProfile(),
        ]);
        if (cancelled) return;
        setRepos(repoData);
        setProfile(profileData);
        // Nodes can render as soon as repos + profile are in — language and
        // contributor details enrich the graph progressively below instead
        // of blocking the whole page behind 2×N slow/rate-limited requests.
        setLoading(false);

        const detailResults = await Promise.allSettled(
          repoData.map(async (r) => {
            // Only the direct github.com call still needs a hand-rolled
            // timeout — it bypasses our API layer. getRepoLanguages goes
            // through apiFetch, which applies UPSTREAM_TIMEOUT_MS itself.
            // Both talk to the same slow unauthenticated upstream, so they use
            // the same budget.
            const controller = new AbortController();
            const timeout = setTimeout(
              () => controller.abort(),
              UPSTREAM_TIMEOUT_MS,
            );
            const [langs, contribs] = await Promise.allSettled([
              githubApi.getRepoLanguages(r.name),
              fetch(
                `https://api.github.com/repos/${profileData.login}/${r.name}/contributors?per_page=1`,
                {
                  headers: { Accept: "application/vnd.github+json" },
                  signal: controller.signal,
                },
              ).then((res) =>
                res.ok ? (res.json() as Promise<GhContributor[]>) : [],
              ),
            ]);
            clearTimeout(timeout);
            const details: RepoDetails = {
              languages: langs.status === "fulfilled" ? langs.value : {},
              topContributor:
                contribs.status === "fulfilled" && contribs.value[0]
                  ? contribs.value[0]
                  : null,
            };
            return [r.name, details] as const;
          }),
        );
        if (cancelled) return;
        const detailMap: Record<string, RepoDetails> = {};
        for (const res of detailResults) {
          if (res.status === "fulfilled") {
            const [name, d] = res.value;
            detailMap[name] = d;
          }
        }
        setDetails(detailMap);
      } catch {
        if (!cancelled) setError("Failed to fetch repositories from GitHub");
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!profile || repos.length === 0) return { nodes: [], edges: [] };
    return buildFlow(repos, profile, details);
  }, [repos, profile, details]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // useNodesState/useEdgesState only seed their internal state from the
  // initial value passed at mount — they don't re-sync automatically when
  // repos/profile/details finish loading asynchronously, so push updates
  // through explicitly whenever the derived flow changes.
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);
  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  return (
    <div className={styles.fullscreen}>
      {loading && <Loading />}
      {error && <Error error={error} />}

      {!loading && !error && repos.length > 0 && profile && (
        <div className={styles.container}>
          <div className={styles.brandRow}>
            <span className={styles.dotpulse}></span>
            <span className={styles.brand}>Repository Timeline</span>
            <span className={styles.counter}>{repos.length} repos</span>
          </div>
          <div className={styles.flowWrap}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.15 }}
              minZoom={0.1}
              maxZoom={1.5}
              proOptions={{ hideAttribution: true }}
              nodesDraggable={true}
              nodesConnectable={true}
              elementsSelectable={true}
              panOnDrag
              zoomOnScroll
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={24}
                size={1}
                color="var(--gv-line)"
              />
              <Controls
                position="bottom-right"
                showInteractive={true}
                className={styles.flowControls}
              />
              <MiniMap
                pannable
                zoomable
                position="bottom-left"
                className={styles.flowMinimap}
                maskColor="var(--gv-bg-1)"
                nodeColor="var(--gv-blue)"
              />
            </ReactFlow>
          </div>
        </div>
      )}

      {!loading && !error && repos.length === 0 && (
        <div className={styles.container}>
          <div className={styles.emptyState}>No repositories found.</div>
        </div>
      )}
    </div>
  );
};

export default GraphView;
