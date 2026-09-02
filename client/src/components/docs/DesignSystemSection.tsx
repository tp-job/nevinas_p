import type { FC } from "react";
import { designSystem } from "@/data/docData";
import DocSection from "./DocSection";
import GroupLabel from "./GroupLabel";
import { contrastRatio, wcagGrade, isOpaqueHex } from "@/utils/contrast";
import { useCssTokens } from "@/hooks/useCssTokens";

/**
 * Design System — a spec sheet, not a swatch gallery.
 *
 * WHAT CHANGED AND WHY IT MATTERED
 *
 * The previous version nested five bordered, rounded containers inside each
 * other: DocSection → Disclosure → a `cardCls` panel with a gradient top bar →
 * per-mode sub-panels → ColorSwatch cards that lifted and dropped a shadow on
 * hover. Every level repeated the same border, radius and surface, so the
 * structure carried no information — the reader could not tell which boundary
 * meant "different palette" from which meant "different container". It also
 * hid the actual reference material behind a collapsed disclosure.
 *
 * This version has ONE level. Content sits directly on the page, separated by
 * hairline rules and small-caps labels, in aligned tabular rows. That is how a
 * token manifest is read: scanned down a column, not browsed as cards.
 *
 * THREE THINGS THIS ADDS THAT THE CARD WALL COULD NOT
 *
 * 1. Light and dark are ONE table with two value columns, because they are one
 *    token with two values — not two palettes. Side-by-side panels forced the
 *    reader to hold `--color-text-secondary` in their head and hunt for its
 *    twin in the other box.
 * 2. Measured WCAG contrast on every text token against its own background.
 *    This is the number that decides whether a token is usable, and it is
 *    computed here rather than claimed, so it cannot go stale.
 * 3. A type scale stated in px/weight — and the scale documented is the one
 *    this very page renders, so the page is its own proof.
 *
 * VALUES ARE READ FROM THE STYLESHEET, NOT FROM docData
 *
 * The hexes in docData had already drifted from index.css — Accent, Success,
 * Error and Warning were all wrong, so four of the five semantic swatches on
 * this page showed a colour the site does not use. Two hand-maintained lists
 * of hex codes cannot be kept in agreement by anything a compiler checks, so
 * this component resolves `--color-*` off the live document instead and treats
 * the docData value as a fallback only. See hooks/useCssTokens.ts.
 *
 * `font-mono` resolves to Tailwind's default system stack (ui-monospace,
 * Menlo, Consolas…). No webfont is downloaded, and CodeBlock.tsx already uses
 * it, so token values are set the same way everywhere on the site.
 */

type Token = { name: string; hex: string; variable: string };

/** Every variable this section documents, in one list for a single read. */
const ALL_TOKENS: Token[] = [
  ...designSystem.mainTheme,
  ...designSystem.subPalette,
  ...designSystem.lightMode,
  ...designSystem.darkMode,
  ...designSystem.semanticTokens,
];

/**
 * Swap each token's hardcoded hex for the value the stylesheet actually
 * resolves. Falls back to the authored value when a variable is missing, so a
 * renamed token degrades to a stale swatch rather than a blank one.
 */
function resolve(tokens: Token[], live: Record<string, string>): Token[] {
  return tokens.map((t) => ({ ...t, hex: live[t.variable] || t.hex }));
}

/* ── Primitives ──────────────────────────────────────────────────────────── */

/**
 * A colour chip.
 *
 * Square, 1px ring, no radius beyond a hair, no hover transform. A swatch is a
 * measurement readout, not a button — the old card lifted 4px and threw a 28px
 * shadow on hover, which implied an interaction that does not exist.
 * `ring-inset` keeps the chip's painted area exactly its stated colour.
 */
const Chip: FC<{ hex: string }> = ({ hex }) => (
  <span
    aria-hidden="true"
    className="inline-block h-4 w-4 shrink-0 rounded-[3px] ring-1 ring-inset ring-black/15 dark:ring-white/15"
    style={{ background: hex }}
  />
);

/** The contrast readout for one text colour on one background. */
const Ratio: FC<{ fg: string; bg: string }> = ({ fg, bg }) => {
  // Translucent tokens get a dash, never a guessed number — see utils/contrast.
  if (!isOpaqueHex(fg) || !isOpaqueHex(bg))
    return (
      <span className="text-light-text-tertiary dark:text-dark-text-muted">
        —
      </span>
    );
  const r = contrastRatio(fg, bg) as number;
  const grade = wcagGrade(r);
  return (
    <span className="tabular-nums">
      {r.toFixed(2)}
      <span
        className={`ml-1.5 text-[10px] uppercase tracking-wider ${
          grade === "Fail"
            ? "text-error"
            : "text-light-text-tertiary dark:text-dark-text-muted"
        }`}
      >
        {grade}
      </span>
    </span>
  );
};

/* ── Blocks ──────────────────────────────────────────────────────────────── */

/**
 * A palette: one continuous ramp strip, then the rows.
 *
 * The strip is the whole palette in one glance and is the only place tonal
 * ORDER is visible — a grid of separated cards destroys it, because each card
 * reads as an independent item rather than a step. Bands are butted with no
 * gap for the same reason.
 */
const Palette: FC<{ label: string; note?: string; tokens: Token[] }> = ({
  label,
  note,
  tokens,
}) => (
  <div className="mb-12">
    <GroupLabel label={label} note={note} />

    <div className="mb-5 flex h-12 w-full overflow-hidden rounded-[3px] ring-1 ring-inset ring-black/10 dark:ring-white/10">
      {tokens.map((t) => (
        <span
          key={t.variable}
          title={`${t.name} ${t.hex}`}
          className="h-full flex-1"
          style={{ background: t.hex }}
        />
      ))}
    </div>

    <dl className="text-sm">
      {tokens.map((t) => (
        <div
          key={t.variable}
          className="flex items-center gap-3 border-b border-light-border/60 py-1.5 last:border-0 dark:border-dark-border/60"
        >
          <Chip hex={t.hex} />
          <dt className="min-w-0 flex-1 truncate text-light-text dark:text-dark-text">
            {t.name}
          </dt>
          <dd className="hidden shrink-0 font-mono text-xs text-light-text-tertiary sm:block dark:text-dark-text-muted">
            {t.variable}
          </dd>
          <dd className="w-24 shrink-0 text-right font-mono text-xs tabular-nums text-light-text-secondary dark:text-dark-text-secondary">
            {t.hex}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);

/**
 * Light and dark as one table.
 *
 * The two arrays in docData use identical `name` values, so they pair by name
 * rather than by index — index pairing would silently mis-align the whole table
 * the first time someone adds a token to one mode and not the other. A name
 * present in only one mode still renders, with a dash in the empty column,
 * which makes that asymmetry visible instead of hiding it.
 */
const ModeTable: FC<{ light: Token[]; dark: Token[] }> = ({ light, dark }) => {
  const lightBg = light.find((t) => t.name === "Background")?.hex ?? "#FFFFFF";
  const darkBg = dark.find((t) => t.name === "Background")?.hex ?? "#000000";
  const names = [...new Set([...light, ...dark].map((t) => t.name))];
  const isText = (name: string) => name.startsWith("Text");

  return (
    <div className="mb-12">
      <GroupLabel
        label="Surface & Text Tokens"
        note="one token, two values · contrast measured against each mode's background"
      />
      {/* The table is wider than the reading column on a phone, so it scrolls
          inside its own container rather than pushing the page sideways. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-sm">
          <thead>
            <tr className="border-b border-light-border text-left dark:border-dark-border">
              <th className="w-1/3 py-2 pr-4 font-medium text-light-text-tertiary dark:text-dark-text-muted">
                Token
              </th>
              <th className="py-2 pr-4 font-medium text-light-text-tertiary dark:text-dark-text-muted">
                Light
              </th>
              <th className="py-2 font-medium text-light-text-tertiary dark:text-dark-text-muted">
                Dark
              </th>
            </tr>
          </thead>
          <tbody>
            {names.map((name) => {
              const l = light.find((t) => t.name === name);
              const d = dark.find((t) => t.name === name);
              return (
                <tr
                  key={name}
                  className="border-b border-light-border/60 last:border-0 dark:border-dark-border/60"
                >
                  <th
                    scope="row"
                    className="py-2 pr-4 text-left font-normal text-light-text dark:text-dark-text"
                  >
                    {name}
                  </th>
                  {[
                    { tok: l, bg: lightBg },
                    { tok: d, bg: darkBg },
                  ].map(({ tok, bg }, i) => (
                    <td key={i} className="py-2 pr-4 last:pr-0 align-top">
                      {tok ? (
                        <>
                          <span className="flex items-center gap-2">
                            <Chip hex={tok.hex} />
                            <code className="font-mono text-xs tabular-nums text-light-text-secondary dark:text-dark-text-secondary">
                              {tok.hex}
                            </code>
                          </span>
                          {isText(name) && (
                            <span className="mt-0.5 block pl-6 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                              <Ratio fg={tok.hex} bg={bg} />
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-light-text-tertiary dark:text-dark-text-muted">
                          —
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Typography — a specimen and a scale, not two icon cards.
 *
 * The scale below is the one this page renders, measured from the live DOM
 * when it was written. Documenting a scale the site does not use is the single
 * easiest way for a design-system page to start lying, so the entries are the
 * page's own roles rather than an abstract t-shirt-size ramp.
 */
const Typography: FC = () => {
  const scale = [
    { role: "Page title", px: 48, weight: 400, cls: "text-4xl sm:text-5xl" },
    { role: "Section heading", px: 28, weight: 500, cls: "text-[1.75rem]" },
    { role: "Lead / eyebrow", px: 18, weight: 400, cls: "text-lg" },
    { role: "Body", px: 16, weight: 400, cls: "text-base" },
    { role: "Meta / caption", px: 14, weight: 400, cls: "text-sm" },
    { role: "Label", px: 12, weight: 500, cls: "text-xs uppercase" },
  ];

  return (
    <div>
      <GroupLabel
        label="Typography"
        note="two families · no weight above 600"
      />

      {designSystem.fonts.map((f) => {
        const zen = f.variable === "--font-zen";
        return (
          <div
            key={f.name}
            className="mb-6 border-b border-light-border/60 pb-6 last:border-0 dark:border-dark-border/60"
          >
            <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-light-text dark:text-dark-text">
                {f.name}
              </span>
              <code className="font-mono text-xs text-light-text-tertiary dark:text-dark-text-muted">
                {f.variable}
              </code>
              <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                {f.usage}
              </span>
            </div>
            {/* The specimen is set IN the font it documents — the old version
                rendered an "Aa" tile in a gradient box, which showed the box
                and not the typeface. */}
            <p
              className={`truncate text-3xl font-light text-light-text dark:text-dark-text ${
                zen ? "font-zen" : "font-inter"
              }`}
            >
              {zen ? "夜の工房 アトリエ 1234" : "Nocturnal Atelier 1234"}
            </p>
            <p
              className={`mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm text-light-text-secondary dark:text-dark-text-secondary ${
                zen ? "font-zen" : "font-inter"
              }`}
            >
              {(zen ? [300, 400, 500] : [300, 400, 500, 600]).map((w) => (
                <span key={w} style={{ fontWeight: w }}>
                  {w} {zen ? "見本" : "Regular"}
                </span>
              ))}
            </p>
          </div>
        );
      })}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[26rem] text-sm">
          <thead>
            <tr className="border-b border-light-border text-left dark:border-dark-border">
              <th className="py-2 pr-4 font-medium text-light-text-tertiary dark:text-dark-text-muted">
                Role
              </th>
              <th className="py-2 pr-4 text-right font-medium text-light-text-tertiary dark:text-dark-text-muted">
                Size
              </th>
              <th className="py-2 pr-4 text-right font-medium text-light-text-tertiary dark:text-dark-text-muted">
                Weight
              </th>
              <th className="py-2 font-medium text-light-text-tertiary dark:text-dark-text-muted">
                Class
              </th>
            </tr>
          </thead>
          <tbody>
            {scale.map((s) => (
              <tr
                key={s.role}
                className="border-b border-light-border/60 last:border-0 dark:border-dark-border/60"
              >
                <th
                  scope="row"
                  className="py-2 pr-4 text-left font-normal text-light-text dark:text-dark-text"
                >
                  {s.role}
                </th>
                <td className="py-2 pr-4 text-right font-mono text-xs tabular-nums text-light-text-secondary dark:text-dark-text-secondary">
                  {s.px}px
                </td>
                <td className="py-2 pr-4 text-right font-mono text-xs tabular-nums text-light-text-secondary dark:text-dark-text-secondary">
                  {s.weight}
                </td>
                <td className="py-2 font-mono text-xs text-light-text-tertiary dark:text-dark-text-muted">
                  {s.cls}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ── Section ─────────────────────────────────────────────────────────────── */

const DesignSystemSection: FC = () => {
  const live = useCssTokens(ALL_TOKENS.map((t) => t.variable));

  return (
    <DocSection
      title="Design System"
      subtitle="Nocturnal Atelier v3.2 — the tokens this site is built from, resolved from the live stylesheet."
      wide
    >
      <Palette
        label="Core Ramp"
        note="11 steps · Periwinkle → Charcoal · UI, text and surfaces"
        tokens={resolve(designSystem.mainTheme, live)}
      />

      <Palette
        label="Sub-Palette"
        note="effects, SVG gradients and WebGL only — never buttons, text or borders"
        tokens={resolve(designSystem.subPalette, live)}
      />

      <ModeTable
        light={resolve(designSystem.lightMode, live)}
        dark={resolve(designSystem.darkMode, live)}
      />

      <Palette
        label="Semantic Tokens"
        note="meaning, not appearance · resolved for the active theme"
        tokens={resolve(designSystem.semanticTokens, live)}
      />

      <Typography />
    </DocSection>
  );
};

export default DesignSystemSection;
