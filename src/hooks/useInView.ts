import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * useInView Hook
 *
 * Detects when an element comes into view and triggers animations or callbacks.
 * Useful for scroll-triggered animations and lazy loading.
 *
 * @param options Configuration options for the intersection observer
 * @returns Object with ref (to attach to element) and isInView (boolean state)
 *
 * @example
 * const { ref, isInView } = useInView({ threshold: 0.1 });
 *
 * return (
 *   <motion.div
 *     ref={ref}
 *     animate={isInView ? 'visible' : 'hidden'}
 *     variants={containerVariants}
 *   >
 *     Content
 *   </motion.div>
 * );
 */
export const useInView = (options: UseInViewOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);

          // Unobserve after first trigger if triggerOnce is true
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          // Allow re-triggering if triggerOnce is false
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isInView };
};

export default useInView;
