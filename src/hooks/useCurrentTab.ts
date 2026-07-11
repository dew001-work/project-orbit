import { useEffect, useState } from 'react';
import { getCurrentTabContext } from '../features/tabs/currentTab';
import type { PageContext } from '../types/tabs';

interface CurrentTabState {
  data: PageContext | null;
  error: string | null;
  isLoading: boolean;
}

export function useCurrentTab(): CurrentTabState {
  const [state, setState] = useState<CurrentTabState>({
    data: null,
    error: null,
    isLoading: true
  });

  useEffect(() => {
    let isMounted = true;

    getCurrentTabContext()
      .then((data) => {
        if (isMounted) {
          setState({ data, error: null, isLoading: false });
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setState({
            data: null,
            error: error instanceof Error ? error.message : 'Unable to read the active tab.',
            isLoading: false
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
