import Hero from '../sections/Hero';
import ModernizationPath from '../sections/ModernizationPath';
import ServicePackages from '../sections/ServicePackages';
import ProofDemos from '../sections/ProofDemos';
import About from '../sections/About';
import TechStack from '../sections/TechStack';
import Projects from '../sections/Projects';
import LiveSignals from '../sections/LiveSignals';
import LeadCapture from '../sections/LeadCapture';
import Contact from '../sections/Contact';
import Locations from '../sections/Locations';
import GetInTouch from '../sections/GetInTouch';

const HomePage = () => (
  <div className="home-page">
    <Hero />
    <ModernizationPath />
    <ServicePackages />
    <ProofDemos />
    <About />
    <TechStack />
    <Projects />
    <LiveSignals />
    <LeadCapture />
    <Locations />
    <GetInTouch />
    <Contact />
  </div>
);

export default HomePage;
