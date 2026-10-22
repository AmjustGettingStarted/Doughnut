import {DoughnutBackground} from '@/components/background/DoughnutBackground';
import {CartDrawer} from '@/components/cart/CartDrawer';
import {CheckoutModal} from '@/components/cart/CheckoutModal';
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
        <MenuSection />
        <BoxBuilder />
        <Reviews />
        <Visit />
        <FinalCta />
      </main>
      <Footer />
      <InfoBar />
      <CartDrawer />
      <CheckoutModal />
    </>
  );
}
