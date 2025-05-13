import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import PlantDetailPage from './pages/PlantDetailPage';
import VirtualToursPage from './pages/VirtualToursPage';
import TourDetailPage from './pages/TourDetailPage';
import MyGardenPage from './pages/MyGardenPage';
import ChatbotPage from './pages/ChatbotPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/plant/:id" element={<PlantDetailPage />} />
            <Route path="/tours" element={<VirtualToursPage />} />
            <Route path="/tour/:id" element={<TourDetailPage />} />
            <Route path="/my-garden" element={<MyGardenPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;