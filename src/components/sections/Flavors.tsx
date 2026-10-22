import {useSectionProgress} from '@/hooks/useSectionProgress';
import {SplitText} from '@/components/ui/SplitText';

export function Flavors() {
  const {ref, progress} = useSectionProgress<HTMLElement>('flavors');
  return (
    <section id="flavors" ref={ref} className="relative h-[300vh]" aria-labelledby="flavors-title">
      <div className="sticky top-0 flex h-screen items-center justify-center px-5">
        <SplitText
          as="h2"
          lines={['Twelve ways', 'to crack.']}
          accent={['crack.']}
          progress={progress}
          range={[0.05, 0.25]}
          leave={[0.8, 0.95]}
          className="text-display max-w-[14ch] text-center font-medium"
        />
        <span id="flavors-title" className="sr-only">
          Signature flavours
        </span>
      </div>
    </section>
  );
}
