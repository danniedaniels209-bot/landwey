import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const LINKS = ["Communities", "Why LandWey", "Invest", "About", "Insights", "Contact"];

type NavProps = {
  /** True once the hero intro video has finished and frozen on its last frame. */
  revealed: boolean;
};

export default function Nav({ revealed }: NavProps) {
  const navRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav || !revealed) return;

    gsap.fromTo(
      nav,
      { autoAlpha: 0, y: -16 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" },
    );
  }, [revealed]);

  return (
    <header
      ref={navRef}
      className="invisible absolute inset-x-0 top-0 z-30"
      aria-hidden={!revealed}
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-6 md:px-10 md:py-8">
        <a
          href="#"
          className="whitespace-nowrap text-xl font-medium tracking-tight text-forest md:text-2xl"
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
          className="group hidden items-center gap-2 rounded-md bg-forest px-5 py-3 text-sm font-medium text-warm-white transition-colors hover:bg-forest-light md:inline-flex"
        >
          Explore Communities
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </a>
      </nav>
    </header>
  );
}
