import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const LINKS = ["Communities", "Why LandWey", "Invest", "About", "Insights", "Contact"];

type NavProps = {
  /** True once the hero intro video has finished and frozen on its last frame. */
  revealed: boolean;
};

export default function Nav({ revealed }: NavProps) {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav || !revealed) return;

    gsap.fromTo(
      nav,
      { autoAlpha: 0, y: -16 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" },
    );
  }, [revealed]);

  // Close the mobile menu automatically if the intro hasn't finished yet
  // (nav becomes visually hidden before `revealed`) so it can't be left
  // open-but-invisible.
  useLayoutEffect(() => {
    if (!revealed) setMenuOpen(false);
  }, [revealed]);

  return (
    <header
      ref={navRef}
      className="invisible absolute inset-x-0 top-0 z-30"
      aria-hidden={!revealed}
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 sm:px-6 sm:py-6 md:px-10 md:py-8">
        <a
          href="#"
          className="whitespace-nowrap text-lg font-medium tracking-tight text-forest sm:text-xl md:text-2xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          LandWey Investment
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <li key={link}>
              <a
                href="#"
                className="text-[15px] font-medium text-forest-dark/90 transition-colors hover:text-forest-dark"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#communities"
          className="group hidden items-center gap-2 rounded-md bg-forest px-5 py-3 text-sm font-medium text-warm-white transition-colors hover:bg-forest-light lg:inline-flex"
        >
          Explore Communities
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </a>

        {/* Mobile / tablet: hamburger toggle, shown below the lg breakpoint */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="relative flex h-10 w-10 flex-none items-center justify-center rounded-md text-forest lg:hidden"
        >
          <span
            aria-hidden
            className={`absolute h-[1.5px] w-5 bg-current transition-transform duration-300 ${
              menuOpen ? "translate-y-0 rotate-45" : "-translate-y-[5px]"
            }`}
          />
          <span
            aria-hidden
            className={`absolute h-[1.5px] w-5 bg-current transition-opacity duration-200 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            aria-hidden
            className={`absolute h-[1.5px] w-5 bg-current transition-transform duration-300 ${
              menuOpen ? "translate-y-0 -rotate-45" : "translate-y-[5px]"
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu panel */}
      <div
        className={`overflow-hidden px-5 transition-[max-height,opacity] duration-300 ease-out sm:px-6 lg:hidden ${
          menuOpen ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 rounded-lg bg-warm-white/95 px-2 py-3 shadow-lg backdrop-blur-sm">
          {LINKS.map((link) => (
            <a
              key={link}
              href="#"
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-3 py-2.5 text-[15px] font-medium text-forest-dark transition-colors hover:bg-forest/5"
            >
              {link}
            </a>
          ))}
          <a
            href="#communities"
            onClick={() => setMenuOpen(false)}
            className="group mt-1 inline-flex items-center justify-center gap-2 rounded-md bg-forest px-5 py-3 text-sm font-medium text-warm-white transition-colors hover:bg-forest-light"
          >
            Explore Communities
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
