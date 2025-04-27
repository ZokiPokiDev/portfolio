import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import IndustryPage from './pages/IndustryPage';
import ServicePage from './pages/ServicePage';
import LocationPage from './pages/LocationPage';
import './App.css';
import './components/Gallery.css';
import './components/LightboxModal.css';
import './components/Collage.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:id" element={<ProjectPage />} />
          <Route path="/industries/:id" element={<IndustryPage />} />
          <Route path="/services/:id" element={<ServicePage />} />
          <Route path="/locations/:id" element={<LocationPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
