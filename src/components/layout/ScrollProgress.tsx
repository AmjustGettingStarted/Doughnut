import {motion, useScroll} from 'motion/react';

/** 2px page-progress meter along the top edge. */
export function ScrollProgress() {
  const {scrollYProgress} = useScroll();
  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[60] h-0.5 w-full origin-left bg-ink/55"
      style={{scaleX: scrollYProgress}}
    />
  );
}
