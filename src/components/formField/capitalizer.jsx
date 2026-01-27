import { useEffect, useRef } from "react";
export const capitalizer = str =>
  str ? str[0].toUpperCase() + str.slice(1) : str;

export function useDebouncedEffect(callback, deps = [], delay = 500) {
  const isFirstRun = useRef(true);
  const timer = useRef(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    if (isFirstRun.current) {
      callback();
      isFirstRun.current = false;
      return;
    }

    timer.current = setTimeout(() => {
      callback();
    }, delay);

    return () => clearTimeout(timer.current);
  }, [...deps]); 
}
