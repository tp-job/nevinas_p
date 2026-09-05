/**
 * The homepage slide's scroll progress, published as a context.
 *
 * Split out of SlideWrapper.tsx so that file exports only its component. Its
 * consumers — ParticleScroll, BentoGrid, ScrollReveal and the ParticleScrollLab
 * page — want the progress value, not the wrapper, and importing the wrapper to
 * reach the hook pulled the whole slide machinery into their module graph.
 *
 * See SlideWrapper for why the value exists at all: only the ACTIVE slide runs
 * useScroll/useTransform, so this is null on every inert slide. Consumers must
 * handle null rather than assume a MotionValue.
 */
import { createContext, useContext } from 'react';
import type { MotionValue } from 'framer-motion';

export const SlideScrollContext = createContext<MotionValue<number> | null>(null);
export const useSlideScroll = () => useContext(SlideScrollContext);
