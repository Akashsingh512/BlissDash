// import * as React from "react";

// const MOBILE_BREAKPOINT = 768;

// export function useIsMobile() {
//   const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

//   React.useEffect(() => {
//     const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
//     const onChange = () => {
//       setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
//     };
//     mql.addEventListener("change", onChange);
//     setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
//     return () => mql.removeEventListener("change", onChange);
//   }, []);

//   return !!isMobile;
// }


import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const getIsMobile = () =>
    typeof window !== "undefined" &&
    window.innerWidth < MOBILE_BREAKPOINT;

  const [isMobile, setIsMobile] = React.useState(getIsMobile);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => setIsMobile(getIsMobile());

    // iPhone-friendly: works even when matchMedia fails
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    // Still add matchMedia as secondary listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    if (mql.addEventListener) {
      mql.addEventListener("change", update);
    } else if (mql.addListener) {
      // iOS 13 fallback
      mql.addListener(update);
    }

    // initial run
    update();

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);

      if (mql.removeEventListener) {
        mql.removeEventListener("change", update);
      } else if (mql.removeListener) {
        mql.removeListener(update);
      }
    };
  }, []);

  return isMobile;
}
