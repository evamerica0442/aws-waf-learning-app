import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import PillarPage from './pages/PillarPage';
import AboutPage from './pages/AboutPage';
import ScenariosPage from './pages/ScenariosPage';
import ScenarioDetailPage from './pages/ScenarioDetailPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pillars/:slug" element={<PillarPage />} />
        <Route path="/scenarios" element={<ScenariosPage />} />
        <Route path="/scenarios/:id" element={<ScenarioDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Layout>
  );
}
