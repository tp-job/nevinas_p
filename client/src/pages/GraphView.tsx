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
} from "@/utils/api";
import AsyncBoundary from "@/components/common/AsyncBoundary";
import RepoCardNode from "@/components/graph/nodes/RepoCardNode";
import TimelineMarkerNode from "@/components/graph/nodes/TimelineMarkerNode";
import TechStackNode from "@/components/graph/nodes/TechStackNode";
import LanguagesNode from "@/components/graph/nodes/LanguagesNode";
import LastCommitNode from "@/components/graph/nodes/LastCommitNode";
import { buildFlow, type RepoDetails } from "@/components/graph/buildFlow";
import { useRepos } from "@/context/RepoContext";

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
  // Repos come from the shared /work provider; only the profile and the
  // per-repo enrichment are fetched here. This page used to fetch the repo
  // list itself, which meant arriving from /work/repository (where it was
  // already loaded) paid for it a second time.
  const { repos, loading: reposLoading, error: reposError } = useRepos();

  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [details, setDetails] = useState<Record<string, RepoDetails>>({});
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Either half failing leaves the graph undrawable, so both surface through
  // the one AsyncBoundary below. The repo half reports through the shared
  // provider now, so its message is worded there rather than here.
  const error = reposError ?? profileError;

  // The graph can draw as soon as repos and profile are in. Enrichment below
  // fills in progressively rather than blocking on 2xN rate-limited requests.
  const loading = reposLoading || profileLoading;

  // Keyed on the repo list: the enrichment pass needs the list, which now
  // arrives asynchronously from context rather than being fetched in here.
  // `repoKey` rather than `repos` so a new array identity carrying the same
  // repositories does not re-run 2xN upstream requests.
  const repoKey = repos.map((r) => r.name).join(",");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const profileData = await githubApi.getProfile();
        if (cancelled) return;
        setProfile(profileData);
        setProfileLoading(false);

        if (repos.length === 0) return;
        const repoData = repos;

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
        if (!cancelled)
          setProfileError("Failed to fetch profile data from GitHub");
        setProfileLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoKey]);

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
      <AsyncBoundary
        loading={loading}
        error={error}
        isEmpty={repos.length === 0 || !profile}
        emptyState={
          <div className={styles.container}>
            <div className={styles.emptyState}>No repositories found.</div>
          </div>
        }
      >
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
      </AsyncBoundary>
    </div>
  );
};

export default GraphView;
