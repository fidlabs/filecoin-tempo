import { useEffect, useState } from "react";

export function useDelayedFlag(input: boolean, delayMs: number): boolean {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        setValue(input);
      },
      input ? delayMs : 0
    );

    return () => {
      clearTimeout(timeoutId);
    };
  }, [delayMs, input]);

  return value;
}
