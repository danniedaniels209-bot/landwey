import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

type HeroProps = {
  /** Fires once, the instant the intro video reaches its last frame. */
  onIntroComplete: () => void;
  /** True once the intro has completed — triggers the headline reveal. */
  revealed: boolean;
};

/**
 * Cinematic hero: an 8s/24fps "estate assembly" video plays once — raw land
 * at 0s, fully built community by 8s — then freezes on that final frame
 * (no `loop`, so the <video> element naturally holds its last painted frame
 * once `ended` fires). The moment it ends, the real site chrome (nav,
 * headline, subhead, CTA) fades/slides into place on top of that now-static
 * photo, matching the reference design exactly — the frozen frame *is* the
 * reference hero photo.
 *
 * Text timing, scrubbed frame-accurately off `video.currentTime` (see
 * comment below) rather than wall-clock timers so it can never drift out of
 * sync with the footage:
 *   0.0s – 3.0s   "FROM LAND"  slides in, holds, slides out
 *   3.0s – 5.0s   clean — construction animation is the focus
 *   5.0s – 8.0s   "TO LEGACY"  slides in, holds, slides out (same motion)
 */
export default function Hero({ onIntroComplete, revealed }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fromLandRef = useRef<HTMLSpanElement>(null);
  const toLegacyRef = useRef<HTMLSpanElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // ---- cinematic word scrub, synced to video.currentTime ----
  useLayoutEffect(() => {
    const video = videoRef.current;
    const fromLand = fromLandRef.current;
    const toLegacy = toLegacyRef.current;
    if (!video || !fromLand || !toLegacy) return;

    const enterEase = "power4.out"; // quick entrance → strong deceleration
    const exitEase = "power3.in"; // fast, smooth exit

    const tl = gsap.timeline({ paused: true });
    // FROM LAND: enters from the left, exits to the right.
    tl.set(fromLand, { xPercent: -120, opacity: 0 }, 0);
    tl.to(fromLand, { xPercent: 0, opacity: 1, duration: 0.9, ease: enterEase }, 0.2);
    tl.to(fromLand, { xPercent: 120, opacity: 0, duration: 0.7, ease: exitEase }, 2.3);
    // TO LEGACY: the mirror image — enters from the right, exits to the left.
    tl.set(toLegacy, { xPercent: 120, opacity: 0 }, 0);
    tl.to(toLegacy, { xPercent: 0, opacity: 1, duration: 0.9, ease: enterEase }, 5.2);
    tl.to(toLegacy, { xPercent: -120, opacity: 0, duration: 0.7, ease: exitEase }, 7.3);

    const duration = tl.duration(); // ≈ 8s, matches video length
    tl.time(0); // paint the hidden starting state immediately — before the
    // video has even started playing — so nothing flashes unstyled.

    const tick = () => {
      // Always scrub, even while paused/buffering: currentTime is 0 before
      // playback starts, which correctly keeps both words hidden until the
      // video is actually moving.
      tl.time(Math.min(video.currentTime, duration));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ---- headline / subhead / CTA reveal, once the intro finishes ----
  useLayoutEffect(() => {
    const group = revealRef.current;
    if (!group || !revealed) return;

    gsap.fromTo(
      group.children,
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.14 },
    );
  }, [revealed]);

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-forest-dark">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/video/hero.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={onIntroComplete}
        aria-hidden
      />

      {/* Subtle left-side scrim so the type stays legible without a heavy shadow.
          Fades out once the intro completes — the reference photo doesn't need it. */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background:
            "linear-gradient(90deg, rgba(4,12,8,0.45) 0%, rgba(4,12,8,0.15) 38%, rgba(4,12,8,0) 60%)",
          opacity: revealed ? 0 : 1,
        }}
      />

      {/* Cinematic text — left-middle, ~7% from the left edge, vertically centered.
          Both words finish their exit tween exactly as the video ends, so this
          layer is already fully transparent by the time the reveal below starts. */}
      <div
        className="pointer-events-none absolute left-[6%] top-1/2 z-20 -translate-y-1/2 md:left-[8%]"
        aria-hidden={revealed}
      >
        <span ref={fromLandRef} className="hero-word absolute left-0 top-0">
          From Land
        </span>
        <span ref={toLegacyRef} className="hero-word absolute left-0 top-0">
          To Legacy
        </span>
        {/* Reserves layout height so the absolutely-positioned spans above
            don't collapse the container to zero height. */}
        <span className="hero-word invisible" aria-hidden>
          From Land
        </span>
      </div>

      {/* Reference-matching headline block — hidden until the intro completes,
          then fades/slides up in a short stagger (headline → subhead → CTA). */}
      <div
        ref={revealRef}
        className="absolute left-[6%] right-6 top-[20%] z-20 flex max-w-xl flex-col items-start gap-5 sm:right-auto sm:top-[24%] sm:gap-6 md:left-[8%] md:top-[26%]"
      >
        <h1
          className="invisible text-[38px] font-medium leading-[1] tracking-tight text-forest min-[420px]:text-[44px] sm:text-[56px] md:text-[68px] lg:text-[76px]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Build Wealth
          <br />
          on Land
        </h1>
        <p className="invisible text-sm text-forest-dark/70 sm:text-base md:text-lg">
          Master-planned communities across Lagos
        </p>
        <a
          href="#communities"
          className="group invisible inline-flex items-center gap-2 rounded-md bg-forest px-5 py-3 text-sm font-medium text-warm-white transition-colors hover:bg-forest-light sm:px-6 sm:py-3.5 md:text-base"
        >
          Explore Communities
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </a>
      </div>
    </section>
  );
}
