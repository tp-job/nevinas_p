// ─────────────────────────────────────────────────────────────
//  MA Studio — Horizontal Services § S6
//  types.ts
// ─────────────────────────────────────────────────────────────

import type { ReactNode } from 'react';

/** A single service panel (Panel 1‥N). */
export interface ServicePanel {
  /** e.g. "01" */
  num: string;
  /** Japanese display title, may include <br/> line breaks */
  titleJP: string;
  /** English subtitle / tag label */
  tag: string;
  /** Body copy */
  description: string;
  /** Optional icon — React node (SVG component) or image URL string */
  icon?: ReactNode | string;
  /** Alt text when icon is a URL */
  iconAlt?: string;
}

export interface HorizontalServicesProps {
  /** Array of service panels (rendered after the intro panel) */
  panels?: ServicePanel[];
  /** Section id for anchor navigation */
  id?: string;
  /** Override intro heading (JP) */
  introBig?: string;
  /** Override intro sub-label */
  introSub?: string;
}