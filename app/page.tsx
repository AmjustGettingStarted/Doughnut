import {DoughnutBackground} from '@/components/background/DoughnutBackgroundClient';
import {CartDrawer} from '@/components/cart/CartDrawer';
import {CheckoutLoader} from '@/components/cart/CheckoutLoader';
import {AppEffects} from '@/components/layout/AppEffects';
import {Footer} from '@/components/layout/Footer';
import {InfoBar} from '@/components/layout/InfoBar';
import {Loader} from '@/components/layout/Loader';
import {Navbar} from '@/components/layout/Navbar';
import {ScrollProgress} from '@/components/layout/ScrollProgress';
import {BoxBuilder} from '@/components/sections/BoxBuilder';
import {Craft} from '@/components/sections/Craft';
import {FinalCta} from '@/components/sections/FinalCta';
import {Flavors} from '@/components/sections/Flavors';
import {Hero} from '@/components/sections/Hero';
import {MenuSection} from '@/components/sections/MenuSection';
import {Reviews} from '@/components/sections/Reviews';
import {Visit} from '@/components/sections/Visit';

export default function Page() {
  return (
    <>
      <AppEffects />
      <a
        href="#menu"
        className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to menu
      </a>
      <Loader />
      <DoughnutBackground />
      <ScrollProgress />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Craft />
        <Flavors />
        <MenuSection />
        <BoxBuilder />
        <Reviews />
        <Visit />
        <FinalCta />
      </main>
      <Footer />
      <InfoBar />
      <CartDrawer />
      <CheckoutLoader />
    </>
  );
}
