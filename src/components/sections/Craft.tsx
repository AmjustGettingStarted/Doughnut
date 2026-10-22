import {useSectionProgress} from '@/hooks/useSectionProgress';
import {SplitText} from '@/components/ui/SplitText';

export function Craft() {
  const {ref, progress} = useSectionProgress<HTMLElement>('craft');
  return (
    <section id="craft" ref={ref} className="relative h-[300vh]" aria-labelledby="craft-title">
      <div className="sticky top-0 flex h-screen items-center justify-center px-5">
        <SplitText
          as="h2"
          lines={['Proofed slow.', 'Glazed by hand.']}
          progress={progress}
          range={[0.05, 0.25]}
          leave={[0.8, 0.95]}
          className="text-display max-w-[14ch] text-center font-medium"
        />
        <span id="craft-title" className="sr-only">
          Our craft
        </span>
      </div>
    </section>
  );
}
