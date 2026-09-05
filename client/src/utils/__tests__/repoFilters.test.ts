import { describe, it, expect } from 'vitest';
import { filterReposByKeywords } from '../repoFilters';
import type { GitHubRepo } from '@/utils/api';

/**
 * filterReposByKeywords decides which repos appear under each section of the
 * work pages. Its edge cases are all about ABSENT data — the GitHub API returns
 * null for description and language, and omits topics entirely on some repos —
 * so a naive implementation throws on exactly the repos that are hardest to
 * notice missing.
 */
const repo = (over: Partial<GitHubRepo>): GitHubRepo =>
  ({
    name: 'placeholder',
    description: null,
    language: null,
    topics: [],
    ...over,
  }) as GitHubRepo;

describe('filterReposByKeywords', () => {
  it('matches an exact topic', () => {
    const repos = [repo({ name: 'a', topics: ['react'] }), repo({ name: 'b' })];
    expect(filterReposByKeywords(repos, ['react']).map((r) => r.name)).toEqual(['a']);
  });

  it('matches a keyword as a substring of the name, case-insensitively', () => {
    const repos = [repo({ name: 'My-React-App' })];
    expect(filterReposByKeywords(repos, ['react'])).toHaveLength(1);
  });

  it('matches a keyword inside the description, case-insensitively', () => {
    const repos = [repo({ name: 'x', description: 'A Portfolio Site' })];
    expect(filterReposByKeywords(repos, ['portfolio'])).toHaveLength(1);
  });

  it('matches on exact language when the keywords miss', () => {
    const repos = [repo({ name: 'x', language: 'TypeScript' })];
    expect(filterReposByKeywords(repos, ['nothing'], ['TypeScript'])).toHaveLength(1);
  });

  it('matches language exactly, not as a substring', () => {
    // "Type" must not match "TypeScript" — languages come from a fixed GitHub
    // vocabulary, and substring matching there would pull in unrelated repos.
    const repos = [repo({ name: 'x', language: 'TypeScript' })];
    expect(filterReposByKeywords(repos, [], ['Type'])).toHaveLength(0);
  });

  /* The null/undefined cases the GitHub API actually returns. */
  it('survives a null description', () => {
    const repos = [repo({ name: 'x', description: null })];
    expect(() => filterReposByKeywords(repos, ['anything'])).not.toThrow();
    expect(filterReposByKeywords(repos, ['anything'])).toHaveLength(0);
  });

  it('survives entirely absent topics', () => {
    const repos = [{ name: 'x', description: null, language: null } as GitHubRepo];
    expect(() => filterReposByKeywords(repos, ['anything'])).not.toThrow();
  });

  it('does not match a null language against an empty-string filter', () => {
    // `r.language ?? ""` means a null language becomes "". If a caller ever
    // passes "" in the languages list, every untyped repo would match.
    const repos = [repo({ name: 'x', language: null })];
    expect(filterReposByKeywords(repos, [], [])).toHaveLength(0);
  });

  it('returns nothing when no keywords or languages are given', () => {
    const repos = [repo({ name: 'a' }), repo({ name: 'b' })];
    expect(filterReposByKeywords(repos, [])).toEqual([]);
  });

  it('returns each matching repo once even when several keywords hit it', () => {
    const repos = [repo({ name: 'react-portfolio', topics: ['react', 'portfolio'] })];
    expect(filterReposByKeywords(repos, ['react', 'portfolio'])).toHaveLength(1);
  });

  it('preserves input order', () => {
    const repos = [repo({ name: 'z', topics: ['t'] }), repo({ name: 'a', topics: ['t'] })];
    expect(filterReposByKeywords(repos, ['t']).map((r) => r.name)).toEqual(['z', 'a']);
  });
});
