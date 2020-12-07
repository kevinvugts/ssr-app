import { useEffect } from 'react';

export default () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    // Kickstart animations
    window.setTimeout(() => {
      if (window.scrollY <= 1) {
        window.scrollTo(0, 1);
        window.scrollTo(0, 0);
      }
    }, 1000);
  }, []);

  return null;
}
