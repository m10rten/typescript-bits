import type { ReactNode } from "react";

interface HeroProps {
  /** Content inside the hero content column */
  children: ReactNode;
  /** Controls grid texture intensity: "default" (home) or "subtle" (secondary pages) */
  intensity?: "default" | "subtle";
}

/**
 * Shared hero wrapper used by every page that needs a hero section.
 * Provides a unified background (hero-bg gradient), a masked line-grid texture,
 * and consistent vertical rhythm. Pages vary content only.
 *
 * The grid texture color is theme-aware via the --hero-grid-color CSS token.
 */
export function Hero({ children, intensity = "default" }: HeroProps) {
  const py = intensity === "default" ? "py-16 md:py-24" : "py-12 md:py-16";

  return (
    <section className="hero-bg relative overflow-hidden">
      {/* Masked line-grid texture — decorative, theme-aware color token */}
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className={`container-main ${py}`}>{children}</div>
    </section>
  );
}
