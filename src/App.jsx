import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import CarDetail from "./pages/CarDetail/CarDetail";
import Contact from "./pages/Contact/Contact";
import Favorites from "./pages/Favorites/Favorites";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./utils/ScrollToTop";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars/:id" element={<CarDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/cars/:id" element={<CarDetail />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
