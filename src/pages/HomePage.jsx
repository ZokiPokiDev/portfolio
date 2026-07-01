import Hero from '../sections/Hero';
import ModernizationPath from '../sections/ModernizationPath';
import About from '../sections/About';
import TechStack from '../sections/TechStack';
import Projects from '../sections/Projects';
import LiveSignals from '../sections/LiveSignals';
import Contact from '../sections/Contact';
import Locations from '../sections/Locations';
import GetInTouch from '../sections/GetInTouch';

const HomePage = () => (
  <div className="home-page">
    <Hero />
    <ModernizationPath />
    <About />
    <TechStack />
    <Projects />
    <LiveSignals />
    <Locations />
    <GetInTouch />
    <Contact />
  </div>
);

export default HomePage;
