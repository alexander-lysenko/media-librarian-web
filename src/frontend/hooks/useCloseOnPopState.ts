import { type SyntheticEvent, useCallback, useEffect } from 'react';

interface CloseOnPopStateProps {
  id: string;
  open: boolean;
  onClose: (event: SyntheticEvent, reason?: string) => void;
}

export const useCloseOnPopState = ({ id, open, onClose }: CloseOnPopStateProps) => {
  const patchedCloseHandler = (event: SyntheticEvent, reason: string) => {
    console.log('patchedCloseHandler', id, reason);
    onClose?.(event, reason);
    window.history.back();
  };

  const popStateEventHandler = useCallback(
    (event: PopStateEvent) => {
      console.log('popstate', id);
      if (open && id && event.state.key === id) {
        onClose?.({} as SyntheticEvent, 'popstate');
        // window.history.back();
      }
    },
    [id, open, onClose],
  );

  useEffect(() => {
    if (open && id) {
      console.log('replaceState', id);
      window.history.replaceState({ isPopup: true, key: id }, '');
      window.history.pushState({ isPopup: true, key: id }, '');
    }

    window.addEventListener('popstate', popStateEventHandler);
    return () => {
      window.removeEventListener('popstate', popStateEventHandler);
    };
  }, [onClose, open, popStateEventHandler, id]);

  return { onCloseWithPopstate: patchedCloseHandler };
};
