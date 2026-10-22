import {DoughnutBackground} from '@/components/background/DoughnutBackground';
import {InfoBar} from '@/components/layout/InfoBar';
import {Loader} from '@/components/layout/Loader';
import {Navbar} from '@/components/layout/Navbar';
import {ScrollProgress} from '@/components/layout/ScrollProgress';
import {Craft} from '@/components/sections/Craft';
import {Flavors} from '@/components/sections/Flavors';
import {Hero} from '@/components/sections/Hero';
import {useLenis} from '@/hooks/useLenis';

export default function App() {
  useLenis();

  return (
    <>
      <Loader />
      <DoughnutBackground />
      <ScrollProgress />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Craft />
        <Flavors />
      </main>
      <InfoBar />
    </>
  );
}
