import type { FC } from "react";
import ReactMarkdown from "react-markdown";
import type { GitHubRepo } from "@/utils/api";
import { getLangColor } from "@/utils/constants";
import { projectDetailByRepo } from "@/data/docData";
import ArchitectureGrid from "./ArchitectureGrid";
import { TH, cardCls } from "./constants";

interface RepoDetailPanelProps {
  selectedRepo: string;
  selectedRepoData: GitHubRepo | null;
  readmeContent: string | null;
  readmeLoading: boolean;
  readmeError: string | null;
  onBack: () => void;
}

/** Detail shown when a repo card is clicked — architecture / info + README. */
const RepoDetailPanel: FC<RepoDetailPanelProps> = ({
  selectedRepo,
  selectedRepoData,
  readmeContent,
  readmeLoading,
  readmeError,
  onBack,
}) => {
  const projectArchitecture = projectDetailByRepo[selectedRepo] ?? null;

  const backButton = (
    <button
      onClick={onBack}
      className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-light-surface-2 dark:bg-dark-surface text-light-text-secondary dark:text-dark-text-secondary hover:bg-matte-azure/10 hover:text-matte-azure transition-colors"
    >
      <i className="ri-arrow-left-line mr-1"></i> Back
    </button>
  );

  return (
    <>
      {/* Architecture Overview — for repos with projectDetailByRepo */}
      {projectArchitecture && (
        <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${TH.azure}60, ${TH.orchid}60, transparent)`,
            }}
          />
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-light-text dark:text-dark-text">
                <i className="ri-folder-3-line mr-2 text-matte-azure"></i>
                {selectedRepo} — Project Detail
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-0.5">
                Technology stack breakdown
              </p>
            </div>
            {backButton}
          </div>
          <ArchitectureGrid data={projectArchitecture} />
        </div>
      )}

      {/* Simple Tech Stack — for repos without projectDetailByRepo */}
      {!projectArchitecture && selectedRepoData && (
        <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${TH.azure}60, transparent)`,
            }}
          />
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-light-text dark:text-dark-text">
                <i className="ri-folder-3-line mr-2 text-matte-azure"></i>
                {selectedRepo} — Project Info
              </h3>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-0.5">
                {selectedRepoData.description || "No description"}
              </p>
            </div>
            {backButton}
          </div>
          <div className="flex flex-wrap gap-3">
            {selectedRepoData.language && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-light-surface-2 dark:bg-dark-surface border border-light-border dark:border-dark-border">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: getLangColor(
                      selectedRepoData.language,
                    ),
                  }}
                />
                <span className="text-sm font-semibold text-light-text dark:text-dark-text">
                  {selectedRepoData.language}
                </span>
              </div>
            )}
            {(selectedRepoData.topics || []).map((t) => (
              <span
                key={t}
                className="px-3 py-2 rounded-xl bg-light-surface-2 dark:bg-dark-surface border border-light-border dark:border-dark-border text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* README Viewer */}
      <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${TH.green}60, transparent)`,
          }}
        />
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-light-text dark:text-dark-text">
            <i className="ri-file-list-3-line mr-2 text-matte-azure"></i>
            {selectedRepo} — README
          </h3>
          {!projectArchitecture && !selectedRepoData && backButton}
        </div>
        {readmeLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin w-10 h-10 border-2 border-matte-azure border-t-transparent rounded-full" />
          </div>
        )}
        {readmeError && (
          <div className="py-12 text-center">
            <i className="ri-error-warning-line text-4xl text-global-red mb-3"></i>
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              {readmeError}
            </p>
          </div>
        )}
        {readmeContent && !readmeLoading && (
          <div
            className="prose-doc [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:text-light-text [&_h1]:dark:text-dark-text
                      [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-light-text [&_h2]:dark:text-dark-text
                      [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-light-text [&_h3]:dark:text-dark-text
                      [&_p]:text-base [&_p]:text-light-text [&_p]:dark:text-dark-text [&_p]:mb-4 [&_p]:leading-relaxed
                      [&_a]:text-matte-azure [&_a]:underline [&_a]:hover:no-underline
                      [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:bg-light-surface-2 [&_code]:dark:bg-dark-surface [&_code]:font-mono
                      [&_pre]:p-5 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:bg-light-surface-2 [&_pre]:dark:bg-dark-surface [&_pre]:border [&_pre]:border-light-border [&_pre]:dark:border-dark-border [&_pre]:mb-6
                      [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2 [&_ul]:text-light-text [&_ul]:dark:text-dark-text
                      [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2 [&_ol]:text-light-text [&_ol]:dark:text-dark-text"
          >
            <ReactMarkdown>{readmeContent}</ReactMarkdown>
          </div>
        )}
      </div>
    </>
  );
};

export default RepoDetailPanel;
