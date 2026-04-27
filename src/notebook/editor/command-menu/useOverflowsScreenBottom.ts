import { useEffect, useRef, useState } from 'react';

export function useOverflowsScreenBottom() {
  const ref = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const { bottom } = ref.current.getBoundingClientRect();
    setOverflows(bottom > window.innerHeight);
  }, []);

  return { ref, overflows };
}
