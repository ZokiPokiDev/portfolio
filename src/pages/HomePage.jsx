import Hero from '../sections/Hero';
import About from '../sections/About';
import TechStack from '../sections/TechStack';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';
import Locations from '../sections/Locations';
import GetInTouch from '../sections/GetInTouch';

const HomePage = () => (
  <div className="home-page">
    <Hero />
    <About />
    <TechStack />
    <Projects />
    <Locations />
    <GetInTouch />
    <Contact />
  </div>
);

export default HomePage;