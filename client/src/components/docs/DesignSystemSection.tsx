import type { FC } from "react";
import { designSystem } from "@/data/docData";
import DocSection from "./DocSection";
import ColorSwatch from "./ColorSwatch";
import { TH, cardCls } from "./constants";

interface PaletteGroupProps {
  label: string;
  hint?: string;
  color: string;
  cols?: string;
  swatches: { name: string; hex: string; variable: string }[];
}

/** A labelled panel holding one palette's swatches. */
const PaletteGroup: FC<PaletteGroupProps> = ({
  label,
  hint,
  color,
  cols = "grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
  swatches,
}) => (
  <div className="mb-8 last:mb-0">
    <div className="flex items-center gap-2.5 mb-4">
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}80` }}
      />
      <h4 className="text-xs font-bold uppercase tracking-wider text-light-text dark:text-dark-text">
        {label}
      </h4>
      {hint && (
        <span className="text-[11px] text-light-text-secondary dark:text-dark-text-secondary">
          {hint}
        </span>
      )}
    </div>
    <div className={`grid ${cols} gap-3`}>
      {swatches.map((c) => (
        <ColorSwatch key={c.variable} {...c} />
      ))}
    </div>
  </div>
);

/** Design System — theme colors and typography. */
const DesignSystemSection: FC = () => (
  <DocSection title="Design System" subtitle="Theme colors and typography">
    <div className={`p-6 sm:p-8 mb-8 ${cardCls}`}>
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${TH.flamingo}60, ${TH.orchid}60, transparent)`,
        }}
      />

      <PaletteGroup
        label="Main Palette"
        hint="Periwinkle → Charcoal"
        color={TH.orchid}
        swatches={designSystem.mainTheme}
      />

      <PaletteGroup
        label="Sub-Palette"
        hint="Effects & SVG"
        color={TH.flamingo}
        cols="grid-cols-2 sm:grid-cols-4 lg:grid-cols-5"
        swatches={designSystem.subPalette}
      />

      {/* Light + Dark side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl p-5 border border-light-border dark:border-dark-border bg-light-surface/40 dark:bg-dark-bg/30">
          <PaletteGroup
            label="Light Mode"
            color={TH.yellow}
            cols="grid-cols-2"
            swatches={designSystem.lightMode}
          />
        </div>
        <div className="rounded-2xl p-5 border border-light-border dark:border-dark-border bg-light-surface/40 dark:bg-dark-bg/30">
          <PaletteGroup
            label="Dark Mode"
            color={TH.royal}
            cols="grid-cols-2"
            swatches={designSystem.darkMode}
          />
        </div>
      </div>

      <PaletteGroup
        label="Semantic Tokens"
        color={TH.green}
        cols="grid-cols-2 sm:grid-cols-4 lg:grid-cols-5"
        swatches={designSystem.semanticTokens}
      />

      {/* Typography */}
      <div className="flex items-center gap-2.5 mb-4">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: TH.azure, boxShadow: `0 0 8px ${TH.azure}80` }}
        />
        <h4 className="text-xs font-bold uppercase tracking-wider text-light-text dark:text-dark-text">
          Typography
        </h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {designSystem.fonts.map((f) => (
          <div
            key={f.name}
            className="group flex items-start gap-4 p-5 rounded-2xl
                       border border-light-border dark:border-dark-border
                       bg-light-surface-2 dark:bg-dark-surface
                       transition-all duration-300 hover:-translate-y-1
                       hover:shadow-[0_12px_32px_rgba(30,35,60,0.10)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
                          bg-gradient-to-br from-haze to-midnight text-periwinkle-pale
                          transition-transform duration-300 group-hover:scale-105
                          ${f.variable === "--font-zen" ? "font-zen" : "font-inter"}`}
              style={{ boxShadow: `0 6px 18px ${TH.azure}30` }}
            >
              <span className="text-xl font-semibold">Aa</span>
            </div>
            <div className="min-w-0">
              <p
                className={`text-lg font-semibold text-light-text dark:text-dark-text mb-0.5 ${f.variable === "--font-zen" ? "font-zen" : "font-inter"}`}
              >
                {f.name}
              </p>
              <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                {f.usage}
              </p>
              <code className="inline-block text-[10px] font-mono mt-1.5 px-2 py-0.5 rounded-md bg-light-surface dark:bg-dark-bg/50 text-haze dark:text-periwinkle">
                {f.variable}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  </DocSection>
);

export default DesignSystemSection;
