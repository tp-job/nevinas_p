import type { FC } from 'react';
import Navbar from '@/components/layouts/Navbar';
import Header from '@/components/layouts/Header';
import About from '@/components/ui/homepage/About';
import Services from '@/components/ui/homepage/Services';
import InteractiveBanner from '@/components/three/InteractiveBanner';
import Work from '@/components/ui/homepage/Work';
import Contact from '@/components/ui/homepage/Contact';
import Footer from '@/components/layouts/Footer';
import TimelineSection from '@/components/ui/homepage/Timeline';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const HomePage: FC = () => {
    return (
        <>
            <Navbar />
            <main id="top" className="overflow-hidden">
                <Header />
                
                <ScrollReveal>
                    <About />
                </ScrollReveal>
                
                <InteractiveBanner />
                
                <ScrollReveal>
                    <TimelineSection />
                </ScrollReveal>
                
                <ScrollReveal>
                    <Services />
                </ScrollReveal>
                
                <ScrollReveal>
                    <Work />
                </ScrollReveal>
                
                <ScrollReveal>
                    <Contact />
                </ScrollReveal>
                
                <Footer />
            </main>
        </>
    );
};

export default HomePage;