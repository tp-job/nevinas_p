import type { FC } from 'react'; // Corrected and extension-less imports
import Navbar from '@/components/layouts/Navbar';
import Header from '@/components/layouts/Header';
import About from '@/components/ui/homepage/About';
import Services from '@/components/ui/homepage/Services';
import InteractiveBanner from '@/components/three/InteractiveBanner';
import Work from '@/components/ui/homepage/Work';
import Contact from '@/components/ui/homepage/Contact';
import Footer from '@/components/layouts/Footer';
import TimelineSection from '@/components/ui/homepage/Timeline'; const HomePage: FC = () => {
    return (<> <Navbar /> <main id="top"> <Header /> <About /> <TimelineSection /> <Services /> <InteractiveBanner /> <Work /> <Contact /> <Footer /> </main> </>);
}; export default HomePage;