import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import IndustryPage from './pages/IndustryPage';
import ServicePage from './pages/ServicePage';
import LocationPage from './pages/LocationPage';
import RegionalCampaignPage from './pages/RegionalCampaignPage';
import FounderPage from './pages/FounderPage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import ThemeSwitch from './components/ThemeSwitch';
import SitemapTree from "./components/SitemapTree";
import ParticleNetwork from "./components/ParticleNetwork";
import Footer from "./sections/Footer";
import { useCampaignTracking } from "./hooks/useCampaignTracking";
import './App.css';
import './components/Gallery.css';
import './components/LightboxModal.css';
import './components/Collage.css';
import './components/Grid.css';
import './components/Flex.css'

function CampaignTracker() {
  useCampaignTracking();
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <CampaignTracker />
        <ParticleNetwork />
        <ThemeSwitch />
        <SitemapTree />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/founder" element={<FounderPage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route path="/industries/:slug" element={<IndustryPage />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/locations/:slug" element={<LocationPage />} />
          <Route path="/:slug" element={<RegionalCampaignPage />} />
        </Routes>
        <Footer/>
      </div>
    </BrowserRouter>
  );
}

export default App
