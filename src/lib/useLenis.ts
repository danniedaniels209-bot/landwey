import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";

/**
 * Optional smooth-scroll. Wires Lenis into GSAP's ticker so any future
 * scroll-triggered GSAP animations stay perfectly in sync with the
 * smoothed scroll position, instead of running two competing RAF loops.
 */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3), // cubic ease-out
      smoothWheel: true,
    });

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);
}
