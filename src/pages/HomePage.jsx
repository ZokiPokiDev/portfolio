import Hero from '../sections/Hero';
import ModernizationPath from '../sections/ModernizationPath';
import ServicePackages from '../sections/ServicePackages';
import ProofDemos from '../sections/ProofDemos';
import About from '../sections/About';
import TechStack from '../sections/TechStack';
import Projects from '../sections/Projects';
import Posts from '../sections/Posts';
import LiveSignals from '../sections/LiveSignals';
import LeadCapture from '../sections/LeadCapture';
import Contact from '../sections/Contact';
import Locations from '../sections/Locations';
import GetInTouch from '../sections/GetInTouch';
import Seo, { seoConfig } from '../components/Seo';

const HomePage = () => (
  <div className="home-page">
    <Seo {...seoConfig.homepage} />
    <Hero />
    <ModernizationPath />
    <ServicePackages />
    <ProofDemos />
    <About />
    <TechStack />
    <Projects />
    <Posts />
    <LiveSignals />
    <LeadCapture />
    <Locations />
    <GetInTouch />
    <Contact />
  </div>
);

export default HomePage;
