import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Hero from './Hero';
import HowItWorks from './HowItWorks';
import Features from './Features';
import CTA from './CTA';
import AboutDeveloper from './AboutDeveloper';
import Footer from './Footer';

export default function Landing() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleCTA = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900 selection:bg-indigo-100">
            <Navbar user={user} onCTA={handleCTA} />
            <Hero onCTA={handleCTA} />
            <HowItWorks />
            <Features />
            <CTA user={user} onCTA={handleCTA} />
            <AboutDeveloper />
            <Footer />
        </div>
    );
}
