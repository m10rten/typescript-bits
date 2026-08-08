"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ListChecks, ChevronLeft, ChevronRight, Check, XIcon } from "lucide-react";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import type { Chapter, ContentChunk } from "~/render-markdown";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "#/ui/dialog";
import { Button } from "#/ui/button";
import { ProgressTrack, ProgressIndicator } from "#/ui/progress";
import { CodeBlock } from "#/code-block";
import { cn } from "~/utils";

// ---------------------------------------------------------------------------
// Chunk renderer — same mapping as the static recipe page
// ---------------------------------------------------------------------------

function ChunkRenderer({ chunk }: { chunk: ContentChunk }) {
  if (chunk.type === "code") {
    return (
      <div className="my-4">
        <CodeBlock html={chunk.html} code={chunk.code} lang={chunk.lang} />
      </div>
    );
  }
  return <div dangerouslySetInnerHTML={{ __html: chunk.html }} />;
}

// ---------------------------------------------------------------------------
// Slide animation helpers
// ---------------------------------------------------------------------------

type Direction = "forward" | "back";

// Single source of truth for the slide transition length — shared by the
// content region's inline transition-duration style and the JS timer that
// commits the animation end (kept out of a Tailwind class since a
// template-literal `duration-[Nms]` class would be invisible to the build-time scanner).
const SLIDE_TRANSITION_MS = 200;

function getSlideClasses(phase: "enter" | "exit", direction: Direction): string {
  if (phase === "enter") {
    return direction === "forward" ? "translate-x-2 opacity-0" : "-translate-x-2 opacity-0";
  }
  return direction === "forward" ? "-translate-x-2 opacity-0" : "translate-x-2 opacity-0";
}

// ---------------------------------------------------------------------------
// RecipeWizard
// ---------------------------------------------------------------------------

interface RecipeWizardProps {
  chapters: Chapter[];
}

export function RecipeWizard({ chapters }: RecipeWizardProps) {
  // The gate: show the trigger only when there are >= 2 numbered (non-overview) steps
  const numberedChapters = chapters.filter((c) => c.id !== "overview");
  if (numberedChapters.length < 2) return null;

  return <WizardDialog chapters={chapters} numberedChapters={numberedChapters} />;
}

// Separated so the hook rules are clean — RecipeWizard does an early return above
interface WizardDialogProps {
  chapters: Chapter[];
  numberedChapters: Chapter[];
}

function WizardDialog({ chapters, numberedChapters }: WizardDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  // direction tracks whether the last navigation was forward or backward
  const [direction, setDirection] = useState<Direction>("forward");
  // animate controls the enter/exit transition
  const [animating, setAnimating] = useState(false);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  // "Guide complete" announcement lives outside the dialog so it survives unmount
  const [announcement, setAnnouncement] = useState("");
  // Scroll affordance: track whether there is more content below (or above)
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const totalScreens = chapters.length;
  // M = number of numbered steps (Overview excluded)
  const totalSteps = numberedChapters.length;

  const currentChapter = chapters[currentIndex];

  // Derive progress: current position across ALL screens (including overview at 0)
  const progressValue = totalScreens > 1 ? (currentIndex / (totalScreens - 1)) * 100 : 100;

  // Label for the overline: "Overview" or "Step N of M"
  function getOverline(index: number): string {
    const chapter = chapters[index];
    if (!chapter || chapter.id === "overview") return "Overview";
    const stepNum = numberedChapters.indexOf(chapter) + 1;
    return `Step ${stepNum} of ${totalSteps}`;
  }

  // Short form for the live region — avoids re-announcing the full "Step N of M"
  // overline on top of the focus-triggered title announcement
  function getStepAnnouncement(index: number): string {
    const chapter = chapters[index];
    if (!chapter || chapter.id === "overview") return "Overview";
    const stepNum = numberedChapters.indexOf(chapter) + 1;
    return `Step ${stepNum}`;
  }

  // Visual status for a screen's step pip, relative to the current screen
  function getPipStatus(index: number): "completed" | "current" | "upcoming" {
    if (index < currentIndex) return "completed";
    if (index === currentIndex) return "current";
    return "upcoming";
  }

  // Recompute scroll affordance indicators from the content element
  const updateScrollState = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
    setCanScrollUp(el.scrollTop > 1);
  }, []);

  // Navigate to a new screen with direction-aware animation
  const navigateTo = useCallback(
    (nextIndex: number, dir: Direction) => {
      if (nextIndex < 0 || nextIndex >= totalScreens) return;
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
      setDirection(dir);
      setAnimating(true);
      setPendingIndex(nextIndex);
    },
    [totalScreens],
  );

  // When animating starts (exit phase), after one frame commit the new index (enter phase)
  useEffect(() => {
    if (!animating || pendingIndex === null) return;

    // One rAF for the exit frame; then commit
    const id = requestAnimationFrame(() => {
      setCurrentIndex(pendingIndex);
      setPendingIndex(null);
      // End animation after the transition duration
      const endId = setTimeout(() => setAnimating(false), SLIDE_TRANSITION_MS);
      return () => clearTimeout(endId);
    });
    animFrameRef.current = id;
    return () => {
      cancelAnimationFrame(id);
    };
  }, [animating, pendingIndex]);

  // Focus the chapter title, reset scroll, and recompute affordance on screen change
  useEffect(() => {
    if (!open) return;
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    // Recompute after the DOM has updated with the new screen's content
    const rafId = requestAnimationFrame(updateScrollState);
    // Small delay to let animation settle before moving focus
    const id = setTimeout(() => {
      titleRef.current?.focus();
    }, 50);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(id);
    };
  }, [currentIndex, open, updateScrollState]);

  // Recompute on resize (content height may change)
  useEffect(() => {
    if (!open) return;
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => observer.disconnect();
  }, [open, updateScrollState]);

  function handleOpen(value: boolean) {
    setOpen(value);
    if (!value) {
      // Reset to first screen on close
      setCurrentIndex(0);
      setDirection("forward");
      setAnimating(false);
      setPendingIndex(null);
    }
  }

  function goNext() {
    if (currentIndex >= totalScreens - 1) {
      // Last screen — finish
      handleOpen(false);
      setAnnouncement("Guide complete");
      // Clear the announcement after a beat so it re-announces if reopened
      setTimeout(() => setAnnouncement(""), 3000);
      return;
    }
    navigateTo(currentIndex + 1, "forward");
  }

  function goBack() {
    if (currentIndex <= 0) return;
    navigateTo(currentIndex - 1, "back");
  }

  // Arrow key handler scoped to the dialog — do not hijack horizontal scroll in code blocks
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    // If the event originates inside a horizontally-scrollable element, let it scroll
    const target = e.target as HTMLElement;
    const scrollable = target.closest<HTMLElement>("[data-scroll-x]");
    if (scrollable) return;
    e.preventDefault();
    if (e.key === "ArrowRight") goNext();
    else goBack();
  }

  // Slide + fade classes for the content region
  const isLastScreen = currentIndex === totalScreens - 1;
  const animClass = animating ? getSlideClasses("exit", direction) : "";

  return (
    <>
      {/* Single aria-live region — announces both step changes and completion.
          Kept short (step number only) since focus already moves to the chapter
          title, which its own announcement covers. */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement || (open ? getStepAnnouncement(currentIndex) : "")}
      </div>

      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogTrigger
          render={
            <Button variant="default" size="sm">
              <ListChecks className="size-3.5" aria-hidden="true" />
              Start guide
            </Button>
          }
        />

        <DialogContent
          className="sm:max-w-2xl w-[calc(100%-2rem)] h-[85vh] max-h-[85vh] gap-0 p-0 overflow-hidden"
          showCloseButton={false}
          onKeyDown={handleKeyDown}>
          {/* Inner flex-column container — DialogContent may resolve to display:grid from its
              base class; this wrapper guarantees a true flex column regardless of the outer
              display value, so height propagates correctly to the scroll region. */}
          <div className="flex flex-col h-full min-h-0 overflow-hidden">
            {/* Pinned header */}
            <div className="flex flex-col gap-2 px-4 sm:px-6 pt-5 pb-4 border-b shrink-0">
              {/* Overline + inline close button, on one row so the close target
                  never overlaps the title */}
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium tracking-wide text-accent uppercase tabular-nums">
                  {getOverline(currentIndex)}
                </p>
                <DialogClose render={<Button variant="ghost" size="icon" />}>
                  <XIcon className="size-4" aria-hidden="true" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </div>

              {/* Completion payoff — final screen only */}
              {isLastScreen && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                  You've reached the end
                </div>
              )}

              {/* Chapter title */}
              <DialogTitle ref={titleRef} tabIndex={-1} className="text-lg font-semibold leading-snug outline-none">
                {currentChapter?.title ?? ""}
              </DialogTitle>

              {/* Step pips — decorative echo of the static recipe page's numbered
                  timeline; the Progress element below carries the accessible state */}
              <div aria-hidden="true" className="flex items-center gap-1.5">
                {chapters.map((chapter, index) => {
                  const status = getPipStatus(index);
                  const isOverview = chapter.id === "overview";
                  return (
                    <span
                      key={chapter.id}
                      className={cn(
                        "flex size-3 items-center justify-center rounded-full transition-colors motion-reduce:transition-none",
                        status === "current" && "bg-accent/15 ring-2 ring-accent",
                      )}>
                      {isOverview ? (
                        <span
                          className={cn(
                            "font-mono text-[9px] leading-none",
                            status === "upcoming" ? "text-muted-foreground" : "text-accent",
                          )}>
                          ◆
                        </span>
                      ) : (
                        <span
                          className={cn(
                            "size-1.5 rounded-full transition-colors motion-reduce:transition-none",
                            status === "upcoming" ? "bg-muted" : "bg-accent",
                          )}
                        />
                      )}
                    </span>
                  );
                })}
              </div>

              {/* Progress bar — Track/Indicator composed directly (rather than the shared
                  <Progress>) so the fill can use the accent color without touching that
                  component's shared default. aria-valuetext announces "Step N of M". */}
              <ProgressPrimitive.Root
                value={progressValue}
                aria-label="Guide progress"
                aria-valuetext={getOverline(currentIndex)}
                className="w-full">
                <ProgressTrack>
                  <ProgressIndicator className="bg-accent" />
                </ProgressTrack>
              </ProgressPrimitive.Root>
            </div>

            {/* Scroll region wrapper — positions the fade affordance overlay */}
            <div className="relative flex-1 min-h-0">
              {/* Scrollable content region */}
              <div
                ref={contentRef}
                role="group"
                aria-roledescription="slide"
                aria-label={getOverline(currentIndex)}
                onScroll={updateScrollState}
                // Duration set via inline style (not a `duration-*` class) so
                // SLIDE_TRANSITION_MS stays the single source of truth shared with the JS timer.
                style={{ transitionDuration: `${SLIDE_TRANSITION_MS}ms` }}
                className={`h-full overflow-y-auto overscroll-contain scrollbar-gutter-stable px-4 sm:px-6 pt-4 pb-6 [&>*:first-child]:mt-0 transition-[transform,opacity] ease-out motion-reduce:transition-none ${animClass}`}>
                {currentChapter?.chunks.map((chunk, i) => (
                  <ChunkRenderer key={i} chunk={chunk} />
                ))}
              </div>

              {/* Top scroll fade affordance */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-popover to-transparent transition-opacity duration-200 motion-reduce:transition-none ${canScrollUp ? "opacity-100" : "opacity-0"}`}
              />

              {/* Bottom scroll fade affordance — communicates more content below */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-popover to-transparent transition-opacity duration-200 motion-reduce:transition-none ${canScrollDown ? "opacity-100" : "opacity-0"}`}
              />
            </div>

            {/* Pinned footer — DialogFooter provides border-t, bg-muted/50, and p-4.
               mx-0 mb-0 neutralise the -mx-4 -mb-4 bleed that assumes DialogContent has p-4;
               this DialogContent uses p-0 so those negative margins would overshoot. */}
            <DialogFooter className="shrink-0 mx-0 mb-0 sm:justify-between gap-2 sm:px-6">
              {/* Always variant="outline" (never ghost) so Back keeps its footprint
                  on the first step instead of visually disappearing */}
              <Button variant="outline" size="sm" disabled={currentIndex === 0} onClick={goBack}>
                <ChevronLeft className="size-3.5" aria-hidden="true" />
                Back
              </Button>
              <Button variant="default" size="default" onClick={goNext}>
                {isLastScreen ? (
                  <>
                    <Check className="size-3.5" aria-hidden="true" />
                    Finish
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="size-3.5" aria-hidden="true" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
          {/* end inner flex-column wrapper */}
        </DialogContent>
      </Dialog>
    </>
  );
}
