import { useEffect, useRef } from "react";

/**
 * hook to listen for keyboard events and trigger a callback
 * @param callback callback to call when requested keys event are detected
 * @param codes an array of code representing the keys to listen events from
 * @param options control what events to listen (keydown by default)
 */
export function useKeyBoard(
  callback: (event: KeyboardEvent) => void,
  codes: string[],
  options: {
    keyup?: boolean;
    keydown?: boolean;
  } = { keydown: true, keyup: false }
) {
  const cb = useRef(callback);

  useEffect(() => {
    cb.current = callback;
  }, [callback]);

  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (codes.includes(event.code)) {
        cb.current(event);
      }
    };
    const upHandler = (event: KeyboardEvent) => {
      if (codes.includes(event.code)) {
        cb.current(event);
      }
    };
    if (options.keydown) window.addEventListener("keydown", downHandler);
    if (options.keyup) window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [cb, codes, options.keyup, options.keydown]);
}
