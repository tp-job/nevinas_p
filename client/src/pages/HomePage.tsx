import type { FC } from 'react';

// Corrected and extension-less imports
import Navbar from '@/components/layouts/Navbar';
import Header from '@/components/layouts/Header';
import About from '@/components/ui/homepage/About';
import Services from '@/components/ui/homepage/Services';
import Work from '@/components/ui/homepage/Work';
import Contact from '@/components/ui/homepage/Contact';
import Footer from '@/components/layouts/Footer';

const HomePage: FC = () => {
    return (
        <>
            <Navbar />
            <main id="top">
                <Header />
                <About />
                <Services />
                <Work />
                <Contact />
                <Footer />
            </main>
        </>
    );
};

export default HomePage;