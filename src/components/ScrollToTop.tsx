import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop custom component
 * Resets window scroll position and dashboard layout scroll containers on route changes.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Reset standard window/viewport scroll
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    // 2. Reset custom scrollable layout containers (like the dashboard sidebar's content container)
    const containers = document.querySelectorAll(
      '[data-scroll-reset], .overflow-y-auto, .md\\:overflow-y-auto'
    );
    
    containers.forEach((container) => {
      container.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    });
  }, [pathname]);

  return null;
}
